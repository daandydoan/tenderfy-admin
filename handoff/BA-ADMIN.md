# Tenderfy Super Admin Business Analysis (initial)

**Version** 0.1 · draft for review · 28 Sep 2026
**Author** Daniel (dev + UI/UX)
**Reviewers** Tom (model + commercials), Shivam (technical feasibility)
**Source of truth** this file. The 2-page summary for non-BA readers is `brief.html`; screen-by-screen wording is `handoff/copy.md`; prototype behaviour and fakes are `DEMO-NOTES.md`.
**Status of evidence** Everything below is derived from the working prototype at
`https://daandydoan.github.io/tenderfy-admin/` and the decisions logged in this repo. It has **not**
been validated with an onboarding operator. See §12 OQ-1.

---

## 1. Purpose and scope

### 1.1 Purpose
Define what the Super Admin side of Tenderfy must do, for whom, and under what rules, so that the
build can be estimated and the client-side editor can be specified against a stable contract.

### 1.2 In scope
The internal Tenderfy workspace used by Tenderfy staff to onboard a contractor client and produce the
tender kit that client's estimators will later fill in:

| # | Module | Screen(s) |
|---|---|---|
| M1 | Dashboard | `dashboard.html` |
| M2 | Clients (tenants) | `tenants.html`, `tenant-detail.html`, `client-edit.html` |
| M3 | Brand / client styleguide | Client detail → Original files, Brand |
| M4 | Blocks | `blocks.html`, `block-edit.html`, `block-view.html` |
| M5 | Documents | `library.html`, `document-edit.html`, `document-view.html` |
| M6 | Tender templates | `templates.html`, `template-edit.html`, `template-view.html` |
| M7 | QA review | `qa.html` |
| M8 | Subcontractors | `subcontractors.html`, `view-subbie.html` |
| M9 | Subscriptions | `subscriptions.html` |
| M10 | Settings, roles, informative pages | `settings.html` |

### 1.3 Out of scope (this document)
- **The client-side editor** where estimators fill in an assigned template. It is referenced here only
  where the admin side hands off to it. Permissions (Fixed / Editable / Locked), "add another item",
  audit trail, locking and document versioning are all client-editor concerns.
- **The backend PDF renderer.** Admin ends at "assigned"; PDF generation and download are server-side
  and exercised from the client side.
- Billing mechanics behind subscriptions; marketing site; the subbie portal itself.

### 1.4 Out of scope (deliberately parked for the build)
Multi-select in the builders · smarter AI drafting · deep version history with diff · a client fact
store (ABN / licences / insurance) that blocks reference · block analytics and win-rate · starter
block libraries per trade · custom font upload · cross-client head-contractor kit library.

---

## 2. Background and problem statement

Construction and civil contractors produce each tender by copying and reworking the last one in Word.
The result is slow, inconsistent between estimators, and visually off-brand. Content that should be
stable (safety statement, insurances, capability, resumes) is rewritten every bid, and facts with a
shelf life (licence numbers, insurance currency) go stale inside prose.

**Problem statement.** A contractor has no reusable, on-brand, structured tender kit; every bid is
rebuilt from scratch by whoever is free, and quality depends on which old document they started from.

**The Tenderfy answer, and the thing this document specifies.** Tenderfy staff, not the client,
build that kit once, from evidence the client already has. The client's estimators then only ever
supply words into a structure that is already correct and already on-brand.

**Why admin-built, not self-serve.** A client sends a logo, a brand guide and their last few tenders.
They do not know what a block is and should not have to. An admin turns that evidence into a kit; the
client's only obligation is to approve the brand. This buys two things: time to first tender (the
client's first bid is a fill-in, not a build) and consistency (every tender renders from one approved
brand through one renderer).

---

## 3. Business objectives and measures

| # | Objective | Measure | Baseline | Notes |
|---|---|---|---|---|
| BO-1 | Cut the time a contractor spends producing a tender | Hours per tender, estimator-reported | TBD | Needs a before-number from two real clients |
| BO-2 | Every issued tender is on-brand and structurally consistent | % of issued tenders rendered from an approved brand | n/a | Enforced by BR-3 |
| BO-3 | Onboarding a client is repeatable and cheap enough to scale | Admin hours per client onboarding; lead time to first fillable template | **unknown, see OQ-1** | The number that decides whether admin-built scales |
| BO-4 | Content is written once and reused | Average number of documents a block is used in | prototype: seeded | Requires the real "used in N" count |
| BO-5 | Stale facts cannot rot inside prose | % of shelf-life facts held as merge fields, not text | n/a | BR-10 |

