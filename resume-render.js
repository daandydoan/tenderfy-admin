// Shared resume renderer — ONE source of truth for how a resume looks, so the
// Resume builder and the document/pack preview render an identical CV.
//
// A resume is a base LAYOUT (which defines REGIONS) + a PLACEMENT that says which
// sections sit in which region, in what order. Sections: Profile Picture, Contact,
// Summary, Experience, Skills, Accreditations, Referees.
//
// renderResume({ layout, brand, placement, data, showLogo, logoInitials })
//   layout    — a RESUME_LAYOUTS id (default 'left-panel')
//   placement — { regionId: [sectionId, …] }  (falls back to the layout's defaults)
//   brand     — { primary, secondary, background, font, bodyFont }
//   sections  — legacy flat list; used to filter the defaults when no placement given

const RESUME_BRAND_DEFAULT = {primary:'#27535C', secondary:'#38988A', background:'#F7F9F8', font:'Outfit', bodyFont:'Outfit'};

const RESUME_DATA = {
  name:'Jordan Avery', role:'Senior Project Manager',
  contact:['jordan.avery@example.com','+61 400 000 000','Sydney, NSW'],
  summary:'Delivery-focused project manager with 12+ years leading civil and commercial construction projects from tender through to handover.',
  experience:[
    {t:'Senior Project Manager · Meridian Constructions', d:'2019–Present', b:'Led $40M+ infrastructure packages; managed multidisciplinary teams of 30+.'},
    {t:'Project Manager · Harbour Civil', d:'2014–2019', b:'Delivered road and drainage upgrades on time and 6% under budget.'},
  ],
  skills:['Programme & cost control','Stakeholder management','WHS & compliance','Tender & bid strategy','Contract administration'],
  accreditations:['RPEQ · Registered Professional Engineer','White Card · Construction Induction','PRINCE2 Practitioner'],
  referees:['Available on request'],
};

// The placeable resume sections (the "blocks" of a resume).
const RESUME_SECTIONS = [
  {id:'profile',        name:'Profile Picture', icon:'account_circle'},
  {id:'contact',        name:'Contact',         icon:'contact_mail'},
  {id:'summary',        name:'Summary',         icon:'notes'},
  {id:'experience',     name:'Experience',      icon:'work_history'},
  {id:'skills',         name:'Skills',          icon:'star'},
  {id:'accreditations', name:'Accreditations',  icon:'verified'},
  {id:'referees',       name:'Referees',        icon:'contact_page'},
];
const RESUME_SECTION_NAME = Object.fromEntries(RESUME_SECTIONS.map(s=>[s.id,s.name]));
const RESUME_SECTION_ICON = Object.fromEntries(RESUME_SECTIONS.map(s=>[s.id,s.icon]));

// Base layouts — each defines its regions and a default placement.
const RESUME_LAYOUTS = (function(){
  const sk=(w,h,d)=>`<div class="sk${d?' d':''}" style="width:${w};height:${h||'6px'}"></div>`;
  return [
    {id:'left-panel', name:'Left Panel', desc:'Coloured sidebar beside a main column.',
      regions:[{id:'sidebar',name:'Sidebar'},{id:'main',name:'Main column'}],
      defaults:{sidebar:['profile','contact','skills'], main:['summary','experience','accreditations','referees']},
      thumb:`<div style="width:34%;background:#9fb2ac;border-radius:4px;padding:6px;display:flex;flex-direction:column;gap:5px">${sk('80%','8px',1)+sk('100%')+sk('90%')+sk('70%')}</div><div style="flex:1;padding:6px;display:flex;flex-direction:column;gap:5px">${sk('70%','9px',1)+sk('100%')+sk('96%')+sk('88%')+sk('60%')}</div>`},
    {id:'top-band', name:'Header Band', desc:'Brand band over two columns.',
      regions:[{id:'left',name:'Left column'},{id:'right',name:'Right column'}],
      defaults:{left:['summary','experience'], right:['profile','contact','skills','accreditations']},
      thumb:`<div style="width:100%;display:flex;flex-direction:column;gap:5px"><div style="height:24px;background:#9fb2ac;border-radius:4px"></div><div style="flex:1;display:flex;gap:5px"><div style="flex:1;display:flex;flex-direction:column;gap:4px">${sk('90%')+sk('80%')+sk('86%')}</div><div style="flex:1;display:flex;flex-direction:column;gap:4px">${sk('84%')+sk('92%')+sk('70%')}</div></div></div>`},
    {id:'timeline', name:'Timeline', desc:'Centered header over a single column.',
      regions:[{id:'body',name:'Body'}],
      defaults:{body:['contact','summary','experience','skills','accreditations']},
      thumb:`<div style="width:100%;display:flex;flex-direction:column;gap:6px;align-items:center;padding:4px">${sk('56%','9px',1)}<div style="width:100%;border-left:2px solid #9fb2ac;padding-left:8px;display:flex;flex-direction:column;gap:6px;margin-top:2px">${sk('80%')+sk('66%')+sk('74%')}</div></div>`},
    {id:'minimal', name:'Minimal', desc:'Clean single column.',
      regions:[{id:'body',name:'Body'}],
      defaults:{body:['profile','contact','summary','experience','skills','accreditations']},
      thumb:`<div style="width:100%;padding:6px;display:flex;flex-direction:column;gap:6px">${sk('60%','9px',1)+sk('100%')+sk('94%')+sk('88%')+sk('96%')+sk('70%')}</div>`},
  ];
})();
const RESUME_SECTION_DEFAULT = ['profile','contact','summary','experience','skills','accreditations'];

