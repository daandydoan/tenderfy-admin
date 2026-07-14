# Tenderfy Admin Portal — Prototype

Static HTML click-through prototype of the Tenderfy **Super Admin** portal, extracted
from the [subbie-portal prototype](https://github.com/daandydoan/tenderfy-subbie-portal)
(`superadmin/` section) so the admin side can grow as its own project.

## Screens

| File | Screen |
|---|---|
| `index.html` | Admin dashboard — company overview, revenue chart, latest subscribers |
| `subcontractors.html` | Subcontractor list |
| `view-subbie.html` | Subcontractor detail |

Sidebar items without a real screen yet (Manage Company, Subscriptions, AI Usage,
Reports) show a placeholder toast — they are the expansion points.

## Structure

- `styles.css` — full shared stylesheet copied from the subbie-portal prototype
  (admin uses the `capp` / `c-side` / `c-*` shell and `sa-*` components; the rest
  is available for new screens)
- `app.js` — trimmed to what the admin pages use: placeholder-action toasts
  (`data-toast`) and the hidden-scrollbar toggle
- No build step — open `index.html` or serve the folder statically

## Run locally

```
npx serve -l 8001 .
```
