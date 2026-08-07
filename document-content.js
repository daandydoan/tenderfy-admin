// Functional document mockups — a handful of Tenderfy library documents built out
// with real, brand-aware content so the document view renders a true A4 page
// (not just a schematic). Each entry is (brand) => inner HTML for the A4 sheet.
//
// brand = { primary, secondary, background, font, bodyFont }. Documents are
// brand-neutral by default; the client's brand tokens are layered on when a
// preview style is chosen. Docs without a bespoke mock fall back to a
// primitive-composed page via renderDocument().

const DOC_BRAND_DEFAULT = {primary:'#27535C', secondary:'#38988A', background:'#F7F9F8', font:'Outfit', bodyFont:'Outfit'};

const DOC_CONTENT = {
  // ---------- Cover Page ----------
  cover(b){
    const H=`font-family:'${b.font}',sans-serif`;
    return `<div style="${H};min-height:877px;display:flex;flex-direction:column">
      <div style="background:${b.primary};color:#fff;padding:60px 54px 52px;flex:1;display:flex;flex-direction:column">
        <div style="display:flex;align-items:center;gap:11px">
          <div style="width:38px;height:38px;border-radius:9px;background:${b.secondary};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px">M</div>
          <div style="font-size:15px;font-weight:600;letter-spacing:.2px">Meridian Civil</div>
        </div>
        <div style="margin-top:auto">
          <div style="font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:${b.secondary};font-weight:600">Tender Response</div>
          <div style="font-size:40px;font-weight:700;line-height:1.1;margin-top:14px">Kingsford Smith Drive<br>Intersection Upgrade</div>
          <div style="width:64px;height:4px;background:${b.secondary};margin:24px 0"></div>
          <div style="font-size:15px;opacity:.85">Prepared for the <strong>Department of Transport</strong></div>
        </div>
      </div>
      <div style="padding:26px 54px;display:flex;justify-content:space-between;font-size:12.5px;color:#5a6a67;background:#fff">
        <div><div style="color:#9aa5a3;font-size:11px;text-transform:uppercase;letter-spacing:.4px">Reference</div><div style="font-weight:600;color:#2b3a37;margin-top:3px">RFT-2026-0418</div></div>
        <div><div style="color:#9aa5a3;font-size:11px;text-transform:uppercase;letter-spacing:.4px">Submission date</div><div style="font-weight:600;color:#2b3a37;margin-top:3px">14 August 2026</div></div>
        <div><div style="color:#9aa5a3;font-size:11px;text-transform:uppercase;letter-spacing:.4px">Contact</div><div style="font-weight:600;color:#2b3a37;margin-top:3px">tenders@meridiancivil.au</div></div>
      </div>
    </div>`;
  },

  // CV / Resume documents render via the shared renderResume() (resume-render.js),
  // driven by each doc's saved layout config — see renderDocument() below.

  // ---------- Schedule of Rates ----------
  'rate-table'(b){
    const H=`font-family:'${b.font}',sans-serif`, T=`font-family:'${b.bodyFont}',sans-serif`, soft='#3A4442';
    const rows=[
      ['1.1','Site establishment &amp; mobilisation','item','1','$18,500','$18,500'],
      ['2.1','Traffic management (per week)','week','6','$8,400','$50,400'],
      ['3.1','Bulk earthworks — cut to fill','m³','3,200','$46.00','$147,200'],
      ['3.2','Imported select fill','m³','680','$62.00','$42,160'],
      ['4.1','Stormwater drainage — 450mm RCP','m','340','$385.00','$130,900'],
      ['4.2','Junction pits (type C)','ea','12','$2,150','$25,800'],
      ['5.1','Asphalt wearing course (40mm)','m²','4,100','$28.50','$116,850'],
      ['6.1','Line marking &amp; signage','item','1','$21,750','$21,750'],
    ];
    return `<div style="padding:46px 50px">
      <div style="${H};font-size:22px;font-weight:700;color:${b.primary};border-bottom:2px solid ${b.secondary};padding-bottom:8px">Schedule of Rates</div>
      <div style="${T};font-size:12.5px;color:#7A8583;margin-top:8px">Kingsford Smith Drive Intersection Upgrade · RFT-2026-0418 · All rates exclude GST.</div>
      <table style="${T};width:100%;border-collapse:collapse;font-size:11.5px;margin-top:18px">
        <thead><tr style="background:${b.primary};color:#fff">
          <th style="text-align:left;padding:8px 9px;font-weight:600">Item</th>
          <th style="text-align:left;padding:8px 9px;font-weight:600">Description</th>
          <th style="text-align:center;padding:8px 9px;font-weight:600">Unit</th>
          <th style="text-align:right;padding:8px 9px;font-weight:600">Qty</th>
          <th style="text-align:right;padding:8px 9px;font-weight:600">Rate</th>
          <th style="text-align:right;padding:8px 9px;font-weight:600">Amount</th>
        </tr></thead>
        <tbody>
          ${rows.map((r,i)=>`<tr style="border-bottom:1px solid #E6EAE9;color:${soft};background:${i%2?'#F7F9F8':'#fff'}">
            <td style="padding:7px 9px">${r[0]}</td><td style="padding:7px 9px">${r[1]}</td>
            <td style="padding:7px 9px;text-align:center">${r[2]}</td><td style="padding:7px 9px;text-align:right">${r[3]}</td>
            <td style="padding:7px 9px;text-align:right">${r[4]}</td><td style="padding:7px 9px;text-align:right;font-weight:600">${r[5]}</td></tr>`).join('')}
        </tbody>
        <tfoot><tr style="border-top:2px solid ${b.primary};color:${b.primary}">
          <td colspan="5" style="padding:10px 9px;text-align:right;font-weight:700;${H}">Total (ex GST)</td>
          <td style="padding:10px 9px;text-align:right;font-weight:700;font-size:13px;${H}">$553,560</td>
        </tr></tfoot>
      </table>
      <div style="${T};font-size:11.5px;color:#8A938F;margin-top:14px;line-height:1.5">Rates are fixed for 90 days from submission. Quantities are provisional and subject to remeasurement on completion.</div>
    </div>`;
  },

  // ---------- WHS Policy ----------
  'policy-whs'(b){
    const H=`font-family:'${b.font}',sans-serif`, T=`font-family:'${b.bodyFont}',sans-serif`, soft='#3A4442';
    const commit=[
      'Provide and maintain a working environment that is safe and without risks to health.',
      'Consult with workers on matters that affect their health, safety and welfare.',
      'Identify hazards and eliminate or minimise risks so far as is reasonably practicable.',
      'Ensure all workers are trained, competent and appropriately supervised.',
      'Report, investigate and learn from all incidents and near misses.',
    ];
    return `<div style="padding:46px 50px">
      <div style="display:flex;align-items:center;gap:12px;border-bottom:2px solid ${b.secondary};padding-bottom:12px">
        <span class="ms" style="font-size:30px;color:${b.secondary}">health_and_safety</span>
        <div><div style="${H};font-size:22px;font-weight:700;color:${b.primary}">Work Health &amp; Safety Policy</div>
        <div style="${T};font-size:12px;color:#7A8583;margin-top:2px">Meridian Civil Pty Ltd · Policy WHS-01 · Rev 3.0</div></div>
      </div>
      <div style="${T};margin-top:20px;color:${soft};font-size:13px;line-height:1.65">Meridian Civil is committed to protecting the health, safety and welfare of all workers, subcontractors, visitors and members of the public affected by our operations. We regard safety as a core value — not a competing priority — and hold every level of the business accountable for it.</div>

      <div style="${H};font-size:14px;font-weight:700;color:${b.primary};margin:24px 0 10px">Our commitments</div>
      <div style="${T}">${commit.map(c=>`<div style="display:flex;gap:11px;padding:9px 0;border-bottom:1px solid #EEF1F0;font-size:13px;color:${soft};line-height:1.5"><span class="ms" style="color:${b.secondary};font-size:19px;flex-shrink:0">check_circle</span><span>${c}</span></div>`).join('')}</div>

      <div style="${T};background:${b.secondary}14;border-left:4px solid ${b.secondary};border-radius:8px;padding:14px 16px;margin-top:22px;font-size:12.5px;color:${soft};line-height:1.55">This policy is endorsed by the Managing Director, reviewed annually, and communicated to all workers at induction. Compliance is a condition of engagement for every person on a Meridian Civil site.</div>

      <div style="${T};margin-top:30px;display:flex;gap:60px">
        <div><div style="border-bottom:1px solid #9AA5A3;width:180px;height:26px;margin-bottom:7px"></div><div style="font-size:12.5px;color:${soft}"><strong style="color:${b.primary}">Dana Whitlock</strong> · Managing Director</div></div>
        <div><div style="border-bottom:1px solid #9AA5A3;width:130px;height:26px;margin-bottom:7px"></div><div style="font-size:12.5px;color:${soft}">Date: 1 July 2026</div></div>
      </div>
    </div>`;
  },

  // ---------- Executive Summary ----------
  'exec-summary'(b){
    const H=`font-family:'${b.font}',sans-serif`, T=`font-family:'${b.bodyFont}',sans-serif`, soft='#3A4442';
    const stats=[['$553k','Fixed lump sum'],['18 wk','Delivery programme'],['0','LTIs in 5 years'],['98%','On-time completion']];
    return `<div style="padding:46px 50px">
      <div style="${H};font-size:22px;font-weight:700;color:${b.primary};border-bottom:2px solid ${b.secondary};padding-bottom:8px">Executive Summary</div>
      <div style="${T};margin-top:18px;color:${soft};font-size:13px;line-height:1.7">Meridian Civil is pleased to submit this response for the Kingsford Smith Drive Intersection Upgrade. We are a Queensland-based civil contractor with a fifteen-year record delivering road, drainage and structures packages on live transport corridors — on time, on budget and without compromise to safety.</div>
      <div style="${T};margin-top:12px;color:${soft};font-size:13px;line-height:1.7">Our approach centres on a fully sequenced traffic-staging plan that keeps two lanes open throughout, a self-performing earthworks and drainage crew, and a dedicated project director accountable from award to defects liability.</div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0">
        ${stats.map(s=>`<div style="${T};background:${b.secondary}12;border:1px solid ${b.secondary}33;border-radius:10px;padding:14px 12px"><div style="${H};color:${b.primary};font-size:24px;font-weight:700;line-height:1">${s[0]}</div><div style="color:#7A8583;font-size:11.5px;margin-top:4px">${s[1]}</div></div>`).join('')}
      </div>

      <div style="${T};color:${soft};font-size:13px;line-height:1.7">We have reviewed the full scope and confirm no departures from the specification. Our pricing is fixed for 90 days, and we are ready to mobilise within two weeks of award.</div>
      <div style="${T};background:${b.secondary}14;border-left:4px solid ${b.secondary};border-radius:8px;padding:14px 16px;margin-top:20px;font-size:13px;color:${soft};line-height:1.55"><strong style="color:${b.primary}">In short</strong> — a proven local team, a de-risked traffic plan, and a competitive fixed price backed by a flawless safety record.</div>
    </div>`;
  },

  // ---------- Case Study ----------
  'case-study'(b){
    const H=`font-family:'${b.font}',sans-serif`, T=`font-family:'${b.bodyFont}',sans-serif`, soft='#3A4442';
    const meta=[['Client','Brisbane City Council'],['Value','$2.4M'],['Duration','22 weeks'],['Sector','Roads & Drainage']];
    const sec=(t,body)=>`<div style="${H};font-size:14px;font-weight:700;color:${b.primary};margin:20px 0 8px">${t}</div><div style="${T};color:${soft};font-size:13px;line-height:1.65">${body}</div>`;
    return `<div style="padding:46px 50px">
      <div style="${T};font-size:11.5px;letter-spacing:1.5px;text-transform:uppercase;color:${b.secondary};font-weight:700">Case Study</div>
      <div style="${H};font-size:24px;font-weight:700;color:${b.primary};margin-top:4px">Wynnum Road Corridor Upgrade</div>
      <div style="height:150px;background:${b.secondary}18;border:1px solid ${b.secondary}44;border-radius:10px;display:flex;align-items:center;justify-content:center;color:${b.secondary};margin-top:16px"><span class="ms" style="font-size:44px">image</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px">
        ${meta.map(m=>`<div style="${T}"><div style="color:#9aa5a3;font-size:10.5px;text-transform:uppercase;letter-spacing:.4px">${m[0]}</div><div style="color:${b.primary};font-weight:700;font-size:14px;margin-top:2px">${m[1]}</div></div>`).join('')}
      </div>
      ${sec('The challenge','Upgrade a congested 1.4km arterial while maintaining peak-hour traffic flow and access to 30 businesses — with a fixed council budget and a hard pre-wet-season deadline.')}
      ${sec('Our approach','We staged the works into six zones with night shifts for the critical intersection, self-performed all drainage to control the programme, and ran weekly stakeholder briefings with affected businesses.')}
      ${sec('The result','Delivered two weeks early and 4% under budget, with zero lost-time injuries and a 98% positive stakeholder survey. The corridor now carries 22,000 vehicles a day with no recorded flooding events.')}
      <blockquote style="${T};margin:22px 0 0;border-left:3px solid ${b.secondary};padding:6px 0 6px 16px;color:${b.primary};font-style:italic;font-size:13.5px">"Meridian ran a tight, transparent job. They finished early and the community barely noticed the disruption."<div style="font-style:normal;font-size:12px;color:#7A8583;margin-top:6px">— Project Manager, Brisbane City Council</div></blockquote>
    </div>`;
  },
};

