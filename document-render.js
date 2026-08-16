// Shared composed-document renderer — ONE code path for how a section/page
// document looks, so the Document builder (document-edit.html) and the
// document/pack preview (renderDocument) render the SAME thing you assembled.
// Closes the "what you build ≠ what renders" seam for block-assembled docs.
//
// A document's composition is an ordered list of blocks/elements stored on the
// COMPONENT as `c.blocks` (see library-data.js). Each entry: {t:'block'|'element',
// id, content?, style?}. renderComposedDoc() turns the instantiated items into an
// A4 page; docBlocksToItems() inflates stored composition into render items.

const DOC_ITEM_STYLE_DEFAULT = {padH:0, padV:0, padSides:false, padT:0, padR:0, padB:0, padL:0, marH:0, marV:0, marSides:false, marT:0, marR:0, marB:0, marL:0, rad:0, radSides:false, radTL:0, radTR:0, radBR:0, radBL:0, bgOn:false, bg:'#ffffff', bgA:100, bgVis:true, bcOn:false, bc:'#dbe3e0', bcA:100, bcVis:true, bw:1, bpos:'inside', wMode:'fill', wPx:480, hMode:'auto', hVal:120};

// Padding / margin as a CSS value — Horizontal+Vertical (Figma default) or four per side.
function boxCss(s, key){
  if(!s) return '0px';
  if(s[key+'Sides']) return `${(s[key+'T']||0)}px ${(s[key+'R']||0)}px ${(s[key+'B']||0)}px ${(s[key+'L']||0)}px`;
  const h = (s[key+'H']!=null) ? s[key+'H'] : (s[key]||0);   // fall back to legacy overall
  const v = (s[key+'V']!=null) ? s[key+'V'] : (s[key]||0);
  return `${v}px ${h}px`;
}
// Corner radius — one value (all) or four corners (TL TR BR BL, the CSS order).
function radCss(s){
  if(s && s.radSides) return `${(s.radTL||0)}px ${(s.radTR||0)}px ${(s.radBR||0)}px ${(s.radBL||0)}px`;
  return `${(s&&s.rad)||0}px`;
}
function radAny(s){ return !!s && (s.radSides ? (s.radTL||s.radTR||s.radBR||s.radBL) : s.rad>0); }
// A paint (fill/stroke) colour with optional opacity → hex or rgba().
function paintCss(hex, a){
  if(a==null || a>=100 || !hex) return hex||'';
  a=Math.max(0,Math.min(100,a))/100;
  let h=String(hex).replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join('');
  const n=parseInt(h,16); if(isNaN(n)) return hex;
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

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
  // Margin: user value if set, else a default 16px bottom rhythm between blocks.
  const marUsed = s.marSides || s.marH || s.marV || s.mar>0 || s.marT || s.marR || s.marB || s.marL;
  let c=`box-sizing:border-box;padding:${boxCss(s,'pad')};margin:${marUsed?boxCss(s,'mar'):'0 0 16px'};border-radius:${radCss(s)};`+docHeightCss(s);
  if(s.wMode==='fixed' && s.wPx>0) c+=`width:${s.wPx}px;max-width:100%;margin-left:auto;margin-right:auto;`;   // Fixed width, centred on the page
  if(radAny(s)) c+='overflow:hidden;';   // clip content so a high radius rounds the image (up to a full circle)
  if(s.bgOn && s.bgVis!==false) c+=`background:${paintCss(s.bg, s.bgA)};`;
  if(s.bcOn && s.bcVis!==false){
    const w=(s.bw!=null?s.bw:1), col=paintCss(s.bc, s.bcA);
    c += s.bpos==='inside' ? `box-shadow:inset 0 0 0 ${w}px ${col};` : `border:${w}px solid ${col};`;
  }
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
  window.DOC_ITEM_STYLE_DEFAULT=DOC_ITEM_STYLE_DEFAULT; window.boxCss=boxCss; window.radCss=radCss; window.radAny=radAny; window.paintCss=paintCss;
  window.docHeightCss=docHeightCss; window.docItemHtml=docItemHtml;
  window.renderComposedDoc=renderComposedDoc; window.docBlocksToItems=docBlocksToItems;
}
