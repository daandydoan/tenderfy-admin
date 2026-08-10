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
  {id:'field',      name:'Merge field',   tag:'Data',    desc:'A dynamic value from the client or project.'},
  {id:'callout',    name:'Callout',       tag:'Text',    desc:'A highlighted box for key text.'},
  {id:'stat',       name:'Stat',          tag:'Data',    desc:'A metric — a big number with a label.'},
  {id:'button',     name:'Button',        tag:'Layout',  desc:'A call-to-action button.'},
  {id:'cover',      name:'Cover title',   tag:'Layout',  desc:'A branded cover heading band.'},
  {id:'toc',        name:'Contents',      tag:'Data',    desc:'A table of contents list.'},
  {id:'pagebreak',  name:'Page break',    tag:'Layout',  desc:'Forces a new page in the PDF.'},
];
// Element categories, in palette order.
const PRIM_TAGS = ['Text','Media','Data','Sign-off','Layout'];
// Icon per element — shared by the block editor and the document editor palettes.
const PRIM_ICON={heading:'title',subheading:'subtitles',paragraph:'notes',list:'format_list_bulleted',quote:'format_quote',image:'image',table:'table_chart',keyvalue:'list_alt',signature:'draw',divider:'horizontal_rule',spacer:'height',field:'data_object',callout:'campaign',stat:'trending_up',button:'smart_button',cover:'title',toc:'toc',pagebreak:'insert_page_break'};

