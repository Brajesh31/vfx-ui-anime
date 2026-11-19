# 🟪 Heatmap

A responsive activity grid that maps numeric samples to five intensity levels. Cells are keyboard-operable and selectable.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-heatmap title="Weekly activity" labels="Mon,Tue,Wed,Thu,Fri,Sat,Sun" values="0,1,2,3,4,2,1" columns="7"></vfx-heatmap>
\`\`\`

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`title\` | Activity heatmap | Visible heading and group label |
| \`values\` | 35 generated samples | Comma-separated levels, rounded and clamped to 0–4 |
| \`labels\` | Cell numbers | Comma-separated cell labels, such as dates or weekdays |
| \`columns\` | 7 | Number of columns, clamped to 1–14 |

\`\`\`js
const heatmap = document.querySelector('vfx-heatmap');
heatmap.values = [0, 1, 3, 4, 2];
heatmap.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
heatmap.columns = 5;
heatmap.select(3);
\`\`\`
An empty values array or attribute renders a no-activity state. Invalid values become level 0.

## 📣 Events
The bubbling, composed \`select\` event fires when a cell is clicked, tapped, or activated with Enter/Space.
\`\`\`js
heatmap.addEventListener('select', (event) => {
  const { index, label, value, level } = event.detail;
  console.log(label, level);
});
\`\`\`
The \`select(index)\` method returns \`true\` for an existing cell and \`false\` for an invalid index.

## ♿ Accessibility and behavior
- Every cell is a real button with an accessible label and pressed state.
- A visible intensity key maps all five levels.
- Grid columns are configurable.
- Selection is exposed through the event and \`selectedIndex\` property.
- Attribute changes rebuild the grid without stale cells.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/heatmap/demo.html\` through a local server.

## ⚠️ Limits
The heatmap does not assign dates or calculate aggregation windows. Supply labels that explain the meaning and period of each cell.
