# 🧭 VFX Radial Menu

An expanding action launcher arranged around a center trigger, with keyboard navigation, focus management, and selection events.

## 🚀 Quick start
\`\`\`html
<script src="/components/radial-menu/index.js"></script>
<vfx-radial-menu items="Create|Edit|Share|Preview|Export|Settings"></vfx-radial-menu>
\`\`\`

## ⚙️ API

| API | Description |
|---|---|
| \`items\` attribute | Pipe-separated labels, limited to eight actions. |
| \`label\` attribute | Accessible action-menu name. Defaults to "Actions". |
| \`items\` property | Read or replace actions with a string array. Getter returns a copy. |
| \`opened\` | Read-only open state. |
| \`show()\`, \`hide()\` | Open/close the menu. Return \`true\` when the state changes. |
| \`choose(index)\` | Select a zero-based action and emit \`select\`. Returns \`false\` for an invalid index. |

The built-in example actions appear when \`items\` is omitted. Empty data displays an empty state and prevents opening. Updating the list while open refreshes its actions.

## 📣 Events
- \`open\`: emitted when the menu opens.
- \`close\`: emitted when it closes.
- \`select\`: detail includes \`index\` and \`label\`.

## ⌨️ Interaction and accessibility
- The trigger exposes \`aria-haspopup="menu"\` and a synchronized \`aria-expanded\` value.
- Opening moves focus to the first action.
- Arrow keys move through the actions. **Home** and **End** focus the first or last action.
- **Escape** closes the menu and returns focus to the center trigger.
- Closed actions are inert and removed from the tab sequence.
- Action labels are escaped before rendering.

## 🧩 Example
\`\`\`js
const menu = document.querySelector('vfx-radial-menu');
menu.addEventListener('select', ({ detail }) => {
  if (detail.label === 'Export') exportProject();
});
\`\`\`

## 🛡️ Scope and limits
The component emits intent only. It does not execute commands, navigate routes, or enforce permissions. Connect its \`select\` event to application logic and enforce authorization in the host application.
