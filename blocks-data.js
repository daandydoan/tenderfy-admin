// Content blocks behind Tenderfy's Block Builder — the pieces Documents are built from.
// Shared by the Blocks library, the block editor and the document editor.
//
// Goal: ONE shared block set for every client. `label` is what the client sees in Add Block.
const BLOCKS = [
  {id:'heading',    name:'Heading',             label:'Heading',            desc:'A single section heading.',                            cat:'Title Blocks', p:'heading'},
  {id:'subheading', name:'Sub-Heading',         label:'Sub-heading',        desc:'A smaller heading with a supporting line.',            cat:'Title Blocks', p:'subheading'},
  {id:'divider',    name:'Section Divider',     label:'Section divider',    desc:'A titled rule that separates sections.',               cat:'Title Blocks', p:'divider'},
  {id:'paragraph',  name:'Paragraph',           label:'Paragraph',          desc:'A block of body text.',                                cat:'Text Blocks',  p:'paragraph'},
  {id:'double',     name:'Double Paragraph',    label:'Two columns of text',desc:'Body text in two side-by-side columns.',               cat:'Text Blocks',  p:'double'},
  {id:'headpara',   name:'Heading & Paragraph', label:'Heading beside text',desc:'A heading on the left with body text on the right.',   cat:'Text Blocks',  p:'headpara'},
  {id:'parahead',   name:'Paragraph & Heading', label:'Text beside heading',desc:'Body text on the left with a heading on the right.',   cat:'Text Blocks',  p:'parahead'},
  {id:'quote',      name:'Pull Quote',          label:'Quote',              desc:'A highlighted quote or testimonial.',                  cat:'Text Blocks',  p:'quote'},
  {id:'list',       name:'Bulleted List',       label:'Bulleted list',      desc:'A list of short points.',                              cat:'Text Blocks',  p:'list'},
  {id:'callout',    name:'Branded Callout',     label:'Highlight box',      desc:'A coloured box that draws attention to key text.',     cat:'Text Blocks',  p:'callout'},
  {id:'doc-details',name:'Document Details Grid',label:'Details grid',       desc:'A section title beside a grid of label / value detail rows.',   cat:'Text Blocks', p:'docdetails'},
  {id:'doc-para',   name:'Document Paragraph',   label:'Document paragraph', desc:'A section title beside a paragraph.',                           cat:'Text Blocks', p:'docpara'},
  {id:'doc-dblpara',name:'Document Double Paragraph',label:'Document double paragraph',desc:'A section title beside two paragraphs.',                 cat:'Text Blocks', p:'docdblpara'},
  {id:'img1',       name:'Single Image',        label:'One image',          desc:'A single full-width image.',                           cat:'Images',       p:'img1'},
  {id:'img2',       name:'Double Images',       label:'Two images',         desc:'Two images side by side.',                             cat:'Images',       p:'img2'},
  {id:'img3',       name:'Triple Images',       label:'Three images',       desc:'Three images in a row.',                               cat:'Images',       p:'img3'},
  {id:'imggrid',    name:'Image Grid',          label:'Image grid',         desc:'A four-image grid.',                                   cat:'Images',       p:'imggrid'},
  {id:'imgtext',    name:'Image & Text',        label:'Image with text',    desc:'An image on the left, text on the right.',             cat:'Image & Text', p:'imgtext'},
  {id:'textimg',    name:'Text & Image',        label:'Text with image',    desc:'Text on the left, an image on the right.',             cat:'Image & Text', p:'textimg'},
  {id:'imgcap',     name:'Image + Caption',     label:'Image with caption', desc:'An image with a caption underneath.',                  cat:'Image & Text', p:'imgcap'},
  {id:'feature',    name:'Two-Column Feature',  label:'Feature panel',      desc:'An image beside a headline and supporting text.',      cat:'Image & Text', p:'feature'},
  {id:'table',      name:'Table',               label:'Table',              desc:'Rows and columns for rates, schedules or comparisons.',cat:'Table & Data', p:'table'},
  {id:'itemprice',  name:'Item Pricing',        label:'Item pricing',       desc:'A list of priced line items — description with a unit amount.',  cat:'Table & Data', p:'itemprice'},
  {id:'totalprice', name:'Total Pricing',       label:'Total pricing',      desc:'A subtotal / total summary with a highlighted grand total.',     cat:'Table & Data', p:'totalprice'},
  {id:'signature',  name:'Signature Block',     label:'Signature',          desc:'A sign-off area with name, role and date.',            cat:'Text Blocks', p:'signature'},
  {id:'sig1',       name:'Signature',           label:'Signature',          desc:'A single sign-off built from the signature element.',   cat:'Text Blocks', p:'sig1'},
  {id:'sig2',       name:'Double Signature',    label:'Double signature',   desc:'Two sign-off areas side by side, for two signatories.', cat:'Text Blocks', p:'sig2'},
  {id:'catalogue',  name:'Catalogue',           label:'Catalogue',          desc:'A list of items with an image, title and details.',    cat:'Image & Text',      p:'catalogue'},
  {id:'tcircimgs',  name:'Text & Circular Images',label:'Text with circular images',desc:'Two circular images beside a block of text.',       cat:'Image & Text',      p:'tcircimgs'},
  {id:'tcircimg',   name:'Text & Circular Image', label:'Text with a circular image',desc:'A block of text beside a single circular image.',    cat:'Image & Text',      p:'tcircimg'},
  // Headers & Footers — page furniture for the document's Top Layer (repeats on every page).
  {id:'lh-brand',   name:'Branded Letterhead',  label:'Branded letterhead', desc:'Logo, company name and a brand rule across the top of every page.', cat:'Headers & Footers', p:'lh-brand',   slot:'header'},
  {id:'lh-contact', name:'Contact Letterhead',  label:'Contact letterhead', desc:'Company name with contact details in a top bar.',                   cat:'Headers & Footers', p:'lh-contact', slot:'header'},
  {id:'lh-min',     name:'Minimal Letterhead',  label:'Minimal letterhead', desc:'A small logo with a thin rule — understated.',                      cat:'Headers & Footers', p:'lh-min',     slot:'header'},
  {id:'lf-page',    name:'Page-number Footer',  label:'Page-number footer', desc:'Company name with a page number on every page.',                    cat:'Headers & Footers', p:'lf-page',    slot:'footer'},
  {id:'lf-legal',   name:'Legal Footer',        label:'Legal footer',       desc:'A confidentiality or disclaimer line across the bottom.',           cat:'Headers & Footers', p:'lf-legal',   slot:'footer'},
  {id:'lf-contact', name:'Contact Footer',      label:'Contact footer',     desc:'Address, phone and web in a bottom strip.',                         cat:'Headers & Footers', p:'lf-contact', slot:'footer'},
];
const BLOCK_CATS = ['Title Blocks','Text Blocks','Images','Image & Text','Table & Data','Headers & Footers'];

