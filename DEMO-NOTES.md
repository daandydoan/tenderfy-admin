# Block Builder — demo notes

Static prototype. Everything persists in the browser only (localStorage). Two audiences:
**developers** (what to build) and **prospects** (why it matters). The script below is the prospect demo;
the "For developers" notes are what the mockup deliberately fakes.

## The block workspace (how it's meant to be used)

One screen, no steps: a tabbed panel on the left (Elements · Style · AI Draft · Code), the block on the right; Build / Preview toggle on the canvas.
Entry: Client detail → **Build blocks** (`block-edit.html#client=taylor`); from the Blocks list, New Block asks
*Who is this block for?* first.

- **Draft with AI**: upload, drop or paste (Ctrl+V anywhere) a screenshot or photo of a section from the client's
  document, optionally say what it is → Ray lays it out as elements. In the mockup the layout follows the description
  (table / list / quote / photo words) and the text is a placeholder; the real build reads the image.
- **Elements** for anything else (drag or click, or the + line between elements): Structure (2/3 columns, Repeat down/across, Divider), Text, Media, Data, Sign-off. Every element's words are editable inline with rich text (b/i/u/s/link); **Style** shows Typography for text elements and Layout / Dimension / Appearance under Advanced; selecting an element opens Style, Esc returns to Elements.
- **Save** — the first save asks for name · category · helper in a dialog; later saves are one click.
  **Save & start another** in the kebab.

Blocks save against the client (*Built for Bramble & Kite Builders*); *Share as a generic template* is a save-time checkbox.

## The 2-minute demo

1. Client detail (Bramble & Kite) → **Build blocks**. An empty block, Bramble & Kite's brand already selected.
2. Paste a screenshot of their safety section into **Draft with AI**, type "our safety commitment with a stats table", **Draft block**.
   > "Screenshot any section of what you already have — Ray lays it out."
3. Fix the words inline, adjust the table rows, **Save**. It appears in the Blocks list and the Document builder.
4. **Save & start another** → paste the next screenshot.

Optional: Preview style → another client (same block, their brand).
## Glossary — say this, not that

| On screen | Say to a prospect | Means |
|---|---|---|
| Block | reusable section | A piece of a tender you write once and reuse |
| Element | part | Heading, paragraph, table… the things inside a section |
| Merge field | auto-filled detail | Client name, ABN, project ref — filled in per document |
| Key / Value | details list | Label + value rows |
| Stat | headline number | A big figure with a caption |
| Ray | the assistant | Drafts from a source document or description |
| Preview style | see it in a brand | Renders the block in a client's brand kit |
| Publish / Save as draft | make it available / keep working | Draft = only staff see it |
| Used in N documents | where it's used | Which documents include this block |

## For developers — what the mockup fakes

- **Draft with AI** stores the pasted image as a data URL and drafts a layout from the description keywords. Real: a vision model over the image returning elements + the exact text.
- **Client attachment.** Blocks belong to a client (`client` on the record; the picker asks *Who is this block for?*); *Share as a generic template* makes one reusable. "Preview style" renders the block in another client's brand for comparison only.
- **Persistence** is `localStorage` (`tf_blocks_custom`, `tf_bdraft_*`, `tf_bver_*`; documents in `tf_docs`, `tf_ddraft_*`). Real: API, per-user drafts, server-side versions.
- **Renderer parity.** One `elStyle(st, brand)` in block-layouts.js drives the canvas, Preview, the Code tab and `composeBlock` for documents, so per-element styling never drifts. Repeat rows render twice in documents as a stand-in.
- **Image upload** stores a data URL. Real: asset store, per-client library.
- **"Used in N"** comes from a seeded table; new blocks are 0. Real: count from documents, list them on click.

## Brand / styleguide — how it's modelled

The brand is **evidence + sign-off**, not a document we store or a kit we version.

Workflow: **Request** (client sends logo · brand document · past tenders) → **Derive** (admin, Ray suggesting,
fills the Brand; every value carries *from file · page* or *assumed*) → **Approve** (client signs off the brand) → **Build** (blocks bind roles) → **Assign**
(no ceremony — render applies the brand) → **Issue** (a sent document freezes its brand; later changes affect drafts only).

Where it lives in the mockup: Client detail → *Original files*, *Brand* (with evidence tags, approval status,
change log); Documents tab → *Brand frozen at issue* on a sent tender; Block builder →
Preview style reads "Bramble & Kite Builders · approved 1 Sep".

