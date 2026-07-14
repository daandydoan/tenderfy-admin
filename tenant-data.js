// Tenants (client companies on the platform) + their per-tenant Brand Kit.
// Design decision: brand identity is stored PER TENANT and auto-applied when a
// (brand-neutral) template is assigned — so templates stay reusable across clients.
const TENANTS = [
  {id:'taylor',   name:'Taylor Builders',        industry:'Construction',   initials:'TB', templates:4, brand:{primary:'#1F5C3D', secondary:'#C9A227', font:'Poppins'}},
  {id:'cpm-civil',name:'CPM Civil',              industry:'Civil',          initials:'CC', templates:3, brand:{primary:'#123B66', secondary:'#E8622C', font:'Inter'}},
  {id:'cpm-infra',name:'CPM Infrastructure',     industry:'Infrastructure', initials:'CI', templates:3, brand:{primary:'#0B4F4A', secondary:'#7BC043', font:'Inter'}},
  {id:'velocity', name:'Velocity Engineering',   industry:'Engineering',    initials:'VE', templates:2, brand:{primary:'#2B2D42', secondary:'#EF233C', font:'Outfit'}},
  {id:'hansen',   name:'Hansen Projects',        industry:'Construction',   initials:'HP', templates:2, brand:{primary:'#3A2E39', secondary:'#D4A15A', font:'Lora'}},
  {id:'acme',     name:'Acme Constructions',     industry:'Construction',   initials:'AC', templates:1, brand:{primary:'#8A1C1C', secondary:'#F2C14E', font:'Roboto'}},
  {id:'northolt', name:'Northolt Construction',  industry:'Trades',         initials:'NC', templates:0, brand:{primary:'#38988A', secondary:'#FFBC4A', font:'Outfit'}},
  {id:'civic',    name:'Civic HVAC',             industry:'HVAC',           initials:'CH', templates:1, brand:{primary:'#155E75', secondary:'#F59E0B', font:'Inter'}},
];
if(typeof window!=='undefined') window.TENANTS = TENANTS;