// The set of documents with a bespoke, fully built-out mockup.
const DOC_MOCKED = Object.keys(DOC_CONTENT);

// Render a document into A4 inner HTML for a given brand. Falls back to a
// primitive-composed page for documents without a bespoke mock (needs
// primitives.js for renderPrimitive).
function renderDocument(id, brand){
  const b = brand || DOC_BRAND_DEFAULT;
  const c = (typeof COMPONENTS!=='undefined') ? COMPONENTS.find(x=>x.id===id) : null;
  // Resume documents render through the SHARED resume renderer, so a pack shows
  // the exact CV built in the Resume builder (same layout + sections).
  if(c && c.type==='resume' && typeof renderResume==='function'){
    const cfg = c.resume || {};
    return renderResume({layout:cfg.layout, brand:b, sections:cfg.sections});
  }
  // Section/page documents render from their saved block/element composition —
  // the same items the Document builder assembles (see document-render.js).
  if(c && Array.isArray(c.blocks) && typeof renderComposedDoc==='function' && typeof docBlocksToItems==='function'){
    return renderComposedDoc(docBlocksToItems(c.blocks), b);
  }
  if(DOC_CONTENT[id]) return DOC_CONTENT[id](b);
  // Fallback: a plausible page assembled from primitives, keyed off the doc's
  // thumbnail style so rows-docs get a table, icon-docs get imagery, etc.
  const name = c ? c.name : 'Document';
  const H=`font-family:'${b.font}',sans-serif`;
  const rp = (typeof renderPrimitive==='function') ? renderPrimitive : ()=>'';
  const head = `<h3 style="${H};margin:0 0 16px;color:${b.primary};font-size:22px;font-weight:700;border-bottom:2px solid ${b.secondary};padding-bottom:8px">${name}</h3>`;
  let body;
  if(c && c.thumb==='rows')      body = rp('paragraph',b)+'<div style="height:16px"></div>'+rp('table',b);
  else if(c && c.thumb==='icon') body = rp('paragraph',b)+'<div style="height:16px"></div>'+rp('image',b);
  else                           body = rp('paragraph',b)+'<div style="height:14px"></div>'+rp('keyvalue',b)+'<div style="height:14px"></div>'+rp('list',b);
  return `<div style="padding:46px 50px;display:flex;flex-direction:column;gap:0">${head}${body}</div>`;
}

if(typeof window!=='undefined'){
  window.DOC_CONTENT=DOC_CONTENT; window.DOC_MOCKED=DOC_MOCKED;
  window.renderDocument=renderDocument; window.DOC_BRAND_DEFAULT=DOC_BRAND_DEFAULT;
}
