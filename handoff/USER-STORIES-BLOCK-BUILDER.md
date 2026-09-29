# Block Builder, user stories

**Version** 0.1, draft for refinement · 30 September 2026
**Author** Daniel (dev + UI/UX)
**Scope** The admin Block Builder feature set: `blocks.html`, `block-edit.html`, `block-view.html`, and the client picker that precedes them.
**Traces to** `handoff/BA-ADMIN.md` §7 M4 (FR-M4-1 to FR-M4-10) and §8 business rules.
**Not in scope** Document Builder, tender templates, QA, the client-side editor. Those get their own backlogs.

---

## How to read this

Each story is written as **As a / I want / so that**, with acceptance criteria in Given / When / Then. The story is the headline for a conversation; the detail sits in the BA document, referenced in the **Traces** line.

- **ID** `BB-nn`, stable. Do not renumber when the order changes.
- **Size** S (under a day), M (a few days), L (needs splitting before it is pulled into a sprint).
- **Priority** MoSCoW, proposed by the author, to be confirmed in refinement.
- **BLOCKED** marks a story that cannot be finalised until an open question in the BA document is answered.

### Roles

| Role | Who | Used in stories as |
|---|---|---|
| Onboarding admin | Tenderfy staff building a client's kit, the primary user of every story here | "onboarding admin" |
| Library manager | Staff maintaining the shared block library across clients | "library manager" |
| Client owner | The contractor signing off brand and content. Never opens this screen. | referenced in "so that" only |

### Definition of Done (applies to every story)

1. Works in the Block Builder canvas, in Preview, and when the block is placed in a document. One renderer, no second code path (NFR-2, invariant I-2).
2. Survives a reload: the draft is autosaved and resumes.
3. Does not write to another client's data (BR-5).
4. Keyboard reachable, visible focus state, Esc deselects (NFR-7).
5. Any deliberate stand-in is badged `concept` on screen.

---

## Epic map

| Epic | Covers | Stories |
|---|---|---|
| E1 Start a block | Entry points, client ownership, naming | BB-01 to BB-03 |
| E2 Compose the structure | Rows, columns, insert, drag, repeat rows | BB-04 to BB-09 |
| E3 Put the content in | Inline text, tables, images, data elements | BB-10 to BB-15 |
| E4 Style it | Typography, layout, appearance, brand inheritance | BB-16 to BB-21 |
| E5 Draft it with Ray | Screenshot, description, provenance | BB-22 to BB-24 |
| E6 Save and reuse | Save dialog, drafts, versions, duplication, sharing | BB-25 to BB-31 |
| E7 Find and manage | Blocks list, categories, search, usage | BB-32 to BB-35 |
| E8 Inspect | Code view | BB-36 |

---

## E1. Start a block

### BB-01 Choose who the block is for
**As an** onboarding admin, **I want** to be asked which client a new block belongs to before I start building, **so that** a client's content can never end up in another client's library by accident.

- Given I choose New Block from the Blocks list
- When the builder opens
- Then I am asked "Who is this block for?" before I can add anything
- And the list of clients is scrollable and searchable
- And "General library block" is the only option that creates a block with no client

**Traces** FR-M4-1, BR-5 · **Size** S · **Priority** Must

### BB-02 Start from a client I am already working on
**As an** onboarding admin, **I want** to open the builder straight from a client's detail page with that client already selected, **so that** I am not re-picking the client I was just looking at.

- Given I am on a client's detail page
- When I choose Build blocks
- Then the builder opens with that client selected and their brand applied
- And I am not shown the client picker

**Traces** FR-M4-1 · **Size** S · **Priority** Should

### BB-03 Name the block only when it is worth naming
**As an** onboarding admin, **I want** to build first and name the block at save time, **so that** I am not blocked by a naming decision before I know what the block is.

- Given a new, unnamed block
- When I add elements
- Then the header reads "Untitled block" and everything still works
- And the name is asked for at the first save, not before

**Traces** FR-M4-7 · **Size** S · **Priority** Must

---

## E2. Compose the structure

### BB-04 Add an element
**As an** onboarding admin, **I want** to add an element by dragging it in or clicking it in the panel, **so that** I can build at whatever pace suits the section.

- Given the Elements tab with groups Structure, Text, Media, Data, Sign-off
- When I drag an element onto the canvas, or click it
- Then it is inserted at the drop point, or appended when clicked
- And an empty canvas shows "Add your first element" rather than a blank area

