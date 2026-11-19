# 🎯 KPI Card

A responsive dashboard metric card for a primary value and a concise change indicator. It supports live attribute and property updates.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-kpi-card label="Active users" value="12,480" delta="+12.8%"></vfx-kpi-card>
\`\`\`

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`label\` | Active users | Metric name |
| \`value\` | 12,480 | Display value, including formatted text |
| \`delta\` | Empty | Optional comparison text, such as +12.8% or -320 |
| \`trend\` | Inferred | Optional positive, negative, or neutral visual state |

The \`label\`, \`value\`, and \`delta\` properties are synchronized:
\`\`\`js
const card = document.querySelector('vfx-kpi-card');
card.label = 'Monthly revenue';
card.value = '₹24,800';
card.delta = '-2.1%';
card.setAttribute('trend', 'negative');
\`\`\`
Without an explicit trend, a leading minus or plus determines the visual direction. Other text is neutral. A valid explicit trend overrides inference.

## ♿ Accessibility and behavior
- The card exposes a summary containing label, value, and delta.
- Values use tabular numerals and wrap to avoid horizontal overflow.
- Attribute changes update the visible content immediately.
- User content is assigned as text, not interpreted as HTML.
- An empty delta is omitted from the visual layout.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/kpi-card/demo.html\` through a local server.

## ⚠️ Limits
The component does not calculate business metrics or infer whether a change is good or bad. Provide a meaningful \`trend\` when the sign alone is not enough.
