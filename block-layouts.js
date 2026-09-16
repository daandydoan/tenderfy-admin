// Shared block layouts — maps a block's layout key (block.p) to its row/column
// composition of primitives. Used by the block editor (prefill) and the block
// view (render a real preview). Requires primitives.js for composeBlock().
const P2DOC={
  heading:[{cols:[['heading']]}], subheading:[{cols:[['subheading']]}],
  divider:[{cols:[['heading','divider','paragraph']]}], paragraph:[{cols:[['paragraph']]}],
  double:[{cols:[['paragraph'],['paragraph']]}], headpara:[{cols:[['subheading'],['paragraph']]}],
  parahead:[{cols:[['paragraph'],['subheading']]}], quote:[{cols:[['quote']]}], list:[{cols:[['list']]}],
  callout:[{cols:[['callout']]}], docdetails:[{cols:[['subheading'],['keyvalue']]}],
  docpara:[{cols:[['subheading'],['paragraph']]}], docdblpara:[{cols:[['subheading'],['paragraph'],['paragraph']]}],
  img1:[{cols:[['image']]}], img2:[{cols:[['image'],['image']]}], img3:[{cols:[['image'],['image'],['image']]}],
  imggrid:[{cols:[['image'],['image']]},{cols:[['image'],['image']]}], imgtext:[{cols:[['image'],['paragraph']]}],
  textimg:[{cols:[['paragraph'],['image']]}], imgcap:[{cols:[['image','subheading']]}],
  feature:[{cols:[['image'],['heading','paragraph']]}], table:[{cols:[['table']]}],
  itemprice:[{cols:[['subheading'],['table']]}], totalprice:[{cols:[['keyvalue']]}],
  signature:[{cols:[['signature']]}], catalogue:[{cols:[['image'],['subheading','paragraph']]}],
  sig1:[{cols:[['signature']]}], sig2:[{cols:[['signature'],['signature']]}],
  tcircimgs:[{cols:[['image'],['paragraph']]}], tcircimg:[{cols:[['paragraph'],['image']]}],
  // Headers & Footers default to a 2-column band (edited in the block editor).
  'lh-brand':[{cols:[['image','heading'],['paragraph']]}], 'lh-contact':[{cols:[['heading'],['paragraph']]}],
  'lh-min':[{cols:[['image'],['heading']]}], 'lf-page':[{cols:[['paragraph'],['paragraph']]}],
  'lf-legal':[{cols:[['paragraph'],['paragraph']]}], 'lf-contact':[{cols:[['paragraph'],['paragraph']]}],
};

// Letterhead / footer bands (the document's Top Layer) — rendered bespoke and
// brand-aware, since they are page furniture rather than body primitives.
function renderStationery(p, b){
  b = b || {primary:'#27535C', secondary:'#38988A', font:'Outfit', bodyFont:'Outfit'};
  const H=`font-family:'${b.font}',sans-serif`, T=`font-family:'${b.bodyFont}',sans-serif`;
  switch(p){
    case 'lh-brand':
      return `<div style="${H};display:flex;align-items:center;gap:11px;border-bottom:3px solid ${b.secondary};padding-bottom:11px"><div style="width:30px;height:30px;border-radius:7px;background:${b.primary};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px">M</div><div style="font-size:16px;font-weight:700;color:${b.primary}">Meridian Civil</div></div>`;
    case 'lh-contact':
      return `<div style="display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1px solid ${b.secondary}66;padding-bottom:10px"><div style="${H};font-size:16px;font-weight:700;color:${b.primary}">Meridian Civil</div><div style="${T};font-size:10.5px;color:#7A8583;text-align:right;line-height:1.5">1300 000 000 · meridiancivil.au<br>Level 3, 210 Grey St, Brisbane QLD</div></div>`;
    case 'lh-min':
      return `<div style="display:flex;align-items:center;gap:8px;border-bottom:1px solid ${b.secondary}55;padding-bottom:8px"><div style="width:18px;height:18px;border-radius:5px;background:${b.primary}"></div><span style="${H};font-size:12px;font-weight:600;color:${b.primary};letter-spacing:.6px">MERIDIAN CIVIL</span></div>`;
    case 'lf-page':
      return `<div style="${T};display:flex;align-items:center;justify-content:space-between;border-top:1px solid ${b.secondary}66;padding-top:9px;font-size:10.5px;color:#7A8583"><span>Meridian Civil · Kingsford Smith Drive Upgrade</span><span>Page 1 of 12</span></div>`;
    case 'lf-legal':
      return `<div style="${T};border-top:1px solid ${b.secondary}44;padding-top:9px;font-size:9.5px;color:#8A938F;text-align:center;line-height:1.5">Commercial-in-confidence — this document and its contents are the property of Meridian Civil Pty Ltd and may not be reproduced without written consent.</div>`;
    case 'lf-contact':
      return `<div style="${T};display:flex;justify-content:space-between;gap:10px;border-top:2px solid ${b.secondary};padding-top:9px;font-size:10.5px;color:#7A8583"><span>Level 3, 210 Grey St, Brisbane QLD</span><span>1300 000 000</span><span>meridiancivil.au</span></div>`;
    default: return '';
  }
}

