# 🍩 Donut Chart

A responsive SVG proportion chart with a synchronized category legend, accessible slice selection, and live data updates. No runtime dependencies.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-donut-chart title="Traffic sources" labels="Direct,Search,Social" values="45,30,25"></vfx-donut-chart>
\`\`\`

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`title\` | Donut chart | Heading and accessible chart title |
| \`values\` | 45,30,15,10 | Comma-separated finite numbers. Negative values are clamped to zero. |
| \`labels\` | Direct,Search,Social,Other | Comma-separated category labels |

Both properties accept arrays:
\`\`\`js
const chart = document.querySelector('vfx-donut-chart');
chart.values = [52, 28, 14, 6];
chart.labels = ['Direct', 'Search', 'Social', 'Referral'];
chart.select(0);
\`\`\`
Percentages are calculated from positive values. Invalid entries are ignored. A series without a positive total shows a no-data state.

## 📣 Events
The bubbling, composed \`select\` event fires when a slice or legend row is activated.
\`\`\`js
chart.addEventListener('select', (event) => {
  const { index, label, value, percent } = event.detail;
  console.log(label, value, percent);
});
\`\`\`
Use \`select(index)\` to select a category. It returns \`false\` for invalid indexes and zero-value categories.

## ♿ Accessibility and behavior
- Non-zero SVG slices are keyboard reachable and expose category, value, and percentage.
- Legend entries are real buttons and share the slice selected state.
- The SVG contains a title and a data description.
- Category text is written through text nodes.
- Attribute changes update the ring and legend together.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/donut-chart/demo.html\` from a local server.

## ⚠️ Limits
This is a single-ring chart. It does not implement nested rings, drill-down, or automatic color-contrast selection. Keep category counts modest.
