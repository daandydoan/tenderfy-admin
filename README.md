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
| `library.html` · `component-detail.html` | **Library** — global component library (browse, search, categories, statuses) |
| `templates.html` · `template-builder.html` | **Templates** — list + 3-pane self-serve builder |
| `tenants.html` · `tenant-detail.html` | **Tenants** — client companies + per-tenant Brand Kit |
| `subcontractors.html` · `view-subbie.html` | **Subcontractors** — the tenants' supply chain: onboarding status, compliance, activity |
| `qa.html` | **QA** — review queue, Draft→In review→Approved→Live pipeline |
| `settings.html` | **Settings** — roles & permissions, security |

Subcontractors are a distinct entity from Tenants (client companies): tenants are the
head contractors; subcontractors are who they invite to quote.

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