**Traces** FR-M4-2 · **Size** M · **Priority** Must

### BB-05 Insert between two elements
**As an** onboarding admin, **I want** an insert point between existing elements, **so that** I can add a paragraph into the middle of a section without dragging past everything.

- Given two elements on the canvas
- When I hover the gap between them
- Then an insert line appears and offers a quick picker
- And the element I choose lands in that gap, not at the end

**Traces** FR-M4-2 · **Size** S · **Priority** Should

### BB-06 Lay out a row in columns
**As an** onboarding admin, **I want** to put a row into 2 or 3 columns, **so that** I can recreate a section where text sits beside an image.

- Given a row on the canvas
- When I add a 2 or 3 column layout
- Then each column accepts its own elements
- And I can set the column ratio
- And a full width element can still be added below the layout frame

**Traces** FR-M4-2 · **Size** M · **Priority** Must

### BB-07 Align content inside a row
**As an** onboarding admin, **I want** to set vertical alignment per column and horizontal alignment per element, **so that** a caption can sit against the bottom of an image beside it.

- Given a multi column row
- When I set vertical alignment on one column
- Then only that column's content moves
- And horizontal alignment applies to elements that are narrower than their column

**Traces** FR-M4-2, FR-M4-4 · **Size** M · **Priority** Should

### BB-08 Repeat a row per item
**As an** onboarding admin, **I want** to mark a row as "one per item" down or across, **so that** a resume block lists one project per entry without me duplicating the row.

- Given a row of elements
- When I mark it Repeat down or Repeat across
- Then the row is badged as a repeater on the canvas
- And a ghost of the next item is shown so the pattern is obvious
- And the block records the row as structure, not as two separate rows

**Traces** FR-M4-5, invariant I-4 · **Size** M · **Priority** Must
**Note** The estimator's "add another item" lives in the client editor, not here.

### BB-09 Separate two parts of a section
**As an** onboarding admin, **I want** a divider element, **so that** I can break a long section visually without faking it with an empty paragraph.

- Given any point in the block
- When I add a Divider from Structure
- Then a rule is drawn, and it is stylable like any other element

**Traces** FR-M4-2 · **Size** S · **Priority** Could

---

## E3. Put the content in

### BB-10 Edit words where they sit
**As an** onboarding admin, **I want** to type directly onto the canvas, **so that** I am reading the block the way it will print while I fix its wording.

- Given any text element
- When I click into it
- Then I can type in place, and the caret is not lost when the canvas repaints
- And bold, italic, underline, strike and link are available on the selection

**Traces** FR-M4-3 · **Size** M · **Priority** Must

### BB-11 Format from the side panel too
**As an** onboarding admin, **I want** the same rich text controls in the Style panel for the selected element, **so that** I can format without hunting for a floating toolbar.

- Given a selected text element
- When I open the Style tab
- Then the rich text controls act on the current canvas selection
- And the panel and canvas stay in step

**Traces** FR-M4-3 · **Size** S · **Priority** Should

### BB-12 Hold a fact as a merge field
**As an** onboarding admin, **I want** to insert a merge field instead of typing a fact, **so that** a licence or insurance number can never be sent out of date inside prose.

- Given a fact with a shelf life, for example ABN, licence number, insurance expiry
- When I insert it as a merge field
- Then it renders as a resolvable placeholder, visibly distinct on the canvas
- And it resolves per document at render time

**Traces** FR-M4-2, BR-10 · **Size** M · **Priority** Must

### BB-13 Show a table of figures
**As an** onboarding admin, **I want** a table element whose shape I can set, **so that** I can rebuild a client's compliance matrix or stats table.

- Given a table element
- When I set rows and columns in the Style panel
- Then the table reshapes without losing the cells that remain
- And each cell takes inline rich text

**Traces** FR-M4-2, FR-M4-3 · **Size** M · **Priority** Must

### BB-14 Place an image
**As an** onboarding admin, **I want** to place an image and set how it fills its box, **so that** a site photo sits correctly in a two column row.

- Given an image element
- When no image is chosen
- Then it renders as a placeholder that still shows the block's real proportions
- And I can set the source, and cover, contain or stretch
- And "Client logo" inherits each client's own logo rather than a fixed file

