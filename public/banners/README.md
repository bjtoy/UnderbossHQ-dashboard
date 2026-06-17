# Guide banner images

Drop wide banner PNGs here (recommended **960×540** or **1200×400**). They are used in:

- **Dashboard** guide preview (`/banners/{name}.png`)
- **Discord** embed images when guides are posted

## Background files

| File | Guide markup |
|------|----------------|
| `crimson.png` | `bg=crimson` |
| `gold.png` | `bg=gold` |
| `noir.png` | `bg=noir` |
| `velvet.png` | `bg=velvet` |
| `smoke.png` | `bg=smoke` |
| `ledger.png` | `bg=ledger` |
| `neon.png` | `bg=neon` |
| `ember.png` | `bg=ember` |

Optional style banners (when `bg=default`):

| File | Banner style |
|------|----------------|
| `styles/fancy.png` | `:::banner-fancy` |
| `styles/gaming.png` | `:::banner-gaming` |
| `styles/tactical.png` | `:::banner-tactical` |
| `styles/minimal.png` | `:::banner-minimal` |
| `styles/standard.png` | `:::banner-standard` |

Images must be publicly reachable over HTTPS after deploy (Vercel serves this folder as static assets).
