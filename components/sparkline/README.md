# 📈 Sparkline

A compact, responsive SVG trend line for dashboards and metric summaries. The latest point, net change, and accessible description update with the data.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-sparkline label="Weekly activity" values="4,7,5,9,8,13,11,16"></vfx-sparkline>
\`\`\`

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`label\` | Trend | Metric label and accessible name |
| \`values\` | 4,7,5,9,8,13,11,16 | Comma-separated finite numeric samples |
| \`color\` | Lavender | Optional hexadecimal line color |

\`\`\`js
const trend = document.querySelector('vfx-sparkline');
trend.values = [8, 10, 7, 13, 15, 12];
trend.label = 'Weekly orders';
\`\`\`
Invalid samples are ignored. A constant series is centered; a single point is shown at the center. An empty or invalid series displays “No data”.

## ♿ Accessibility and behavior
- The SVG summary exposes the metric label, sample count, first value, last value, and net change.
- The latest sample is marked visually.
- The line scales with the available width.
- Labels are inserted as text.
- Attribute changes update the visualization without reconnecting the element.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/sparkline/demo.html\` through a local server.

## ⚠️ Limits
A sparkline omits axes, tick labels, hover tooltips, and interpolation. It is a trend cue, not a replacement for a detailed chart or statistical summary.
