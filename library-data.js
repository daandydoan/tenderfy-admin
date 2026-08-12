// Document library — the reusable document sections/templates that make up a tender.
// Categories mirror the real Tenderfy document types (Resumes, Case Studies, Policies,
// Insurances, Certifications, Organisation Chart, Cover Pages, Table of Contents, Others).
// Each document is assembled from BLOCKS (see blocks.html) and brand-applied per client.
// Shared by the Documents browser and the Template Builder palette.
const COMPONENTS = [
  {id:'cv-standard',    name:'CV / Resume',            category:'Resumes',            status:'published', restricted:0, version:'3.1', updated:'2 days ago',  thumb:'lines', icon:'badge', desc:'Individual staff resume with role, experience timeline and accreditations.'},
  {id:'cv-exec',        name:'Executive Bio',          category:'Resumes',            status:'published', restricted:0, version:'1.4', updated:'3 weeks ago', thumb:'lines', icon:'badge', desc:'Short-form leadership profile for key personnel.'},
  {id:'org-chart',      name:'Organisation Chart',     category:'Organisation Chart', status:'draft',     restricted:0, version:'0.4', updated:'6 hours ago', thumb:'icon',  icon:'account_tree', desc:'Project team structure and reporting lines.'},
  {id:'proj-profile',   name:'Project Profile',        category:'Case Studies',       status:'published', restricted:0, version:'4.0', updated:'1 week ago',  thumb:'lines', icon:'domain', desc:'Reference project with client, value, scope and outcomes.'},
  {id:'case-study',     name:'Case Study',             category:'Case Studies',       status:'published', restricted:0, version:'2.2', updated:'4 days ago',  thumb:'lines', icon:'auto_stories', desc:'Narrative project story with challenge, approach and results.'},
  {id:'proj-gallery',   name:'Project Gallery',        category:'Case Studies',       status:'draft',     restricted:0, version:'0.9', updated:'Yesterday',   thumb:'icon',  icon:'photo_library', desc:'Image grid of completed works.'},
  {id:'rate-table',     name:'Schedule of Rates',      category:'Others',             status:'published', restricted:0, version:'3.5', updated:'5 days ago',  thumb:'rows',  icon:'table_chart', desc:'Itemised pricing table with quantities and unit rates.'},
  {id:'compliance-tbl', name:'Compliance Matrix',      category:'Others',             status:'published', restricted:0, version:'2.0', updated:'2 weeks ago', thumb:'rows',  icon:'grid_on', desc:'Requirement-by-requirement conformance table.'},
  {id:'env-row',        name:'Environmental Row',      category:'Others',             status:'published', restricted:4, version:'1.1', updated:'1 month ago', thumb:'rows',  icon:'eco', desc:'Sustainability / environmental line item — infra & civil clients.'},
  {id:'methodology',    name:'Methodology Block',      category:'Others',             status:'published', restricted:0, version:'2.8', updated:'3 days ago',  thumb:'lines', icon:'schema', desc:'Structured method statement with staged approach.'},
  {id:'program',        name:'Program / Gantt',        category:'Others',             status:'published', restricted:0, version:'1.6', updated:'2 weeks ago', thumb:'rows',  icon:'view_timeline', desc:'High-level delivery programme timeline.'},
  {id:'risk-block',     name:'Risk Assessment',        category:'Others',             status:'draft',     restricted:0, version:'0.6', updated:'4 hours ago', thumb:'rows',  icon:'warning', desc:'Risk register with likelihood, impact and controls.'},
  {id:'policy-whs',     name:'WHS Policy',             category:'Policies',           status:'published', restricted:0, version:'3.0', updated:'1 week ago',  thumb:'lines', icon:'health_and_safety', desc:'Work health & safety policy statement.'},
  {id:'policy-quality', name:'Quality Policy',         category:'Policies',           status:'published', restricted:0, version:'2.4', updated:'2 weeks ago', thumb:'lines', icon:'verified', desc:'Quality management policy statement.'},
  {id:'policy-env',     name:'Environmental Policy',   category:'Policies',           status:'published', restricted:0, version:'2.1', updated:'3 weeks ago', thumb:'lines', icon:'compost', desc:'Environmental management policy statement.'},
  {id:'policy-legacy',  name:'Legacy HSE Policy',      category:'Policies',           status:'deprecated',restricted:2, version:'1.0', updated:'6 months ago',thumb:'lines', icon:'history', desc:'Superseded combined HSE policy — retained for two legacy clients.'},
  {id:'cover',          name:'Cover Page',             category:'Cover Pages',        status:'published', restricted:0, version:'5.2', updated:'2 days ago',  thumb:'icon',  icon:'article', desc:'Title page with tender name, client and submission date.'},
  {id:'toc',            name:'Table of Contents',      category:'Table of Contents',  status:'published', restricted:0, version:'4.1', updated:'1 week ago',  thumb:'rows',  icon:'toc', desc:'Auto-generated contents driven by section names.'},
  {id:'exec-summary',   name:'Executive Summary',      category:'Others',             status:'published', restricted:0, version:'3.3', updated:'5 days ago',  thumb:'lines', icon:'summarize', desc:'Opening summary / value proposition section.'},
  {id:'insurance',      name:'Insurance Certificates', category:'Insurances',         status:'published', restricted:0, version:'2.0', updated:'2 weeks ago', thumb:'rows',  icon:'shield', desc:'Currency of insurances with expiry tracking.'},
  {id:'licences',       name:'Licences & Accreditations',category:'Certifications',   status:'published', restricted:0, version:'1.9', updated:'3 weeks ago', thumb:'rows',  icon:'workspace_premium', desc:'Trade licences and accreditation register.'},
  {id:'referees',       name:'Referees',               category:'Others',             status:'draft',     restricted:0, version:'0.3', updated:'1 day ago',   thumb:'lines', icon:'contact_page', desc:'Client referee contacts for the submission.'},
];
// Document TYPE drives which builder opens (see directive #4):
//   page    — standalone cover / contents page (Page builder)
//   resume  — CV / bio built from a base layout (Resume builder)
//   section — a normal multi-block tender section (Document builder)
const DOC_PAGE_CATS   = new Set(['Cover Pages','Table of Contents']);
const DOC_RESUME_CATS = new Set(['Resumes']);
COMPONENTS.forEach(c=>{ c.type = DOC_RESUME_CATS.has(c.category) ? 'resume' : DOC_PAGE_CATS.has(c.category) ? 'page' : 'section'; });
// Resume documents carry the base-layout config the Resume builder saved, so the
// document/pack preview renders the very same CV (see resume-render.js).
const RESUME_CONFIG = {
  'cv-standard': {layout:'left-panel', placement:{sidebar:['profile','contact','skills'], main:['summary','experience','accreditations']}},
  'cv-exec':     {layout:'minimal',    placement:{body:['profile','contact','summary','experience','accreditations']}},
};
COMPONENTS.forEach(c=>{ if(RESUME_CONFIG[c.id]) c.resume = RESUME_CONFIG[c.id]; });

