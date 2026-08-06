// Tender Template Builder — organise a Document List into the sectioned tender
// structure a client sees in Tenderfy (Cover Pages → Table of Contents →
// Tender Documentations → Resumes → …). Preview against a client brand; save,
// send to QA, save as a Preset, or assign to clients (brand applied on assign).
function pageInit(){
  const byId = Object.fromEntries(COMPONENTS.map(c=>[c.id,c]));
  const tById = Object.fromEntries(TENANTS.map(t=>[t.id,t]));

  // Tender section order + how document categories map into sections.
  const SECTIONS = ['Cover Pages','Table of Contents','Tender Documentations','Resumes','Case Studies','Policies','Insurances','Certifications','Organisation Chart'];
  const CAT2SEC = {'Cover Pages':'Cover Pages','Table of Contents':'Table of Contents','Others':'Tender Documentations','Resumes':'Resumes','Case Studies':'Case Studies','Policies':'Policies','Insurances':'Insurances','Certifications':'Certifications','Organisation Chart':'Organisation Chart'};
  const ADDLBL = {'Cover Pages':'Add Cover','Table of Contents':'Add Table of Contents','Tender Documentations':'Add Tender Document','Resumes':'Add Resume','Case Studies':'Add Case Study','Policies':'Add Policy','Insurances':'Add Insurance','Certifications':'Add Certification','Organisation Chart':'Add Organisation Chart'};
  const secOf = (id)=> CAT2SEC[byId[id].category] || 'Tender Documentations';

  const editing = new URLSearchParams(location.search || location.hash.slice(1)).get('id');
  const sections = {}; SECTIONS.forEach(s=>sections[s]=[]);
  if(editing){
    Object.assign(sections, {
      'Cover Pages':['cover'], 'Table of Contents':['toc'],
      'Tender Documentations':['exec-summary','methodology','rate-table'],
      'Resumes':['cv-standard'], 'Case Studies':['proj-profile','case-study'],
      'Policies':['policy-whs','policy-quality'], 'Insurances':['insurance'], 'Certifications':['licences'],
    });
    document.getElementById('tpl-name').value='Construction — Standard Tender';
    const _cr=document.getElementById('cr-name'); if(_cr)_cr.textContent='Construction — Standard Tender';
    document.getElementById('tpl-desc').value='General head-contractor response';
  }
  let brandTenant=''; const assigned=new Set();
  const total = ()=>SECTIONS.reduce((n,s)=>n+sections[s].length,0);

  document.getElementById('tpl-name').addEventListener('input', e=>{ const cr=document.getElementById('cr-name'); if(cr) cr.textContent = e.target.value || 'Untitled Tender Template'; });

  // ---- Palette: available documents grouped by type ----
  const palette=document.getElementById('palette'); let pq='';
  function renderPalette(){
    const avail=COMPONENTS.filter(c=>c.status!=='deprecated' && (!pq || (c.name+' '+c.category).toLowerCase().includes(pq)));
    const cats=[...new Set(avail.map(c=>c.category))];
    palette.innerHTML = cats.map(cat=>`<div class="tb-cat">${cat}</div>${avail.filter(c=>c.category===cat).map(c=>`
      <div class="tb-comp" draggable="true" data-id="${c.id}"><span class="ci"><span class="ms">${c.icon}</span></span><span class="cn">${c.name}</span><span class="ms cadd">add_circle</span></div>`).join('')}`).join('');
    document.getElementById('pal-count').textContent=`(${avail.length})`;
    palette.querySelectorAll('.tb-comp').forEach(el=>{
      el.addEventListener('click', ()=>addDoc(el.dataset.id));
      el.addEventListener('dragstart', e=>{ e.dataTransfer.setData('add', el.dataset.id); el.classList.add('dragging'); });
      el.addEventListener('dragend', ()=>el.classList.remove('dragging'));
    });
  }
  document.getElementById('pq').addEventListener('input', e=>{pq=e.target.value.toLowerCase().trim();renderPalette();});

  // ---- Collapse the palette (left) / properties (right) columns ----
  (function(){
    const wrap=document.querySelector('.tb-wrap');
    const pal=document.getElementById('palToggle'), prop=document.getElementById('propToggle');
    pal.addEventListener('click',()=>{ const off=wrap.classList.toggle('l-off'); pal.classList.toggle('on',!off); });
    prop.addEventListener('click',()=>{ const off=wrap.classList.toggle('r-off'); prop.classList.toggle('on',!off); });
  })();

  // ---- Canvas: the sectioned tender structure ----
  const canvas=document.getElementById('canvas');
  function renderCanvas(){
    canvas.innerHTML = SECTIONS.map(sec=>`
      <div class="ts-sec" data-sec="${sec}">
        <div class="ts-head"><span class="ts-title">${sec}</span></div>
        ${sections[sec].map((id,i)=>{const c=byId[id];return `
          <div class="ts-entry" draggable="true" data-sec="${sec}" data-i="${i}">
            <span class="ms grip">drag_indicator</span>
            <span class="ei"><span class="ms">${c.icon}</span></span>
            <span class="en">${c.name}</span><span class="etag">v${c.version}</span>
            <span class="ms ekebab" data-rm="${sec}|${i}" title="Remove from tender">more_vert</span>
          </div>`;}).join('') || '<div class="ts-empty">No documents yet</div>'}
        <div class="ts-add" data-add="${sec}"><span class="ms">add</span> ${ADDLBL[sec]}</div>
      </div>`).join('');
    document.getElementById('p-count').textContent=total();
    const tc=document.getElementById('tb-count'); if(tc) tc.textContent=total();

    canvas.querySelectorAll('[data-rm]').forEach(k=>k.addEventListener('click',()=>{
      const [sec,i]=k.dataset.rm.split('|'); const [r]=sections[sec].splice(+i,1); renderCanvas(); renderPalette(); showToast('Removed: '+byId[r].name);
    }));
    canvas.querySelectorAll('[data-add]').forEach(a=>a.addEventListener('click',()=>addNext(a.dataset.add)));

    // reorder within a section
    canvas.querySelectorAll('.ts-entry').forEach(en=>{
      en.addEventListener('dragstart', e=>{ e.dataTransfer.setData('move', en.dataset.sec+'|'+en.dataset.i); en.classList.add('dragging'); });
      en.addEventListener('dragend', ()=>en.classList.remove('dragging'));
      en.addEventListener('dragover', e=>e.preventDefault());
      en.addEventListener('drop', e=>{
        e.preventDefault(); e.stopPropagation();
        const mv=e.dataTransfer.getData('move'); if(!mv) return;
        const [fsec,fi]=mv.split('|'); if(fsec!==en.dataset.sec) return;  // reorder within a section
        const arr=sections[fsec]; const [m]=arr.splice(+fi,1); arr.splice(+en.dataset.i,0,m); renderCanvas(); renderPalette();
      });
    });
    // drop a palette document onto a section
    canvas.querySelectorAll('.ts-sec').forEach(s=>{
      s.addEventListener('dragover', e=>{ if(e.dataTransfer.types.includes('add')){ e.preventDefault(); s.classList.add('ts-over'); } });
      s.addEventListener('dragleave', ()=>s.classList.remove('ts-over'));
      s.addEventListener('drop', e=>{ s.classList.remove('ts-over'); const add=e.dataTransfer.getData('add'); if(add){ e.preventDefault(); addDoc(add); } });
    });
  }
  function addDoc(id){ const sec=secOf(id); if(sections[sec].includes(id)){ showToast(byId[id].name+' is already in the tender'); return; } sections[sec].push(id); renderCanvas(); renderPalette(); showToast('Added to '+sec+': '+byId[id].name); }
  function addNext(sec){
    const cand=COMPONENTS.find(c=>c.status!=='deprecated' && secOf(c.id)===sec && !sections[sec].includes(c.id));
    if(!cand){ showToast('All '+sec+' documents are already added'); return; }
    sections[sec].push(cand.id); renderCanvas(); renderPalette(); showToast('Added to '+sec+': '+cand.name);
  }

  // ---- Brand preview ----
  const brandsel=document.getElementById('brandsel');
  brandsel.innerHTML='<option value="">Brand-neutral (structure)</option>'+TENANTS.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  brandsel.addEventListener('change', ()=>{ brandTenant=brandsel.value; applyBrand(); });
  function renderBrandSummary(t){
    const el=document.getElementById('tokenMap');
    if(!t){ el.innerHTML='<div class="muted" style="font-size:12px">Pick a client above to preview its brand.</div>'; return; }
    const b=t.brand;
    el.innerHTML=`<div class="bk-swatches" style="margin:2px 0 8px">
        <span class="bk-sw" style="background:${b.primary}" title="Primary"></span>
        <span class="bk-sw" style="background:${b.secondary}" title="Secondary"></span>
        <span class="bk-sw" style="background:${b.background}" title="Background"></span>
      </div>
      <div class="muted" style="font-size:12px">${b.font} / ${b.bodyFont} · headings, accents, background &amp; logo.</div>`;
  }
  function applyBrand(){
    const bar=document.getElementById('brandbar');
    if(!brandTenant){
      bar.style.background='var(--teal)';
      document.getElementById('bb-logo').textContent='TF';
      document.getElementById('bb-name').textContent='Brand-neutral structure';
      document.getElementById('bb-sub').textContent='Pick a client to preview its brand & typography';
      renderBrandSummary(null);
      return;
    }
    const t=tById[brandTenant], b=t.brand;
    bar.style.background=b.primary;
    document.getElementById('bb-logo').textContent=t.initials;
    document.getElementById('bb-name').textContent=t.name;
    document.getElementById('bb-sub').textContent=`Brand kit · ${b.font} / ${b.bodyFont}`;
    renderBrandSummary(t);
  }

  // ---- Preview modal (sectioned, branded) ----
  document.getElementById('previewBtn').addEventListener('click', ()=>{
    if(!total()){ showToast('Add documents to preview'); return; }
    const t = brandTenant ? tById[brandTenant] : null;
    const bname = t ? t.name : 'Brand-neutral';
    const docs = SECTIONS.reduce((a,s)=>a.concat(sections[s]), []);
    document.getElementById('pm-title').textContent = document.getElementById('tpl-name').value;
    document.getElementById('pm-brand').textContent = bname;
    renderTemplatePreview(document.getElementById('pm-paper'), {
      name: document.getElementById('tpl-name').value,
      docs, brand: t ? t.brand : null, category: 'Draft preview'
    });
    document.getElementById('previewModal').classList.add('open');
  });
  document.querySelectorAll('[data-close-preview]').forEach(x=>x.addEventListener('click',()=>document.getElementById('previewModal').classList.remove('open')));
  document.getElementById('previewModal').addEventListener('click',e=>{if(e.target.id==='previewModal')e.target.classList.remove('open');});

  // ---- Save / review / preset / assign ----
  document.getElementById('saveBtn').addEventListener('click', ()=>{ if(!total()){showToast('Nothing to save yet');return;} showToast('Saved as v'+(editing?4:1)+' · Draft'); });
  document.getElementById('reviewBtn').addEventListener('click', ()=>{
    if(!total()){showToast('Add documents before submitting');return;}
    const s=document.getElementById('tpl-status'); s.className='badge b-inreview'; s.innerHTML='<span class="b-dot"></span>In review';
    showToast('Submitted to QA review queue');
  });
  document.getElementById('presetBtn').addEventListener('click', ()=>{
    if(!total()){showToast('Add documents before saving a preset');return;}
    showToast('Saved as a reusable tender preset — available to assign to any client');
  });

  const aList=document.getElementById('assignList');
  function renderAssign(){
    aList.innerHTML=TENANTS.map(t=>`
      <div class="assign-row ${assigned.has(t.id)?'sel':''}" data-t="${t.id}">
        <span class="ta">${t.initials}</span>
        <div class="tn"><div class="nm">${t.name}</div><div class="ds">${t.industry} · brand: <span class="brand-swatch" style="background:${t.brand.primary}"></span> <span class="brand-swatch" style="background:${t.brand.secondary}"></span> ${t.brand.font}</div></div>
        <span class="chk"><span class="ms">check</span></span>
      </div>`).join('');
    aList.querySelectorAll('.assign-row').forEach(r=>r.addEventListener('click',()=>{ const id=r.dataset.t; assigned.has(id)?assigned.delete(id):assigned.add(id); renderAssign(); updateN(); }));
  }
  function updateN(){ document.getElementById('assignN').textContent = assigned.size?`(${assigned.size})`:''; }
  document.getElementById('assignBtn').addEventListener('click', ()=>{ renderAssign(); updateN(); document.getElementById('assignModal').classList.add('open'); });
  document.querySelectorAll('[data-close-assign]').forEach(x=>x.addEventListener('click',()=>document.getElementById('assignModal').classList.remove('open')));
  document.getElementById('assignModal').addEventListener('click',e=>{if(e.target.id==='assignModal')e.target.classList.remove('open');});
  document.getElementById('assignConfirm').addEventListener('click', ()=>{
    if(!assigned.size){showToast('Select at least one client');return;}
    showToast(`Assigned to ${assigned.size} client${assigned.size>1?'s':''} — sent to QA to confirm as finalised before going live`);
    document.getElementById('assignModal').classList.remove('open');
  });

  renderPalette(); renderCanvas(); applyBrand();

  // ---- Draft with Ray: suggest a tender pack inline; the user adds what they want ----
  const inTender = id => SECTIONS.some(sec=>sections[sec].includes(id));
  function raySuggest(desc){
    const s=(desc||'').toLowerCase();
    let ids, name;
    if(/civil|infrastructure|road|drainage/.test(s)){ ids=['cover','toc','exec-summary','methodology','rate-table','env-row','proj-profile','case-study','compliance-tbl','policy-whs','policy-env','insurance','licences']; name='Civil Infrastructure Response'; }
    else if(/capability|eoi|expression|prequal/.test(s)){ ids=['cover','toc','exec-summary','cv-standard','cv-exec','proj-profile','licences','insurance']; name='Engineering Capability Statement'; }
    else if(/facilit|maintenance|hvac/.test(s)){ ids=['cover','toc','exec-summary','methodology','rate-table','program','policy-whs','risk-block','insurance','licences']; name='Facilities Maintenance Tender'; }
    else if(/government|panel|supplier/.test(s)){ ids=['cover','toc','exec-summary','compliance-tbl','methodology','cv-standard','policy-whs','policy-quality','policy-env','insurance','licences','referees']; name='Government Supplier Panel'; }
    else { ids=['cover','toc','exec-summary','methodology','rate-table','cv-standard','proj-profile','case-study','policy-whs','policy-quality','insurance','licences']; name='Construction — Standard Tender'; }
    return {ids:ids.filter(id=>byId[id]), name};
  }
  function renderSuggestions(ids){
    const wrap=document.getElementById('raySuggestions');
    wrap.innerHTML = `<div class="ray-sugg"><div class="ray-sugg-head"><span>Suggested pack · ${ids.length} documents</span> <a data-addall>Add all</a></div>${ids.map(id=>{const c=byId[id];const on=inTender(id);return `<div class="ray-sugg-row ${on?'in':''}" data-id="${id}"><span class="ci"><span class="ms">${c.icon}</span></span><span class="nm">${c.name}</span><button class="add" title="${on?'Added':'Add'}"><span class="ms" style="font-size:15px">${on?'check':'add'}</span></button></div>`;}).join('')}</div>`;
    wrap.querySelectorAll('.ray-sugg-row .add').forEach(b=>b.addEventListener('click',()=>{ const id=b.closest('.ray-sugg-row').dataset.id; if(!inTender(id)){ addDoc(id); renderSuggestions(ids); } }));
    wrap.querySelector('[data-addall]').addEventListener('click',()=>{
      const toAdd=ids.filter(id=>!inTender(id)); if(!toAdd.length){ showToast('All suggestions already added'); return; }
      toAdd.forEach(id=>{ const sec=secOf(id); if(!sections[sec].includes(id)) sections[sec].push(id); });
      renderCanvas(); renderPalette(); renderSuggestions(ids); showToast('Added '+toAdd.length+' documents to the tender');
    });
  }
  document.getElementById('raySuggestBtn').addEventListener('click',()=>{
    const p=document.getElementById('rayPrompt').value.trim();
    if(!p){ showToast('Describe the tender so Ray can suggest a pack'); return; }
    const res=raySuggest(p);
    const nmeEl=document.getElementById('tpl-name');
    if(!nmeEl.value.trim() || nmeEl.value==='Untitled Tender Template'){ nmeEl.value=res.name; const cr=document.getElementById('cr-name'); if(cr) cr.textContent=res.name; }
    renderSuggestions(res.ids);
    showToast('Ray suggested a '+res.ids.length+'-document pack — add what you need');
  });
}