function resumeInitials(name){ return (String(name||'').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2)||'—').toUpperCase(); }

// Render a single section, styled for a light column or a dark sidebar.
function resumeSection(id, b, o){
  o = o || {};
  const data = o.data || RESUME_DATA, dark = !!o.dark;
  const H = `font-family:'${b.font}',sans-serif`, T = `font-family:'${b.bodyFont}',sans-serif`;
  const body = dark ? 'rgba(255,255,255,.9)' : '#3A4442';
  const acc  = dark ? 'rgba(255,255,255,.85)' : b.secondary;
  const title = t => dark
    ? `<div style="${H};color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;opacity:.9;margin:16px 0 8px">${t}</div>`
    : `<div style="${H};color:${b.primary};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid ${b.secondary};padding-bottom:4px;margin:18px 0 9px">${t}</div>`;
  switch(id){
    case 'profile': {
      const ini = o.logoInitials || resumeInitials(data.name), sz = dark ? 66 : 92;
      return `<div style="display:flex;justify-content:${dark?'flex-start':'center'};margin:${dark?'2px 0 6px':'0 0 16px'}"><div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${dark?'rgba(255,255,255,.16)':b.secondary+'22'};border:2px solid ${dark?'rgba(255,255,255,.55)':b.secondary};display:flex;align-items:center;justify-content:center;${H};font-weight:700;font-size:${Math.round(sz/2.6)}px;color:${dark?'#fff':b.primary}">${ini}</div></div>`;
    }
    case 'contact':
      return title('Contact')+`<div style="${T};font-size:${dark?11:12}px;color:${body};display:flex;flex-direction:column;gap:4px">${data.contact.map(c=>`<span>${c}</span>`).join('')}</div>`;
    case 'summary':
      return title('Summary')+`<div style="${T};font-size:12.5px;color:${body};line-height:1.55">${data.summary}</div>`;
    case 'experience':
      if(o.timeline) return title('Experience')+`<div style="border-left:2px solid ${b.secondary};padding-left:16px;margin-top:2px">${data.experience.map(e=>`<div style="position:relative;margin-bottom:14px"><span style="position:absolute;left:-23px;top:3px;width:10px;height:10px;border-radius:50%;background:${b.secondary};border:2px solid #fff;box-shadow:0 0 0 2px ${b.secondary}"></span><div style="${H};font-weight:700;font-size:12.5px;color:${dark?'#fff':'#26332F'}">${e.t}</div><div style="${T};font-size:11px;color:${acc};font-weight:600;margin:1px 0 3px">${e.d}</div><div style="${T};font-size:12px;color:${body};line-height:1.5">${e.b}</div></div>`).join('')}</div>`;
      return title('Experience')+data.experience.map(e=>`<div style="margin-bottom:11px"><div style="${H};font-weight:700;font-size:12.5px;color:${dark?'#fff':'#26332F'}">${e.t}</div><div style="${T};font-size:11px;color:${acc};font-weight:600;margin:1px 0 3px">${e.d}</div><div style="${T};font-size:12px;color:${body};line-height:1.5">${e.b}</div></div>`).join('');
    case 'skills':
      if(dark) return title('Skills')+data.skills.map(s=>`<div style="${T};font-size:11.5px;color:rgba(255,255,255,.9);padding:2px 0">${s}</div>`).join('');
      return title('Skills')+`<div style="display:flex;flex-wrap:wrap;gap:6px">${data.skills.map(s=>`<span style="${T};font-size:11.5px;background:${b.background};color:#3A4442;border:1px solid ${b.secondary}44;border-radius:100px;padding:3px 10px">${s}</span>`).join('')}</div>`;
    case 'accreditations':
      return title('Accreditations')+data.accreditations.map(a=>`<div style="${T};font-size:12px;color:${body};padding:3px 0;display:flex;gap:7px"><span class="ms" style="font-size:15px;color:${acc}">verified</span>${a}</div>`).join('');
    case 'referees':
      return title('Referees')+`<div style="${T};font-size:12px;color:${body}">${data.referees.join(', ')}</div>`;
    default: return '';
  }
}

