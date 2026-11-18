# 🗂️ VFX Kanban Board

A three-lane task board with drag-and-drop movement and accessible lane selectors.

```html
<script src="/components/kanban/index.js"></script>
<vfx-kanban lanes="Backlog|In progress|Done" items="brief::Write the brief::0|prototype::Build a prototype::1|release::Ship the first release::2"></vfx-kanban>
```

## API
- `lanes`: pipe-separated lane names.
- `items`: pipe-separated `id::title::laneIndex` records.
- `cards`: read or replace the board with card objects `{id,title,lane}`.
- `move(id, laneIndex)`: move a card and return whether it changed.
- `addCard(title, laneIndex, id?)`: add a new card.

## Events
- `change`: card, from, to, and full cards array.
- `add`: added card and updated cards array.

## Accessibility and limits
Each task has a native select for lane changes, so touch and keyboard users do not depend on drag gestures. Drag-and-drop is native HTML. This is a local board, it does not save to a server or implement permissions.
