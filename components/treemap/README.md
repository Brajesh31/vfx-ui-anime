# 🧩 Treemap

An SVG treemap for comparing category values by proportional area. Tiles support pointer and keyboard selection.

## 🚀 Usage
\`\`\`html
<script src="./index.js"></script>
<vfx-treemap title="Resource distribution" items="app::App::42|web::Web::26|ops::Operations::20|data::Data::12"></vfx-treemap>
\`\`\`
The attribute format is a pipe-separated sequence of \`id::label::value\` entries.

## ⚙️ Attributes and properties

| Attribute | Default | Description |
|---|---|---|
| \`title\` | Resource distribution | Heading and accessible chart title |
| \`items\` | Four sample categories | Pipe-separated IDs, labels, and positive numeric values |

For application-driven updates, assign an array of objects:
\`\`\`js
const map = document.querySelector('vfx-treemap');
map.items = [
  { id: 'design', label: 'Design', value: 24 },
  { id: 'engineering', label: 'Engineering', value: 52 },
  { id: 'operations', label: 'Operations', value: 24 }
];
map.select('engineering');
console.log(map.selectedId);
\`\`\`
Array items accept \`id\`, \`label\` (or \`name\`), and \`value\`. Non-finite and non-positive values are excluded. Duplicate IDs are ignored after the first occurrence. Tile area is proportional to value; labels are hidden on tiles too small to display.

## 📣 Events
The bubbling, composed \`select\` event fires when a tile is clicked, tapped, or activated with Enter/Space.
\`\`\`js
map.addEventListener('select', (event) => {
  const { id, label, value, percent } = event.detail;
  console.log(label, value, percent);
});
\`\`\`
The \`select(id)\` method returns \`true\` when an item exists, otherwise \`false\`.

## ♿ Accessibility and behavior
- Tiles expose button semantics, keyboard focus, and an accessible name with value and percentage.
- SVG tiles include a title for pointer users; the chart includes a title and description.
- Labels are inserted as SVG text nodes, never parsed as markup.
- Attribute and array-property updates rebuild the layout in place.

## 🧪 Demo
Open [demo.html](./demo.html) or visit \`/components/treemap/demo.html\` through a local server.

## ⚠️ Limits
The deterministic recursive split strategy preserves proportional area but is not an optimized squarified treemap algorithm. Some datasets may produce narrow tiles. Nested hierarchies and drill-down are not included.
