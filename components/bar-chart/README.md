# 📊 Bar Chart

A responsive SVG bar chart with signed values, keyboard-operable bars, live data updates, and selection events. No runtime dependencies.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-bar-chart title="Monthly signups" labels="Jan,Feb,Mar" values="18,32,-4"></vfx-bar-chart>
\`\`\`

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`title\` | Bar chart | Heading and accessible chart title |
| \`values\` | 18,32,24,48,38,64 | Comma-separated finite numbers. Negative and zero values are supported. |
| \`labels\` | Jan,Feb,Mar,Apr,May,Jun | Comma-separated category names |

The \`values\` and \`labels\` properties accept arrays:
\`\`\`js
const chart = document.querySelector('vfx-bar-chart');
chart.values = [12, 18, -4, 25];
chart.labels = ['North', 'South', 'West', 'East'];
chart.select(3);
console.log(chart.selectedIndex);
\`\`\`

Invalid numeric entries are skipped without shifting source indexes. An empty or invalid series shows a no-data state.

## 📣 Events

The bubbling, composed \`select\` event fires on pointer or keyboard activation.
\`\`\`js
chart.addEventListener('select', (event) => {
  const { index, label, value } = event.detail;
  console.log({ index, label, value });
});
\`\`\`
The \`select(index)\` method returns \`true\` when a data point exists, otherwise \`false\`.

## ♿ Accessibility and behavior

- Each bar exposes button semantics, a descriptive accessible name, visible focus, and Enter/Space activation.
- The SVG contains a title and a data description.
- The chart scales to its container and uses a zero baseline for signed values.
- Labels are inserted as text, not interpreted as HTML.
- Attribute changes rerender the chart without reconnecting the element.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/bar-chart/demo.html\` from a local server.

## ⚠️ Limits
This is a compact single-series chart. It does not provide numeric tick labels, stacked series, zooming, or data fetching. Supply authorized data from your application.