// Block/element composition per section & page document — the "what you build"
// that the Document builder assembles and the view/pack preview renders (via
// document-render.js → renderComposedDoc). Resume docs are excluded (they use
// the resume renderer). Keeps build == render across the whole flow.
const DOC_BLOCKS = (function(){
  const H = title => ({t:'element', id:'heading', content:{title}});
  const P = body => ({t:'element', id:'paragraph', content:body?{body}:{}});
  const L = items => ({t:'element', id:'list', content:{items}});
  const TBL = (headers,rows) => ({t:'element', id:'table', content:{headers,rows}});
  const KV = pairs => ({t:'element', id:'keyvalue', content:{pairs}});
  const COVER = o => ({t:'element', id:'cover', content:o});
  const TOC = rows => ({t:'element', id:'toc', content:{rows}});
  const E = id => ({t:'element', id});
  const B = id => ({t:'block',   id});
  return {
    cover: [COVER({kicker:'Tender Response', title:'Kingsford Smith Drive Upgrade', meta:'Prepared for the Department of Transport · RFT-2026-0418 · 14 August 2026'})],
    toc: [TOC([['1. Executive Summary','2'],['2. Company Profile','4'],['3. Methodology','7'],['4. Schedule of Rates','12'],['5. Compliance & Insurances','16'],['6. Referees','19']])],
    'exec-summary': [
      H('Executive Summary'),
      P('We are pleased to submit our response for the Kingsford Smith Drive intersection upgrade. With 18 years delivering complex road and drainage packages on live transport corridors, our team is well placed to deliver this project safely, on time and on budget.'),
      P('Our proposal combines a disciplined staged methodology, a proven local supply chain and a zero-harm safety culture to minimise disruption to road users and adjacent businesses.'),
    ],
    methodology: [
      H('Methodology'),
      P('We deliver the works in four controlled stages, each with defined hold points, quality checks and a return-to-service plan.'),
      L(['Mobilisation, site establishment and traffic management','Bulk earthworks, service relocation and drainage','Pavement, structures and reinstatement','Testing, commissioning and handover']),
    ],
    'rate-table': [
      H('Schedule of Rates'),
      P('All rates are fixed for the tender period and inclusive of plant, labour and supervision.'),
      TBL(['Item','Qty','Unit rate','Amount'], [['Traffic management','16 wks','$525/wk','$8,400'],['Bulk earthworks','320 m³','$46/m³','$14,720'],['Stormwater drainage','1 item','$21,750','$21,750'],['Pavement & reinstatement','1 item','$9,900','$9,900']]),
    ],
    'compliance-tbl': [
      H('Compliance Matrix'),
      P('Requirement-by-requirement conformance against the specification.'),
      TBL(['Requirement','Clause','Status'], [['WHS management system','3.1','Full compliance'],['Environmental controls','3.4','Full compliance'],['Insurances current','5.2','Full compliance'],['Quality (ITP) regime','6.1','Full compliance']]),
    ],
    'env-row': [
      H('Environmental Management'),
      P('Environmental controls are integrated into every stage and managed to the project CEMP.'),
      L(['Erosion and sediment controls','Dust and air-quality monitoring','Spill response and waste tracking','Weekly environmental inspections']),
    ],
    program: [
      H('Delivery Programme'),
      P('A 16-week programme with staged possessions to keep two lanes open at all times.'),
      TBL(['Stage','Duration','Milestone'], [['Establishment','2 wks','Site setup complete'],['Earthworks & drainage','7 wks','Drainage proof-tested'],['Pavement & structures','5 wks','Base course accepted'],['Handover','2 wks','Practical completion']]),
    ],
    'risk-block': [
      H('Risk Assessment'),
      P('Key project risks with likelihood and the controls we apply.'),
      TBL(['Risk','Likelihood','Control'], [['Service strike','Medium','DBYD + potholing'],['Wet weather','Medium','Float + staged works'],['Traffic incident','Low','Approved TMP + spotters']]),
    ],
    'policy-whs': [
      H('Work Health & Safety Policy'),
      P('We are committed to a zero-harm workplace. Safety is a line-management responsibility on every site.'),
      L(['Zero-harm safety culture','JSAs and SWMS for all activities','Daily pre-starts and toolbox talks','Incident reporting and investigation','Regular audits and corrective actions']),
    ],
    'policy-quality': [
      H('Quality Policy'),
      P('We deliver to specification through documented inspection and test plans and independent verification at each hold point.'),
      L(['ISO 9001-aligned quality system','ITPs for every work lot','Hold and witness points','Non-conformance tracking to closure']),
    ],
    'policy-env': [
      H('Environmental Policy'),
      P('We protect the environment through planning, control and monitoring under a project-specific CEMP.'),
      L(['Project CEMP for every site','Sediment and erosion controls','Waste minimisation and recycling','Environmental incident reporting']),
    ],
    'policy-legacy': [
      H('Health, Safety & Environment Policy'),
      P('This combined legacy HSE policy is retained for two long-standing clients and is superseded by the current WHS, Quality and Environmental policies.'),
    ],
    'proj-profile': [
      H('Project Profile'),
      KV([['Client','Department of Transport'],['Contract value','$4.2M'],['Sector','Civil / Roads'],['Duration','22 weeks'],['Completed','March 2025']]),
      P('Full reconstruction of a signalised intersection including drainage, pavement and traffic signals, delivered under live traffic with zero lost-time injuries.'),
      E('image'),
    ],
    'case-study': [
      H('Case Study'),
      P('Challenge — deliver a major intersection upgrade on a live arterial with strict night-work windows and heritage drainage constraints.'),
      B('imgtext'),
      P('Outcome — completed six weeks early and 6% under budget, with a road-user satisfaction score of 94%.'),
    ],
    'proj-gallery': [ H('Project Gallery'), B('imggrid') ],
    'org-chart': [ H('Organisation Chart'), P('Project delivery structure and reporting lines for the contract.'), E('image') ],
    insurance: [
      H('Insurance Certificates'),
      P('Currency of insurances held; certificates available on request.'),
      TBL(['Policy','Sum insured','Expiry'], [['Public & product liability','$20,000,000','30/06/2027'],['Workers compensation','Statutory','30/06/2027'],['Professional indemnity','$10,000,000','30/06/2027'],['Plant & equipment','$2,500,000','30/06/2027']]),
    ],
    licences: [
      H('Licences & Accreditations'),
      TBL(['Licence / accreditation','Reference','Expiry'], [['Builder licence (QBCC)','BLD-12894','31/03/2027'],['RPEQ registered engineer','12894','—'],['ISO 9001 Quality','QMS-4471','2028'],['ISO 45001 Safety','OHS-2210','2028']]),
    ],
    referees: [
      H('Referees'),
      KV([['Dept of Transport — J. Okafor','(07) 3000 1200'],['City Council — R. Delacroix','(07) 3400 8800'],['Harbour Water — S. Nguyen','(07) 3900 5500']]),
    ],
  };
})();
COMPONENTS.forEach(c=>{ if(DOC_BLOCKS[c.id]) c.blocks = DOC_BLOCKS[c.id]; });
const DOC_TYPE_META = {
  page:   {label:'Page',    icon:'wysiwyg',   builder:'document-edit.html', mode:'page'},
  section:{label:'Section', icon:'article',   builder:'document-edit.html', mode:'section'},
  resume: {label:'Resume',  icon:'badge',     builder:'resume-edit.html',   mode:'resume'},
};
const DOC_TYPES = ['page','section','resume'];
function docBuilderHref(c){ const m=DOC_TYPE_META[c.type]||DOC_TYPE_META.section; return m.builder+'#id='+c.id; }