Data model (per client, `tenant-data.js` → `brandMeta(client)`; mockup persists in `tf_brandmeta_<id>`):

```
client.files[]        {type: logo | brand-guide | past-tender, name, by, date, pages?, data?}
client.requested      date the three-slot request went out (null once files are in)
brand.evidence[key]   {from, page} | {assumed:true} | {derived:true}   — key = colour role or font
brand.approval        {status: not-sent | pending | approved, by, date}
brand.log[]           {date, by, what}                                — a log, not versions
document.issued       {date, brandSnapshot}                           — frozen at issue
client.kits[]         later: head-contractor kits, chosen per document, co-branded by default
```

Rules for the real build: no template is built on a brand that isn't `approved`; editing the brand after
approval resets it to `not-sent`; an issued document renders from its snapshot, never the live brand.

Parked: real extraction from PDF/DOCX, kit versioning with diff preview, custom font upload, cross-client
head-contractor kit library, brand-check score.

## Deliberately not built (parked)

Multi-select · per-element horizontal alignment · smarter Ray · deeper version history · a client fact
store (ABN/licences/insurance) that blocks reference · block analytics / win-rate · starter library per trade.

## Block workspace — rules the mockup now models

- **A block belongs to a client**: New Block asks *Who is this block for?* before anything else; *General library
  block* is the only client-less path (Tenderfy's seeded blocks).
- **Provenance**: *Drafted by Ray from an image* — the real build stores the image and what it read from it.
- **No permissions in the admin workspace.** Who may edit what is decided in the client editor — *owner decides,
  estimator obeys*. The admin’s protection is provenance and merge fields — facts with a shelf life
  (licence, insurance, ABN) become merge fields, never prose.
- **Sharing is a save decision**: *Share as a generic template* sits in the Save dialog with category/name/helper,
  with a warning that it must hold nothing client-specific.
- **One save**: *Save Block*; *Save & start another* in the kebab. Autosave is the draft.
- Elements are block-level parts only (heading, sub-heading, paragraph, list, quote, callout, image, table,
  key/value, merge field, 2/3 columns). Style shows image source and table shape; layout, fill,
  spacing, type and borders live under *Advanced styling*.

Parked for the real build: a **block-in-use check** — drop a block into a real tender with merge fields resolved before calling it done; multiple images per block.

## Document Builder — for developers

Same shell as the Block Builder (one tabbed panel · canvas · Build/Preview), same shared code:
`components.css` (inspector controls, dialogs, picker, insert lines, rich text), `editor-shared.js`
(scrub, dialogs, collapsible sections, rich-text capture), `block-layouts.js` (`elStyle`, `composeBlock`,
`blockDocCopy`), `document-render.js` (`docItemHtml`, pagination).

**Document schema** (what Save writes to `tf_docs`, merged into `COMPONENTS` on load):

```
{ id, name, category, status, desc, type: 'section' | 'page', client,
  docStyle:{bg, pad, gap, rad},              -- page fill / padding / spacing / radius
  topLayer:{header, footer},                 -- block ids from Headers & Footers
  docBg:{mode:'regions', regions:[]},        -- fill regions behind content
  blocks:[ { t:'block'|'element', id, style, content?, doc? } ] }
```

- `blocks[i].doc` is **this document's copy of the block** (rows → cols → elements, same shape as a
  block's `doc`). It exists only once someone edits words or element typography in place; "Revert to
  block" deletes it. The saved block is never written from here.
- Drafts autosave to `tf_ddraft_<id|new>` 600ms after the last change and resume silently.

**Decisions encoded in the UI**
- Brand is applied by the renderer. Per-instance Layout / Fill / Stroke overrides on a placed block are
  shown and live in `blocks[i].style` (this document only); whether they survive the styling-ownership call
  (block owns layout/emphasis, brand owns type/colour — *proposed, not decided*) is open.
- Element-level Typography overrides inside a document are allowed and live in `blocks[i].doc`.
- Repeat rows render twice in documents as a stand-in for "one per item"; the estimator's "add another"
  belongs to the client editor.

**What the mockup fakes here** (look for the `concept` badge)
- AI Draft "from a client file" and "Suggest blocks": keyword match on the description / name; the file is ignored.
- Pagination never splits a block taller than a page; long tables overflow the A4 page in Preview.
- No audit trail, no lock-by-head-office, no versioning of documents — open items the client editor must answer.