**Traces** FR-M4-2 · **Size** M · **Priority** Must

### BB-15 Add sign-off and headline figures
**As an** onboarding admin, **I want** signature blocks, key/value rows and stat elements, **so that** I can rebuild the parts of a tender that are not paragraphs.

- Given the Data and Sign-off groups
- When I add a key/value list, a stat or a signature
- Then each renders correctly in the canvas, in Preview and in a document

**Traces** FR-M4-2 · **Size** M · **Priority** Should

---

## E4. Style it

### BB-16 Style the selected element, not the whole block
**As an** onboarding admin, **I want** selecting an element to open its own Style tab, **so that** I am never guessing which thing my change will hit.

- Given an element on the canvas
- When I select it
- Then the panel switches to Style and names what I am editing
- And pressing Esc deselects and returns me to the Elements tab

**Traces** FR-M4-4 · **Size** S · **Priority** Must

### BB-17 Set typography for a text element
**As an** onboarding admin, **I want** a typography panel with font, weight, size, line height, letter spacing, colour and alignment, **so that** I can match a heading the client already uses.

- Given a selected text element
- When I change a typography value
- Then the canvas updates immediately
- And any value left as "Inherit from brand" follows the client's brand rather than a hardcoded default

**Traces** FR-M4-4, BR-13 · **Size** M · **Priority** Must

### BB-18 Size and space an element
**As an** onboarding admin, **I want** width, height, padding and margin controls including drag to adjust, **so that** I can tighten a block's spacing without editing numbers one at a time.

- Given a selected element
- When I drag the scrub handle on a spacing field
- Then the value changes live and the canvas follows
- And padding and margin can be edited as one value or per side

**Traces** FR-M4-4 · **Size** M · **Priority** Should

### BB-19 Add a fill, stroke or corner radius
**As an** onboarding admin, **I want** to add a fill or stroke only when I want one, **so that** an unstyled element does not carry invisible borders or reserved space.

- Given an element with no fill and no stroke
- When I open Appearance
- Then the Fill and Stroke sections are shown as not yet added, with no reserved gap
- And adding one reveals its colour, opacity and, for a stroke, position, weight and style
- And a stroke of zero weight renders as no stroke

**Traces** FR-M4-4 · **Size** M · **Priority** Should

### BB-20 See the block in the client's brand
**As an** onboarding admin, **I want** the canvas to render in the selected client's brand, **so that** what I am building is what the client will receive.

- Given a block owned by a client with an approved brand
- When I build or preview it
- Then brand colours and fonts are applied by the renderer
- And the header shows which brand is in use and when it was approved

**Traces** FR-M3-5, BR-13 · **Size** M · **Priority** Must

### BB-21 Compare the same block in another brand
**As a** library manager, **I want** to preview a block rendered in a different client's brand, **so that** I can tell whether a generic block really is brand neutral.

- Given any block
- When I choose another client under Preview style
- Then the block re-renders in that brand, for comparison only
- And nothing about the saved block changes

**Traces** FR-M3-5, BR-6 · **Size** S · **Priority** Should

---

## E5. Draft it with Ray

### BB-22 Draft a block from a screenshot
**As an** onboarding admin, **I want** to paste or drop a screenshot of the client's existing section and have it laid out as elements, **so that** I am not retyping a page of their safety statement.

- Given a screenshot or photo of a section
- When I drop, upload or paste it, optionally adding a description, and choose Draft block
- Then the canvas is filled with elements matching the source layout and text
- And the result is editable like any hand built block

**Traces** FR-M4-6 · **Size** L, split before sprinting · **Priority** Should
**Note** The prototype keyword matches the description and ignores the image. This story is the real behaviour, and must not be estimated as done.

### BB-23 Try it without a client file
**As an** onboarding admin, **I want** a sample to try the drafting flow with, **so that** I can learn what it does before I use a client's document.

- Given the AI Draft tab
- When I choose "Try with a sample"
- Then a worked example is drafted onto the canvas

**Traces** FR-M4-6 · **Size** S · **Priority** Could

### BB-24 Keep the provenance of a drafted block
**As an** onboarding admin, **I want** the block to record that Ray drafted it from a named image, **so that** months later I can tell where its wording came from.

- Given a block drafted from an image
- When I save it
- Then the source image and what was read from it are stored with the block
- And the block shows "Drafted by Ray from an image" with the reference

