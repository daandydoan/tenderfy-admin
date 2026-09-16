// Clients (customer companies on the platform) + their per-client Brand Kit,
// subscription plan and AI credit balances.
// Design decision: brand identity is stored PER CLIENT and auto-applied when a
// (brand-neutral) template is assigned — so templates stay reusable across clients.
// Filenames/ids keep the legacy "tenant" wording; the user-facing name is "Clients".
const TENANTS = [
  {id:'taylor',   name:'Bramble & Kite Builders',        industry:'Construction',   initials:'BK', templates:4, plan:'Pro',     planCredits:62,  topup:0,   renews:'10 Aug 2026', brand:{primary:'#1F5C3D', secondary:'#C9A227', background:'#F4F7F5', font:'Poppins', bodyFont:'Outfit'}},
  {id:'cpm-civil',name:'Ironbark Civil',              industry:'Civil',          initials:'IC', templates:3, plan:'Growth',  planCredits:45,  topup:0,   renews:'2 Sep 2026',  brand:{primary:'#123B66', secondary:'#E8622C', background:'#F2F5F9', font:'Inter',   bodyFont:'Inter'}},
  {id:'cpm-infra',name:'Ironbark Infrastructure',     industry:'Infrastructure', initials:'II', templates:3, plan:'Growth',  planCredits:80,  topup:26,  renews:'2 Sep 2026',  brand:{primary:'#0B4F4A', secondary:'#7BC043', background:'#F1F6F5', font:'Inter',   bodyFont:'Inter'}},
  {id:'velocity', name:'Halcyon Engineering',   industry:'Engineering',    initials:'HE', templates:2, plan:'Lite',    planCredits:100, topup:0,   renews:'18 Aug 2026', brand:{primary:'#2B2D42', secondary:'#EF233C', background:'#F5F5F7', font:'Outfit',  bodyFont:'Outfit'}},
  {id:'hansen',   name:'Wattlecreek Projects',        industry:'Construction',   initials:'WP', templates:2, plan:'Starter', planCredits:34,  topup:0,   renews:'5 Jul 2026',  brand:{primary:'#3A2E39', secondary:'#D4A15A', background:'#F7F4F2', font:'Lora',    bodyFont:'Outfit'}},
  {id:'acme',     name:'Stonefield Constructions',     industry:'Construction',   initials:'SC', templates:1, plan:'Starter', planCredits:12,  topup:0,   renews:'21 Jul 2026', brand:{primary:'#8A1C1C', secondary:'#F2C14E', background:'#FAF4F2', font:'Roboto',  bodyFont:'Roboto'}},
  {id:'northolt', name:'Redgum Construction',  industry:'Trades',         initials:'RC', templates:0, plan:'Lite',    planCredits:100, topup:0,   renews:'1 Sep 2026',  brand:{primary:'#38988A', secondary:'#FFBC4A', background:'#F2F8F6', font:'Outfit',  bodyFont:'Outfit'}},
  {id:'civic',    name:'Southwind HVAC',             industry:'HVAC',           initials:'SH', templates:1, plan:'Growth',  planCredits:96,  topup:99,  renews:'14 Aug 2026', brand:{primary:'#155E75', secondary:'#F59E0B', background:'#F1F6F8', font:'Inter',   bodyFont:'Outfit'}},
];

// Which brand token drives what inside an assigned tender template.
// Answers Tom's question (scrum 20 Jul): "what styles are being edited within that template?"
const BRAND_TOKENS = [
  {key:'logo',       label:'Logo',              type:'asset', applies:'Cover page lockup and the running header on every page'},
  {key:'primary',    label:'Primary colour',    type:'color', applies:'Cover panel, section headings, table header fill'},
  {key:'secondary',  label:'Secondary / accent',type:'color', applies:'Heading rules, dividers, callout borders, bullets'},
  {key:'background', label:'Background',        type:'color', applies:'Cover panel wash and highlight-box fills'},
  {key:'font',       label:'Heading font',      type:'font',  applies:'All headings, section titles and the cover title'},
  {key:'bodyFont',   label:'Body font',         type:'font',  applies:'Body copy, table text, captions and footers'},
];

