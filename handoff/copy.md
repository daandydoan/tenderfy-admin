# Admin builders — copy deck

Every user-facing string in the Block Builder, Document Builder and the lists around them. Keyed by Figma frame id (file `Tenderfy Admin Builders`, page *Admin builders — flows*). Sample block content ("Scope of works", "$553,560" …) is seed data, not UI copy, and is left out.

Legend: **[app]** = live in the prototype today · **[proposed]** = drawn in Figma, not in the app · **[rename?]** = council flagged the label.

---

## Shared chrome (every frame)

| Where | String | Note |
|---|---|---|
| Topbar crumb | Blocks · Documents · Clients | current page |
| Topbar search | Search everything… | placeholder |
| Autosave stamp | Autosaved · {hh:mm} | 11px, appears 600 ms after first change |
| Confirm dialog | **Discard changes?** / This block has unsaved changes. Leaving now discards them. / Discard · Cancel | Discard = danger button |
| Confirm dialog | **Restore this version?** / The current canvas will be replaced with this saved version. / Restore · Cancel | |
| Confirm dialog | **Delete this document?** / “{name}” … / Delete · Cancel | body text truncated in source — finish it |
| Confirm dialog | **Delete this client?** / “{name}” … / Delete · Cancel | |
| Toast | Could not save — browser storage is full | prototype only; real error TBD |
| Toast | Picked up your unsaved draft | on reopen with a localStorage draft |

---

## Blocks list — `9:2` (+ states `30:2`, `30:208`, `44:129`, `44:353`, `44:630`)

| Element | String |
|---|---|
| H1 | Blocks |
| Sub | The building blocks behind the Block Builder — one shared set for every client. |
| Primary button | New Block |
| Tabs | Text Blocks · Images · Image & Text · Table & Data · Headers & Footers · All Blocks |
| Filter button | Filters |
| Card badge | Published · Draft · Inactive |
| Card count tooltip | Used in {n} documents |
| Card ⋮ menu | Edit · Duplicate · Deactivate / Reactivate · Delete |
| Toast | Duplicated: {name} |
| Toast | Deactivated: {label} / Reactivated: {label} |
| Toast | Deleted: {name} |
| Empty **[proposed]** | **No blocks yet** / Blocks are the reusable sections of this client’s tenders. Build the first one from their past documents. / New Block |
| No results **[proposed]** | **No blocks match “{query}”** / Try a different word, or clear the search and filters. / Clear search |
| Loading **[proposed]** | skeleton, no text |

## Client picker — `11:2` (+ `44:1863`, `44:2103`)

| Element | String |
|---|---|
| Title | Who is this block for? |
| Sub | Blocks belong to a client and are drafted from their documents. |
| Client row meta | Documents received · Waiting on documents |
| Footer | Back to blocks · General library block |
| Empty **[proposed]** | **No clients yet** / Blocks always belong to a client. Onboard one first, or build a general library block below. / Go to Clients |

## Block Builder — header & tabs — `2:2` `3:2` `5:2` `6:2` `7:2`

| Element | String |
|---|---|
| Name input placeholder | Name this block… |
| Usage chip | Used in {n} documents |
| Primary button | Save Block |
| ⋮ menu (`28:2`) | Save & start another · Save as draft · Duplicate · Version history · Delete |
| Panel tabs | Elements · Style · AI Draft · Code |
| Toolbar | Panel · Whole block · (undo) · (redo) · (history) |
| Canvas toggle | Build · Preview |
| Preview style | Preview style · Default (brand-neutral) · {client name} **[rename?]** |
| Toast | Add something to the block first |
| Toast | Name the block first |
| Toast | Saved “{label}” for {client} · updates {n} documents |
| Toast | Saved as draft “{label}” |
| Toast | Duplicated on the canvas — save it as a new block |
| Toast | Restored version |

### Elements tab
| Element | String |
|---|---|
| Search | Search elements… |
| Groups | STRUCTURE · TEXT · MEDIA · DATA · SIGN-OFF · LAYOUT · DOCUMENT |
| Structure tiles | 2 Columns · 3 Columns · Repeat down · Repeat across · Divider |
| Element tiles | Heading · Sub-heading · Paragraph · Bulleted list · Quote · Callout · Image · Table · Key / Value · Signature · Spacer · Merge field · Stat · Button · Cover title · Contents · Page break |
| Tile tooltips | A row with two columns · A row with three columns · Items side by side, repeated · Items side by side — the estimator adds as many as the tender needs (stats, logos, cards) · A horizontal rule |
| Row tools | Drag to move · Add column · Delete row · Column widths · Duplicate · Delete |
| Drop target | Drop element |
| Insert lines | Insert an element here · Insert a full-width element below |
| Toast | A row can have up to 3 columns · A row needs at least one column · Key / value has two columns · Columns {a : b} |
| Empty canvas (`25:2`) | **Empty block** / ADD YOUR FIRST ELEMENT / Click a section of the document on the left, drag across any text there, or add an element: / Choose an element… |
| Quick picker (`26:2`) | Search · ELEMENTS |

