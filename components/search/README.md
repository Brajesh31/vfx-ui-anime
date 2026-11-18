# Search

A search field with keyboard-navigable suggestions, clear action, live value events, and a dedicated search event.

Part of **VFX UI Anime**, an expressive collection of native Web Components. This component uses the shared VFX motion and effects runtime embedded in its own JavaScript file. It has no external runtime dependency and can be used on a plain HTML page.

## Run the demo

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/components/search/demo.html
```

## Install manually

Copy `index.js` into your project and load it with a regular script tag. Do not load it as an ES module.

```html
<script defer src="/components/search/index.js"></script>
<vfx-search label="Search" placeholder="Search components" suggestions="Button|Toggle|Slider" name="query"></vfx-search>>
```

## API

| Attribute | Purpose | Default |\n|---|---|---|\n| `label` | Accessible input name | `Search` |\n| `placeholder` | Empty-field guidance | `Search…` |\n| `value` | Initial query | empty |\n| `suggestions` | Pipe-separated suggestion values | none |\n| `name` | Form field name | none |\n| `disabled` | Disables the search field | off |

## Events

- `input`: emitted while the query changes, with `{ value }` in `detail`.\n- `search`: emitted on Enter or the search button, with `{ value }` in `detail`.\n- `change`: emitted when a search is submitted or a suggestion is committed.\n\nSuggestions filter as the user types. Arrow keys move through matches, Enter commits, and Escape closes the list.

## Motion and visual behavior

- The control is visually quiet at rest. Effects are created in response to real pointer, keyboard, input, selection, or drop actions.
- Presses and state changes use spring motion, impact marks, small smoke puffs, ticks, shards, or manga lettering from the VFX UI Anime runtime.
- State updates happen immediately. The animation never controls whether a value is accepted or a form can be submitted.
- The effect layer respects `prefers-reduced-motion`. The control remains operable and its value still changes when reduced motion is enabled.
- Colors inherit the project tokens such as `--vfx-ink`, `--vfx-pri`, `--vfx-acc`, `--vfx-soft`, and `--vfx-sh`.

## Accessibility and integration

Use a meaningful label. Keep the component in normal document flow and avoid clipping its effects with an ancestor that has `overflow: hidden`. Keyboard interaction is supported according to the control type. Value-bearing controls expose their value and participate in forms through form-associated custom element internals.

## Limits

- The component uses modern browser APIs. Test the exact browsers and assistive technologies used by your application.
- The standalone demo is the source of truth for its current visual preview and interaction wiring.
- This component is an original VFX UI Anime addition. The third-party notice in the repository applies to the eleven adapted original controls and their associated artwork, not this new implementation.