// Subscription plan catalog (global product config, mirrors the live super admin).
const PLANS = [
  {name:'Starter', price:249, per:'mo', quota:10,  tokens:'2M',   subs:35, popular:false},
  {name:'Lite',    price:149, per:'mo', quota:5,   tokens:'500K', subs:19, popular:false},
  {name:'Growth',  price:499, per:'mo', quota:50,  tokens:'8M',   subs:21, popular:true},
  {name:'Pro',     price:999, per:'mo', quota:100, tokens:'15M',  subs:8,  popular:false},
];
// ============================================================================
// Design tokens — the single source of truth shared by the client Brand-tokens
// board (tenant-detail) and the block builder's bindings. A block references a
// token *role* (e.g. "primary"), and it resolves to each client's value at render.
// ============================================================================

// Colour roles. scope: 'brand' = comes from the client's kit; 'derived' = computed;
// 'shared' = one neutral value for every client. `bindable` roles appear in the block builder.
const COLOUR_ROLES = [
  {key:'primary',    label:'Primary',    scope:'brand',   bindable:true,  applies:'Headings, cover panel, table header fill'},
  {key:'secondary',  label:'Secondary',  scope:'brand',   bindable:true,  applies:'Accents, heading rules, dividers, bullets'},
  {key:'tint',       label:'Tint',       scope:'derived', bindable:true,  applies:'Callout & highlight-box fills'},
  {key:'background', label:'Background',  scope:'brand',   bindable:true,  applies:'Cover wash, panel backgrounds'},
  {key:'ink',        label:'Ink / Text', scope:'shared',  bindable:true,  applies:'Body copy, captions'},
  {key:'surface',    label:'Surface',    scope:'shared',  bindable:true,  applies:'Cards, table cells'},
  {key:'border',     label:'Border',     scope:'shared',  bindable:true,  applies:'Dividers, table & box borders'},
];
// Type scale (shared design scale; the font family per role comes from the client's kit).
const TYPE_SCALE = [
  {key:'h1',    label:'Heading 1', size:28, weight:700, lh:34, font:'heading'},
  {key:'h2',    label:'Heading 2', size:20, weight:700, lh:26, font:'heading'},
  {key:'h3',    label:'Heading 3', size:15, weight:600, lh:20, font:'heading'},
  {key:'body',  label:'Body',      size:13, weight:400, lh:20, font:'body'},
  {key:'small', label:'Caption',   size:11, weight:400, lh:15, font:'body'},
];
// Spacing & radius aliases (shared across every client — geometry is not brand-specific).
const SPACE_SCALE  = [{key:'xs',v:4},{key:'sm',v:8},{key:'md',v:16},{key:'lg',v:24},{key:'xl',v:40}];
const RADIUS_SCALE = [{key:'sm',v:4},{key:'md',v:8},{key:'lg',v:14}];

// Curated font list (loaded on demand) offered in the Brand Kit editor.
const FONTS = ['Outfit','Inter','Poppins','Lora','Roboto','Montserrat','Work Sans','Nunito','Merriweather','Playfair Display','DM Sans','Manrope','Raleway','Rubik','Source Sans 3'];

// Lazily give a client an editable, per-client token set (colours + type styles),
// seeded from the shared defaults the first time its Brand Kit is opened.
function ensureBrandTokens(t){
  const b=t.brand;
  if(!b.colours) b.colours = COLOUR_ROLES.map(r=>({key:r.key, name:r.label, value:roleValue(b, r.key), scope:r.scope, applies:r.applies}));
  if(!b.type)    b.type    = TYPE_SCALE.map(s=>({name:s.label, size:s.size, lh:s.lh, weight:String(s.weight), font:s.font, color:(s.font==='heading'?'primary':(s.key==='small'?'secondary':'ink'))}));
}

