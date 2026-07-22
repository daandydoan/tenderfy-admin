// Content blocks behind Tenderfy's Block Builder — the pieces Documents are built from.
// Shared by the Blocks library, the block editor and the document editor.
//
// ⚠ COVERAGE DATA IS PLACEHOLDER pending the block audit (scrum 20 Jul 2026):
// "we need to pull across all the different variations of blocks we've got in Tenderfy
//  currently — there needs to be some communication with Shiv... we don't know at the
//  moment who's got what block." Replace `tenants` on each block with audited values.
//
// status: 'standard'    — available to every tenant (the agreed end state)
//         'tenant-only' — bespoke / partial rollout, needs standardising
//         'to-retire'   — duplicate or superseded, remove after migration
const ALL_TENANTS = ['taylor','cpm-civil','cpm-infra','velocity','hansen','acme','northolt','civic'];

const BLOCKS = [
  {id:'heading',    name:'Heading',             label:'Heading',            desc:'A single section heading.',                          cat:'Title Blocks', p:'heading',    status:'standard',    tenants:ALL_TENANTS},
  {id:'subheading', name:'Sub-Heading',         label:'Sub-heading',        desc:'A smaller heading with a supporting line.',          cat:'Title Blocks', p:'subheading', status:'standard',    tenants:ALL_TENANTS},
  {id:'divider',    name:'Section Divider',     label:'Section divider',    desc:'A titled rule that separates sections.',             cat:'Title Blocks', p:'divider',    status:'tenant-only', tenants:['cpm-civil','cpm-infra'], custom:true},
  {id:'paragraph',  name:'Paragraph',           label:'Paragraph',          desc:'A block of body text.',                              cat:'Text Blocks',  p:'paragraph',  status:'standard',    tenants:ALL_TENANTS},
  {id:'double',     name:'Double Paragraph',    label:'Two columns of text',desc:'Body text in two side-by-side columns.',             cat:'Text Blocks',  p:'double',     status:'standard',    tenants:ALL_TENANTS},
  {id:'headpara',   name:'Heading & Paragraph', label:'Heading beside text',desc:'A heading on the left with body text on the right.', cat:'Text Blocks',  p:'headpara',   status:'standard',    tenants:ALL_TENANTS},
  {id:'parahead',   name:'Paragraph & Heading', label:'Text beside heading',desc:'Body text on the left with a heading on the right.', cat:'Text Blocks',  p:'parahead',   status:'standard',    tenants:ALL_TENANTS},
  {id:'quote',      name:'Pull Quote',          label:'Quote',              desc:'A highlighted quote or testimonial.',                cat:'Text Blocks',  p:'quote',      status:'standard',    tenants:ALL_TENANTS},
  {id:'list',       name:'Bulleted List',       label:'Bulleted list',      desc:'A list of short points.',                            cat:'Text Blocks',  p:'list',       status:'standard',    tenants:ALL_TENANTS},
  {id:'callout',    name:'Branded Callout',     label:'Highlight box',      desc:'A coloured box that draws attention to key text.',   cat:'Text Blocks',  p:'callout',    status:'tenant-only', tenants:['taylor','cpm-civil'], custom:true},
  {id:'img1',       name:'Single Image',        label:'One image',          desc:'A single full-width image.',                         cat:'Images',       p:'img1',       status:'standard',    tenants:ALL_TENANTS},
  {id:'img2',       name:'Double Images',       label:'Two images',         desc:'Two images side by side.',                           cat:'Images',       p:'img2',       status:'standard',    tenants:ALL_TENANTS},
  {id:'img3',       name:'Triple Images',       label:'Three images',       desc:'Three images in a row.',                             cat:'Images',       p:'img3',       status:'standard',    tenants:ALL_TENANTS},
  {id:'imggrid',    name:'Image Grid',          label:'Image grid',         desc:'A four-image grid.',                                 cat:'Images',       p:'imggrid',    status:'standard',    tenants:ALL_TENANTS},
  {id:'banner',     name:'Logo Banner',         label:'Logo banner',        desc:'A full-width banner carrying the company logo.',     cat:'Images',       p:'banner',     status:'to-retire',   tenants:['acme'], custom:true},
  {id:'imgtext',    name:'Image & Text',        label:'Image with text',    desc:'An image on the left, text on the right.',           cat:'Image & Text', p:'imgtext',    status:'standard',    tenants:ALL_TENANTS},
  {id:'textimg',    name:'Text & Image',        label:'Text with image',    desc:'Text on the left, an image on the right.',           cat:'Image & Text', p:'textimg',    status:'standard',    tenants:ALL_TENANTS},
  {id:'imgcap',     name:'Image + Caption',     label:'Image with caption', desc:'An image with a caption underneath.',                cat:'Image & Text', p:'imgcap',     status:'standard',    tenants:ALL_TENANTS},
  {id:'feature',    name:'Two-Column Feature',  label:'Feature panel',      desc:'An image beside a headline and supporting text.',    cat:'Image & Text', p:'feature',    status:'tenant-only', tenants:['taylor','hansen','civic'], custom:true},
  // Named explicitly in the 20 Jul scrum as bespoke-per-tenant and missing from the standard set.
  {id:'table',      name:'Table',               label:'Table',              desc:'Rows and columns for rates, schedules or comparisons.',cat:'Tables & Sign-off', p:'table',     status:'tenant-only', tenants:['cpm-civil','cpm-infra','taylor']},
  {id:'signature',  name:'Signature Block',     label:'Signature',          desc:'A sign-off area with name, role and date.',          cat:'Tables & Sign-off', p:'signature', status:'tenant-only', tenants:['cpm-civil','hansen']},
];
const BLOCK_CATS = ['Title Blocks','Text Blocks','Images','Image & Text','Tables & Sign-off'];

const isStandard = b => b.status === 'standard';
const coverage = b => b.tenants ? b.tenants.length : 0;

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
    case 'table':     return `<div class="blk-table">${['h','','',''].map(r=>`<div class="tr ${r}"><span></span><span></span><span></span></div>`).join('')}</div>`;
    case 'signature': return `${bar('55%')}<div style="height:1px;background:#9FB5B0;margin:14px 0 7px"></div>${bar('40%',1)}${bar('30%')}`;
    default:          return bar('80%');
  }
}
if(typeof window!=='undefined'){
  window.BLOCKS=BLOCKS; window.BLOCK_CATS=BLOCK_CATS; window.ALL_TENANTS=ALL_TENANTS;
  window.blockPreview=blockPreview; window.isStandard=isStandard; window.coverage=coverage;
}