---

## 4. Stakeholders

| Stakeholder | Interest | Influence | Needs from this work |
|---|---|---|---|
| Tom (founder) | Does admin-built onboarding scale; commercial model | High | BO-3 answered; the model defensible to prospects |
| Shivam (tech lead) | Feasibility, shared component library, effort | High | Unambiguous data model and invariants (§10, §11) |
| Daniel (BA / dev / UI-UX) | Owns prototype and spec | High | Decisions closed so the client side can be scoped |
| Onboarding operator (Tenderfy staff) | Day-to-day user of every module here | Medium | Fast, forgiving builders; no dead ends |
| Sales | Something sayable to a prospect | Medium | Lead time, what the client must hand over, rebrand answer |
| Client owner (contractor) | Brand correctness; control over estimators | High (external) | Brand sign-off; permissions (client-side) |
| Client estimator | Producing a bid on deadline | Medium (external) | A template that is already right (client-side) |

### 4.1 Actors in the admin system
- **Super Admin**: full access including settings and roles.
- **Library Manager**: builds and edits blocks, documents, templates.
- **Template Builder**: builds, cannot approve.
- **QA Approver**: moves items from In review to Approved.
- **Member**: read-only.
(Roles as modelled in `settings.html`; see OQ-4 on whether the matrix is final.)

---

## 5. Glossary / domain model

| Term | Definition | In the reader's own words |
|---|---|---|
| **Client (tenant)** | A contractor business that subscribes to Tenderfy | The customer |
| **Brand** | A versioned record of the client's visual tokens (logo, colours by role, heading/body fonts, type scale), each value tagged with its evidence | The client's styleguide, proven |
| **Element** | The smallest part: heading, paragraph, list, quote, callout, image, table, key/value, merge field, stat, divider, signature | A part |
| **Block** | A reusable section of a tender: rows of 1–3 columns of elements, owned by a client | One section |
| **Document** | One or more A4 pages assembled from blocks, plus letterhead/footer and background regions | A page or handful of pages |
| **Tender template** | Documents arranged in the fixed section order and assigned to a client | The whole bid |
| **Merge field** | A placeholder resolved per document (client name, ABN, project ref) | An auto-filled detail |
| **Repeat row** | A block row marked "one per item", rendered once per instance at fill time | One per item |
| **Issue** | Sending a tender; freezes the brand it rendered with | The moment it goes out |
| **Ray** | The AI assistant that drafts a block or brand values from a client file | The assistant |

**Containment:** Tender template ⊃ Documents ⊃ Blocks ⊃ Elements. Brand is not in that chain; the renderer applies it across all of it at output.

---

## 6. Business process

### 6.1 As-is (client, before Tenderfy)
Find the most recent similar tender → copy the file → rewrite sections → re-paste resumes and case
studies → fix formatting → hope the insurance dates are current → PDF → send.

### 6.2 To-be (the admin pipeline this document specifies)

| Stage | Input | Who acts | Output | Governing rule |
|---|---|---|---|---|
| 1. Request | New client signed | Admin | Three-slot request sent: logo · brand guide · past tenders | Logged on `client.requested` |
| 2. Derive | Client's files | Admin, Ray suggesting | Brand filled; every value tagged *from file p.N* / *assumed* / *derived* | BR-1 |
| 3. Approve | Derived brand | Client owner | `brand.approval.status = approved` | BR-2, BR-4 |
| 4. Build blocks | Client's past tender sections | Admin | Saved blocks owned by that client | BR-5, BR-6 |
| 5. Build documents | Saved blocks | Admin | Documents in the library, assigned to the client | BR-7, BR-8 |
| 6. Assemble template | Documents | Admin | Tender template, preset or client-assigned | BR-9 |
| 7. QA | Template in review | QA Approver | Approved / sent back | BR-11 |
| 8. Assign | Approved template | Admin | Template live for the client's estimators | Hands off to client editor |
| 9. Issue | *(client side)* | Estimator | PDF sent; brand snapshot frozen | BR-3 |

---

## 7. Functional scope by module

Requirements are stated at feature level for estimation, not as build-ready user stories. Each is
traceable as `FR-<module>-<n>`.

### M1 Dashboard
- FR-M1-1 Show onboarding state across clients: who is awaiting files, awaiting brand approval, in build, in QA, live.
- FR-M1-2 Link each state directly to the screen that clears it.

