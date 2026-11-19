# 🧭 Gauge

A responsive semicircular SVG meter with bounded values, configurable ranges, an optional unit, and accessible meter semantics.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-gauge label="Completion" value="72" min="0" max="100"></vfx-gauge>
\`\`\`

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`label\` | Completion | Accessible meter name |
| \`value\` | 0 | Current numeric reading |
| \`min\` | 0 | Lower bound |
| \`max\` | 100 | Upper bound, must be greater than min |
| \`unit\` | % | Suffix displayed beside the reading |

\`\`\`js
const gauge = document.querySelector('vfx-gauge');
gauge.min = 10;
gauge.max = 30;
gauge.value = 24;
console.log(gauge.value);
\`\`\`
Values outside the active range are clamped. If max is not greater than min, the gauge falls back to 0–100. The displayed value and \`aria-valuenow\` reflect the clamped reading.

## 📣 Events
The bubbling, composed \`change\` event fires when an observed value or range update changes the effective reading.
\`\`\`js
gauge.addEventListener('change', (event) => {
  const { value, min, max, percent } = event.detail;
  console.log(value, min, max, percent);
});
\`\`\`

## ♿ Accessibility and behavior
- The custom element exposes \`role="meter"\`, \`aria-valuemin\`, \`aria-valuemax\`, \`aria-valuenow\`, and \`aria-valuetext\`.
- The SVG is decorative because the host carries the meter semantics.
- The progress arc is bounded and respects reduced-motion preferences.
- Attribute and property changes update the value and arc together.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/gauge/demo.html\` through a local server.

## ⚠️ Limits
This is a read-only display meter, not an interactive range control. Pair it with a separately labeled slider or number field for user input.