// ---- Brand provenance & approval (per client, persisted in localStorage) ----
// The brand is evidence + sign-off, not a document we store: every value says where it
// came from (or that it was assumed), the client's original files sit beside it, the
// client approves a rendered sample before templates are built, and an issued document
// freezes the brand it was sent with.
const BRAND_META_KEY = id => 'tf_brandmeta_'+id;
function brandMeta(t){
  if(t._meta) return t._meta;
  let m=null; try{ m=JSON.parse(localStorage.getItem(BRAND_META_KEY(t.id))); }catch(e){}
  if(!m){
    const guide = t.name.replace(/\s+/g,'-')+'-Brand-Guide.pdf', tender='2025-'+t.name.split(' ')[0]+'-Tender.docx';
    const seeded = t.templates>0;   // clients with templates already have their files in; new ones are still waiting
    m = {
      files: seeded ? [
        {type:'logo',        name:t.initials.toLowerCase()+'-logo.png', by:'Client', date:'28 Aug 2026'},
        {type:'brand-guide', name:guide,  by:'Client', date:'28 Aug 2026', pages:12},
        {type:'past-tender', name:tender, by:'Client', date:'29 Aug 2026', pages:31},
      ] : [],
      requested: seeded ? null : '3 Sep 2026',
      // Where each value came from. from/page = evidence; assumed = admin's best guess.
      evidence: seeded
        ? {primary:{from:guide,page:4}, secondary:{from:guide,page:4}, background:{from:guide,page:6}, tint:{derived:true}, ink:{assumed:true}, surface:{assumed:true}, border:{assumed:true}, font:{from:guide,page:8}, bodyFont:{from:tender,page:2}, logo:{from:t.initials.toLowerCase()+'-logo.png'}}
        : {primary:{from:'email from client'}, secondary:{assumed:true}, background:{assumed:true}, tint:{derived:true}, ink:{assumed:true}, surface:{assumed:true}, border:{assumed:true}, font:{assumed:true}, bodyFont:{assumed:true}, logo:{assumed:true}},
      page: {marginTop:22, marginSide:18, logoPos:'top-left', footer:t.name+' · Commercial-in-confidence'},
      approval: seeded ? {status:'approved', by:'Client · '+t.name, date:'1 Sep 2026'} : {status:'not-sent'},
      log: seeded ? [{date:'1 Sep 2026', by:'Kaila', what:'Client approved brand sample'},{date:'29 Aug 2026', by:'Kaila', what:'Body font set from past tender'},{date:'28 Aug 2026', by:'Kaila', what:'Colours & heading font from brand guide'}] : [],
      issued: seeded ? [{name:'Kingsford Smith Drive Upgrade — Tender Response', date:'3 Sep 2026', brandVersion:1}] : [],
    };
  }
  t._meta=m; return m;
}
function saveBrandMeta(t){ try{ localStorage.setItem(BRAND_META_KEY(t.id), JSON.stringify(t._meta)); }catch(e){} }
function brandLog(t, by, what){ const m=brandMeta(t); m.log.unshift({date:new Date().toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}), by, what}); saveBrandMeta(t); }
// One-line status for pickers: "Bramble & Kite Builders · approved 1 Sep" / "· awaiting approval" / "· brand not approved".
function brandStatusLabel(t){ const a=brandMeta(t).approval; return a.status==='approved' ? 'approved '+a.date : a.status==='pending' ? 'awaiting client approval' : 'brand not approved'; }

// Resolve a colour-role key to a concrete value for a given brand or the neutral default.
// Prefers the client's own editable colours[] when present.
function roleValue(brand, key){
  if(brand && brand.colours){ const c=brand.colours.find(x=>x.key===key); if(c) return c.value; }
  const b = brand || {primary:'#27535C', secondary:'#38988A', background:'#F7F9F8'};
  switch(key){
    case 'primary':    return b.primary;
    case 'secondary':  return b.secondary;
    case 'tint':       return b.secondary + '22';
    case 'background': return b.background;
    case 'ink':        return '#2E3C3B';
    case 'surface':    return '#FFFFFF';
    case 'border':     return '#E2E8E6';
  }
  return '#000000';
}

if(typeof window!=='undefined'){
  window.TENANTS = TENANTS; window.PLANS = PLANS; window.BRAND_TOKENS = BRAND_TOKENS;
  window.COLOUR_ROLES = COLOUR_ROLES; window.TYPE_SCALE = TYPE_SCALE;
  window.SPACE_SCALE = SPACE_SCALE; window.RADIUS_SCALE = RADIUS_SCALE; window.roleValue = roleValue;
  window.FONTS = FONTS; window.ensureBrandTokens = ensureBrandTokens;
  window.brandMeta = brandMeta; window.saveBrandMeta = saveBrandMeta; window.brandLog = brandLog; window.brandStatusLabel = brandStatusLabel;
}