// Realistic "used in N tender templates" counts per document type.
const COMP_USAGE = {
  cover:14, toc:12, 'exec-summary':11, insurance:11, 'policy-whs':10, 'cv-standard':9,
  licences:9, methodology:9, 'policy-quality':8, 'rate-table':8, 'case-study':8,
  'proj-profile':7, 'policy-env':7, program:6, 'compliance-tbl':6, 'org-chart':5,
  'cv-exec':4, referees:4, 'env-row':4, 'proj-gallery':3, 'risk-block':3, 'policy-legacy':2,
};
function compUsage(id){ return (id in COMP_USAGE) ? COMP_USAGE[id] : 4; }

// ---- Flow connections (Blocks ↔ Documents ↔ Packs), backed by real data ----
// Documents whose composition includes a given block/element id.
function docsUsingBlock(blockId){ return COMPONENTS.filter(c=>Array.isArray(c.blocks) && c.blocks.some(bl=>bl.id===blockId)); }
// The block/element composition entries of a document (for "Built from").
function docComposition(c){ return (c && Array.isArray(c.blocks)) ? c.blocks : []; }
if(typeof window!=='undefined'){ window.COMPONENTS = COMPONENTS; window.COMP_USAGE = COMP_USAGE; window.compUsage = compUsage; window.DOC_TYPE_META = DOC_TYPE_META; window.DOC_TYPES = DOC_TYPES; window.docBuilderHref = docBuilderHref; window.docsUsingBlock = docsUsingBlock; window.docComposition = docComposition; }
