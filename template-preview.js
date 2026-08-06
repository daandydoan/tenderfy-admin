// Shared branded A4 preview for a tender template (a pack of library documents).
// Renders a cover page followed by one A4 sheet per document, in a client's brand.
// Used by the template view page, the template editor's Preview, and the client
// detail page — one source of truth so all three stay identical.
//
// renderTemplatePreview(el, { name, docs, brand, version, category })
//   el       — container element (gets the .tpl-preview flow)
//   name     — template name (cover title)
//   docs     — ordered array of library-document ids
//   brand    — a brand object {primary,secondary,font,bodyFont,…} or null (neutral)
//   version  — optional version number for the cover meta line
//   category — optional category label for the cover meta line
function renderTemplatePreview(el, opts){
  if(!el) return;
  const name = opts.name || 'Tender Template';
  const docs = opts.docs || [];
  const brand = opts.brand || null;
  const version = opts.version;
  const category = opts.category;
  const byComp = Object.fromEntries((typeof COMPONENTS!=='undefined'?COMPONENTS:[]).map(c=>[c.id,c]));
  const b = brand || (typeof DOC_BRAND_DEFAULT!=='undefined'
    ? DOC_BRAND_DEFAULT
    : {primary:'#27535C',secondary:'#38988A',font:'Outfit',bodyFont:'Outfit'});
  const H=`font-family:'${b.font}',sans-serif`, T=`font-family:'${b.bodyFont}',sans-serif`;

  const meta = [docs.length+' document'+(docs.length===1?'':'s'), version!=null?('v'+version):null, category]
    .filter(Boolean).join(' · ');

  const cover = `<div class="cd-a4">
      <div style="${H};background:${b.primary};color:#fff;padding:44px 46px">
        <div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${b.secondary};font-weight:600">Tender Template</div>
        <div style="font-size:30px;font-weight:700;margin-top:12px;line-height:1.15">${name}</div>
        <div style="width:56px;height:4px;background:${b.secondary};margin:20px 0"></div>
        <div style="font-size:13px;opacity:.85">${meta}</div>
      </div>
      <div style="padding:32px 46px">
        <div style="${H};font-size:16px;font-weight:700;color:${b.primary};border-bottom:2px solid ${b.secondary};padding-bottom:8px;margin-bottom:6px">Contents</div>
        ${docs.map((id,i)=>{ const c=byComp[id]; return `<div style="${T};display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid #EEF1F0;font-size:13.5px;color:#3A4442"><span style="${H};color:${b.secondary};font-weight:700;width:26px">${String(i+1).padStart(2,'0')}</span><span style="flex:1">${c?c.name:id}</span><span style="color:#9aa5a3;font-size:11px">${c?c.category:''}</span></div>`; }).join('') || `<div style="${T};color:#9aa5a3;font-size:13px;padding:14px 0">No documents in this template yet.</div>`}
      </div></div>`;

  const pages = docs.map(id=>`<div class="cd-a4">${(typeof renderDocument==='function')?renderDocument(id, brand):''}</div>`).join('');

  el.classList.add('tpl-preview');
  el.innerHTML = cover + pages;
}

if(typeof window!=='undefined'){ window.renderTemplatePreview = renderTemplatePreview; }
