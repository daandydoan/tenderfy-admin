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
  'cv-standard': {layout:'left-panel', sections:['summary','experience','skills','accreditations']},
  'cv-exec':     {layout:'minimal',    sections:['summary','experience','accreditations']},
};
COMPONENTS.forEach(c=>{ if(RESUME_CONFIG[c.id]) c.resume = RESUME_CONFIG[c.id]; });

// Block/element composition per section & page document — the "what you build"
// that the Document builder assembles and the view/pack preview renders (via
// document-render.js → renderComposedDoc). Resume docs are excluded (they use
// the resume renderer). Keeps build == render across the whole flow.
const DOC_BLOCKS = (function(){
  const H = t => ({t:'element', id:'heading', content:{title:t}});
  const P = () => ({t:'element', id:'paragraph'});
  const E = id => ({t:'element', id});
  const B = id => ({t:'block',   id});
  return {
    cover:            [E('cover')],
    toc:              [E('toc')],
    'exec-summary':   [H('Executive Summary'), P(), P()],
    methodology:      [H('Methodology'), P(), E('list')],
    'rate-table':     [H('Schedule of Rates'), P(), E('table')],
    'compliance-tbl': [H('Compliance Matrix'), P(), E('table')],
    'env-row':        [H('Environmental Management'), P(), E('table')],
    program:          [H('Delivery Programme'), P(), E('table')],
    'risk-block':     [H('Risk Assessment'), P(), E('table')],
    'policy-whs':     [H('Work Health & Safety Policy'), P(), E('list')],
    'policy-quality': [H('Quality Policy'), P(), E('list')],
    'policy-env':     [H('Environmental Policy'), P(), E('list')],
    'policy-legacy':  [H('HSE Policy'), P()],
    'proj-profile':   [H('Project Profile'), B('feature'), P()],
    'case-study':     [H('Case Study'), P(), B('imgtext'), P()],
    'proj-gallery':   [H('Project Gallery'), B('imggrid')],
    'org-chart':      [H('Organisation Chart'), E('image')],
    insurance:        [H('Insurance Certificates'), P(), E('table')],
    licences:         [H('Licences & Accreditations'), E('table')],
    referees:         [H('Referees'), E('keyvalue')],
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
if(typeof window!=='undefined'){ window.COMPONENTS = COMPONENTS; window.COMP_USAGE = COMP_USAGE; window.compUsage = compUsage; window.DOC_TYPE_META = DOC_TYPE_META; window.DOC_TYPES = DOC_TYPES; window.docBuilderHref = docBuilderHref; }
