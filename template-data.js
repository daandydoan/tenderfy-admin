// Tender templates — shared by the templates listing, the view page and (later)
// the builder. A template is an ordered list of library documents; on assign it
// takes the client's brand.
const TEMPLATES = [
  {id:'t1', name:'Construction — Standard Tender', desc:'General head-contractor response', category:'Construction', comps:9, tenants:['taylor','hansen','acme'], version:3, status:'live',     updated:'2 days ago'},
  {id:'t2', name:'Civil Infrastructure Response',  desc:'Includes environmental rows',        category:'Civil',        comps:11,tenants:['cpm-civil','cpm-infra'],    version:2, status:'live',     updated:'1 week ago'},
  {id:'t3', name:'Engineering Capability Statement',desc:'Short capability / EOI',            category:'Engineering',  comps:6, tenants:['velocity'],                 version:1, status:'approved', updated:'3 days ago'},
  {id:'t4', name:'HVAC Maintenance Tender',        desc:'Facilities / maintenance scope',     category:'Facilities',   comps:8, tenants:['civic'],                    version:2, status:'inreview', updated:'5 hours ago'},
  {id:'t5', name:'Trades Prequalification',        desc:'Subcontractor prequal pack',         category:'Trades',       comps:5, tenants:[],                           version:1, status:'draft',    updated:'Yesterday'},
  {id:'t6', name:'Government Supplier Panel',       desc:'Compliance-heavy panel submission',  category:'Government',   comps:12,tenants:['taylor','cpm-civil'],       version:4, status:'inreview', updated:'1 day ago'},
];
const TEMPLATE_CATS = ['Construction','Civil','Engineering','Facilities','Trades','Government'];

// A typical tender structure; a template shows the first `comps` of these.
const TENDER_DOCS = ['Cover Page','Table of Contents','Executive Summary','Company Profile','CV / Resume','Case Study','Schedule of Rates','Methodology Block','WHS Policy','Quality Policy','Insurance Certificates','Licences & Accreditations','Compliance Matrix','Referees'];
function templateDocs(t){ return TENDER_DOCS.slice(0, Math.min(t.comps, TENDER_DOCS.length)); }

const TEMPLATE_STATUS = {live:'Live', approved:'Approved', inreview:'In review', draft:'Draft'};
function templateBadge(s){ return `<span class="badge b-${s}"><span class="b-dot"></span>${TEMPLATE_STATUS[s]||s}</span>`; }

if(typeof window!=='undefined'){ window.TEMPLATES=TEMPLATES; window.TEMPLATE_CATS=TEMPLATE_CATS; window.TENDER_DOCS=TENDER_DOCS; window.templateDocs=templateDocs; window.TEMPLATE_STATUS=TEMPLATE_STATUS; window.templateBadge=templateBadge; }
