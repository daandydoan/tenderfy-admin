// Tender templates — shared by the templates listing, the view page and (later)
// the builder. A template is an ordered list of library documents; on assign it
// takes the client's brand.
// Each template is a pack of library documents (ids from library-data COMPONENTS).
const TEMPLATES = [
  {id:'t1', name:'Construction — Standard Tender', desc:'General head-contractor response', category:'Construction', tenants:['taylor','hansen','acme'], version:3, status:'live',     updated:'2 days ago',  docs:['cover','toc','exec-summary','methodology','rate-table','cv-standard','proj-profile','case-study','policy-whs']},
  {id:'t2', name:'Civil Infrastructure Response',  desc:'Includes environmental rows',        category:'Civil',        tenants:['cpm-civil','cpm-infra'],    version:2, status:'live',     updated:'1 week ago',  docs:['cover','toc','exec-summary','methodology','rate-table','env-row','proj-profile','case-study','compliance-tbl','policy-whs','insurance']},
  {id:'t3', name:'Engineering Capability Statement',desc:'Short capability / EOI',            category:'Engineering',  tenants:['velocity'],                 version:1, status:'approved', updated:'3 days ago',  docs:['cover','toc','exec-summary','cv-standard','cv-exec','licences']},
  {id:'t4', name:'HVAC Maintenance Tender',        desc:'Facilities / maintenance scope',     category:'Facilities',   tenants:['civic'],                    version:2, status:'inreview', updated:'5 hours ago', docs:['cover','toc','exec-summary','methodology','rate-table','program','policy-whs','insurance']},
  {id:'t5', name:'Trades Prequalification',        desc:'Subcontractor prequal pack',         category:'Trades',       tenants:[],                           version:1, status:'draft',    updated:'Yesterday',   docs:['cover','toc','exec-summary','cv-standard','licences']},
  {id:'t6', name:'Government Supplier Panel',       desc:'Compliance-heavy panel submission',  category:'Government',   tenants:['taylor','cpm-civil'],       version:4, status:'inreview', updated:'1 day ago',   docs:['cover','toc','exec-summary','compliance-tbl','methodology','cv-standard','policy-whs','policy-quality','policy-env','insurance','licences','referees']},
];
TEMPLATES.forEach(t=>t.comps=t.docs.length);
const TEMPLATE_CATS = ['Construction','Civil','Engineering','Facilities','Trades','Government'];

function templateDocs(t){ return t.docs || []; }

const TEMPLATE_STATUS = {live:'Live', approved:'Approved', inreview:'In review', draft:'Draft'};
function templateBadge(s){ return `<span class="badge b-${s}"><span class="b-dot"></span>${TEMPLATE_STATUS[s]||s}</span>`; }

if(typeof window!=='undefined'){ window.TEMPLATES=TEMPLATES; window.TEMPLATE_CATS=TEMPLATE_CATS; window.templateDocs=templateDocs; window.TEMPLATE_STATUS=TEMPLATE_STATUS; window.templateBadge=templateBadge; }
