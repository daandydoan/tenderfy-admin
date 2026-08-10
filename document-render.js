// Shared composed-document renderer — ONE code path for how a section/page
// document looks, so the Document builder (document-edit.html) and the
// document/pack preview (renderDocument) render the SAME thing you assembled.
// Closes the "what you build ≠ what renders" seam for block-assembled docs.
//
// A document's composition is an ordered list of blocks/elements stored on the
// COMPONENT as `c.blocks` (see library-data.js). Each entry: {t:'block'|'element',
// id, content?, style?}. renderComposedDoc() turns the instantiated items into an
// A4 page; docBlocksToItems() inflates stored composition into render items.

const DOC_ITEM_STYLE_DEFAULT = {pad:0, gap:16, rad:0, bgOn:false, bg:'#ffffff', bcOn:false, bc:'#dbe3e0', hMode:'auto', hVal:120};

function docHeightCss(s){
  const m=(s&&s.hMode)||'auto', v=Math.max(0,(s&&s.hVal)||0);
  if(m==='hug')   return 'height:fit-content;';
  if(m==='fixed') return `height:${v}px;overflow:hidden;`;
  if(m==='min')   return `min-height:${v}px;`;
  if(m==='max')   return `max-height:${v}px;overflow:auto;`;
  return '';
}

// Render one item (element → primitive, block → composed block), apply the
// per-item content overrides + style box. Identical logic to the editor's
// renderBlockInstance so build and preview match exactly.
function docItemHtml(it, brand, cls){
  const content = it.content || {};
  let inner='';
  if(it.el){
    // Elements take content directly, so each document renders distinct text/rows.
    inner = (typeof renderPrimitive==='function') ? renderPrimitive(it.pid, brand, content) : '';
  } else {
    const b = (typeof BLOCKS!=='undefined') ? BLOCKS.find(x=>x.id===it.bid) : null;
    inner = b ? ((typeof composeBlock==='function') ? composeBlock(b, brand) : '') : '';
    // Blocks compose several primitives — override the first heading/body if given.
    if(content.title || content.body){
      const tmp=document.createElement('div'); tmp.innerHTML=inner;
      if(content.title){ const h=tmp.querySelector('h1,h2,h3,h4'); if(h) h.textContent=content.title; }
      if(content.body){ const p=tmp.querySelector('p,li,blockquote'); if(p) p.textContent=content.body; }
      inner=tmp.innerHTML;
    }
  }
  const s=it.style||DOC_ITEM_STYLE_DEFAULT;
  let c=`box-sizing:border-box;padding:${s.pad||0}px;border-radius:${s.rad||0}px;margin-bottom:${s.gap!=null?s.gap:16}px;`+docHeightCss(s);
  if(s.bgOn) c+=`background:${s.bg};`;
  if(s.bcOn) c+=`border:1px solid ${s.bc};`;
  return `<div class="${cls||'doc-blk-r'}" style="${c}">${inner}</div>`;
}

// Full A4 page from a list of render items.
function renderComposedDoc(items, brand){
  const body=(items||[]).map(it=>docItemHtml(it, brand)).join('');
  return `<div style="padding:46px 50px;display:flex;flex-direction:column;gap:0">${body}</div>`;
}

// Inflate a stored composition (c.blocks) into render items.
function docBlocksToItems(blocks){
  return (blocks||[]).map(bl=>{
    const isEl = bl.t==='element' || bl.el;
    return {
      el:isEl, bid:isEl?null:bl.id, pid:isEl?bl.id:null,
      style:Object.assign({}, DOC_ITEM_STYLE_DEFAULT, bl.style||{}),
      content:bl.content||{},
    };
  });
}

if(typeof window!=='undefined'){
  window.DOC_ITEM_STYLE_DEFAULT=DOC_ITEM_STYLE_DEFAULT;
  window.docHeightCss=docHeightCss; window.docItemHtml=docItemHtml;
  window.renderComposedDoc=renderComposedDoc; window.docBlocksToItems=docBlocksToItems;
}