// Render a primitive with real sample content, styled by the brand tokens.
// b = { primary, secondary, background, font, bodyFont }
// renderPrimitive(id, brand, content?) — content lets a document supply its own
// text/rows so each document reads distinctly (else a realistic default is used).
function renderPrimitive(id, b, c){
  b = b || {primary:'#27535C', secondary:'#38988A', background:'#F7F9F8', font:'Outfit', bodyFont:'Outfit'};
  c = c || {};
  const H = `font-family:'${b.font}',sans-serif`;
  const T = `font-family:'${b.bodyFont}',sans-serif`;
  const soft = '#3A4442';
  const esc = v => (v==null?'':String(v));
  switch(id){
    case 'heading':
      return `<h3 style="${H};margin:0;color:${b.primary};font-size:20px;font-weight:700;border-bottom:2px solid ${b.secondary};padding-bottom:6px">${esc(c.title||'Project Overview')}</h3>`;
    case 'subheading':
      return `<h4 style="${H};margin:0;color:${b.primary};font-size:15px;font-weight:600">${esc(c.title||'Scope of works')}</h4>`;
    case 'paragraph':
      return `<p style="${T};margin:0;color:${soft};font-size:13px;line-height:1.6">${esc(c.body||'Our team delivered the full civil works package on time and on budget — coordinating traffic management, bulk earthworks and drainage across a live site.')}</p>`;
    case 'list':{
      const items = c.items || ['Traffic management plan','Bulk earthworks & drainage','Reinstatement & handover'];
      return `<ul style="${T};margin:0;padding-left:18px;color:${soft};font-size:13px;line-height:1.7">${items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`;
    }
    case 'quote':
      return `<blockquote style="${T};margin:0;border-left:3px solid ${b.secondary};padding:2px 0 2px 14px;color:${b.primary};font-style:italic;font-size:13.5px">"${esc(c.body||'Delivered ahead of schedule with zero safety incidents.')}"</blockquote>`;
    case 'image':
      return `<div style="height:118px;background:${b.secondary}1f;border:1px solid ${b.secondary}55;border-radius:8px;display:flex;align-items:center;justify-content:center;color:${b.secondary}"><span class="ms" style="font-size:34px">${esc(c.icon||'image')}</span></div>`;
    case 'table':{
      const headers = c.headers || ['Item','Qty','Rate'];
      const rows = c.rows || [['Traffic management','1','$8,400'],['Earthworks','320 m³','$46/m³'],['Drainage','1','$21,750']];
      return `<table style="${T};width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:${b.primary};color:#fff">${headers.map((h,i)=>`<th style="text-align:${i?'right':'left'};padding:6px 10px;font-weight:600">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r=>`<tr style="border-bottom:1px solid #E6EAE9;color:${soft}">${r.map((cell,i)=>`<td style="padding:6px 10px;text-align:${i?'right':'left'}">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    case 'keyvalue':{
      const pairs = c.pairs || [['Client','Department of Transport'],['Value','$553,560'],['Sector','Civil / Roads'],['Duration','18 weeks']];
      return `<div style="${T}">${pairs.map(kv=>`<div style="display:flex;gap:12px;padding:5px 0;border-bottom:1px solid #EEF1F0;font-size:12.5px"><span style="color:#7A8583;width:120px;flex-shrink:0">${esc(kv[0])}</span><span style="color:${soft};font-weight:600">${esc(kv[1])}</span></div>`).join('')}</div>`;
    }
    case 'signature':
      return `<div style="${T}"><div style="border-bottom:1px solid #9AA5A3;width:64%;height:24px;margin-bottom:7px"></div><div style="font-size:12.5px;color:${soft}"><strong style="color:${b.primary}">${esc(c.name||'Kenzie May')}</strong> · ${esc(c.role||'Project Director')}</div><div style="font-size:11.5px;color:#8A938F;margin-top:1px">Date: ${esc(c.date||'30 Jul 2026')}</div></div>`;
    case 'divider':
      return `<hr style="border:none;border-top:1px solid ${b.secondary}66;margin:0">`;
    case 'spacer':
      return `<div style="height:26px;border:1px dashed var(--lighter);border-radius:5px;display:flex;align-items:center;justify-content:center;color:var(--light);font-size:11px;letter-spacing:.3px">spacing</div>`;
    case 'field':
      return `<span style="${T};background:${b.secondary}1f;color:${b.primary};border:1px solid ${b.secondary}55;border-radius:5px;padding:1px 8px;font-size:12.5px;font-weight:600">{{ ${esc(c.field||'Client name')} }}</span>`;
    case 'callout':
      return `<div style="${T};background:${b.secondary}1f;border:1px solid ${b.secondary}55;border-left:4px solid ${b.secondary};border-radius:8px;padding:12px 14px;color:${soft};font-size:13px;line-height:1.55"><strong style="color:${b.primary}">${esc(c.label||'Note')}</strong> — ${esc(c.body||'key information the reader should not miss.')}</div>`;
    case 'stat':
      return `<div style="${T}"><div style="${H};color:${b.primary};font-size:30px;font-weight:700;line-height:1">${esc(c.value||'98%')}</div><div style="color:#7A8583;font-size:12px;margin-top:2px">${esc(c.label||'On-time completion')}</div></div>`;
    case 'button':
      return `<a style="${T};display:inline-block;background:${b.primary};color:#fff;font-size:13px;font-weight:600;padding:9px 18px;border-radius:7px;text-decoration:none">${esc(c.label||'View full submission')}</a>`;
    case 'cover':
      return `<div style="${H};background:${b.primary};color:#fff;border-radius:8px;padding:38px 34px 32px">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${b.secondary};font-weight:600">${esc(c.kicker||'Tender Response')}</div>
        <div style="font-size:30px;font-weight:700;margin-top:12px;line-height:1.12">${esc(c.title||'Project Overview')}</div>
        <div style="width:56px;height:4px;background:${b.secondary};margin:18px 0"></div>
        <div style="font-size:12.5px;opacity:.85">${esc(c.meta||'Prepared for the client · Submission')}</div>
      </div>`;
    case 'toc':{
      const rows = c.rows || [['1. Executive summary','2'],['2. Company profile','4'],['3. Methodology','7'],['4. Pricing','12']];
      return `<div style="${T};font-size:13px;color:${soft}">${rows.map(r=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dotted #cfd6d4"><span>${esc(r[0])}</span><span style="color:#7A8583">${esc(r[1])}</span></div>`).join('')}</div>`;
    }
    case 'pagebreak':
      return `<div style="${T};display:flex;align-items:center;gap:10px;color:#9aa5a3;font-size:11px;text-transform:uppercase;letter-spacing:.4px"><span style="flex:1;border-top:1.5px dashed #c2ccc9"></span>Page break<span style="flex:1;border-top:1.5px dashed #c2ccc9"></span></div>`;
    default:
      return '';
  }
}
if(typeof window!=='undefined'){ window.PRIMITIVES=PRIMITIVES; window.PRIM_TAGS=PRIM_TAGS; window.PRIM_ICON=PRIM_ICON; window.renderPrimitive=renderPrimitive; }
