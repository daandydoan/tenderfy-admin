// Template Builder — assemble library components, preview against a tenant brand,
// save (versioned), submit to QA, and assign to tenants.
function pageInit(){
  const byId = Object.fromEntries(COMPONENTS.map(c=>[c.id,c]));
  const tById = Object.fromEntries(TENANTS.map(t=>[t.id,t]));

  // Prefill: editing an existing template seeds a representative set; a new one starts empty.
  const editing = new URLSearchParams(location.search || location.hash.slice(1)).get('id');
  let blocks = editing ? ['cover','toc','exec-summary','proj-profile','case-study','methodology','rate-table','cv-standard','insurance'] : [];
  let brandTenant = '';
  const assigned = new Set();

  if(editing){ document.getElementById('tpl-name').value = 'Construction — Standard Tender'; document.getElementById('cr-name').textContent='Construction — Standard Tender'; document.getElementById('tpl-desc').value='General head-contractor response'; }
  document.getElementById('tpl-name').addEventListener('input', e=>document.getElementById('cr-name').textContent = e.target.value || 'Untitled Template');

  // ---- Palette (available = published + draft, excluding deprecated & anything already added) ----
  const palette = document.getElementById('palette');
  let pq='';
  function renderPalette(){
    const avail = COMPONENTS.filter(c=>c.status!=='deprecated' && (!pq || (c.name+' '+c.category).toLowerCase().includes(pq)));
    const cats=[...new Set(avail.map(c=>c.category))];
    palette.innerHTML = cats.map(cat=>`
      <div class="tb-cat">${cat}</div>
      ${avail.filter(c=>c.category===cat).map(c=>`
        <div class="tb-comp" draggable="true" data-id="${c.id}">
          <span class="ci"><span class="ms">${c.icon}</span></span>
          <span class="cn">${c.name}</span>
          <span class="ms cadd">add_circle</span>
        </div>`).join('')}`).join('');
    document.getElementById('pal-count').textContent = `(${avail.length})`;
    palette.querySelectorAll('.tb-comp').forEach(el=>{
      el.addEventListener('click', ()=>addBlock(el.dataset.id));
      el.addEventListener('dragstart', e=>{ e.dataTransfer.setData('add', el.dataset.id); el.classList.add('dragging'); });
      el.addEventListener('dragend', ()=>el.classList.remove('dragging'));
    });
  }
  document.getElementById('pq').addEventListener('input', e=>{pq=e.target.value.toLowerCase().trim();renderPalette();});

  // ---- Canvas ----
  const canvas = document.getElementById('canvas');
  const drop = document.getElementById('drop');
  function renderCanvas(){
    canvas.innerHTML = blocks.map((id,i)=>{
      const c=byId[id];
      return `<div class="tb-block" draggable="true" data-i="${i}">
        <span class="ms grip">drag_indicator</span>
        <span class="bi"><span class="ms">${c.icon}</span></span>
        <div class="bmain"><div class="bn">${c.name}</div><div class="bc">${c.category} · v${c.version}</div></div>
        <span class="ms bx" data-rm="${i}">close</span>
      </div>`;
    }).join('');
    document.getElementById('p-count').textContent = blocks.length;
    drop.style.display = blocks.length ? 'none' : 'block';
    // remove
    canvas.querySelectorAll('[data-rm]').forEach(x=>x.addEventListener('click', ()=>{ blocks.splice(+x.dataset.rm,1); renderCanvas(); renderPalette(); }));
    // reorder via drag
    canvas.querySelectorAll('.tb-block').forEach(b=>{
      b.addEventListener('dragstart', e=>{ e.dataTransfer.setData('move', b.dataset.i); b.classList.add('dragging'); });
      b.addEventListener('dragend', ()=>b.classList.remove('dragging'));
      b.addEventListener('dragover', e=>e.preventDefault());
      b.addEventListener('drop', e=>{
        e.preventDefault(); e.stopPropagation();
        const from=e.dataTransfer.getData('move'); const add=e.dataTransfer.getData('add');
        const to=+b.dataset.i;
        if(add){ blocks.splice(to,0,add); }
        else if(from!==''){ const f=+from; const [m]=blocks.splice(f,1); blocks.splice(to,0,m); }
        renderCanvas(); renderPalette();
      });
    });
  }
  function addBlock(id){ blocks.push(id); renderCanvas(); renderPalette(); showToast('Added: '+byId[id].name); }
  // drop onto empty area / drop zone
  [drop, canvas].forEach(z=>{
    z.addEventListener('dragover', e=>{ e.preventDefault(); drop.classList.add('over'); });
    z.addEventListener('dragleave', ()=>drop.classList.remove('over'));
    z.addEventListener('drop', e=>{
      e.preventDefault(); drop.classList.remove('over');
      const add=e.dataTransfer.getData('add');
      if(add && e.target===drop || (add && !e.target.closest('.tb-block'))){ blocks.push(add); renderCanvas(); renderPalette(); }
    });
  });

  // ---- Brand preview ----
  const brandsel = document.getElementById('brandsel');
  brandsel.innerHTML = '<option value="">Brand-neutral (structure)</option>' + TENANTS.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  brandsel.addEventListener('change', ()=>{ brandTenant=brandsel.value; applyBrand(); });
  function applyBrand(){
    const bar=document.getElementById('brandbar');
    if(!brandTenant){
      bar.style.background='var(--teal)';
      document.getElementById('bb-logo').textContent='TF';
      document.getElementById('bb-name').textContent='Brand-neutral preview';
      document.getElementById('bb-sub').textContent='Structure only — pick a tenant to preview its brand';
      document.getElementById('bk-logo-t').textContent='From tenant brand kit';
      document.getElementById('bk-font').textContent='Outfit';
      document.getElementById('bk-sw').innerHTML='<span class="bk-sw add"><span class="ms" style="font-size:16px">add</span></span>';
      return;
    }
    const t=tById[brandTenant], b=t.brand;
    bar.style.background=b.primary;
    document.getElementById('bb-logo').textContent=t.initials;
    document.getElementById('bb-name').textContent=t.name;
    document.getElementById('bb-sub').textContent=`Brand kit · ${b.font}`;
    document.getElementById('bk-logo-t').textContent=t.name+' logo';
    document.getElementById('bk-font').textContent=b.font;
    document.getElementById('bk-sw').innerHTML=`<span class="bk-sw" style="background:${b.primary}"></span><span class="bk-sw" style="background:${b.secondary}"></span><span class="bk-sw add"><span class="ms" style="font-size:16px">add</span></span>`;
  }

  // ---- Preview modal ----
  document.getElementById('previewBtn').addEventListener('click', ()=>{
    if(!blocks.length){ showToast('Add at least one component to preview'); return; }
    const b = brandTenant ? tById[brandTenant].brand : {primary:'#38988A', secondary:'#FFBC4A', font:'Outfit'};
    const bname = brandTenant ? tById[brandTenant].name : 'Brand-neutral';
    document.getElementById('pm-title').textContent = document.getElementById('tpl-name').value;
    document.getElementById('pm-brand').textContent = bname;
    const line=(w)=>`<div style="height:8px;border-radius:4px;background:#eef0f0;margin:7px 0;width:${w}"></div>`;
    document.getElementById('pm-paper').innerHTML = `
      <div style="background:${b.primary};color:#fff;padding:30px 34px">
        <div style="font-family:'${b.font}',sans-serif;font-size:22px;font-weight:700">${document.getElementById('tpl-name').value}</div>
        <div style="opacity:.85;font-size:12px;margin-top:4px">${bname} · Tender Response</div>
      </div>
      <div style="padding:26px 34px">${blocks.map(id=>{const c=byId[id];return `
        <div style="margin-bottom:22px">
          <div style="display:flex;align-items:center;gap:8px;font-family:'${b.font}',sans-serif;font-weight:700;color:${b.primary};font-size:14px;border-bottom:2px solid ${b.secondary};padding-bottom:5px;margin-bottom:10px">
            <span class="ms" style="font-size:17px">${c.icon}</span> ${c.name}</div>
          ${line('96%')+line('88%')+line('72%')}
        </div>`;}).join('')}</div>`;
    document.getElementById('previewModal').classList.add('open');
  });
  document.querySelectorAll('[data-close-preview]').forEach(x=>x.addEventListener('click',()=>document.getElementById('previewModal').classList.remove('open')));
  document.getElementById('previewModal').addEventListener('click',e=>{if(e.target.id==='previewModal')e.target.classList.remove('open');});

  // ---- Save / review ----
  document.getElementById('saveBtn').addEventListener('click', ()=>{ if(!blocks.length){showToast('Nothing to save yet');return;} showToast('Saved as v'+(editing?4:1)+' · Draft'); });
  document.getElementById('reviewBtn').addEventListener('click', ()=>{
    if(!blocks.length){showToast('Add components before submitting');return;}
    const s=document.getElementById('tpl-status'); s.className='badge b-inreview'; s.innerHTML='<span class="b-dot"></span>In review';
    showToast('Submitted to QA review queue');
  });

  // ---- Assign modal ----
  const aList=document.getElementById('assignList');
  function renderAssign(){
    aList.innerHTML = TENANTS.map(t=>`
      <div class="assign-row ${assigned.has(t.id)?'sel':''}" data-t="${t.id}">
        <span class="ta">${t.initials}</span>
        <div class="tn"><div class="nm">${t.name}</div><div class="ds">${t.industry} · brand: <span class="brand-swatch" style="background:${t.brand.primary}"></span> <span class="brand-swatch" style="background:${t.brand.secondary}"></span></div></div>
        <span class="chk"><span class="ms">check</span></span>
      </div>`).join('');
    aList.querySelectorAll('.assign-row').forEach(r=>r.addEventListener('click',()=>{
      const id=r.dataset.t; assigned.has(id)?assigned.delete(id):assigned.add(id); renderAssign(); updateN();
    }));
  }
  function updateN(){ document.getElementById('assignN').textContent = assigned.size?`(${assigned.size})`:''; }
  document.getElementById('assignBtn').addEventListener('click', ()=>{ renderAssign(); updateN(); document.getElementById('assignModal').classList.add('open'); });
  document.querySelectorAll('[data-close-assign]').forEach(x=>x.addEventListener('click',()=>document.getElementById('assignModal').classList.remove('open')));
  document.getElementById('assignModal').addEventListener('click',e=>{if(e.target.id==='assignModal')e.target.classList.remove('open');});
  document.getElementById('assignConfirm').addEventListener('click', ()=>{
    if(!assigned.size){showToast('Select at least one tenant');return;}
    showToast(`Assigned to ${assigned.size} tenant${assigned.size>1?'s':''} — each applies its own brand kit`);
    document.getElementById('assignModal').classList.remove('open');
  });

  renderPalette(); renderCanvas(); applyBrand();
}
