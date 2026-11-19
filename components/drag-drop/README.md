# 🧲 VFX Drag and Drop

A reorderable single list with native drag-and-drop, touch-friendly move buttons, keyboard reordering, and committed change events.

## 🚀 Quick start
\`\`\`html
<script src="/components/drag-drop/index.js"></script>
<vfx-drag-drop items="Research|Prototype|Launch"></vfx-drag-drop>
\`\`\`

## ⚙️ API

| API | Description |
|---|---|
| \`items\` attribute | Pipe-separated labels. Changes to the attribute rebuild the list. |
| \`items\` property | Read or replace the labels with a string array. The getter returns a copy. |
| \`value\` | Read-only copy of the current order. |
| \`move(from, to)\` | Move between zero-based indexes. Returns \`true\` only when an order change is made. |

An empty list displays an explicit empty state. Empty labels are discarded.

## 📣 Events
- \`change\`: detail includes \`items\` (copied array), \`from\` (original index), and \`to\` (new index).

## ⌨️ Interaction and accessibility
- Drag a row with a mouse or compatible pointer.
- Use the Up and Down buttons on touch devices or whenever dragging is unavailable.
- Focus a row's move button and press **Alt + ArrowUp** or **Alt + ArrowDown** to reorder.
- Keyboard reordering restores focus to an available move button in the moved row.
- Buttons have item-specific accessible names. A polite status message announces the new position.
- Item labels are escaped before rendering.

## 🧩 Example
\`\`\`js
const list = document.querySelector('vfx-drag-drop');
list.addEventListener('change', (event) => {
  saveOrder(event.detail.items);
});
\`\`\`

## 🛡️ Scope and limits
The component manages one in-memory list. It does not persist order, synchronize remote state, or move items between separate lists. Persist the emitted \`items\` array in the host application.
