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
};

// Render a real preview of a block (rows -> columns -> primitives) in a brand.
function composeBlock(block, brand){
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

if(typeof window!=='undefined'){ window.P2DOC=P2DOC; window.composeBlock=composeBlock; window.blockElements=blockElements; }