**Traces** FR-M4-6, NFR-5 · **Size** M · **Priority** Should

---

## E6. Save and reuse

### BB-25 Save a block for reuse
**As an** onboarding admin, **I want** the first save to ask for name, category and a helper description, and later saves to be one click, **so that** I am asked for the filing detail once and never again.

- Given an unsaved block
- When I choose Save block
- Then I am asked for internal name, category and helper description
- And on save it appears in the Blocks list and in the Document Builder's block picker
- And subsequent saves write straight through with no dialog

**Traces** FR-M4-7 · **Size** M · **Priority** Must

### BB-26 Not lose work to a closed tab
**As an** onboarding admin, **I want** my unsaved work to come back when I reopen the builder, **so that** an accidental close does not cost me a section.

- Given unsaved changes
- When the tab is closed and the builder reopened
- Then the draft is restored without asking
- And the header states honestly whether the work is saved or only drafted
- And if the draft cannot be stored, I am told, rather than shown a false "saved"

**Traces** FR-M4-7, NFR-3 · **Size** M · **Priority** Must

### BB-27 Build the next block immediately
**As an** onboarding admin, **I want** "Save and start another", **so that** I can work through a client's tender section by section without navigating back each time.

- Given a saved block
- When I choose Save and start another
- Then the block is saved and a new empty block opens for the same client

**Traces** FR-M4-7 · **Size** S · **Priority** Should

### BB-28 Start from a block that already exists
**As an** onboarding admin, **I want** to duplicate a block, **so that** a near identical variant does not have to be rebuilt.

- Given any block, saved or not
- When I duplicate it
- Then the canvas is kept, a new identity is created and the name is marked as a copy
- And saving the copy never writes over the original

**Traces** FR-M4-7 · **Size** S · **Priority** Should

### BB-29 Share a block with every client
**As a** library manager, **I want** to mark a block as a generic template at save time, **so that** a genuinely reusable section does not have to be rebuilt per client.

- Given a block being saved
- When I tick "Share as a generic template"
- Then I am warned that it must hold nothing client specific
- And the saved block carries no client and appears in every client's picker

**Traces** FR-M4-8, BR-6 · **Size** S · **Priority** Should

### BB-30 Go back to an earlier version
**As an** onboarding admin, **I want** to see a block's previous versions and restore one, **so that** a bad edit is recoverable.

- Given a block saved more than once
- When I open Version history
- Then earlier versions are listed with date and author
- And restoring one creates a new version rather than deleting history

**Traces** FR-M4-7 · **Size** M · **Priority** Should
**Note** The prototype stores versions in the browser only. Server side versioning is OQ-5.

### BB-31 Know that editing a block will not disturb existing documents
**As an** onboarding admin, **I want** to be told plainly that documents holding their own edited copy of this block will not pick up my change, **so that** I do not assume an edit has propagated when it has not.

- Given a block used in documents where the wording was edited locally
- When I edit and save the block
- Then documents that hold a local copy are unchanged
- And the builder states this rather than leaving it to be discovered

**Traces** BR-7, BR-8 · **Size** S · **Priority** Must

---

## E7. Find and manage

### BB-32 Find a block by category
**As an** onboarding admin, **I want** the Blocks list grouped by category with the first category open by default, **so that** I land on something useful rather than an undifferentiated list.

- Given the Blocks list
- When it loads
- Then the first category is selected, and "All blocks" is the last tab, not the default

**Traces** FR-M4-9 · **Size** S · **Priority** Should

### BB-33 Search for a block
**As an** onboarding admin, **I want** to search blocks by name, **so that** I can reach one directly when I already know what it is called.

- Given the Blocks list or the Document Builder's block picker
- When I type into search
- Then results filter as I type, within the current client's blocks plus generic blocks

**Traces** FR-M4-9 · **Size** S · **Priority** Should

### BB-34 See where a block is used
**As an** onboarding admin, **I want** to see how many documents use a block and open that list, **so that** I know the blast radius before I edit it.

- Given a saved block
- When I view it
- Then "Used in N documents" is shown, counted from real documents
- And clicking it lists them

**Traces** FR-M4-9, BO-4 · **Size** M · **Priority** Should
**Note** The prototype seeds this count. Real counting is part of OQ-5.

### BB-35 Retire a block without deleting history
**As a** library manager, **I want** to deactivate a block, **so that** it stops being offered for new documents without breaking the documents that already use it.

