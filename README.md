# Tenderfy Admin Portal — Prototype

Static HTML click-through prototype of the Tenderfy **Super Admin** portal. Originally extracted
from the [subbie-portal prototype](https://github.com/daandydoan/tenderfy-subbie-portal), now
redesigned around a global component library and a self-serve template builder.

See **[DESIGN.md](DESIGN.md)** for the IA, the answers to the open design questions, and the
lifecycle/roles model.

## Sections (reorganised IA)

| Page | Section |
|---|---|
| `index.html` | **Dashboard** — overview stats, revenue chart, quick links |
| `blocks.html` | **Blocks** — content blocks behind Tenderfy's Block Builder; standard set + custom blocks |
| `library.html` · `component-detail.html` | **Documents** — reusable document sections by type (Resumes, Case Studies, Policies, Insurances, Certifications, Org Chart, Cover Pages, TOC, Others), assembled from blocks |
| `templates.html` · `template-builder.html` | **Templates** — assemble documents into a tender architecture; save as **Preset** or assign to clients |
| `tenants.html` · `tenant-detail.html` | **Clients** — client companies + per-client Brand Kit, plan & credits; **AI Usage** tab |
| `subcontractors.html` · `view-subbie.html` | **Subcontractors** — the clients' supply chain: onboarding status, compliance, activity |
| `subscriptions.html` | **Subscriptions** — global plan catalog (reference; editor in production) |
| `qa.html` | **QA** — review queue, Draft→In review→Approved→Live pipeline |
| `settings.html` | **Settings** — roles & permissions, security, **Informative pages** |

Subcontractors are a distinct entity from Clients (the customer companies): clients are the
head contractors; subcontractors are who they invite to quote. The `tenants.html` /
`tenant-data.js` filenames and internal ids are kept as-is — only the visible label is "Clients".

**Placement of the live admin's billing/CMS areas** (from the redesign audit):
- **AI Usage** is per-client data, so it lives *inside* Clients (a tab + a credits panel on each
  client's detail) rather than as a top-level section.
- **Manage Subscription** is the global *plan catalog* (not per-client), so it stays top-level
  as **Subscriptions**. A client's chosen plan/credits show on their detail page.
- **Informative Pages** (T&Cs etc.) is platform content, so it sits under **Settings**.
- Subscriptions and Informative Pages are reference placeholders that deep-link to the live
  super admin (`stgsuperadmin.tenderfy.org`); their editors aren't rebuilt in the prototype.

## Structure

- `styles.css` — shared base stylesheet (unchanged copy from the subbie prototype)
- `admin.css` — header / sidebar hover / chart / drawer / register-modal styles
- `components.css` — library, builder, tenants, QA, settings components
- `shell.js` — single-source chrome (sidebar IA + header) injected on every page
- `library-data.js`, `tenant-data.js` — shared prototype data (components, tenants + brand kits)
- `dashboard.js`, `builder.js` — page logic (chart/modal; builder assemble/brand/preview/assign)
- Each page exposes a `pageInit()` the shell calls after the chrome is built
- Deep links use `#id=` hash params. No build step.

## Run locally

```
npx serve -l 8001 .
```