### M2 Clients
- FR-M2-1 List clients with industry, plan, plan credits, brand-kit state, assigned template count.
- FR-M2-2 Client detail shows: subscription, original files, brand, assigned templates.
- FR-M2-3 Create and edit a client record.
- FR-M2-4 Assign documents and templates to a client from client detail.

### M3 Brand (client styleguide)
- FR-M3-1 Record client files by type (logo · brand-guide · past-tender) with who and when.
- FR-M3-2 Derive brand values, each carrying evidence: `{from, page}` | `{assumed}` | `{derived}`.
- FR-M3-3 Track approval status (`not-sent` → `pending` → `approved`) with approver and date.
- FR-M3-4 Keep a change log of brand edits (a log, not versions, in the prototype; see OQ-3).
- FR-M3-5 Render any block or document in a chosen client's brand for comparison ("Preview style").
- FR-M3-6 Freeze the brand onto a document at issue (`document.issued.brandSnapshot`).

### M4 Blocks
- FR-M4-1 Create a block against a client; "General library block" is the only client-less path.
- FR-M4-2 Compose rows of 1–3 columns; add elements by drag, click, or the insert line between elements.
- FR-M4-3 Edit any element's words inline with rich text (bold / italic / underline / strike / link).
- FR-M4-4 Style a selected element: Typography, and Layout / Dimension / Appearance under advanced styling.
- FR-M4-5 Mark a row as a repeat row (down or across), "one per item".
- FR-M4-6 Draft a block from a screenshot or photo of the client's existing section, plus an optional description. *(prototype: keyword match, see §9)*
- FR-M4-7 Save: first save captures name · category · helper text; later saves are one click; "Save & start another".
- FR-M4-8 Mark a block "Share as a generic template" at save time, with a warning that it must hold nothing client-specific.
- FR-M4-9 Show where a block is used ("Used in N documents") and open that list.
- FR-M4-10 Preview and inspect the generated code / structure of a block.

### M5 Documents
- FR-M5-1 Assemble a document from saved blocks; insert between blocks; insert page breaks.
- FR-M5-2 Set a letterhead and footer (top layer) and background regions.
- FR-M5-3 Paginate to A4 and preview as pages.
- FR-M5-4 Edit words inside a placed block **for this document only**, creating a local copy; offer "Revert to block".
- FR-M5-5 Override element typography inside a placed block, stored on the same local copy.
- FR-M5-6 Override a placed block's layout and appearance for this document (`blocks[i].style`). *(see OQ-2: this is the live styling-ownership question)*
- FR-M5-7 Reorder, duplicate and remove placed blocks; reorder from a Layers list.
- FR-M5-8 Classify the document (Resume, Case study, Policy, Insurance, Certification, Org chart, Cover page, TOC, Other) and set status.
- FR-M5-9 Save to the library and assign to clients.
- FR-M5-10 Autosave a resumable draft.

### M6 Tender templates
- FR-M6-1 Arrange documents into the fixed section order: Cover, TOC, Tender documentation, Resumes, Case studies, Policies, Insurances, Certifications, Org chart.
- FR-M6-2 Save as a reusable preset or assign to specific clients.
- FR-M6-3 Preview the brand-neutral structure, and preview as a chosen client.
- FR-M6-4 Track status: Draft → In review → Approved.

### M7 QA review
- FR-M7-1 Queue of templates and documents in review, with the client and the change note.
- FR-M7-2 Approve, or send back with a comment.
- FR-M7-3 Nothing goes live to a client without passing this queue (BR-11).

### M8 Subcontractors
- FR-M8-1 List subcontractors with status (invited · registered · active · declined/bounced), who invited them, last active, quote count, awarded value.
- FR-M8-2 Filter and sort; resend an invite.
- FR-M8-3 View a subcontractor's profile and work-status timeline.

### M9 Subscriptions
- FR-M9-1 Show plans and which client is on what; surface plan credits.

### M10 Settings
- FR-M10-1 Manage staff members and roles (Super Admin · Library Manager · Template Builder · QA Approver · Member).
- FR-M10-2 Manage informative pages (privacy, security) shown at sign-up and in the footer.
- FR-M10-3 Manage in-app support content.

---

## 8. Business rules