- Given a block used in existing documents
- When I deactivate it
- Then it no longer appears in pickers
- And existing documents render exactly as before

**Traces** FR-M4-9 · **Size** M · **Priority** Could

---

## E8. Inspect

### BB-36 Read the block's markup
**As a** developer, **I want** to see the generated markup for the current block, **so that** I can check what the renderer produces while integrating.

- Given a block on the canvas
- When I open the Code tab
- Then the markup reflects the block as it currently stands, refreshed on each change

**Traces** FR-M4-10 · **Size** S · **Priority** Could

---

## Blocked stories

| Story | Blocked by | What changes with the answer |
|---|---|---|
| BB-17 Typography | OQ-2 styling ownership | If brand owns type and colour outright, per element typography narrows to emphasis only |
| BB-18 Sizing and spacing | OQ-2 | Stays if the block owns layout, as proposed |
| BB-19 Fill, stroke, radius | OQ-2 | At risk of being removed entirely from element level |

No other story in this backlog depends on an open question.

---

## Deliberately not written as stories

| Item | Why | Where it belongs |
|---|---|---|
| "One renderer for canvas, preview and documents" | A system property, nobody asks for it | Definition of Done, invariant I-2 |
| "Blocks persist to an API rather than localStorage" | Not a user need, an implementation gap | OQ-5, technical enabler |
| The block data schema | Design, not need | BA document §10 |
| Multi select, smarter drafting, block analytics, starter libraries per trade | Parked by decision | BA document §1.4 |
| The styling ownership decision | A decision, not work | OQ-2 |

---

## Backlog summary

| ID | Story | Epic | Size | Priority |
|---|---|---|---|---|
| BB-01 | Choose who the block is for | E1 | S | Must |
| BB-02 | Start from a client I am on | E1 | S | Should |
| BB-03 | Name at save time | E1 | S | Must |
| BB-04 | Add an element | E2 | M | Must |
| BB-05 | Insert between elements | E2 | S | Should |
| BB-06 | Lay out a row in columns | E2 | M | Must |
| BB-07 | Align content in a row | E2 | M | Should |
| BB-08 | Repeat a row per item | E2 | M | Must |
| BB-09 | Divider | E2 | S | Could |
| BB-10 | Edit words in place | E3 | M | Must |
| BB-11 | Format from the panel | E3 | S | Should |
| BB-12 | Merge field | E3 | M | Must |
| BB-13 | Table | E3 | M | Must |
| BB-14 | Image | E3 | M | Must |
| BB-15 | Sign-off, key/value, stat | E3 | M | Should |
| BB-16 | Style the selected element | E4 | S | Must |
| BB-17 | Typography | E4 | M | Must, BLOCKED |
| BB-18 | Size and spacing | E4 | M | Should, BLOCKED |
| BB-19 | Fill, stroke, radius | E4 | M | Should, BLOCKED |
| BB-20 | Render in the client's brand | E4 | M | Must |
| BB-21 | Compare in another brand | E4 | S | Should |
| BB-22 | Draft from a screenshot | E5 | L | Should |
| BB-23 | Try with a sample | E5 | S | Could |
| BB-24 | Keep provenance | E5 | M | Should |
| BB-25 | Save for reuse | E6 | M | Must |
| BB-26 | Do not lose work | E6 | M | Must |
| BB-27 | Save and start another | E6 | S | Should |
| BB-28 | Duplicate | E6 | S | Should |
| BB-29 | Share as generic | E6 | S | Should |
| BB-30 | Version history | E6 | M | Should |
| BB-31 | Editing does not disturb documents | E6 | S | Must |
| BB-32 | Browse by category | E7 | S | Should |
| BB-33 | Search | E7 | S | Should |
| BB-34 | See where it is used | E7 | M | Should |
| BB-35 | Deactivate | E7 | M | Could |
| BB-36 | Read the markup | E8 | S | Could |

36 stories. 12 Must, 17 Should, 4 Could, 3 of which are blocked on OQ-2. One story, BB-22, is an L and needs splitting before it is pulled in.

---

## Next steps

1. Refine with Shivam: confirm sizes, split BB-22, challenge anything that is not really one story.
2. Close OQ-2, then finalise BB-17, BB-18 and BB-19.
3. Confirm the proposed MoSCoW priorities with Tom.
