// Functional document mockups — a handful of Tenderfy library documents built out
// with real, brand-aware content so the document view renders a true A4 page
// (not just a schematic). Each entry is (brand) => inner HTML for the A4 sheet.
//
// brand = { primary, secondary, background, font, bodyFont }. Documents are
// brand-neutral by default; the client's brand tokens are layered on when a
// preview style is chosen. Docs without a bespoke mock fall back to a
// primitive-composed page via renderDocument().

const DOC_BRAND_DEFAULT = {primary:'#27535C', secondary:'#38988A', background:'#F7F9F8', font:'Outfit', bodyFont:'Outfit'};


// Documents whose preview uses realistic sample content (all rendered docs now do).
const DOC_MOCKED = (typeof COMPONENTS!=='undefined') ? COMPONENTS.map(c=>c.id) : [];

// Render a document into A4 inner HTML for a given brand.
//  • resume docs → the shared resume renderer (renderResume)
//  • section/page docs → their saved block/element composition (renderComposedDoc)
//  • anything without a composition → a primitive-composed fallback page
// Needs primitives.js, block-layouts.js, document-render.js, resume-render.js.
function renderDocument(id, brand){
  const b = brand || DOC_BRAND_DEFAULT;
  const c = (typeof COMPONENTS!=='undefined') ? COMPONENTS.find(x=>x.id===id) : null;
  // Resume documents render through the SHARED resume renderer, so a pack shows
  // the exact CV built in the Resume builder (same layout + sections).
  if(c && c.type==='resume' && typeof renderResume==='function'){
    const cfg = c.resume || {};
    return renderResume({layout:cfg.layout, brand:b, sections:cfg.sections});
  }
  // Section/page documents render from their saved block/element composition —
  // the same items the Document builder assembles (see document-render.js).
  if(c && Array.isArray(c.blocks) && typeof renderComposedDoc==='function' && typeof docBlocksToItems==='function'){
    return renderComposedDoc(docBlocksToItems(c.blocks), b);
  }
  // Fallback: a plausible page assembled from primitives, keyed off the doc's
  // thumbnail style so rows-docs get a table, icon-docs get imagery, etc.
  const name = c ? c.name : 'Document';
  const H=`font-family:'${b.font}',sans-serif`;
  const rp = (typeof renderPrimitive==='function') ? renderPrimitive : ()=>'';
  const head = `<h3 style="${H};margin:0 0 16px;color:${b.primary};font-size:22px;font-weight:700;border-bottom:2px solid ${b.secondary};padding-bottom:8px">${name}</h3>`;
  let body;
  if(c && c.thumb==='rows')      body = rp('paragraph',b)+'<div style="height:16px"></div>'+rp('table',b);
  else if(c && c.thumb==='icon') body = rp('paragraph',b)+'<div style="height:16px"></div>'+rp('image',b);
  else                           body = rp('paragraph',b)+'<div style="height:14px"></div>'+rp('keyvalue',b)+'<div style="height:14px"></div>'+rp('list',b);
  return `<div style="padding:46px 50px;display:flex;flex-direction:column;gap:0">${head}${body}</div>`;
}

if(typeof window!=='undefined'){
  window.DOC_MOCKED=DOC_MOCKED;
  window.renderDocument=renderDocument; window.DOC_BRAND_DEFAULT=DOC_BRAND_DEFAULT;
}
