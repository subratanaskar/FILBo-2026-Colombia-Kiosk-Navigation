# FILBo 2026 Kiosk UI (1920x1080)

This project is a self-contained kiosk UI:

1. Welcome -> Intro -> Explore -> Navigation Map
2. Zone tiles, popups, map interactions, bilingual EN/ES copy

Open `index.html` in a modern browser to run it.

## Code structure

- `data.js`: all static content/constants (zones, copy, map label data, shapes)
- `state.js`: UI state, shared helpers, scaling setup
- `ui.js`: rendering, events, runtime behavior
- `footsteps-data.js`: generated map footstep path data

## Validation

Run this before/after edits:

```bash
npm run validate
npm run check-all
```

It checks:

- JavaScript syntax for `footsteps-data.js`, `data.js`, `state.js`, `ui.js`
- Missing static `./assets/...` references from JS/HTML/CSS

`check-all` currently runs the full validation suite and is kept as the main team command.

## Notes

- For best visual fidelity, install fonts `Funnel Display` and `Funnel Sans` on kiosk devices.
- All local assets are under `assets/`.
