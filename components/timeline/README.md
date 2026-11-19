# 🗓️ VFX Timeline

A chronological milestone sequence with a selectable active step, semantic list structure, keyboard navigation, and live status feedback.

## 🚀 Quick start
\`\`\`html
<script src="/components/timeline/index.js"></script>
<vfx-timeline items="Discover::Define the problem::01 / PLAN|Build::Create the solution::02 / MAKE|Launch::Ship it::03 / SHIP"></vfx-timeline>
\`\`\`

## ⚙️ API

| API | Description |
|---|---|
| \`items\` attribute | Pipe-separated items formatted as \`title::description::date\`. |
| \`items\` property | Read or replace with objects (\`title\`, \`desc\`, \`date\`) or formatted strings. Getter returns copied objects. |
| \`activeIndex\` | Read or write the active zero-based milestone index. |
| \`select(index)\` | Select a milestone. Returns \`true\` when the active item changes, otherwise \`false\`. |

Without an \`items\` attribute, a three-step example is shown. An explicitly empty list displays an empty state. If the list shrinks, the active index is clamped to the last available item.

## 📣 Events
- \`select\`: detail includes \`index\`, \`title\`, \`desc\`, and \`date\`.

## ⌨️ Interaction and accessibility
- Milestones are buttons inside an ordered list.
- Only the active milestone button is in the normal Tab order.
- Use **ArrowUp** and **ArrowDown** to move, **Home** for the first milestone, and **End** for the last.
- The selected step exposes \`aria-current="step"\`.
- A polite live region announces the active milestone.

## 🧩 Example
\`\`\`js
const timeline = document.querySelector('vfx-timeline');
timeline.addEventListener('select', ({ detail }) => {
  console.log(detail.index, detail.title);
});
timeline.items = [
  { title: 'Plan', desc: 'Define scope', date: '01 / PLAN' },
  { title: 'Build', desc: 'Create the solution', date: '02 / MAKE' }
];
\`\`\`

## 🛡️ Scope and limits
This is a presentation and selection control. It does not infer dates, calculate durations, track completion, or persist changes.
