// Content blocks behind Tenderfy's Block Builder — the pieces Documents are built from.
// Shared by the Blocks library, the block editor and the document editor.
const BLOCKS = [
  {id:'heading',    name:'Heading',             cat:'Title Blocks', p:'heading'},
  {id:'subheading', name:'Sub-Heading',         cat:'Title Blocks', p:'subheading'},
  {id:'divider',    name:'Section Divider',     cat:'Title Blocks', p:'divider', custom:true},
  {id:'paragraph',  name:'Paragraph',           cat:'Text Blocks',  p:'paragraph'},
  {id:'double',     name:'Double Paragraph',    cat:'Text Blocks',  p:'double'},
  {id:'headpara',   name:'Heading & Paragraph', cat:'Text Blocks',  p:'headpara'},
  {id:'parahead',   name:'Paragraph & Heading', cat:'Text Blocks',  p:'parahead'},
  {id:'quote',      name:'Pull Quote',          cat:'Text Blocks',  p:'quote'},
  {id:'list',       name:'Bulleted List',       cat:'Text Blocks',  p:'list'},
  {id:'callout',    name:'Branded Callout',     cat:'Text Blocks',  p:'callout', custom:true},
  {id:'img1',       name:'Single Image',        cat:'Images',       p:'img1'},
  {id:'img2',       name:'Double Images',       cat:'Images',       p:'img2'},
  {id:'img3',       name:'Triple Images',       cat:'Images',       p:'img3'},
  {id:'imggrid',    name:'Image Grid',          cat:'Images',       p:'imggrid'},
  {id:'banner',     name:'Logo Banner',         cat:'Images',       p:'banner', custom:true},
  {id:'imgtext',    name:'Image & Text',        cat:'Image & Text', p:'imgtext'},
  {id:'textimg',    name:'Text & Image',        cat:'Image & Text', p:'textimg'},
  {id:'imgcap',     name:'Image + Caption',     cat:'Image & Text', p:'imgcap'},
  {id:'feature',    name:'Two-Column Feature',  cat:'Image & Text', p:'feature', custom:true},
];
const BLOCK_CATS = ['Title Blocks','Text Blocks','Images','Image & Text'];

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
    case 'banner':    return `<div class="blk-img" style="min-height:64px;background:var(--nav)"><span class="ms">badge</span></div>`;
    case 'imgtext':   return `<div class="blk-row">${img()}<div class="blk-txt">${bar('92%')+bar('84%')+bar('66%')}</div></div>`;
    case 'textimg':   return `<div class="blk-row"><div class="blk-txt">${bar('92%')+bar('84%')+bar('66%')}</div>${img()}</div>`;
    case 'imgcap':    return `${img()}${bar('50%')}`;
    case 'feature':   return `<div class="blk-row">${img()}<div class="blk-txt">${bar('70%',1)+bar('92%')+bar('80%')}</div></div>`;
    default:          return bar('80%');
  }
}
if(typeof window!=='undefined'){ window.BLOCKS=BLOCKS; window.BLOCK_CATS=BLOCK_CATS; window.blockPreview=blockPreview; }