// Element vs Block. ELEMENTS are single atoms (one primitive) — they live inside
// the builders (block editor + document editor) but are NOT listed as Blocks.
// BLOCKS are composed, reusable sub-sections (≥2 elements or a specific layout)
// and populate the Blocks library. See primitives.js for the element source.
const BLOCK_ELEMENT_IDS = new Set(['heading','subheading','divider','paragraph','quote','list','callout','img1','table','signature']);
BLOCKS.forEach(b=>{ b.kind = BLOCK_ELEMENT_IDS.has(b.id) ? 'element' : 'block'; });
const COMPOSED_BLOCKS = BLOCKS.filter(b=>b.kind==='block');
// Categories that actually contain composed blocks (for the Blocks library tabs).
const BLOCK_LIB_CATS = BLOCK_CATS.filter(c=>COMPOSED_BLOCKS.some(b=>b.cat===c));

// Schematic preview for a block layout key.
function blockPreview(p){
  const bar=(w,h)=>`<div class="blk-bar${h?' h':''}" style="width:${w}"></div>`;
  const img=()=>`<div class="blk-img"><span class="ms">image</span></div>`;
  const col=(...b)=>`<div>${b.join('')}</div>`;
  switch(p){
    case 'heading':   return bar('60%',1);
    case 'subheading':return bar('72%',1)+bar('46%');
    case 'divider':   return bar('40%',1)+`<div style="height:2px;background:var(--teal);opacity:.4;margin:4px 0"></div>`+bar('55%');
    case 'paragraph': return bar('94%')+bar('90%')+bar('92%')+bar('68%');
    case 'double':    return `<div class="blk-cols">${col(bar('90%'),bar('80%'),bar('86%'))}${col(bar('88%'),bar('84%'),bar('70%'))}</div>`;
    case 'headpara':  return `<div class="blk-cols">${col(bar('80%',1),bar('60%'))}${col(bar('92%'),bar('86%'),bar('74%'))}</div>`;
    case 'parahead':  return `<div class="blk-cols">${col(bar('92%'),bar('86%'),bar('74%'))}${col(bar('80%',1),bar('60%'))}</div>`;
    case 'quote':     return `<div class="blk-quote">${bar('88%',1)+bar('72%')}</div>`;
    case 'list':      return ['82%','74%','68%'].map(w=>`<div class="blk-list-row"><span class="dot"></span>${bar(w)}</div>`).join('');
    case 'callout':   return `<div style="background:var(--teal-tint);border-radius:6px;padding:12px;display:flex;flex-direction:column;gap:8px">${bar('70%',1)+bar('88%')+bar('60%')}</div>`;
    case 'img1':      return img();
    case 'img2':      return `<div class="blk-imgs">${img()+img()}</div>`;
    case 'img3':      return `<div class="blk-imgs">${img()+img()+img()}</div>`;
    case 'imggrid':   return `<div class="blk-imgs">${img()+img()}</div><div class="blk-imgs">${img()+img()}</div>`;
    case 'imgtext':   return `<div class="blk-row">${img()}<div class="blk-txt">${bar('92%')+bar('84%')+bar('66%')}</div></div>`;
    case 'textimg':   return `<div class="blk-row"><div class="blk-txt">${bar('92%')+bar('84%')+bar('66%')}</div>${img()}</div>`;
    case 'imgcap':    return `${img()}${bar('50%')}`;
    case 'feature':   return `<div class="blk-row">${img()}<div class="blk-txt">${bar('70%',1)+bar('92%')+bar('80%')}</div></div>`;
    case 'tcircimgs': return `<div class="blk-row" style="align-items:center"><div style="position:relative;flex:none;width:66px;height:58px"><div style="position:absolute;right:2px;top:0;width:50px;height:50px;border-radius:50%;background:#7FC1B4;display:flex;align-items:center;justify-content:center;color:#fff"><span class="ms" style="font-size:19px">image</span></div><div style="position:absolute;left:0;bottom:0;width:27px;height:27px;border-radius:50%;background:var(--teal);border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff"><span class="ms" style="font-size:12px">image</span></div></div><div class="blk-txt">${bar('94%')+bar('80%')}</div></div>`;
    case 'tcircimg':  return `<div class="blk-row" style="align-items:center"><div class="blk-txt">${bar('92%')+bar('84%')+bar('66%')}</div><div style="flex:none;width:54px;height:54px;border-radius:50%;background:#7FC1B4;display:flex;align-items:center;justify-content:center;color:#fff"><span class="ms" style="font-size:21px">image</span></div></div>`;
    case 'table':     return `<div class="blk-table">${['h','','',''].map(r=>`<div class="tr ${r}"><span></span><span></span><span></span></div>`).join('')}</div>`;
    case 'itemprice': return bar('44%',1)+[0,1,2].map(()=>`<div class="blk-pr">${bar('56%')}<div class="blk-bar blk-amt"></div></div>`).join('');
    case 'totalprice':return `<div class="blk-pr">${bar('34%')}<div class="blk-bar blk-amt"></div></div><div class="blk-pr">${bar('26%')}<div class="blk-bar blk-amt"></div></div><div style="height:1px;background:#9FB5B0;margin:3px 0"></div><div class="blk-pr">${bar('42%',1)}<div class="blk-bar blk-amt h"></div></div>`;
    case 'signature': return `${bar('55%')}<div style="height:1px;background:#9FB5B0;margin:14px 0 7px"></div>${bar('40%',1)}${bar('30%')}`;
    case 'sig1':      return `<div style="display:flex;flex-direction:column;align-items:center;gap:9px;padding:2px 0"><span class="ms" style="font-size:27px;color:#9FB5B0">draw</span><div style="width:100%;height:18px;background:#c9d5d1;border-radius:5px"></div><div style="width:72%;height:12px;background:#d8e0dd;border-radius:4px"></div></div>`;
    case 'sig2':{ const one=`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:7px"><span class="ms" style="font-size:21px;color:#9FB5B0">draw</span><div style="width:100%;height:15px;background:#c9d5d1;border-radius:4px"></div><div style="width:82%;height:10px;background:#d8e0dd;border-radius:3px"></div></div>`; return `<div style="display:flex;gap:16px">${one}${one}</div>`; }
    case 'catalogue': return `<div class="blk-row" style="min-height:0">${img()}<div class="blk-txt">${bar('80%',1)+bar('62%')}</div></div><div class="blk-row" style="min-height:0;margin-top:8px">${img()}<div class="blk-txt">${bar('80%',1)+bar('62%')}</div></div>`;
    case 'docdetails':{ const cell='<div class="doc-cell"><span class="blk-bar h" style="width:75%"></span><span class="blk-bar" style="width:100%"></span><span class="blk-bar" style="width:82%"></span></div>'; return `<div class="doc-row"><div class="doc-title"></div><div class="doc-grid">${cell+cell+cell+cell}</div></div>`; }
    case 'docpara':   return `<div class="doc-row"><div class="doc-title"></div><div class="doc-body">${bar('46%',1)+bar('92%')+bar('84%')+bar('64%')}</div></div>`;
    case 'docdblpara':{ const col='<div class="doc-col"><span class="blk-bar h" style="width:72%"></span><span class="blk-bar" style="width:100%"></span><span class="blk-bar" style="width:90%"></span><span class="blk-bar" style="width:72%"></span></div>'; return `<div class="doc-row"><div class="doc-title"></div><div class="doc-cols">${col+col}</div></div>`; }
    case 'lh-brand':  return `<div style="display:flex;align-items:center;gap:7px;border-bottom:2px solid var(--teal);padding-bottom:8px"><span style="width:20px;height:20px;border-radius:5px;background:var(--teal);flex:none"></span><span class="blk-bar h" style="width:44%"></span></div>`;
    case 'lh-contact':return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid var(--teal);padding-bottom:8px"><span class="blk-bar h" style="width:36%"></span><div style="display:flex;flex-direction:column;gap:3px;align-items:flex-end;flex:1">${bar('60%')}${bar('44%')}</div></div>`;
    case 'lh-min':    return `<div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid #c2ccc9;padding-bottom:6px"><span style="width:14px;height:14px;border-radius:4px;background:var(--teal);flex:none"></span><span class="blk-bar h" style="width:34%"></span></div>`;
    case 'lf-page':   return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid var(--teal);padding-top:8px;margin-top:4px">${bar('46%')}<span class="blk-bar" style="width:18%"></span></div>`;
    case 'lf-legal':  return `<div style="border-top:1px solid #c2ccc9;padding-top:8px;margin-top:4px;display:flex;flex-direction:column;gap:4px;align-items:center">${bar('90%')}${bar('68%')}</div>`;
    case 'lf-contact':return `<div style="display:flex;justify-content:space-between;gap:8px;border-top:2px solid var(--teal);padding-top:8px;margin-top:4px">${bar('26%')}${bar('22%')}${bar('24%')}</div>`;
    default:          return bar('80%');
  }
}
// ---- Auto-generated block thumbnails ------------------------------------
// A thumbnail is a SIMPLIFIED, data-free schematic of the block — derived from
// its real composition (the P2DOC layout) so any block, including bespoke ones,
// gets a truthful preview without hand-authoring or fake sample text. Each
// primitive renders as a placeholder shape (bars, image box, table grid…).
// A placeholder shape for one primitive. `compact` = fewer lines, for when the
// primitive sits inside a multi-column row (keeps narrow columns from cramming).
function primSchematic(id, compact){
  const bar=(w,h)=>`<div class="blk-bar${h?' h':''}" style="width:${w}"></div>`;
  const img=()=>`<div class="blk-img"><span class="ms">image</span></div>`;
  const rows=compact?2:3;
  switch(id){
    case 'heading':    return bar('60%',1);
    case 'subheading': return bar('72%',1);
    case 'cover':      return bar('66%',1);
    case 'paragraph':  return compact ? bar('92%')+bar('74%') : bar('94%')+bar('88%')+bar('70%');
    case 'list':       return ['82%','74%','66%'].slice(0,rows).map(w=>`<div class="blk-list-row"><span class="dot"></span>${bar(w)}</div>`).join('');
    case 'quote':      return `<div class="blk-quote">${bar('88%')+bar('64%')}</div>`;
    case 'image':      return img();
    case 'table':      return `<div class="blk-table">${['h','',''].concat(compact?[]:['']).map(r=>`<div class="tr ${r}"><span></span><span></span><span></span></div>`).join('')}</div>`;
    case 'keyvalue':   return [0,1,2].slice(0,rows).map(()=>`<div class="blk-pr">${bar('42%')}<div class="blk-bar blk-amt"></div></div>`).join('');
    case 'signature':  return `${bar('48%')}<div style="height:1px;background:#B4C6C1;margin:10px 0 6px"></div>${bar('36%',1)}`;
    case 'divider':    return `<div style="height:2px;background:#B4C6C1;border-radius:2px;margin:2px 0"></div>`;
    case 'callout':    return `<div style="background:var(--teal-tint);border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:7px">${bar('66%',1)+bar('84%')}</div>`;
    case 'stat':       return `<div class="blk-bar h" style="width:34%;height:16px"></div>${bar('58%')}`;
    case 'button':     return `<div style="width:44%;height:16px;background:var(--teal);opacity:.75;border-radius:5px"></div>`;
    case 'toc':        return [0,1,2].slice(0,rows).map(()=>`<div class="blk-pr">${bar('62%')}<div class="blk-bar" style="width:9%"></div></div>`).join('');
    case 'field':      return bar('46%');
    case 'spacer':     return `<div style="height:12px"></div>`;
    default:           return bar('72%');
  }
}
// Compose the schematic from the block's real row/column layout (P2DOC).
function blockSchematic(block){
  if(typeof P2DOC==='undefined') return blockPreview(block.p);
  if(/^l[hf]-/.test(block.p||'')) return blockPreview(block.p);   // letterhead / footer bands keep their bespoke schematic
  const doc = P2DOC[block.p] || [{cols:[[block.p]]}];
  return doc.map(row => row.cols.length>1
    ? `<div class="blk-cols">${row.cols.map(col=>`<div>${col.map(id=>primSchematic(id,true)).join('')}</div>`).join('')}</div>`
    : row.cols[0].map(id=>primSchematic(id,false)).join('')
  ).join('');
}
// Art-direction override — an optional custom image a user sets in the block
// editor. Persisted per block id so palettes/listings pick it up. Falls back to
// the auto-schematic when absent.
function blockThumbOverride(id){ try{ return (id && localStorage.getItem('tf_bthumb_'+id)) || ''; }catch(e){ return ''; } }
function setBlockThumbOverride(id, url){ try{ if(!id) return; if(url) localStorage.setItem('tf_bthumb_'+id, url); else localStorage.removeItem('tf_bthumb_'+id); }catch(e){} }
function blockThumb(block){
  const ovr = (block && (block.thumb || blockThumbOverride(block.id)));
  if(ovr) return `<img class="blk-thumb-img" src="${ovr}" alt="">`;   // custom graphic, sized to fit inside the tile
  return blockSchematic(block);
}
function fitThumbs(){}   // no-op: schematic thumbnails are %-based and need no scaling

