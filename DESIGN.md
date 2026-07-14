# Super Admin Redesign — Design Notes

Prototype implementation of *"Redesign super-admin: global component library + self-serve
template builder."* Static HTML click-through on the existing Tenderfy design system.

## Reorganised IA

A single JS-injected shell (`shell.js`) gives every page the same navigation, so the IA is
defined in one place. Clear homes:

| Section | Page | Purpose |
|---|---|---|
| **Dashboard** | `index.html` | Overview, revenue, quick links into the new sections |
| **Library** | `library.html` → `component-detail.html` | Global component library (source of truth) |
| **Templates** | `templates.html` → `template-builder.html` | Self-serve builder |
| **Tenants** | `tenants.html` → `tenant-detail.html` | Client companies + Brand Kits |
| **QA** | `qa.html` | Review queue + lifecycle pipeline |
| **Settings** | `settings.html` | Roles & permissions, security |

Data lives in shared files (`library-data.js`, `tenant-data.js`) so the library browser and
the builder palette read the *same* component list.

## Answers to the open design questions

**1. Brand identity — per template or per tenant?**
**Stored per tenant, auto-applied on assign.** Components and templates are brand-neutral
(structure only). Each tenant holds a **Brand Kit** (logo, colours, fonts) on its detail page.
The builder's *Brand identity* panel is a **"Preview as tenant"** selector that pulls a tenant's
kit and applies it live to the canvas and preview. Assigning a template to N tenants makes each
render with its own kit — no duplicate per-brand templates, and a brand change propagates
everywhere. This is what makes "build once, reuse everywhere, brand per client" actually hold.

**2. Best interaction for assembling / reordering components?**
**Three-pane builder**: searchable library palette (left) → document canvas (centre) →
properties/brand/assign (right). Components are added by **click or drag** from the palette and
**reordered by dragging** the grip handle; each block has a remove control. The canvas shows a
brand bar + ordered blocks so it reads like the document being built.

**3. Roles for build vs QA sign-off?**
**Separated** (Settings › Roles): **Template Builder** creates/edits drafts and submits for
review but cannot approve; **QA Approver** approves/publishes but doesn't build (so nobody
approves their own work); **Library Manager** owns components; **Super Admin** holds all.

## Lifecycle / QA

- **Components:** Draft → Published → Deprecated (shown as status badges + filter in the library).
- **Templates:** Draft → In review → Approved → Live. The builder's *Submit for Review* moves a
  draft into the QA queue (`qa.html`), where an approver can Approve (→ ready for live) or Reject
  (→ back to draft). The pipeline header shows counts at each stage.

## Global-by-default availability

Every component is available to all tenants by default; restricting to specific tenants is a
deliberate, visible exception (lock badge in the library, "Manage availability" on the detail
page). The two seeded exceptions — *Environmental Row* and *Legacy HSE Policy* — model the
real inconsistency this redesign removes.

## Suggested phasing (as delivered)

1. IA reorg + global library — `shell.js`, `library.html`, `component-detail.html`
2. Builder — `template-builder.html` + `builder.js`
3. Brand + QA — Brand Kit on `tenant-detail.html`, `qa.html`, roles in `settings.html`

## Notes

- Deep links use `#id=` hash params (survive the local `serve` clean-URL rewrite; work on GitHub Pages).
- The legacy subcontractor screens (`subcontractors.html`, `view-subbie.html`) are a different
  entity and are intentionally left on their original chrome, outside the new IA.
- All data is in-memory prototype data; actions that would hit a backend show a toast.
