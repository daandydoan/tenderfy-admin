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
    const b= brandTenant ? tById[brandTenant].brand : {primary:'#38988A',secondary:'#FFBC4A',background:'#F7F9F8',font:'Outfit',bodyFont:'Outfit'};
    const bname= brandTenant ? tById[brandTenant].name : 'Brand-neutral';
    document.getElementById('pm-title').textContent=document.getElementById('tpl-name').value;
    document.getElementById('pm-brand').textContent=bname;
    const line=(w)=>`<div style="height:8px;border-radius:4px;background:#eef0f0;margin:7px 0;width:${w}"></div>`;
    const body = SECTIONS.filter(s=>sections[s].length).map(sec=>`
      <div style="margin-bottom:24px">
        <div style="font-family:'${b.font}',sans-serif;font-weight:700;color:${b.primary};font-size:12px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:10px">${sec}</div>
        ${sections[sec].map(id=>{const c=byId[id];return `
          <div style="margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:8px;font-family:'${b.font}',sans-serif;font-weight:700;color:${b.primary};font-size:14px;border-bottom:2px solid ${b.secondary};padding-bottom:5px;margin-bottom:9px"><span class="ms" style="font-size:16px">${c.icon}</span> ${c.name}</div>
            ${line('96%')+line('86%')+line('70%')}
          </div>`;}).join('')}
      </div>`).join('');
    document.getElementById('pm-paper').innerHTML=`
      <div style="background:${b.primary};color:#fff;padding:30px 34px"><div style="font-family:'${b.font}',sans-serif;font-size:22px;font-weight:700">${document.getElementById('tpl-name').value}</div><div style="opacity:.85;font-size:12px;margin-top:4px">${bname} · Tender Response</div></div>
      <div style="padding:26px 34px;background:${b.background};font-family:'${b.bodyFont}',sans-serif">${body}</div>`;
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

  // ---- Template details are the step BEFORE editing (+ Draft with Ray) ----
  document.getElementById('td-cat').innerHTML=(typeof TEMPLATE_CATS!=='undefined'?TEMPLATE_CATS:['Construction','Civil','Engineering','Facilities','Trades','Government']).map(c=>`<option>${c}</option>`).join('');
  const tplDialog=document.getElementById('tplDialog');
  const tbwrap=()=>document.querySelector('.tb-wrap');
  function openTplDialog(){
    const nm=document.getElementById('tpl-name').value; document.getElementById('td-name').value = nm==='Untitled Tender Template'?'':nm;
    document.getElementById('td-desc').value=document.getElementById('tpl-desc').value;
    tplDialog.classList.add('open'); document.getElementById('td-name').focus();
  }
  function closeTplDialog(){ tplDialog.classList.remove('open'); const w=tbwrap(); if(w) w.style.visibility=''; }
  const STMETA={draft:'Draft',inreview:'In review',approved:'Approved',live:'Live'};
  function applyDetails(){
    const nm=document.getElementById('td-name').value.trim();
    if(nm){ document.getElementById('tpl-name').value=nm; const cr=document.getElementById('cr-name'); if(cr) cr.textContent=nm; }
    document.getElementById('tpl-desc').value=document.getElementById('td-desc').value.trim();
    const st=document.getElementById('td-status').value, sb=document.getElementById('tpl-status');
    sb.className='badge b-'+st; sb.innerHTML='<span class="b-dot"></span>'+(STMETA[st]||st);
  }
  document.getElementById('td-done').addEventListener('click',()=>{ applyDetails(); closeTplDialog(); });
  document.getElementById('td-cancel').addEventListener('click',()=>{ if(!editing && !total()) location.href='templates.html'; else closeTplDialog(); });
  tplDialog.addEventListener('click',e=>{ if(e.target===tplDialog) closeTplDialog(); });
  document.getElementById('detailsBtn').addEventListener('click',openTplDialog);

  // Reference-tender upload (mock — Ray "matches" the uploaded tender)
  let rayTplHasImg=false;
  (function bindRayImg(){
    const ref=document.getElementById('rayTplRef'), inputId='rayTplImg', label='Add a client tender to match';
    function reset(){ rayTplHasImg=false; ref.innerHTML=`<input type="file" accept="image/*" id="${inputId}" hidden><label for="${inputId}" class="ray-drop"><span class="ms">upload_file</span> ${label}</label>`; wire(); }
    function wire(){ document.getElementById(inputId).addEventListener('change',e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ rayTplHasImg=true; ref.innerHTML=`<div class="ray-thumb"><img src="${r.result}" alt="reference"><button type="button" class="ray-x"><span class="ms">close</span></button><div class="ray-cap">Client reference · ${f.name}</div></div>`; ref.querySelector('.ray-x').addEventListener('click',reset); }; r.readAsDataURL(f); }); }
    wire();
  })();
  function rayDraftTemplate(desc){
    const s=(desc||'').toLowerCase();
    let ids, cat, name;
    if(/civil|infrastructure|road|drainage/.test(s)){ ids=['cover','toc','exec-summary','methodology','rate-table','env-row','proj-profile','case-study','compliance-tbl','policy-whs','policy-env','insurance','licences']; cat='Civil'; name='Civil Infrastructure Response'; }
    else if(/capability|eoi|expression|prequal/.test(s)){ ids=['cover','toc','exec-summary','cv-standard','cv-exec','proj-profile','licences','insurance']; cat='Engineering'; name='Engineering Capability Statement'; }
    else if(/facilit|maintenance|hvac/.test(s)){ ids=['cover','toc','exec-summary','methodology','rate-table','program','policy-whs','risk-block','insurance','licences']; cat='Facilities'; name='Facilities Maintenance Tender'; }
    else if(/government|panel|supplier/.test(s)){ ids=['cover','toc','exec-summary','compliance-tbl','methodology','cv-standard','policy-whs','policy-quality','policy-env','insurance','licences','referees']; cat='Government'; name='Government Supplier Panel'; }
    else { ids=['cover','toc','exec-summary','methodology','rate-table','cv-standard','proj-profile','case-study','policy-whs','policy-quality','insurance','licences']; cat='Construction'; name='Construction — Standard Tender'; }
    const cs=document.getElementById('td-cat'); if([...cs.options].some(o=>o.value===cat)) cs.value=cat;
    SECTIONS.forEach(sec=>sections[sec]=[]);
    ids.forEach(id=>{ if(byId[id]){ const sec=secOf(id); if(!sections[sec].includes(id)) sections[sec].push(id); } });
    renderCanvas(); renderPalette();
    return {n:total(), name};
  }
  document.getElementById('rayTplBtn').addEventListener('click',()=>{
    const p=document.getElementById('rayTplPrompt').value.trim();
    if(!p && !document.getElementById('td-cat').value && !rayTplHasImg){ showToast('Describe the tender, pick a type, or add a reference'); return; }
    const res=rayDraftTemplate(p);
    if(!document.getElementById('td-name').value.trim()) document.getElementById('td-name').value=res.name;
    applyDetails(); closeTplDialog();
    showToast('Ray drafted '+res.n+' documents'+(rayTplHasImg?' to match your reference':'')+' — refine, then Save');
  });

  // Auto-open for a new template; keep the editor hidden until Start editing
  if(!editing){ const w=tbwrap(); if(w) w.style.visibility='hidden'; openTplDialog(); }
}