// Shared block actions — kept in one place so the block view and the block
// editor share identical wording and behaviour.
function deleteBlock(label){
  confirmAction({title:'Delete this block?',body:`“${label}” will be removed from the Block Builder. Documents already using it keep their content.`,confirm:'Delete block',danger:true},()=>{
    showToast('Deleted block: '+label); setTimeout(()=>location.href='blocks.html',700);
  });
}
function duplicateBlock(label){
  showToast('Duplicated block: “'+label+' copy” — find it in the library'); setTimeout(()=>location.href='blocks.html',800);
}
// Realistic "used in N documents" counts, shared by the block view and editor
// so the same block reads consistently everywhere. Common blocks are used more.
const BLOCK_USAGE = {
  heading:46, subheading:31, divider:12, paragraph:58, double:14, headpara:27, parahead:9,
  quote:22, list:41, callout:18, 'doc-details':24, 'doc-para':16, 'doc-dblpara':8,
  img1:33, img2:21, img3:7, imggrid:5, imgtext:29, textimg:12, imgcap:15, feature:11,
  table:26, signature:34, catalogue:6,
  'lh-brand':19, 'lh-contact':8, 'lh-min':5, 'lf-page':17, 'lf-legal':22, 'lf-contact':6,
};
function blockUsage(id){ return (id in BLOCK_USAGE) ? BLOCK_USAGE[id] : 6; }

