const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, Footer, PageNumber, LevelFormat, TabStopType, convertInchesToTwip,
} = require('docx');

const SRC = 'G:/Claude/Subbies/tenderfy-admin/handoff/USER-STORIES-BLOCK-BUILDER.md';
const OUT = 'G:/Claude/Subbies/tenderfy-admin/handoff/Block Builder User Stories.docx';
const TEAL = '1D9E75', DARK = '17402F', GREY = '6B7772', LINE = 'D7DEDB', BAND = 'F2F7F5';
const BODY = 'Calibri';

/* ---------- inline markdown ---------- */
const smart = t => t.replace(/"([^"]*)"/g, '“$1”').replace(/(w)'(w)/g, '$1’$2');
function runs(text, base = {}) {
  text = smart(text);
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: BODY, ...base }));
    const t = m[0];
    if (t.startsWith('**')) out.push(new TextRun({ text: t.slice(2, -2), bold: true, font: BODY, ...base }));
    else if (t.startsWith('`')) out.push(new TextRun({ text: t.slice(1, -1), font: 'Consolas', size: (base.size || 22) - 2, color: DARK }));
    else out.push(new TextRun({ text: t.slice(1, -1), italics: true, font: BODY, ...base }));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: BODY, ...base }));
  return out;
}
const plain = s => s.replace(/\*\*/g, '').replace(/`/g, '').trim();

/* ---------- building blocks ---------- */
const P = (text, o = {}) => new Paragraph({
  children: typeof text === 'string' ? runs(text, { size: o.size || 22, color: o.color, italics: o.italics }) : text,
  spacing: { after: o.after === undefined ? 120 : o.after, before: o.before || 0, line: 276 },
  alignment: o.align, indent: o.indent, border: o.border, shading: o.shading, keepNext: o.keepNext,
  numbering: o.numbering,
});

const cell = (text, o = {}) => new TableCell({
  width: { size: o.w, type: WidthType.DXA },
  shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  children: [new Paragraph({
    children: runs(text, { size: o.head ? 19 : 20, bold: o.head || undefined, color: o.head ? 'FFFFFF' : undefined }),
    spacing: { after: 0, line: 252 },
  })],
});

function table(rows, widths) {
  return new Table({
    columnWidths: widths,
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    borders: ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical'].reduce((o, k) => {
      o[k] = { style: BorderStyle.SINGLE, size: 2, color: LINE }; return o;
    }, {}),
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0,
      children: r.map((c, j) => cell(c, { w: widths[j], head: i === 0, fill: i === 0 ? TEAL : (i % 2 === 0 ? BAND : undefined) })),
    })),
  });
}

/* ---------- parse the markdown ---------- */
const lines = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
const doc = [];
const FULL = 9360; // usable width in DXA for A4 with 1in margins

function pushTable(buf) {
  const rows = buf.filter(l => !/^\|[\s:|-]+\|$/.test(l))
    .map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
  const n = rows[0].length;
  let widths;
  if (n === 2) widths = [2200, FULL - 2200];
  else if (n === 3) widths = [2400, 3600, FULL - 6000];
  else if (n === 4) widths = [1200, 3900, 2200, FULL - 7300];
  else if (n === 5) widths = [900, 4200, 1300, 1100, FULL - 7500];
  else widths = Array(n).fill(Math.floor(FULL / n));
  doc.push(table(rows, widths));
  doc.push(P('', { after: 160 }));
}

let i = 0, tbuf = [], inFront = true;
while (i < lines.length) {
  const raw = lines[i], l = raw.trim();
  if (/^\|/.test(l)) { tbuf.push(l); i++; continue; }
  if (tbuf.length) { pushTable(tbuf); tbuf = []; }

  if (l === '---' || l === '') { i++; continue; }

  if (l.startsWith('# ')) {                                   // document title + doc control table
    doc.push(new Paragraph({
      children: [new TextRun({ text: 'Block Builder', bold: true, size: 48, color: DARK, font: BODY })],
      spacing: { after: 0 },
    }));
    doc.push(new Paragraph({
      children: [new TextRun({ text: 'User stories', size: 40, color: TEAL, font: BODY })],
      spacing: { after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 10 } },
    }));
    doc.push(P('', { after: 200 }));
    const ctl = [];
    let k = i + 1;
    while (k < lines.length && lines[k].trim() !== '---') {
      const fm = lines[k].trim().match(/^\*\*([^*]+)\*\*\s+(.*)$/);
      if (fm && fm[1] === 'Version' && fm[2].includes(' · ')) {
        const [v, dt] = fm[2].split(' · ');
        const [num, ...rest] = v.split(', ');
        ctl.push(['Version', num], ['Date', dt],
          ['Status', (rest.join(', ') || 'draft').replace(/^./, c => c.toUpperCase())]);
      } else if (fm) ctl.push([fm[1], fm[2]]);
      k++;
    }
    if (ctl.length) { doc.push(table([['Document control', '']].concat(ctl), [2200, FULL - 2200])); doc.push(P('', { after: 200 })); i = k; continue; }
    i++; continue;
  }
  if (false) {
    doc.push(new Paragraph({
      children: [new TextRun({ text: plain(l.slice(2)), bold: true, size: 44, color: DARK, font: BODY })],
      spacing: { after: 60 },
    }));
    i++; continue;
  }
  if (l.startsWith('## ')) {                                  // epic / section
    const txt = plain(l.slice(3));
    doc.push(new Paragraph({
      heading: HeadingLevel.HEADING_1, keepNext: true,
      children: [new TextRun({ text: txt, bold: true, size: 30, color: TEAL, font: BODY })],
      spacing: { before: 380, after: 140 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 6 } },
    }));
    inFront = false; i++; continue;
  }
  if (l.startsWith('### ')) {                                 // story / sub-section
    doc.push(new Paragraph({
      heading: HeadingLevel.HEADING_2, keepNext: true,
      children: [new TextRun({ text: plain(l.slice(4)), bold: true, size: 24, color: DARK, font: BODY })],
      spacing: { before: 260, after: 100 },
    }));
    i++; continue;
  }
  if (/^- /.test(l)) {                                        // bullet
    const t = l.slice(2);
    const gwt = t.match(/^(Given|When|Then|And)\b(.*)$/);
    doc.push(new Paragraph({
      numbering: { reference: 'bullets', level: 0 },
      spacing: { after: 40, line: 264 },
      children: gwt
        ? [new TextRun({ text: gwt[1], bold: true, font: BODY, size: 21, color: TEAL }), ...runs(gwt[2], { size: 21 })]
        : runs(t, { size: 21 }),
    }));
    i++; continue;
  }
  if (/^\d+\. /.test(l)) {                                    // numbered
    doc.push(new Paragraph({
      numbering: { reference: 'numbers', level: 0 },
      spacing: { after: 40, line: 264 },
      children: runs(l.replace(/^\d+\.\s*/, ''), { size: 21 }),
    }));
    i++; continue;
  }
  if (l.startsWith('**As a**') || l.startsWith('**As an**')) { // the story statement, as a callout
    doc.push(new Paragraph({
      children: runs(l, { size: 22 }),
      spacing: { before: 80, after: 140, line: 276 },
      indent: { left: 200, right: 200 },
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: BAND },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: TEAL, space: 10 } },
    }));
    i++; continue;
  }
  if (l.startsWith('**Traces**')) {                           // meta line
    doc.push(P(l.replace(/ · /g, '   |   '), { size: 18, color: GREY, after: 60 }));
    i++; continue;
  }
  if (l.startsWith('**Note**')) {
    doc.push(P(l, { size: 19, color: GREY, italics: true, after: 60 }));
    i++; continue;
  }
  // ordinary paragraph, joining wrapped lines
  let buf = [l]; i++;
  while (i < lines.length && lines[i].trim() && !/^([#\-|]|\d+\. )/.test(lines[i].trim())) { buf.push(lines[i].trim()); i++; }
  const text = buf.join(' ');
  doc.push(P(text, inFront ? { size: 21, color: GREY, after: 40 } : { size: 22 }));
}
if (tbuf.length) pushTable(tbuf);


/* ---------- assemble ---------- */
const d = new Document({
  creator: 'Daniel, Tenderfy',
  title: 'Block Builder User Stories',
  description: 'User story backlog for the admin Block Builder',
  styles: { default: { document: { run: { font: BODY, size: 22, color: '20282A' } } } },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 520, hanging: 240 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 520, hanging: 260 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 8 } },
          tabStops: [{ type: TabStopType.RIGHT, position: FULL }],
          children: [
            new TextRun({ text: 'Block Builder user stories, v0.1 draft', size: 16, color: GREY, font: BODY }),
            new TextRun({ text: '\t', size: 16 }),
            new TextRun({ text: 'Page ', size: 16, color: GREY, font: BODY }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY, font: BODY }),
            new TextRun({ text: ' of ', size: 16, color: GREY, font: BODY }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GREY, font: BODY }),
          ],
        })],
      }),
    },
    children: doc,
  }],
});

Packer.toBuffer(d).then(b => { fs.writeFileSync(OUT, b); console.log('written', OUT, b.length, 'bytes'); });
