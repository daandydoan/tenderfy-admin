// Tenderfy Admin Portal — prototype interactions.
// Extracted from the subbie-portal prototype; elements and interactions
// referenced from the live staging site (stgsuperadmin.tenderfy.org).

// Placeholder-action toast: actions/buttons with no real destination show a
// toast instead of navigating. Trigger via data-toast="Description", or any a[href="#"].
let __toastTimer;
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
document.addEventListener('click', (e)=>{
  const el = e.target.closest && e.target.closest('[data-toast], a[href="#"]');
  if(!el) return;
  e.preventDefault();
  const desc = el.getAttribute('data-toast') || el.textContent.trim().replace(/\s+/g,' ');
  showToast('Placeholder Action: ' + desc);
});

// ---- Sidebar: labels revealed on hover (generated from each item's title) ----
function mountSidebarLabels(){
  document.querySelectorAll('.c-side .cic[title]').forEach(a=>{
    const s = document.createElement('span');
    s.className = 'clbl';
    s.textContent = a.getAttribute('title');
    a.appendChild(s);
  });
}

// ---- Header: notification bell w/ badge + panel, user menu, calendar drawer ----
const SIGNUPS = ['1996','AI review','R and P','new Tester 1996','Atdrive','Custom sign1'];
function mountAdminHeader(){
  const r = document.querySelector('.c-header .r');
  if(!r) return;

  // Notification bell: replace the placeholder icon with a badge + panel
  const bell = r.querySelector('[data-toast="Notifications"]');
  if(bell){
    const wrap = document.createElement('span');
    wrap.className = 'hbtn';
    wrap.innerHTML = `<span class="ms fill" style="cursor:pointer">notifications</span><span class="hbadge">26</span>
      <div class="npanel"><div class="nitems">${SIGNUPS.map(n=>`
        <div class="nitem"><span class="nic" style="background:var(--teal-tint);color:var(--teal)"><span class="ms">notifications_active</span></span>
        <div class="ntx"><div class="t">${n} has completed sign up</div><span class="nvd" data-company="${n}">View Details</span></div></div>`).join('')}
      </div></div>`;
    bell.replaceWith(wrap);
    wrap.querySelector('.ms').addEventListener('click', ()=>{ closePopovers(wrap); wrap.querySelector('.npanel').classList.toggle('open'); });
    wrap.querySelectorAll('.nvd').forEach(v=>v.addEventListener('click', ()=>showToast('Placeholder Action: View details — ' + v.dataset.company)));
  }

  // Calendar icon → right drawer (today panel, as on the live dashboard)
  const grp = r.querySelector('.grp');
  const cal = document.createElement('span');
  cal.className = 'ms fill';
  cal.style.cursor = 'pointer';
  cal.textContent = 'calendar_month';
  r.insertBefore(cal, grp);
  cal.addEventListener('click', ()=>{ closePopovers(); toggleDrawer(true); });

  // User chip → My Profile / Logout menu
  if(grp){
    const menu = document.createElement('div');
    menu.className = 'umenu';
    menu.innerHTML = `<a data-toast="My profile"><span class="ms">person</span> My Profile</a>
      <a data-toast="Logout"><span class="ms">logout</span> Logout</a>`;
    grp.appendChild(menu);
    grp.addEventListener('click', (e)=>{
      if(e.target.closest('.umenu')) return;
      closePopovers(grp); menu.classList.toggle('open');
    });
  }
}

function closePopovers(except){
  document.querySelectorAll('.c-header .npanel.open, .umenu.open, .fy-dd.open').forEach(p=>{
    if(!except || !except.contains(p)) p.classList.remove('open');
  });
}
document.addEventListener('click', (e)=>{
  if(e.target.closest('.hbtn, .grp, .sa-fy')) return;
  closePopovers();
}, true);
document.addEventListener('keydown', (e)=>{
  if(e.key !== 'Escape') return;
  closePopovers();
  toggleDrawer(false);
  const m = document.getElementById('regmodal');
  if(m) m.classList.remove('open');
});