### Style tab
| Element | String |
|---|---|
| Target chip | Editing: {element} · Editing: whole block |
| Presets | Apply a style preset… |
| Toast | Applied preset: {name} · Style copied · Style pasted · Style reset |
| Sections | TYPOGRAPHY · LAYOUT · Dimension · APPEARANCE · Fill · Stroke |
| Typography fields | Inherit from brand (placeholder) · Weight · brand · Brand (size placeholder) · px · Line height · Auto · Letter spacing · Colour · Alignment |
| Hint | Blank fields inherit the client’s brand & styling. |
| Advanced | Advanced styling — layout · spacing · borders |
| Layout | Width · Fill container / Fixed / Min / Max · Height · Alignment · Gap |
| Dimension | Padding · Margin · Edit sides individually |
| Appearance | Corner radius · Edit corners individually · Add fill · Add stroke |
| Icon tooltips | Bold (Ctrl+B) · Italic (Ctrl+I) · Underline · Strikethrough · Link · Clear formatting · Copy style · Paste style · Reset |
| Image | Fill the box, crop the edges · Fit inside the box · Clear image · Upload |
| Toast | Image too large — keep it under 3 MB |
| Doc-only hint (`13:2`) | Changes apply to this document's copy of the block — the saved block is unchanged. |
| Doc-only button | Reset element style |

### AI Draft tab (`5:2`)
| Element | String |
|---|---|
| Title | Draft a block from an image — with Tenderfy AI (Ray) |
| Fields | SCREENSHOT OR PHOTO OF THE SECTION · Upload, drop, or paste (Ctrl+V) · WHAT IS IT? · OPTIONAL · e.g. our safety commitment with a stats table |
| Buttons | Draft block · Try with a sample |
| Hint | Ray reads the image and lays it out as elements with the words it finds — you edit from there. Paste anywhere on the page to add an image. |
| Toast | Ray drafted a starting point — check the words against the image, then Save |
| Badge | CONCEPT |

### Code tab (`6:2`, `28:533`)
| Element | String |
|---|---|
| Label | HTML · Expand |
| Placeholder | `<div>Your block markup…</div>` |
| Hint | Generated from the canvas. Edit it and the block becomes a custom-HTML block — use var(--brand-primary), var(--brand-secondary) |

## Save block dialog — `8:2` (+ errors `44:2613`, `44:2809`)

| Element | String |
|---|---|
| Title / sub | Save block / How it appears in the Blocks list and to the client. |
| Name | Name · what the client sees · placeholder: e.g. Our safety commitment |
| Category | Category |
| Internal name | Internal name · optional · Defaults to the name |
| Description | Helper description · optional · e.g. Our safety commitment, from the WHS plan. |
| Share | Share as a generic template · other clients can use it — check it holds nothing specific to this client |
| Footer | Cancel · Save block |
| Error **[proposed]** | Name the block first (inline, replaces the toast) |
| Error **[proposed]** | A block with this name already exists for {client} |

## Version history — `28:266`, `44:2333`

| Element | String |
|---|---|
| Title / sub | Version history / Saved versions of this block… |
| Empty | No saved versions yet |
| Row **[proposed]** | v{n} · Published/Draft · {date time} · {author} · Current · Restore |
| Footer | Done |

---

## Documents library — `22:2` (+ `30:422`, `44:852`, `44:1172`, `44:1545`)

| Element | String |
|---|---|
| H1 | Documents |
| Sub | Reusable document sections, assembled from blocks and brand-applied when used. |
| Primary | New Document ▾ → Section · Page · Letterhead · Footer |
| Tabs | All · Resumes · Organisation Chart · Case Studies · Others · Policies · Cover Pages · Table of Contents · Insurances · Certifications |
| Card | v{major.minor} · Published / Draft · type badge (Resume · Section · …) |
| Toast | Created document: {name} · {n} blocks / Updated document: … · Deleted document: {name} |
| Empty **[proposed]** | **No documents yet** / Documents are assembled from blocks. Start with a section or a letterhead. / New Document |
| No results **[proposed]** | **No documents match “{query}”** / Try a different word, or clear the search and filters. / Clear search |

## Document Builder — `19:2` `12:2` `13:2` `14:2` `16:2` `17:2` `18:2`

