# slate

A dark theme for [copyparty](https://github.com/9001/copyparty).

copyparty exposes about 157 CSS custom properties. This is a single stylesheet
that redefines the ones driving appearance and touches nothing else, so every
feature keeps working: resumable uploads, share links, WebDAV, the media player.

No build step, no JavaScript, no extra service. One CSS file.

## Design

Neutral dark surfaces with a single cool accent. Flat rather than glossy: inner
shadows and glows are removed, separation comes from lines and elevation steps.
Sizes and timestamps use tabular numerals so columns line up.

Every foreground and background pair is WCAG AA or better. The lowest ratio is
6.85, for muted text on the base surface. Most pairs are AAA.

| Token | Value | Role |
|---|---|---|
| `--slate-base` | `#0f1115` | page background |
| `--slate-sunk` | `#0a0c10` | recessed areas, tree, inputs |
| `--slate-r1` | `#151821` | raised one step |
| `--slate-r2` | `#1b1f2a` | raised two steps |
| `--slate-r3` | `#232834` | raised three steps |
| `--slate-line` | `#2b3140` | borders |
| `--slate-text` | `#d6dae3` | body text |
| `--slate-bright` | `#f4f6fa` | emphasis |
| `--slate-muted` | `#949cad` | secondary text |
| `--slate-accent` | `#6aa9f4` | links, focus, primary buttons |

Status colours are `#78c99a` ok, `#e0b357` warning, `#e88c8c` error.

## Two parts

`slate.css` handles colour. `slate.js` handles labels.

copyparty builds its toolbars in JavaScript and labels most controls with a
single emoji: a rocket for upload, a fire extinguisher for undo, a trumpet for
the media player. That is compact, but unreadable unless you already know the
vocabulary, and CSS cannot reach it because the text lives in the DOM.

`slate.js` swaps them for words, using copyparty's own tooltips as the source of
truth. It only rewrites label text; ids, classes, handlers and layout are left
alone, so nothing breaks. A MutationObserver reapplies it when copyparty rebuilds
a toolbar after a tab switch.

Anything not in its lookup table keeps working: unknown controls have decoration
stripped only when readable text remains, so a control is never left blank.

Either file works without the other.

## Install

Put `slate.css` and `slate.js` somewhere the browser can fetch, then point
copyparty at them.

Serving it through a reverse proxy keeps it outside copyparty's auth, so the
stylesheet loads on the login page too. With Caddy:

    files.example.com {
        handle_path /_theme/* {
            root * /var/lib/copyparty/theme
            file_server
        }
        reverse_proxy 127.0.0.1:3923
    }

Then in your copyparty config:

    [global]
      css-browser: /_theme/slate.css
      js-browser: /_theme/slate.js

or on the command line:

    copyparty --css-browser /_theme/slate.css --js-browser /_theme/slate.js

Restart copyparty. Confirm it is loading:

    curl -s -A "Mozilla/5.0" https://files.example.com/ | grep slate.css

You should see it listed after copyparty's own stylesheets, which is what lets
the overrides take effect.

## Removing it

Delete the `css-browser` and `js-browser` lines and restart. Nothing else
changes; the stock look comes back. Neither file adds state or dependencies.

## Notes

The selector targets the base `html` element and copyparty's built in theme
classes (`a` through `e` and their dark variants), so it applies whichever of the
ten stock themes is selected.

Two small structural rules go beyond recolouring: row separation uses a hairline
instead of banding, and form inputs get a flat border with an accent focus ring.
Both are near the bottom of the file and easy to delete if you want colours only.

## Licence

MIT.
