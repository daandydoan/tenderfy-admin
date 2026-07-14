// Dashboard page — revenue chart (hover tooltips + FY filter) and Register modal.
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
  const tip = host.querySelector('.ctip'), svg = host.querySelector('svg');
  host.querySelectorAll('.dot-hit').forEach(c=>{
    c.addEventListener('mouseenter', ()=>{
      const i = +c.dataset.i, r = host.getBoundingClientRect();
      tip.textContent = '$ ' + values[i].toLocaleString();
      tip.style.left = (xs[i]/860*r.width) + 'px';
      tip.style.top = (ys[i]/320*svg.getBoundingClientRect().height) + 'px';
      tip.classList.add('show');
    });
    c.addEventListener('mouseleave', ()=>tip.classList.remove('show'));
  });
}

function pageInit(){
  renderRevenueChart('FY 2026-2027');

  // FY filter dropdown
  const btn = document.getElementById('fybtn');
  if(btn){
    let current = 'FY 2026-2027';
    const dd = document.createElement('div'); dd.className='fy-dd';
    const rebuild = ()=>{ dd.innerHTML = Object.keys(FY_DATA).map(k=>`<a class="${k===current?'on':''}" data-fy="${k}">${k}</a>`).join(''); };
    rebuild(); btn.appendChild(dd);
    btn.addEventListener('click', (e)=>{
      const opt = e.target.closest('[data-fy]');
      if(opt){ current=opt.dataset.fy; document.getElementById('fylabel').textContent=current; renderRevenueChart(current); rebuild(); dd.classList.remove('open'); return; }
      dd.classList.toggle('open');
    });
  }

  // Register New Company modal
  const open = document.getElementById('regopen'), modal = document.getElementById('regmodal');
  if(open && modal){
    open.addEventListener('click', ()=>modal.classList.add('open'));
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('open'); });
    modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=>modal.classList.remove('open')));
    modal.querySelectorAll('.seg div').forEach(s=>s.addEventListener('click', ()=>{ s.parentElement.querySelectorAll('div').forEach(o=>o.classList.remove('on')); s.classList.add('on'); }));
    modal.querySelector('#regsubmit').addEventListener('click', ()=>{
      const name = modal.querySelector('#regcompany').value.trim();
      showToast('Company registered' + (name ? ': ' + name : '') + ' — prototype only');
      modal.classList.remove('open');
    });
  }
}