| # | Rule | Why |
|---|---|---|
| BR-1 | Every derived brand value carries evidence: *from file · page*, *assumed*, or *derived*. | The client is signing off something we can show our working for |
| BR-2 | Editing a brand after approval resets its status to `not-sent`. | Approval must mean the thing they saw |
| BR-3 | An issued document renders from its brand snapshot, never the live brand. Later brand changes affect drafts only. | A sent tender cannot silently change |
| BR-4 | No template is built on a brand that is not `approved`. | Prevents rework on an unconfirmed look |
| BR-5 | A block belongs to one client. "General library block" is the only client-less path. | Client content must not leak between clients |
| BR-6 | A block marked "share as generic" must contain nothing client-specific. | Same reason, enforced at save time |
| BR-7 | Editing a placed block inside a document writes to a **local copy** of that block. The saved block is never written from a document. | One source per block; documents cannot corrupt the library |
| BR-8 | A later edit to a saved block does **not** flow into documents that already hold a local copy. There is no sync, silently. | Stated explicitly so no one scopes a sync feature by accident |
| BR-9 | Tender templates follow the fixed section order. | Buyer-side expectation in construction tendering |
| BR-10 | Facts with a shelf life (licence, insurance, ABN) are merge fields, never prose. | Stops stale facts being sent |
| BR-11 | Nothing reaches a client's estimators without passing QA review. | Last check before it represents the client |
| BR-12 | The admin workspace carries no per-field permissions. Who may edit what is decided in the client editor: *owner decides, estimator obeys*. | Keeps the admin builders simple; one place owns permissions |
| BR-13 | Brand is applied by the renderer. Blocks are brand-neutral in styling except deliberate emphasis. | One renderer, one truth |

---

## 9. Current prototype vs required build

The prototype is a static HTML/JS mockup. These are the deliberate stand-ins a reader must not mistake
for working features (each is badged `concept` on screen):

| Area | Prototype does | Real build must |
|---|---|---|
| AI draft (block) | Keyword-matches the description; the uploaded image is stored but not read | Vision model over the image returning elements and exact text |
| AI draft / suggest (document) | Keyword match on name/description; file ignored | Read the client file |
| Persistence | `localStorage` (`tf_blocks_custom`, `tf_docs`, `tf_bdraft_*`, `tf_ddraft_*`, `tf_bver_*`, `tf_brandmeta_*`) | API, per-user drafts, server-side versions |
| Used in N | Seeded table; new blocks are 0 | Count from documents; list on click |
| Repeat rows | Rendered twice as a stand-in | Rendered once per real instance at fill time |
| Pagination | Never splits a block taller than a page; long tables overflow | Split long blocks and tables across pages |
| Images | Stored as data URLs | Asset store with a per-client library |
| Assign / QA / Issue | Toasts, no workflow behind them | Real state transitions and notifications |
| Brand extraction | Manual with Ray suggesting from typed values | Real extraction from PDF / DOCX |

---

## 10. Data model (as modelled; contract for the build)

```
BRAND (per client)
client.files[]        {type: logo|brand-guide|past-tender, name, by, date, pages?, data?}
client.requested      date the three-slot request went out (null once files are in)
brand.evidence[key]   {from, page} | {assumed:true} | {derived:true}     key = colour role or font
brand.approval        {status: not-sent|pending|approved, by, date}
brand.log[]           {date, by, what}
document.issued       {date, brandSnapshot}

BLOCK
{ id, name, category, client, generic?,
  doc: [ { cols:[[el]], ratio?, valign?, repeat?:'v'|'h' } ] }
el = { id, st, content }                st = per-element layout / typography / appearance

DOCUMENT  (tf_docs, merged into COMPONENTS on load)
{ id, name, category, status, desc, type:'section'|'page', client,
  docStyle:{bg, pad, gap, rad},
  topLayer:{header, footer},
  docBg:{mode:'regions', regions:[]},
  blocks:[ { t:'block'|'element', id, style, content?, doc? } ] }
blocks[i].style   this document's layout/appearance override for the placed block
blocks[i].doc     this document's copy of the block; created on first edit; "Revert" deletes it
```

### 10.1 Invariants
- **I-1** Saving a document never writes to a block; editing a block never rewrites a document.
- **I-2** All rendering goes through one function (`elStyle(st, brand)` → `composeBlock`). Canvas, preview and PDF must not have separate renderers.
- **I-3** No document is built on an unapproved brand; an issued document renders from its snapshot.
- **I-4** Repeat rows are block structure. Instances ("add another") belong to the client editor.

---

## 11. Non-functional requirements