// ---- Element style (el.st) -> CSS. Shared by the block builder canvas and this renderer so they can't drift. ----
function boxCss(s,key){ if(!s)return '0px'; if(s[key+'Sides']) return `${s[key+'T']||0}px ${s[key+'R']||0}px ${s[key+'B']||0}px ${s[key+'L']||0}px`; const h=(s[key+'H']!=null)?s[key+'H']:(s[key]||0), v=(s[key+'V']!=null)?s[key+'V']:(s[key]||0); return `${v}px ${h}px`; }
function radCss(s){ if(s&&s.radSides) return `${s.radTL||0}px ${s.radTR||0}px ${s.radBR||0}px ${s.radBL||0}px`; return `${(s&&s.rad)||0}px`; }
const radAny=s=>!!s&&(s.radSides?(s.radTL||s.radTR||s.radBR||s.radBL):s.rad>0);
function paintCss(hex,a){ if(a==null||a>=100||!hex) return hex||''; a=Math.max(0,Math.min(100,a))/100; let h=String(hex).replace('#',''); if(h.length===3) h=h.split('').map(c=>c+c).join(''); const n=parseInt(h,16); if(isNaN(n)) return hex; return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`; }
// A stroke with no weight isn't a stroke — older elements carry a default colour with bw:0.
const paintOn=(t,key)=> (key==='bcolor' && !(t.bw>0)) ? false : (!!(t[key]&&t[key]!=='') || !!(t[key+'Bind']&&t[key+'Bind']!=='none'));
const paintVisible=(t,key)=> paintOn(t,key) && t[key+'Vis']!==false;
const roleOr=(brand,key)=> (typeof roleValue==='function') ? roleValue(brand,key) : '';
function resolveFill(st, brand){ const bd=st.bgBind; if(!bd) return (st.bg&&st.bg!=='transparent')?st.bg:''; if(bd==='none') return ''; return roleOr(brand, bd); }
function resolveBColor(st, brand){ const bd=st.bcolorBind; if(!bd) return st.bcolor; return roleOr(brand, bd); }
// Three style maps: the element's outer box (sizing), its body (paint/spacing) and typography for its text nodes.
function elStyle(st, brand){
  st=st||{}; const ewm=st.wmode||'fill', ehm=st.hmode||'fill', HM={left:'flex-start',center:'center',right:'flex-end'};
  const box={ flex:'0 0 auto' };
  if(ewm==='fixed') box.width=(st.wpx||0)+'px'; if(ewm==='min') box.minWidth=(st.wpx||0)+'px'; if(ewm==='max') box.maxWidth=(st.wpx||0)+'px';
  if(ewm==='fixed'||ewm==='max') box.alignSelf=HM[st.alH||'left'];
  const body={};
  if(ehm==='fixed') body.height=(st.hpx||0)+'px'; if(ehm==='max') body.maxHeight=(st.hpx||0)+'px';
  const pad=boxCss(st,'pad'), mar=boxCss(st,'mar'); if(pad!=='0px 0px'&&pad!=='0px') body.padding=pad; if(mar!=='0px 0px'&&mar!=='0px') body.margin=mar;
  if(paintVisible(st,'bg')){ const bg=paintCss(resolveFill(st,brand), st.bgA); if(bg) body.background=bg; }
  if(radAny(st)) body.borderRadius=radCss(st);
  const ov = ehm==='fixed' ? 'hidden' : (ehm==='max' ? 'auto' : (radAny(st)?'hidden':'')); if(ov) body.overflow=ov;
  if(paintVisible(st,'bcolor') && st.bw>0){ const col=paintCss(resolveBColor(st,brand), st.bcolorA); if(st.bpos==='inside') body.boxShadow=`inset 0 0 0 ${st.bw}px ${col}`; else body.border=`${st.bw}px ${st.bstyle||'solid'} ${col}`; }
  if(st.align) body.textAlign=st.align;
  const typo={};
  if(st.font) typo.fontFamily=`'${st.font}',sans-serif`; if(st.weight) typo.fontWeight=st.weight;
  if(st.size) typo.fontSize=st.size+'px'; if(st.lh) typo.lineHeight=st.lh+'px'; if(st.ls) typo.letterSpacing=st.ls+'px'; if(st.color) typo.color=st.color;
  return {box, body, typo};
}
const TYPO_SEL='h1,h2,h3,h4,h5,p,li,span,a,blockquote,strong,em,td,th,ul,div';
const cssStr=o=>Object.entries(o).map(([k,v])=>k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+':'+v).join(';');
// One element as the document sees it: sizing box > body > primitive, typography pushed onto the text nodes (primitives set inline colours, so inheritance isn't enough).
function renderStyledEl(el, brand, ref){
  const html=renderPrimitive(el.id||el, brand, el.content); const st=el.st; const tag=ref?` data-el="${ref}" data-elid="${el.id||el}"`:''; if(!st) return `<div${tag}>${html}</div>`;
  const {box,body,typo}=elStyle(st, brand);
  let inner=html;
  if(Object.keys(typo).length && typeof document!=='undefined'){ const tpl=document.createElement('template'); tpl.innerHTML=html; tpl.content.querySelectorAll(TYPO_SEL).forEach(n=>Object.assign(n.style,typo)); inner=tpl.innerHTML; }
  return `<div${tag} style="${cssStr(box)}"><div style="${cssStr(Object.assign({},typo,body))}">${inner}</div></div>`;
}
const isSized=el=>{ const s=el&&el.st; return !!s && ['fixed','min','max'].includes(s.wmode||'fill'); };

// Render a real preview of a block (rows -> columns -> primitives) in a brand.
function composeBlock(block, brand){
  if(/^l[hf]-/.test(block.p)) return renderStationery(block.p, brand);
  const doc = P2DOC[block.p] || [{cols:[[block.p]]}];
  const rowHtml=(row,r)=>{
    if(row.cols.length>1){
      const VJ={top:'flex-start',middle:'center',bottom:'flex-end'};
      // A column holding a Fixed/Min/Max-width element sizes to it; the others fill the rest (same rule as the canvas).
      const cols = row.cols.map((col,i)=>`<div style="flex:${col.some(isSized)?'0 1 auto':((row.ratio&&row.ratio[i])||1)};min-width:0;display:flex;flex-direction:column;gap:11px;justify-content:${VJ[(row.valign||[])[i]]||'flex-start'}">${col.map((el,k)=>renderStyledEl(el, brand, r+'.'+i+'.'+k)).join('')}</div>`).join('');
      return `<div style="display:flex;gap:24px;margin-bottom:18px">${cols}</div>`;
    }
    return `<div style="display:flex;flex-direction:column;gap:11px;margin-bottom:18px">${row.cols[0].map((el,k)=>renderStyledEl(el, brand, r+'.0.'+k)).join('')}</div>`;
  };
  // ponytail: a repeating row renders twice as a stand-in for "one per item" until the estimator side can add items.
  return doc.map((row,r)=>{ const h=rowHtml(row,r); if(!row.repeat) return h; return row.repeat==='h' ? `<div style="display:flex;gap:24px;margin-bottom:18px">${[h,h].map(x=>'<div style="flex:1;min-width:0">'+x.replace('margin-bottom:18px','margin-bottom:0')+'</div>').join('')}</div>` : h+h; }).join('');
}

// A deep, normalised copy of a block's doc — what a document keeps when it edits a block's words locally.
function blockDocCopy(block){ const doc=P2DOC[block.p]||[{cols:[[block.p]]}]; return JSON.parse(JSON.stringify(doc)).map(row=>({...row, cols:row.cols.map(col=>col.map(x=>typeof x==='string'?{id:x}:x))})); }

// The distinct primitives a block is composed from (for a "made of" summary).
function blockElements(block){
  const doc = P2DOC[block.p] || [];
  const seen=[];
  doc.forEach(row=>row.cols.forEach(col=>col.forEach(el=>{ const id=el.id||el; if(!seen.includes(id)) seen.push(id); })));
  return seen;
}

if(typeof mergeCustomBlocks==='function') mergeCustomBlocks();   // blocks-data.js may have loaded first
if(typeof window!=='undefined'){ window.P2DOC=P2DOC; window.composeBlock=composeBlock; window.blockDocCopy=blockDocCopy; Object.assign(window,{boxCss,radCss,radAny,paintCss,paintOn,paintVisible,resolveFill,resolveBColor,elStyle,TYPO_SEL}); window.blockElements=blockElements; window.renderStationery=renderStationery; }
