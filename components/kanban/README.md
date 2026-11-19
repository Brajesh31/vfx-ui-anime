# 🗂️ VFX Kanban Board

A three-lane task board with drag-and-drop movement, keyboard/touch lane selectors, live lane counts, and a local card API.

```html
<script src="/components/kanban/index.js"></script>
<vfx-kanban lanes="Backlog|In progress|Done" items="brief::Write the brief::0|prototype::Build a prototype::1|release::Ship the first release::2"></vfx-kanban>
```

## API
- `lanes`: pipe-separated lane names. Updating it rebuilds the board and clamps cards into the available lanes.
- `items`: pipe-separated `id::title::laneIndex` records. Updating it replaces the current cards.
- `cards`: read or replace the board with objects `{id,title,lane}`.
- `move(id, laneIndex)`: move a card and return whether it changed.
- `addCard(title, laneIndex, id?)`: add a card. Duplicate ids throw an error.

## Events
- `change`: `detail.card`, `detail.from`, `detail.to`, and a copy of `detail.cards`.
- `add`: the new `detail.card` and updated `detail.cards`.

## Interaction and accessibility
Native drag-and-drop works with a mouse. Each card also has a native lane selector, so touch and keyboard users do not depend on drag gestures. Labels are escaped before insertion into the component.

## Limits
The board is local state only. It does not persist changes, implement permissions, or synchronize with a server. Save the change/add event data in the host application.
