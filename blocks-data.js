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
  {id:'table',      name:'Table',               label:'Table',              desc:'Rows and columns for rates, schedules or comparisons.',cat:'Tables & Sign-off', p:'table'},
  {id:'signature',  name:'Signature Block',     label:'Signature',          desc:'A sign-off area with name, role and date.',            cat:'Tables & Sign-off', p:'signature'},
  {id:'catalogue',  name:'Catalogue',           label:'Catalogue',          desc:'A list of items with an image, title and details.',    cat:'Image & Text',      p:'catalogue'},
  // Headers & Footers — page furniture for the document's Top Layer (repeats on every page).
  {id:'lh-brand',   name:'Branded Letterhead',  label:'Branded letterhead', desc:'Logo, company name and a brand rule across the top of every page.', cat:'Headers & Footers', p:'lh-brand',   slot:'header'},
  {id:'lh-contact', name:'Contact Letterhead',  label:'Contact letterhead', desc:'Company name with contact details in a top bar.',                   cat:'Headers & Footers', p:'lh-contact', slot:'header'},
  {id:'lh-min',     name:'Minimal Letterhead',  label:'Minimal letterhead', desc:'A small logo with a thin rule — understated.',                      cat:'Headers & Footers', p:'lh-min',     slot:'header'},
  {id:'lf-page',    name:'Page-number Footer',  label:'Page-number footer', desc:'Company name with a page number on every page.',                    cat:'Headers & Footers', p:'lf-page',    slot:'footer'},
  {id:'lf-legal',   name:'Legal Footer',        label:'Legal footer',       desc:'A confidentiality or disclaimer line across the bottom.',           cat:'Headers & Footers', p:'lf-legal',   slot:'footer'},
  {id:'lf-contact', name:'Contact Footer',      label:'Contact footer',     desc:'Address, phone and web in a bottom strip.',                         cat:'Headers & Footers', p:'lf-contact', slot:'footer'},
];
const BLOCK_CATS = ['Title Blocks','Text Blocks','Images','Image & Text','Tables & Sign-off','Headers & Footers'];

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
    case 'table':     return `<div class="blk-table">${['h','','',''].map(r=>`<div class="tr ${r}"><span></span><span></span><span></span></div>`).join('')}</div>`;
    case 'signature': return `${bar('55%')}<div style="height:1px;background:#9FB5B0;margin:14px 0 7px"></div>${bar('40%',1)}${bar('30%')}`;
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
if(typeof window!=='undefined'){ window.BLOCKS=BLOCKS; window.BLOCK_CATS=BLOCK_CATS; window.blockPreview=blockPreview; window.deleteBlock=deleteBlock; window.duplicateBlock=duplicateBlock; window.BLOCK_USAGE=BLOCK_USAGE; window.blockUsage=blockUsage; }
