# 🌳 VFX Tree View

A hierarchical tree control with expandable folders, selectable leaves, and arrow-key navigation.

```html
<script src="/components/tree-view/index.js"></script>
<vfx-tree-view items="root::Project::-|docs::Documents::root|brief::Brief.md::docs|src::Source::root|app::App.js::src"></vfx-tree-view>
```

## API
- `items`: pipe-separated `id::label::parentId` nodes. Use `-` for root nodes.
- `value`: selected node id.
- `select(id)`, `toggle(id)`, `expandAll()`, and `collapseAll()`.

## Events
- `select`: selected node id, label, and parent.
- `toggle`: node id and expanded state.

## Accessibility and limits
The tree uses tree/treeitem/group roles and supports Arrow, Home, End, Enter, and Space navigation. Nodes should have unique ids and valid parent links. It is a local navigation control, not a filesystem reader.
