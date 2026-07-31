// Tenderfy Super Admin — shared shell (chrome for every page).
// Renders the reorganised IA (Dashboard / Library / Templates / Clients / Subcontractors / QA / Settings)
// plus the header (search, notifications, calendar drawer, user menu) around each page's
// content. A page supplies only its inner content in #app-content plus data-page / data-title.

// ---- Global toast (used by every page for placeholder / confirmation actions) ----
let __toastTimer;
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
window.showToast = showToast;

// Reusable confirm dialog — used by every CRUD page before a destructive action.
window.confirmAction = function(opts, onConfirm){
  const o = Object.assign({title:'Are you sure?', body:'', confirm:'Confirm', danger:false}, opts);
  let m = document.getElementById('confirmModal');
  if(!m){ m = document.createElement('div'); m.id='confirmModal'; m.className='modal-overlay'; document.body.appendChild(m); }
  m.innerHTML = `<div class="cfm">
    <div class="cfm-ic ${o.danger?'danger':''}"><span class="ms">${o.danger?'delete':'help'}</span></div>
    <h3>${o.title}</h3>
    <p>${o.body}</p>
    <div class="cfm-acts">
      <a class="btn btn-outline" data-cfm-cancel>Cancel</a>
      <a class="btn ${o.danger?'btn-danger':'btn-primary'}" data-cfm-ok>${o.confirm}</a>
    </div></div>`;
  m.classList.add('open');
  m.querySelector('[data-cfm-cancel]').onclick = ()=>m.classList.remove('open');
  m.onclick = (e)=>{ if(e.target===m) m.classList.remove('open'); };
  m.querySelector('[data-cfm-ok]').onclick = ()=>{ m.classList.remove('open'); if(onConfirm) onConfirm(); };
};

const NAV = [
  {key:'dashboard', icon:'desktop_mac',    label:'Dashboard', href:'index.html'},
  {group:'content', icon:'layers',         label:'Content', children:[
    {key:'blocks',    icon:'grid_view',      label:'Blocks',    href:'blocks.html'},
    {key:'library',   icon:'description',    label:'Documents', href:'library.html'},
    {key:'templates', icon:'space_dashboard',label:'Tender Templates', href:'templates.html'},
  ]},
  {key:'tenants',   icon:'apartment',      label:'Clients',   href:'tenants.html'},
  {key:'subcontractors', icon:'groups',   label:'Subcontractors', href:'subcontractors.html'},
  {key:'subscriptions', icon:'credit_card', label:'Subscriptions', href:'subscriptions.html'},
  {key:'qa',        icon:'fact_check',     label:'QA',        href:'qa.html'},
  {key:'settings',  icon:'settings',       label:'Settings',  href:'settings.html'},
];

const SIGNUPS = ['1996','AI review','R and P','new Tester 1996','Atdrive','Custom sign1'];

function buildShell(){
  const page = document.body.dataset.page || '';
  const title = document.body.dataset.title || '';
  const src = document.getElementById('app-content');

  const item = (n)=>`<a class="cic ${n.key===page?'active':''}" href="${n.href}" title="${n.label}"><span class="ms fill">${n.icon}</span><span class="clbl">${n.label}</span></a>`;
  const nav = NAV.map(n=>{
    if(!n.children) return item(n);
    const childActive = n.children.some(c=>c.key===page);
    const kids = n.children.map(c=>`<a class="cic csub ${c.key===page?'active':''}" href="${c.href}" title="${c.label}"><span class="ms fill">${c.icon}</span><span class="clbl">${c.label}</span></a>`).join('');
    return `<div class="cgroup open">
      <a class="cic cgroup-head ${childActive?'active':''}" title="${n.label}"><span class="ms fill">${n.icon}</span><span class="clbl">${n.label}</span><span class="ms cchev">expand_more</span></a>
      <div class="c-subnav">${kids}</div>
    </div>`;
  }).join('');

  const notifs = SIGNUPS.map(n=>`
    <div class="nitem"><span class="nic" style="background:var(--teal-tint);color:var(--teal)"><span class="ms">notifications_active</span></span>
    <div class="ntx"><div class="t">${n} has completed sign up</div><span class="nvd" data-company="${n}">View Details</span></div></div>`).join('');

  // Build chrome as a real node and MOVE the page content into it — this preserves
  // sibling nodes (modals, scripts) instead of wiping the whole body.
  const capp = document.createElement('div');
  capp.className = 'capp';
  capp.innerHTML = `
    <aside class="c-side">
      <div class="clogo"><img class="logo-sym" src="logo-symbol.svg" alt="Tenderfy"><img class="logo-word" src="logo-wordmark-white.svg" alt="Tenderfy"></div>
      <nav class="c-nav">${nav}</nav>
      <a class="c-logout" data-toast="Log out"><span class="ms">logout</span><span class="clbl">Logout</span></a>
    </aside>
    <div class="c-main">
      <div class="c-header">
        <div class="l"><span class="ms fill" style="font-size:20px">home</span> <span>${title}</span></div>
        <div class="r">
          <span class="hsearch"><span class="ms">search</span><input type="text" placeholder="Search everything…"></span>
          <span class="hbtn"><span class="ms fill" style="cursor:pointer">notifications</span><span class="hbadge">26</span>
            <div class="npanel"><div class="nitems">${notifs}</div></div></span>
          <span class="ms fill" id="calbtn" style="cursor:pointer">calendar_month</span>
          <span class="grp"><span>Andrew Williams</span><span class="cava">AW</span>
            <div class="umenu"><a data-toast="My profile"><span class="ms">person</span> My Profile</a><a href="settings.html"><span class="ms">settings</span> Settings</a><a data-toast="Logout"><span class="ms">logout</span> Logout</a></div>
          </span>
        </div>
      </div>
      <div class="c-content"></div>
    </div>`;

  const contentHost = capp.querySelector('.c-content');
  if(src){ while(src.firstChild) contentHost.appendChild(src.firstChild); src.remove(); }
  document.body.insertBefore(capp, document.body.firstChild);

  wireHeader();
  buildDrawer();
  // Collapsible sidebar groups (parent header toggles its submenu)
  document.querySelectorAll('.cgroup-head').forEach(h=>{
    h.addEventListener('click', (e)=>{ e.preventDefault(); h.closest('.cgroup').classList.toggle('open'); });
  });
}