| # | Requirement |
|---|---|
| NFR-1 | Output is A4 by default; PDF generated server-side. |
| NFR-2 | One shared component library across super-admin and business-admin (decision, 5 Aug 2026). The admin builders and the client editor must not fork the renderer. |
| NFR-3 | Editors must survive an accidental tab close: drafts autosave and resume. |
| NFR-4 | An admin must be able to build a block without training beyond the on-screen hints; no multi-step wizard. |
| NFR-5 | Provenance is retained: what Ray read, and from which file and page. |
| NFR-6 | Client content is isolated per client; generic blocks are the only shared content. |
| NFR-7 | Keyboard and screen-reader basics in the builders (focus states, Esc to deselect). |

---

## 12. Open questions and decisions needed

| # | Question | Owner | Impact if unanswered | Proposal |
|---|---|---|---|---|
| **OQ-1** | What does onboarding one client actually cost: admin hours, and lead time to a fillable template? Who performs it? | Tom | BO-3 unmeasurable; sales cannot answer "how fast to first tender"; scale of the model unproven | Time-box two real onboardings and record it |
| **OQ-2** | **Styling ownership.** Which layer owns type, colour, layout and emphasis? The prototype currently allows per-document overrides of block layout and appearance, and of element typography. | Shivam + Tom | **Blocking.** Devs will scope override plumbing that may be deleted; "brand by renderer" and per-instance overrides contradict each other on the page | Brand owns type and colour; block owns layout and emphasis; document-level overrides limited to words |
| **OQ-3** | Brand is a *log*, not versions, but an issued tender pins a snapshot. Is a real version record required for v1? | Shivam | Rebrand story is unspecified; sales already asked | Version the brand; snapshot references a version id |
| **OQ-4** | Is the role matrix in Settings final, and does QA approval require a different role from the builder? | Tom | QA control (BR-11) may be unenforceable | Builder ≠ approver |
| **OQ-5** | What ships in v1 vs later: server IDs, per-user drafts, document versioning, asset store? | Shivam | Estimate cannot be produced | Scope against §9 |
| **OQ-6** | Where does the PDF renderer run and how does it share the renderer with the front end (NFR-2)? | Shivam | Risk of a second renderer and visual drift | One shared library, server-invoked |
| **OQ-7** | Rebrand: when a client changes brand next year, what happens to live templates and past tenders? | Tom | Sales objection; data model consequence | New brand version; issued tenders keep theirs; templates re-render |

---

## 13. Assumptions, constraints, dependencies

**Assumptions**
- A-1 Clients can supply a logo, some form of brand guide, and at least two past tenders.
- A-2 The client owner will sign off a brand within a working week of being asked.
- A-3 The fixed tender section order (BR-9) matches what the client's buyers expect.
- A-4 One admin can build a client's kit without engineering support.

**Constraints**
- C-1 A4 output; PDF generated by the backend (5 Aug 2026 decision).
- C-2 One shared component library across the two admin surfaces (5 Aug 2026).
- C-3 Autofill was removed in favour of manual editing (5 Aug 2026).
- C-4 The resume builder is deferred.
- C-5 No stepper / wizard in the builders.

**Dependencies**
- D-1 The client-side editor specification, which inherits permissions, versioning, locking and audit.
- D-2 The backend PDF service.
- D-3 Vision model capability for AI Draft to be more than a stand-in.

---

## 14. Risks

| # | Risk | Likelihood | Impact | Response |
|---|---|---|---|---|
| R-1 | Onboarding cost makes admin-built uneconomic at scale | Medium | High | OQ-1: measure before committing to the model |
| R-2 | Styling ownership left open; override plumbing built then deleted | High | Medium | OQ-2: decide before the client-side sprint |
| R-3 | Prototype stand-ins (AI Draft) read as shipped and estimated as done | Medium | High | §9 table; `concept` badges kept on screen |
| R-4 | A second renderer appears server-side; PDFs drift from preview | Medium | High | NFR-2, I-2 |
| R-5 | "No sync" (BR-8) surprises a client whose block was updated | Medium | Medium | State it in the client editor UI; consider an opt-in refresh later |
| R-6 | Most of the hard state (permissions, versioning, audit) sits in the out-of-scope client editor, hiding cost | High | High | Scope the client editor immediately after OQ-2 |

---

## 15. Next steps

1. Close **OQ-2** (styling ownership), blocking the client-side spec.
2. Produce the **OQ-1** onboarding measurement from two real clients.
3. Shivam to size §7 against §9 and §10 and return a v1 / later split (OQ-5).
4. On OQ-2's answer, write the client-editor BA document against §10's contract.