| Element | String |
|---|---|
| Name placeholder | Name this document… |
| Header status | Published · Draft |
| Primary | Save Document |
| ⋮ menu (`29:1106`) | Add to a page · Duplicate · Delete |
| Panel tabs | Blocks ({n}) · Style · AI Draft · Layers **[rename?]** |
| Blocks tab | New block · Search blocks… · TEXT BLOCKS · IMAGES · … |
| Page meta | Untitled document · {n} blocks · {n} A4 page(s) |
| Letterhead chip | Letterhead · Top layer · No letterhead — choose one in Layers ▸ Top |
| Insert line | Insert a block here · Add block |
| Empty page | **Empty document** / Drag a block from the left, or click one to add it. |
| Save hint | Add at least one block |
| Toast | Give the document a name first · Add at least one block · Added block: {name} · Added element: {name} · Added {n} blocks |
| Words edited (`14:2`) | Words edited in this document only — the saved block is unchanged. · Revert to block · tooltip: Discard this document's edits and use the block as saved · Click any text on the canvas to edit it for this document. **[rename? “Words edited” → “Edited in this document”]** |
| Toast | Reverted to the saved block |
| Layers (`16:2`) | LAYERS · Background — Fills behind content, per page · Regions · No fill regions yet — add one. · Add fill region · Overlays the base page fill (Properties ▸ Style). · Main — blocks on the page · ELEMENT / BLOCK · Drag to reorder. Select a block to style it; remove it with ×. · Top — Letterhead & footer — repeats on every page |
| Fill region placeholder | /* Drawn behind content */ background: linear-gradient(135deg,#123B66,#38988A); |
| Page break (`29:821`) | Page break |
| AI Draft (`17:2`) | Draft with Ray from a client file · CONCEPT · CLIENT'S DOCUMENT (REFERENCE) · Add a client document to match · DESCRIPTION · Describe the document — e.g. “a case study for a council road project” · Draft document · SUGGEST BLOCKS · Ray picks blocks that fit this document's name, type and description — add the ones you want. · Suggest blocks with Ray |
| Toast | Add a client document, describe it, or pick a type · Ray drafted {n} blocks to match your reference — refine, then Save |
| Preview (`18:2`) | Build · Preview · Preview style |

## Document details dialog — `21:2` (+ `44:3005`)

| Element | String |
|---|---|
| Title / sub | Document details / Who it's for and what it is — shown in the library. |
| Client | Client this document is for · No client (brand-neutral) · Brand-neutral — no client brand applied. |
| Type | Document type |
| Status | Status · Draft / Published |
| Description | Description · What is this document for? |
| Footer | Cancel · Save document |
| Error **[proposed]** | Give the document a name before saving — the name field is in the header. |

---

## Client detail — `23:2`, `30:737`, `44:2503`

| Element | String |
|---|---|
| H1 | Client Details |
| Header buttons | Assign Template · (brand) · ⋮ |
| Tabs | Overview · Documents · All Blocks |
| Profile | Active · Client since {year} · EMAIL · PHONE · INDUSTRY · TEMPLATES USED {n / n} |
| Subscription | Subscription · Manage · Pro · Renews {date} · Plan credits · {n}% left · Resets each billing cycle · Top-up credits · None · Used after plan credits run out |
| Files | Original files · Sent by the client · {date} · Build blocks · LOGO · BRAND DOCUMENT · PAST TENDERS · Client · {date} · {n} pages |
| Brand | Brand · What blocks & templates inherit for this client — every value says where it came from · Logo · Cover lockup & running header · COLOURS · BRAND / DERIVED / SHARED · Primary · Secondary · Tint · Background · Ink / Text · Surface · Border · provenance: “{file} p.{n}” / derived / assumed |
| Toast | Brand changed — client approval needs renewing · Client details updated · Deleted client: {name} |
| Documents tab | Assigned documents · {n} documents · Preview · Assign · Documents assigned to {client}, grouped by type — … · Issued {date} · Brand frozen at issue · Document unassigned (toast) |
| Empty **[proposed]** | **No documents assigned** / Assign a tender template to give this client’s estimators something to fill. / Assign Template |

---

## Rename candidates (council #16)

| Today | Why it confuses | Suggested |
|---|---|---|
| Words edited | Sounds like a diff count | Edited in this document |
| Layers | Reads as Photoshop | Page structure (or keep, with sub-label “letterhead · blocks · background”) |
| Preview style | Implies a saved style; it’s a brand switch for preview only | Preview as {client} |
| Repeat down / Repeat across | Nobody knows what repeats | Repeating rows / Repeating columns — estimator adds items |
| General library block | “General” vs “shared” vs “template” used interchangeably | Shared block (all clients) |