// ---- Right drawer ----
function mountDrawer(){
  const dim = document.createElement('div');
  dim.className = 'drawer-dim';
  const d = document.createElement('div');
  d.className = 'drawer';
  d.innerHTML = `
    <span class="dx ms">close</span>
    <div class="dtoday"><div class="dw">Today &middot; Tuesday</div><div class="dd">Jul 14, 2026</div></div>
    <div class="dsec">Upcoming events</div>
    <div class="ditem" data-toast="Open event"><div class="t">Subbie feedback round 2 — Wade</div><div class="m">In 45 minutes, Google Meet</div></div>
    <div class="ditem" data-toast="Open event"><div class="t">Placeholder engine design review</div><div class="m">2:00 PM</div></div>
    <div class="ditem" data-toast="Open event"><div class="t">Template SOP handoff — Ashish</div><div class="m">4:30 PM</div></div>
    <div class="dsec">To-do list</div>
    <div class="ditem" data-toast="Open task"><div class="t">Send meeting notes to AJ and Tom</div><div class="m">Added: 6 hours ago</div></div>
    <div class="ditem" data-toast="Open task"><div class="t">Review quote comparison mockups</div><div class="m">Added: 2 days ago</div></div>
    <div class="ditem" data-toast="Open task"><div class="t">Draft analytics integration proposal</div><div class="m">Added: 5 days ago</div></div>
    <div class="dsec">Server statistics</div>
    <div class="dstat"><div class="l"><span>CPU Load</span><span>71% / 100%</span></div><div class="dbar warn"><i style="width:71%"></i></div></div>
    <div class="dstat"><div class="l"><span>RAM Usage</span><span>6,175 MB / 16,384 MB</span></div><div class="dbar"><i style="width:38%"></i></div></div>
    <div class="dstat"><div class="l"><span>CPU Temp</span><span>43&deg; / 80&deg;</span></div><div class="dbar"><i style="width:54%"></i></div></div>`;
  document.body.appendChild(dim);
  document.body.appendChild(d);
  dim.addEventListener('click', ()=>toggleDrawer(false));
  d.querySelector('.dx').addEventListener('click', ()=>toggleDrawer(false));
}
function toggleDrawer(open){
  document.querySelectorAll('.drawer, .drawer-dim').forEach(el=>el.classList.toggle('open', open));
}

// ---- Revenue chart: smooth line, hover tooltips, FY switching ----
const FY_DATA = {
  'FY 2025-2026': { start: 2025, values: [0,0,450,1200,2400,1800,3100,2600,4200,3800,5100,6900] },
  'FY 2026-2027': { start: 2026, values: [9565,120,0,0,0,0,0,0,0,0,0,0] },
};
const MONTHS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];

