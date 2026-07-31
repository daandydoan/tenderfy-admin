// Primitives — the atomic elements every block is built from. These are the ONLY
// things coded once; blocks are just primitives arranged in a layout, and brand is
// applied as tokens. So a new block needs no new code — just a new arrangement.
const PRIMITIVES = [
  {id:'heading',    name:'Heading',       tag:'Text',    desc:'A section heading.'},
  {id:'subheading', name:'Sub-heading',   tag:'Text',    desc:'A smaller heading.'},
  {id:'paragraph',  name:'Paragraph',     tag:'Text',    desc:'A block of body copy.'},
  {id:'list',       name:'Bulleted list', tag:'Text',    desc:'A list of points.'},
  {id:'quote',      name:'Quote',         tag:'Text',    desc:'A highlighted quote.'},
  {id:'image',      name:'Image',         tag:'Media',   desc:'A single image slot.'},
  {id:'table',      name:'Table',         tag:'Data',    desc:'Rows and columns of data.'},
  {id:'keyvalue',   name:'Key / Value',   tag:'Data',    desc:'A label and its value.'},
  {id:'signature',  name:'Signature',     tag:'Sign-off',desc:'A sign-off area.'},
  {id:'divider',    name:'Divider',       tag:'Layout',  desc:'A horizontal rule.'},
  {id:'spacer',     name:'Spacer',        tag:'Layout',  desc:'Vertical spacing.'},
];

// Render a primitive with real sample content, styled by the brand tokens.
// b = { primary, secondary, background, font, bodyFont }
function renderPrimitive(id, b){
  b = b || {primary:'#27535C', secondary:'#38988A', background:'#F7F9F8', font:'Outfit', bodyFont:'Outfit'};
  const H = `font-family:'${b.font}',sans-serif`;
  const T = `font-family:'${b.bodyFont}',sans-serif`;
  const soft = '#3A4442';
  switch(id){
    case 'heading':
      return `<h3 style="${H};margin:0;color:${b.primary};font-size:20px;font-weight:700;border-bottom:2px solid ${b.secondary};padding-bottom:6px">Project Overview</h3>`;
    case 'subheading':
      return `<h4 style="${H};margin:0;color:${b.primary};font-size:15px;font-weight:600">Scope of works</h4>`;
    case 'paragraph':
      return `<p style="${T};margin:0;color:${soft};font-size:13px;line-height:1.6">Our team delivered the full civil works package on time and on budget — coordinating traffic management, bulk earthworks and drainage across a live site.</p>`;
    case 'list':
      return `<ul style="${T};margin:0;padding-left:18px;color:${soft};font-size:13px;line-height:1.7"><li>Traffic management plan</li><li>Bulk earthworks &amp; drainage</li><li>Reinstatement &amp; handover</li></ul>`;
    case 'quote':
      return `<blockquote style="${T};margin:0;border-left:3px solid ${b.secondary};padding:2px 0 2px 14px;color:${b.primary};font-style:italic;font-size:13.5px">"Delivered ahead of schedule with zero safety incidents."</blockquote>`;
    case 'image':
      return `<div style="height:118px;background:${b.secondary}1f;border:1px solid ${b.secondary}55;border-radius:8px;display:flex;align-items:center;justify-content:center;color:${b.secondary}"><span class="ms" style="font-size:34px">image</span></div>`;
    case 'table':
      return `<table style="${T};width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:${b.primary};color:#fff"><th style="text-align:left;padding:6px 10px;font-weight:600">Item</th><th style="text-align:right;padding:6px 10px;font-weight:600">Qty</th><th style="text-align:right;padding:6px 10px;font-weight:600">Rate</th></tr></thead>
        <tbody>
          ${[['Traffic management','1','$8,400'],['Earthworks','320 m³','$46/m³'],['Drainage','1','$21,750']].map(r=>`<tr style="border-bottom:1px solid #E6EAE9;color:${soft}"><td style="padding:6px 10px">${r[0]}</td><td style="padding:6px 10px;text-align:right">${r[1]}</td><td style="padding:6px 10px;text-align:right">${r[2]}</td></tr>`).join('')}
        </tbody></table>`;
    case 'keyvalue':
      return `<div style="${T}">${[['Client','Dept of Transport'],['Value','$1.2M'],['Sector','Civil / Roads'],['Duration','14 weeks']].map(kv=>`<div style="display:flex;gap:12px;padding:5px 0;border-bottom:1px solid #EEF1F0;font-size:12.5px"><span style="color:#7A8583;width:96px;flex-shrink:0">${kv[0]}</span><span style="color:${soft};font-weight:600">${kv[1]}</span></div>`).join('')}</div>`;
    case 'signature':
      return `<div style="${T}"><div style="border-bottom:1px solid #9AA5A3;width:64%;height:24px;margin-bottom:7px"></div><div style="font-size:12.5px;color:${soft}"><strong style="color:${b.primary}">Kenzie May</strong> · Project Director</div><div style="font-size:11.5px;color:#8A938F;margin-top:1px">Date: 30 Jul 2026</div></div>`;
    case 'divider':
      return `<hr style="border:none;border-top:1px solid ${b.secondary}66;margin:0">`;
    case 'spacer':
      return `<div style="height:26px;border:1px dashed var(--lighter);border-radius:5px;display:flex;align-items:center;justify-content:center;color:var(--light);font-size:11px;letter-spacing:.3px">spacing</div>`;
    default:
      return '';
  }
}
if(typeof window!=='undefined'){ window.PRIMITIVES=PRIMITIVES; window.renderPrimitive=renderPrimitive; }
