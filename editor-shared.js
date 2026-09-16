// Shared editor behaviour for the Block Builder and Document Builder (CSS lives in components.css).
// Load after shell.js, before the page script.

// Drag an icon sideways to scrub a numeric value (2px per unit).
function figScrub(el, get, set){
  el.addEventListener('pointerdown',e=>{ e.preventDefault(); const x0=e.clientX, v0=+get()||0; try{el.setPointerCapture(e.pointerId);}catch(_){}
    const mv=ev=>set(v0+Math.round((ev.clientX-x0)/2)); const up=()=>{ el.removeEventListener('pointermove',mv); el.removeEventListener('pointerup',up); };
    el.addEventListener('pointermove',mv); el.addEventListener('pointerup',up); });
}
// Scrub every icon field inside .typo-grid: the input's own min/max clamp it, and it fires `input` so page wiring runs.
function wireScrubFields(root){
  (root||document).querySelectorAll('.typo-grid .fig-field').forEach(wt=>{ const ic=wt.querySelector('.fig-ic'), inp=wt.querySelector('input'); if(!ic||!inp||ic.dataset.scrubbed) return; ic.dataset.scrubbed='1';
    figScrub(ic, ()=>+inp.value||0, v=>{ if(inp.disabled) return; const mn=+inp.min||0, mx=(inp.max!==''&&inp.max!=null)?+inp.max:1e5; inp.value=Math.max(mn,Math.min(mx,v)); inp.dispatchEvent(new Event('input',{bubbles:true})); }); });
}
// Dialog shell (.cfm.dlg): the × closes its overlay; clicking the scrim closes too.
function wireDialogs(){
  document.querySelectorAll('.dlg-x[data-close]').forEach(x=>x.addEventListener('click',()=>x.closest('.modal-overlay').classList.remove('open')));
  document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m && m.querySelector('.dlg')) m.classList.remove('open'); }));
}
// Collapsible inspector sections (.insp-sec > .insp-h / .fig-sec-h); `key` namespaces the remembered state.
function wireInspSections(key){
  const K='tf_insp_closed_'+key; let closed=[]; try{ closed=JSON.parse(localStorage.getItem(K)||'[]'); }catch(_){}
  const apply=()=>document.querySelectorAll('.insp-sec[data-sec]').forEach(s=>s.classList.toggle('closed', closed.includes(s.dataset.sec)));
  document.querySelectorAll('.insp-sec[data-sec] > .insp-h, .insp-sec[data-sec] > .fig-sec-h').forEach(h=>h.addEventListener('click',e=>{
    if(e.target.closest('button')) return; const k=h.parentElement.dataset.sec;
    closed = closed.includes(k) ? closed.filter(x=>x!==k) : closed.concat(k); try{ localStorage.setItem(K, JSON.stringify(closed)); }catch(_){} apply();
  }));
  apply();
}
// Text is kept as inline HTML limited to b/i/u/s/br/a — anything else the browser emits is unwrapped to its text.
const RICH=new Set(['B','I','U','S','BR','A']);
function richText(n){ return [...n.childNodes].map(x=>{ if(x.nodeType===3) return x.textContent; if(x.nodeType!==1) return ''; const inner=richText(x); const tag=x.tagName==='STRONG'?'b':x.tagName==='EM'?'i':x.tagName.toLowerCase(); if(x.tagName==='BR') return '<br>'; if(x.tagName==='A' && x.getAttribute('href')) return '<a href="'+x.getAttribute('href').replace(/"/g,'')+'">'+inner+'</a>'; return RICH.has(tag.toUpperCase()) ? '<'+tag+'>'+inner+'</'+tag+'>' : inner; }).join(''); }
function captureContent(body){
  const c={};
  body.querySelectorAll('[data-ek]').forEach(n=>{ const k=n.dataset.ek;
    if(k==='items') c.items=[...n.querySelectorAll('li')].map(richText);
    else if(k==='headers') (c.headers=c.headers||[]).push(richText(n));
    else if(k==='row'||k==='pair') (c[k+'s']=c[k+'s']||[]).push([...n.querySelectorAll('[data-ec]')].map(richText));
    else c[k]=richText(n);
  });
  return c;
}
// Preview is the build canvas with the editing chrome hidden (CSS) and text locked — what you built is what you see.
if(typeof window!=='undefined'){ Object.assign(window,{figScrub,wireScrubFields,wireDialogs,wireInspSections,richText,captureContent}); }
