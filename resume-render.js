// Shared resume renderer — ONE source of truth for how a resume looks, so the
// Resume builder (resume-edit.html) and the document/pack preview
// (document-content.js → renderDocument) render an identical CV. Closing the
// "what you build ≠ what renders" seam for resume-type documents.
//
// renderResume({ layout, brand, sections, showLogo, data, logoInitials })
//   layout   — one of RESUME_LAYOUTS ids (default 'left-panel')
//   brand    — { primary, secondary, background, font, bodyFont }
//   sections — array of enabled section ids (default RESUME_SECTION_DEFAULT)
//   showLogo — bool (default true)
//   data     — CV data object (default RESUME_DATA)
//   logoInitials — override the logo monogram (else derived from data.name)

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
const RESUME_SECTIONS = [
  {id:'summary', name:'Professional Summary'},
  {id:'experience', name:'Experience'},
  {id:'skills', name:'Skills'},
  {id:'accreditations', name:'Accreditations'},
  {id:'referees', name:'Referees'},
];
const RESUME_SECTION_DEFAULT = ['summary','experience','skills','accreditations'];

const RESUME_LAYOUTS = (function(){
  const sk=(w,h,d)=>`<div class="sk${d?' d':''}" style="width:${w};height:${h||'6px'}"></div>`;
  return [
    {id:'left-panel', name:'Left Panel', desc:'Coloured sidebar with contact & skills, main column for experience.',
      thumb:`<div style="width:34%;background:#9fb2ac;border-radius:4px;padding:6px;display:flex;flex-direction:column;gap:5px">${sk('80%','8px',1)+sk('100%')+sk('90%')+sk('70%')}</div><div style="flex:1;padding:6px;display:flex;flex-direction:column;gap:5px">${sk('70%','9px',1)+sk('100%')+sk('96%')+sk('88%')+sk('60%')}</div>`},
    {id:'top-band', name:'Header Band', desc:'Full-width brand band with name & role, two-column body beneath.',
      thumb:`<div style="width:100%;display:flex;flex-direction:column;gap:5px"><div style="height:24px;background:#9fb2ac;border-radius:4px"></div><div style="flex:1;display:flex;gap:5px"><div style="flex:1;display:flex;flex-direction:column;gap:4px">${sk('90%')+sk('80%')+sk('86%')}</div><div style="flex:1;display:flex;flex-direction:column;gap:4px">${sk('84%')+sk('92%')+sk('70%')}</div></div></div>`},
    {id:'timeline', name:'Timeline', desc:'Centered name header over a vertical experience timeline.',
      thumb:`<div style="width:100%;display:flex;flex-direction:column;gap:6px;align-items:center;padding:4px">${sk('56%','9px',1)}<div style="width:100%;border-left:2px solid #9fb2ac;padding-left:8px;display:flex;flex-direction:column;gap:6px;margin-top:2px">${sk('80%')+sk('66%')+sk('74%')}</div></div>`},
    {id:'minimal', name:'Minimal', desc:'Clean single column — understated, ATS-friendly.',
      thumb:`<div style="width:100%;padding:6px;display:flex;flex-direction:column;gap:6px">${sk('60%','9px',1)+sk('100%')+sk('94%')+sk('88%')+sk('96%')+sk('70%')}</div>`},
  ];
})();

function resumeInitials(name){ return (String(name||'').trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2)||'—').toUpperCase(); }