function closePopovers(except){
  document.querySelectorAll('.npanel.open, .umenu.open, .fy-dd.open, .kebab-menu.open').forEach(p=>{
    if(!except || !except.contains(p)) p.classList.remove('open');
  });
}

function wireHeader(){
  const bell = document.querySelector('.hbtn');
  if(bell){
    bell.querySelector('.ms').addEventListener('click', ()=>{ closePopovers(bell); bell.querySelector('.npanel').classList.toggle('open'); });
    bell.querySelectorAll('.nvd').forEach(v=>v.addEventListener('click', ()=>showToast('Placeholder Action: View details — ' + v.dataset.company)));
  }
  const grp = document.querySelector('.grp');
  if(grp) grp.addEventListener('click', (e)=>{ if(e.target.closest('.umenu a')) return; closePopovers(grp); grp.querySelector('.umenu').classList.toggle('open'); });
  const cal = document.getElementById('calbtn');
  if(cal) cal.addEventListener('click', ()=>{ closePopovers(); toggleDrawer(true); });
}

function buildDrawer(){
  const dim = document.createElement('div'); dim.className='drawer-dim';
  const d = document.createElement('div'); d.className='drawer';
  d.innerHTML = `
    <span class="dx ms">close</span>
    <div class="dtoday"><div class="dw">Today &middot; Tuesday</div><div class="dd">Jul 14, 2026</div></div>
    <div class="dsec">Upcoming events</div>
    <div class="ditem" data-toast="Open event"><div class="t">Subbie feedback round 2 — Wade</div><div class="m">In 45 minutes, Google Meet</div></div>
    <div class="ditem" data-toast="Open event"><div class="t">Template QA review — 3 in queue</div><div class="m">2:00 PM</div></div>
    <div class="ditem" data-toast="Open event"><div class="t">Brand kit handoff — Ashish</div><div class="m">4:30 PM</div></div>
    <div class="dsec">To-do list</div>
    <div class="ditem" data-toast="Open task"><div class="t">Approve Taylor Builders template v3</div><div class="m">Added: 6 hours ago</div></div>
    <div class="ditem" data-toast="Open task"><div class="t">Deprecate legacy CV (v1) component</div><div class="m">Added: 2 days ago</div></div>
    <div class="dsec">Server statistics</div>
    <div class="dstat"><div class="l"><span>CPU Load</span><span>71% / 100%</span></div><div class="dbar warn"><i style="width:71%"></i></div></div>
    <div class="dstat"><div class="l"><span>RAM Usage</span><span>6,175 MB / 16,384 MB</span></div><div class="dbar"><i style="width:38%"></i></div></div>
    <div class="dstat"><div class="l"><span>CPU Temp</span><span>43&deg; / 80&deg;</span></div><div class="dbar"><i style="width:54%"></i></div></div>`;
  document.body.appendChild(dim); document.body.appendChild(d);
  dim.addEventListener('click', ()=>toggleDrawer(false));
  d.querySelector('.dx').addEventListener('click', ()=>toggleDrawer(false));
}
function toggleDrawer(open){ document.querySelectorAll('.drawer, .drawer-dim').forEach(el=>el.classList.toggle('open', open)); }

// Global placeholder-action toast + outside-click / escape handling
document.addEventListener('click', (e)=>{
  const el = e.target.closest && e.target.closest('[data-toast], a[href="#"]');
  if(el){ e.preventDefault(); showToast('Placeholder Action: ' + (el.getAttribute('data-toast') || el.textContent.trim().replace(/\s+/g,' '))); }
});
document.addEventListener('click', (e)=>{ if(e.target.closest('.hbtn, .grp, .sa-fy, [data-kebab]')) return; closePopovers(); }, true);
document.addEventListener('keydown', (e)=>{
  if(e.key !== 'Escape') return;
  closePopovers(); toggleDrawer(false);
  document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));
});

document.addEventListener('DOMContentLoaded', ()=>{
  buildShell();
  if(typeof pageInit === 'function') pageInit();   // page-specific hook, runs after chrome exists
});

// Scrollbars stay hidden unless explicitly revealed.
window.toggleScrollbars = (on)=>document.documentElement.classList.toggle('show-scrollbars', on);
