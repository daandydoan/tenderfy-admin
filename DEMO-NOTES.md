# Block Builder — demo notes

Static prototype. Everything persists in the browser only (localStorage). Two audiences:
**developers** (what to build) and **prospects** (why it matters). The script below is the prospect demo;
the "For developers" notes are what the mockup deliberately fakes.

## The block workspace (how it's meant to be used)

One screen, no steps: the client's document on the left, the block on the right, the block panel
(Block · Style) on the far right. Entry: Client detail → *Original files* → **Build blocks from these**
(`block-edit.html#client=taylor&doc=whs`). From the Blocks list you get the same screen with no document;
*Attach a source document* in the kebab opens one.

You can, in any order:
- click any section of any page → **New block** (or **Add to this block** if one is open)
- drag across any text → **New block from selection** / **Add to this block**
- **+ Add element** for anything not in the document; every element's words are editable inline
- set **Fixed / Editable / Locked** per element in the *Elements & client permission* list (or on the canvas)
- **Save** (stays here; the section gets a ✓ on the document) or **Save & new**
- click a ✓ section to reopen that block

The document is a map, not a to-do list: "2 of 14 sections are blocks" in its header, a dot on pages that
have blocks, one section deliberately flagged *Ray merged two sections — check the split*, one page that
*Ray couldn't read* (a drawing). Blocks save against the client (*Built for Taylor Builders*) with the
regions they came from; *Also available to all clients* is a checkbox.

## The 2-minute demo

1. Client detail (Taylor) → **Build blocks from these**. Their WHS plan opens beside an empty block.
   > "We start from your documents, not a blank page."
2. Page 4 → click **Our commitment**. Their words land in the block, named after the section,
   *From WHS Management Plan · p.4*.
3. Click **Safety performance** → *Add to this block*. A key/value table joins it.
4. In the panel, set the paragraph **Editable**, the heading **Locked**.
   > "You decide what your estimators can change — and what they can't."
5. **Client view**. Only the dashed paragraph takes a cursor.
   > "This is exactly what your team sees."
6. **Save & new** → both sections show ✓ on the document. Drag across a sentence on page 2 → *New block
   from selection*.
   > "Any text, any page, any order."

Optional: Preview style → another client (same block, their brand); page 7 (the drawing Ray can't read);
page 5 (the flagged merge).

## Glossary — say this, not that

| On screen | Say to a prospect | Means |
|---|---|---|
| Block | reusable section | A piece of a tender you write once and reuse |
| Element | part | Heading, paragraph, table… the things inside a section |
| Merge field | auto-filled detail | Client name, ABN, project ref — filled in per document |
| Key / Value | details list | Label + value rows |
| Stat | headline number | A big figure with a caption |
| Fixed | can't be changed | Client sees it, can't edit the words |
| Editable | your team can edit | Client can rewrite the words |
| Locked | stays put | Client can't move or remove it |
| Ray | the assistant | Drafts from a source document or description |
| Preview style | see it in a brand | Renders the block in a client's brand kit |
| Publish / Save as draft | make it available / keep working | Draft = only staff see it |
| Used in N documents | where it's used | Which documents include this block |

## For developers — what the mockup fakes

- **Source document** is a static page with three draftable regions. Real: upload PDF/Word, render pages,
  select a region, extract text/tables. Provenance (`source`) is stored on the block and should become
  `{docId, page, region}`.
- **Ray** is a keyword matcher on the description and a fixed lift from the source regions. Real: LLM over
  the extracted region, returning elements + suggested permissions.
- **Client attachment.** Blocks are stored brand-neutral with `availability: All clients`. Prior reviews
  agree the real model is *block → client* (admin-built blocks belong to one client; Tenderfy base blocks
  are the exception). The mockup does not model this yet; "Preview style" stands in for it.
- **Persistence** is `localStorage` (`tf_blocks_custom`, `tf_bdraft_*`, `tf_bver_*`). Real: API, per-user
  drafts, server-side versions.
- **Image upload** stores a data URL. Real: asset store, per-client library.
- **"Used in N"** comes from a seeded table; new blocks are 0. Real: count from documents, list them on click.
- **Client view** is a CSS/contenteditable mode inside the admin editor. Real: the client-side editor
  enforces Fixed/Editable/Locked server-side.

## Brand / styleguide — how it's modelled

The brand is **evidence + sign-off**, not a document we store or a kit we version.

Workflow: **Request** (client sends logo · brand document · past tenders) → **Derive** (admin, Ray suggesting,
fills the Brand; every value carries *from file · page* or *assumed*; page setup is part of it) → **Approve**
(client sees their real tender page beside ours; one click) → **Build** (blocks bind roles) → **Assign**
(no ceremony — render applies the brand) → **Issue** (a sent document freezes its brand; later changes affect drafts only).

Where it lives in the mockup: Client detail → *Original files*, *Approve brand*, *Brand* (with evidence tags,
page setup, change log); Documents tab → *Brand frozen at issue* on a sent tender; Block builder →
Preview style reads "Taylor Builders · approved 1 Sep".

Data model (per client, `tenant-data.js` → `brandMeta(client)`; mockup persists in `tf_brandmeta_<id>`):

```
client.files[]        {type: logo | brand-guide | past-tender, name, by, date, pages?, data?}
client.requested      date the three-slot request went out (null once files are in)
brand.evidence[key]   {from, page} | {assumed:true} | {derived:true}   — key = colour role or font
brand.page            {marginTop, marginSide, logoPos, footer}        — geometry IS brand
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