function renderResume(opts){
  opts = opts || {};
  const layoutId = opts.layout || 'left-panel';
  const lay = RESUME_LAYOUTS.find(l=>l.id===layoutId) || RESUME_LAYOUTS[0];
  const b = opts.brand || RESUME_BRAND_DEFAULT;
  const data = opts.data || RESUME_DATA;
  const H = `font-family:'${b.font}',sans-serif`, T = `font-family:'${b.bodyFont}',sans-serif`;

  // Placement: {region:[sections]}. Fallback to layout defaults (optionally filtered by legacy opts.sections).
  let placement = opts.placement;
  if(!placement){
    placement = {}; const enabled = opts.sections || null;
    Object.keys(lay.defaults).forEach(r=>{ placement[r] = lay.defaults[r].filter(id=> !enabled || enabled.indexOf(id)!==-1); });
  }
  const sec = (id, o)=> resumeSection(id, b, Object.assign({data, logoInitials:opts.logoInitials}, o||{}));
  const reg = (r, o)=> (placement[r]||[]).map(id=>sec(id, o)).join('');

  if(layoutId==='left-panel'){
    return `<div style="display:flex;${T}">
      <div style="width:210px;background:${b.primary};color:#fff;padding:26px 20px;min-height:877px">
        <div style="${H};font-size:20px;font-weight:700;line-height:1.15">${data.name}</div>
        <div style="${T};font-size:12px;opacity:.9;margin-top:3px">${data.role}</div>
        ${reg('sidebar',{dark:true})}
      </div>
      <div style="flex:1;padding:26px 26px 26px 24px">${reg('main')}</div>
    </div>`;
  }
  if(layoutId==='top-band'){
    return `<div style="background:${b.primary};color:#fff;padding:26px 30px"><div style="${H};font-size:25px;font-weight:700">${data.name}</div><div style="${T};font-size:13px;opacity:.9;margin-top:2px">${data.role}</div></div>
      <div style="display:flex;gap:18px;padding:24px 30px;${T}"><div style="flex:1">${reg('left')}</div><div style="width:210px;flex:none">${reg('right')}</div></div>`;
  }
  // Single column (timeline / minimal)
  const align = layoutId==='timeline' ? 'center' : 'left';
  const rule  = align==='center' ? 'width:60px;margin:16px auto' : 'margin:16px 0';
  return `<div style="padding:32px 42px;${T}">
    <div style="${H};text-align:${align}"><div style="font-size:26px;font-weight:700;color:${b.primary};line-height:1.1">${data.name}</div><div style="${T};font-size:13.5px;color:${b.secondary};font-weight:600;margin-top:3px">${data.role}</div></div>
    <div style="height:2px;background:${b.secondary};${rule}"></div>
    ${reg('body',{timeline:layoutId==='timeline'})}
  </div>`;
}

if(typeof window!=='undefined'){
  window.RESUME_DATA=RESUME_DATA; window.RESUME_SECTIONS=RESUME_SECTIONS; window.RESUME_SECTION_NAME=RESUME_SECTION_NAME;
  window.RESUME_SECTION_ICON=RESUME_SECTION_ICON; window.RESUME_SECTION_DEFAULT=RESUME_SECTION_DEFAULT;
  window.RESUME_LAYOUTS=RESUME_LAYOUTS; window.RESUME_BRAND_DEFAULT=RESUME_BRAND_DEFAULT;
  window.renderResume=renderResume; window.resumeSection=resumeSection; window.resumeInitials=resumeInitials;
}