function renderResume(opts){
  opts = opts || {};
  const layout = opts.layout || 'left-panel';
  const b = opts.brand || {primary:'#27535C',secondary:'#38988A',background:'#F7F9F8',font:'Outfit',bodyFont:'Outfit'};
  const data = opts.data || RESUME_DATA;
  const enabled = opts.sections || RESUME_SECTION_DEFAULT;
  const showLogo = opts.showLogo !== false;
  const on = id => enabled.indexOf(id) !== -1;
  const H = `font-family:'${b.font}',sans-serif`, T = `font-family:'${b.bodyFont}',sans-serif`;

  function logoMark(){
    if(!showLogo) return '';
    const ini = opts.logoInitials || resumeInitials(data.name);
    return `<div style="width:46px;height:46px;border-radius:9px;background:${b.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;${H};font-size:16px;flex:none">${ini}</div>`;
  }
  function block(id){
    if(!on(id)) return '';
    const title=t=>`<div style="${H};color:${b.primary};font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid ${b.secondary};padding-bottom:4px;margin:18px 0 9px">${t}</div>`;
    if(id==='summary') return title('Summary')+`<div style="${T};font-size:12.5px;color:#3A4442;line-height:1.55">${data.summary}</div>`;
    if(id==='experience') return title('Experience')+data.experience.map(e=>`<div style="margin-bottom:11px"><div style="${H};font-weight:700;font-size:12.5px;color:#26332F">${e.t}</div><div style="${T};font-size:11px;color:${b.secondary};font-weight:600;margin:1px 0 3px">${e.d}</div><div style="${T};font-size:12px;color:#3A4442;line-height:1.5">${e.b}</div></div>`).join('');
    if(id==='skills') return title('Skills')+`<div style="display:flex;flex-wrap:wrap;gap:6px">${data.skills.map(s=>`<span style="${T};font-size:11.5px;background:${b.background};color:#3A4442;border:1px solid ${b.secondary}44;border-radius:100px;padding:3px 10px">${s}</span>`).join('')}</div>`;
    if(id==='accreditations') return title('Accreditations')+data.accreditations.map(a=>`<div style="${T};font-size:12px;color:#3A4442;padding:3px 0;display:flex;gap:7px"><span class="ms" style="font-size:15px;color:${b.secondary}">verified</span>${a}</div>`).join('');
    if(id==='referees') return title('Referees')+`<div style="${T};font-size:12px;color:#3A4442">${data.referees.join(', ')}</div>`;
    return '';
  }
  const nameHead=(align)=>`<div style="${H};text-align:${align||'left'}"><div style="font-size:26px;font-weight:700;color:${b.primary};line-height:1.1">${data.name}</div><div style="${T};font-size:13.5px;color:${b.secondary};font-weight:600;margin-top:3px">${data.role}</div></div>`;
  const contactLine=`<div style="${T};font-size:11px;color:#6A756F;margin-top:6px">${data.contact.join('  ·  ')}</div>`;

  if(layout==='left-panel'){
    const side=`<div style="width:210px;background:${b.primary};color:#fff;padding:26px 20px;min-height:877px">
      ${logoMark()}
      <div style="${H};font-size:20px;font-weight:700;margin-top:16px;line-height:1.15">${data.name}</div>
      <div style="${T};font-size:12px;opacity:.9;margin-top:3px">${data.role}</div>
      <div style="${T};font-size:11px;opacity:.85;margin-top:16px;display:flex;flex-direction:column;gap:5px">${data.contact.map(c=>`<span>${c}</span>`).join('')}</div>
      ${on('skills')?`<div style="${H};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin:20px 0 8px;opacity:.9">Skills</div>${data.skills.map(s=>`<div style="${T};font-size:11.5px;opacity:.9;padding:2px 0">${s}</div>`).join('')}`:''}
    </div>`;
    const main=`<div style="flex:1;padding:26px 26px 26px 24px">${block('summary')}${block('experience')}${block('accreditations')}${block('referees')}</div>`;
    return `<div style="display:flex;${T}">${side}${main}</div>`;
  }
  if(layout==='top-band'){
    const band=`<div style="background:${b.primary};color:#fff;padding:26px 30px;display:flex;align-items:center;gap:16px">${logoMark()}<div style="${H}"><div style="font-size:25px;font-weight:700">${data.name}</div><div style="${T};font-size:13px;opacity:.9;margin-top:2px">${data.role}</div><div style="${T};font-size:11px;opacity:.8;margin-top:6px">${data.contact.join('  ·  ')}</div></div></div>`;
    const left=`<div style="flex:1;padding-right:14px">${block('summary')}${block('experience')}</div>`;
    const right=`<div style="width:210px;flex:none">${block('skills')}${block('accreditations')}${block('referees')}</div>`;
    return `${band}<div style="display:flex;gap:14px;padding:24px 30px;${T}">${left}${right}</div>`;
  }
  if(layout==='timeline'){
    return `<div style="padding:30px 40px;${T}">${nameHead('center')}<div style="text-align:center">${contactLine}</div>
      <div style="margin-top:20px;border-left:2px solid ${b.secondary};padding-left:18px">
      ${block('summary')}
      ${on('experience')?data.experience.map(e=>`<div style="position:relative;margin-bottom:16px"><span style="position:absolute;left:-25px;top:3px;width:11px;height:11px;border-radius:50%;background:${b.secondary};border:2px solid #fff;box-shadow:0 0 0 2px ${b.secondary}"></span><div style="${H};font-weight:700;font-size:13px;color:#26332F">${e.t}</div><div style="${T};font-size:11px;color:${b.secondary};font-weight:600;margin:1px 0 3px">${e.d}</div><div style="${T};font-size:12px;color:#3A4442;line-height:1.5">${e.b}</div></div>`).join(''):''}
      </div>${block('skills')}${block('accreditations')}${block('referees')}</div>`;
  }
  // minimal
  return `<div style="padding:34px 42px;${T}">${nameHead('left')}${contactLine}<div style="height:2px;background:${b.secondary};margin:16px 0"></div>${block('summary')}${block('experience')}${block('skills')}${block('accreditations')}${block('referees')}</div>`;
}

if(typeof window!=='undefined'){ window.RESUME_DATA=RESUME_DATA; window.RESUME_SECTIONS=RESUME_SECTIONS; window.RESUME_SECTION_DEFAULT=RESUME_SECTION_DEFAULT; window.RESUME_LAYOUTS=RESUME_LAYOUTS; window.renderResume=renderResume; window.resumeInitials=resumeInitials; }
