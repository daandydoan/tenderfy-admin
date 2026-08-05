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
  signature:[{cols:[['signature']]}], catalogue:[{cols:[['image'],['subheading','paragraph']]}],
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

// Render a real preview of a block (rows -> columns -> primitives) in a brand.
function composeBlock(block, brand){
  if(/^l[hf]-/.test(block.p)) return renderStationery(block.p, brand);
  const doc = P2DOC[block.p] || [{cols:[[block.p]]}];
  return doc.map(row=>{
    if(row.cols.length>1){
      const cols = row.cols.map(col=>`<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:11px">${col.map(id=>renderPrimitive(id, brand)).join('')}</div>`).join('');
      return `<div style="display:flex;gap:24px;margin-bottom:18px">${cols}</div>`;
    }
    return `<div style="display:flex;flex-direction:column;gap:11px;margin-bottom:18px">${row.cols[0].map(id=>renderPrimitive(id, brand)).join('')}</div>`;
  }).join('');
}

// The distinct primitives a block is composed from (for a "made of" summary).
function blockElements(block){
  const doc = P2DOC[block.p] || [];
  const seen=[];
  doc.forEach(row=>row.cols.forEach(col=>col.forEach(id=>{ if(!seen.includes(id)) seen.push(id); })));
  return seen;
}

if(typeof window!=='undefined'){ window.P2DOC=P2DOC; window.composeBlock=composeBlock; window.blockElements=blockElements; window.renderStationery=renderStationery; }