function renderRevenueChart(fy){
  const host = document.getElementById('revchart');
  if(!host) return;
  const {start, values} = FY_DATA[fy];
  const max = 10000, x0 = 40, x1 = 850, yTop = 20, yBase = 270;
  const xs = MONTHS.map((_,i)=>107 + i*67);
  const ys = values.map(v=>yBase - (v/max)*(yBase-yTop));

  // Catmull-Rom → cubic bezier, clamped to the plot area
  const cl = y=>Math.max(yTop, Math.min(yBase, y));
  let line = `M${xs[0]},${ys[0]}`;
  for(let i=0;i<xs.length-1;i++){
    const p0 = i>0 ? {x:xs[i-1],y:ys[i-1]} : {x:xs[0],y:ys[0]};
    const p1 = {x:xs[i],y:ys[i]}, p2 = {x:xs[i+1],y:ys[i+1]};
    const p3 = i<xs.length-2 ? {x:xs[i+2],y:ys[i+2]} : p2;
    const c1 = {x:p1.x+(p2.x-p0.x)/6, y:cl(p1.y+(p2.y-p0.y)/6)};
    const c2 = {x:p2.x-(p3.x-p1.x)/6, y:cl(p2.y-(p3.y-p1.y)/6)};
    line += ` C${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  const grid = [0,1,2,3,4,5].map(i=>`<line x1="${x0}" y1="${yTop+i*50}" x2="${x1}" y2="${yTop+i*50}"/>`).join('');
  const yLbl = [0,1,2,3,4,5,6,7,8,9,10].map(k=>`<text x="${x0-8}" y="${yBase-(k/10)*(yBase-yTop)+3}" text-anchor="end">${k?k+'K':'0'}</text>`).join('');
  const xLbl = MONTHS.map((m,i)=>`<text x="${xs[i]}" y="292" text-anchor="middle">${m}</text>`).join('');
  const dots = xs.map((x,i)=>`<circle class="dot-hit" data-i="${i}" cx="${x}" cy="${ys[i]}" r="4.5" fill="#38988A"/>`).join('');

  host.innerHTML = `
    <svg viewBox="0 0 860 320" width="100%" preserveAspectRatio="none" style="display:block">
      <g stroke="#EEF1F0" stroke-width="1">${grid}</g>
      <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38988A" stop-opacity=".28"/><stop offset="1" stop-color="#38988A" stop-opacity="0"/></linearGradient></defs>
      <path d="${line} L${xs[11]},${yBase} L${xs[0]},${yBase} Z" fill="url(#rev)" stroke="none"/>
      <path d="${line}" fill="none" stroke="#38988A" stroke-width="2.5"/>
      <g font-size="11" fill="#9AA4A2" font-family="Outfit">${yLbl}${xLbl}
        <text x="${xs[0]}" y="312" text-anchor="middle">${start}</text>
        <text x="${xs[6]}" y="312" text-anchor="middle">${start+1}</text>
      </g>
      ${dots}
    </svg>
    <div class="ctip"></div>`;

  const tip = host.querySelector('.ctip');
  const svg = host.querySelector('svg');
  host.querySelectorAll('.dot-hit').forEach(c=>{
    c.addEventListener('mouseenter', ()=>{
      const i = +c.dataset.i;
      const r = host.getBoundingClientRect();
      tip.textContent = '$ ' + values[i].toLocaleString();
      tip.style.left = (xs[i]/860*r.width) + 'px';
      tip.style.top = (ys[i]/320*svg.getBoundingClientRect().height) + 'px';
      tip.classList.add('show');
    });
    c.addEventListener('mouseleave', ()=>tip.classList.remove('show'));
  });
}

function mountFyFilter(){
  const btn = document.getElementById('fybtn');
  if(!btn) return;
  let current = 'FY 2026-2027';
  const dd = document.createElement('div');
  dd.className = 'fy-dd';
  const rebuild = ()=>{ dd.innerHTML = Object.keys(FY_DATA).map(k=>`<a class="${k===current?'on':''}" data-fy="${k}">${k}</a>`).join(''); };
  rebuild();
  btn.appendChild(dd);
  btn.addEventListener('click', (e)=>{
    const opt = e.target.closest('[data-fy]');
    if(opt){
      current = opt.dataset.fy;
      document.getElementById('fylabel').textContent = current;
      renderRevenueChart(current);
      rebuild();
      dd.classList.remove('open');
      return;
    }
    closePopovers(btn);
    dd.classList.toggle('open');
  });
}

// ---- Register New Company modal ----
function mountRegisterModal(){
  const open = document.getElementById('regopen');
  const modal = document.getElementById('regmodal');
  if(!open || !modal) return;
  open.addEventListener('click', ()=>modal.classList.add('open'));
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open'); });
  modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>modal.classList.remove('open')));
  modal.querySelectorAll('.seg div').forEach(s=>s.addEventListener('click', ()=>{
    s.parentElement.querySelectorAll('div').forEach(o=>o.classList.remove('on'));
    s.classList.add('on');
  }));
  const submit = modal.querySelector('#regsubmit');
  submit.addEventListener('click', ()=>{
    const name = modal.querySelector('#regcompany').value.trim();
    showToast('Company registered' + (name ? ': ' + name : '') + ' — prototype only');
    modal.classList.remove('open');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  mountSidebarLabels();
  mountAdminHeader();
  mountDrawer();
  renderRevenueChart('FY 2026-2027');
  mountFyFilter();
  mountRegisterModal();
});

// Scrollbars are hidden everywhere and stay hidden — they do NOT appear on hover
// or while scrolling. They show ONLY on explicit request: set this flag to true
// (or call toggleScrollbars() at runtime) to reveal them.
const SHOW_SCROLLBARS = false;
if(SHOW_SCROLLBARS) document.documentElement.classList.add('show-scrollbars');
window.toggleScrollbars = (on)=>document.documentElement.classList.toggle('show-scrollbars', on);