// Per-block status: Draft (being built), Active (live), Inactive (retired).
// Default is 'active'; overrides below make the set realistic.
const BLOCK_STATUS = {
  imggrid:'draft', 'doc-dblpara':'draft', catalogue:'draft', 'lh-min':'draft', 'lf-contact':'draft',
  parahead:'inactive', img3:'inactive',
};
function blockStatus(id){ return BLOCK_STATUS[id] || 'active'; }
// Live blocks read as "Published" to match Documents (and the meeting's
// "save as draft or publish"); the value stays 'active' internally.
const BLOCK_STATUS_META = {
  active:{cls:'b-published', label:'Published'},
  draft:{cls:'b-draft', label:'Draft'},
  inactive:{cls:'b-deprecated', label:'Inactive'},
};
function blockStatusBadge(id){ const m=BLOCK_STATUS_META[blockStatus(id)]||BLOCK_STATUS_META.active; return `<span class="badge ${m.cls}"><span class="b-dot"></span>${m.label}</span>`; }
if(typeof window!=='undefined'){ window.BLOCKS=BLOCKS; window.BLOCK_CATS=BLOCK_CATS; window.COMPOSED_BLOCKS=COMPOSED_BLOCKS; window.BLOCK_LIB_CATS=BLOCK_LIB_CATS; window.BLOCK_ELEMENT_IDS=BLOCK_ELEMENT_IDS; window.blockPreview=blockPreview; window.blockThumb=blockThumb; window.blockSchematic=blockSchematic; window.fitThumbs=fitThumbs; window.blockThumbOverride=blockThumbOverride; window.setBlockThumbOverride=setBlockThumbOverride; window.deleteBlock=deleteBlock; window.duplicateBlock=duplicateBlock; window.BLOCK_USAGE=BLOCK_USAGE; window.blockUsage=blockUsage; window.BLOCK_STATUS=BLOCK_STATUS; window.blockStatus=blockStatus; window.BLOCK_STATUS_META=BLOCK_STATUS_META; window.blockStatusBadge=blockStatusBadge; }
