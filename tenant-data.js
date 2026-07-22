// Clients (customer companies on the platform) + their per-client Brand Kit,
// subscription plan and AI credit balances.
// Design decision: brand identity is stored PER CLIENT and auto-applied when a
// (brand-neutral) template is assigned — so templates stay reusable across clients.
// Filenames/ids keep the legacy "tenant" wording; the user-facing name is "Clients".
const TENANTS = [
  {id:'taylor',   name:'Taylor Builders',        industry:'Construction',   initials:'TB', templates:4, plan:'Pro',     planCredits:62,  topup:0,   renews:'10 Aug 2026', brand:{primary:'#1F5C3D', secondary:'#C9A227', background:'#F4F7F5', font:'Poppins', bodyFont:'Outfit'}},
  {id:'cpm-civil',name:'CPM Civil',              industry:'Civil',          initials:'CC', templates:3, plan:'Growth',  planCredits:45,  topup:0,   renews:'2 Sep 2026',  brand:{primary:'#123B66', secondary:'#E8622C', background:'#F2F5F9', font:'Inter',   bodyFont:'Inter'}},
  {id:'cpm-infra',name:'CPM Infrastructure',     industry:'Infrastructure', initials:'CI', templates:3, plan:'Growth',  planCredits:80,  topup:26,  renews:'2 Sep 2026',  brand:{primary:'#0B4F4A', secondary:'#7BC043', background:'#F1F6F5', font:'Inter',   bodyFont:'Inter'}},
  {id:'velocity', name:'Velocity Engineering',   industry:'Engineering',    initials:'VE', templates:2, plan:'Lite',    planCredits:100, topup:0,   renews:'18 Aug 2026', brand:{primary:'#2B2D42', secondary:'#EF233C', background:'#F5F5F7', font:'Outfit',  bodyFont:'Outfit'}},
  {id:'hansen',   name:'Hansen Projects',        industry:'Construction',   initials:'HP', templates:2, plan:'Starter', planCredits:34,  topup:0,   renews:'5 Jul 2026',  brand:{primary:'#3A2E39', secondary:'#D4A15A', background:'#F7F4F2', font:'Lora',    bodyFont:'Outfit'}},
  {id:'acme',     name:'Acme Constructions',     industry:'Construction',   initials:'AC', templates:1, plan:'Starter', planCredits:12,  topup:0,   renews:'21 Jul 2026', brand:{primary:'#8A1C1C', secondary:'#F2C14E', background:'#FAF4F2', font:'Roboto',  bodyFont:'Roboto'}},
  {id:'northolt', name:'Northolt Construction',  industry:'Trades',         initials:'NC', templates:0, plan:'Lite',    planCredits:100, topup:0,   renews:'1 Sep 2026',  brand:{primary:'#38988A', secondary:'#FFBC4A', background:'#F2F8F6', font:'Outfit',  bodyFont:'Outfit'}},
  {id:'civic',    name:'Civic HVAC',             industry:'HVAC',           initials:'CH', templates:1, plan:'Growth',  planCredits:96,  topup:99,  renews:'14 Aug 2026', brand:{primary:'#155E75', secondary:'#F59E0B', background:'#F1F6F8', font:'Inter',   bodyFont:'Outfit'}},
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
if(typeof window!=='undefined'){ window.TENANTS = TENANTS; window.PLANS = PLANS; window.BRAND_TOKENS = BRAND_TOKENS; }
