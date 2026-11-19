# 🌳 VFX Tree View

A hierarchical tree control with expandable folders, selectable nodes, live data replacement, and arrow-key navigation.

```html
<script src="/components/tree-view/index.js"></script>
<vfx-tree-view label="Project files" items="root::Project::-|docs::Documents::root|brief::Brief.md::docs|src::Source::root|app::App.js::src"></vfx-tree-view>
```

## API
- `items`: pipe-separated `id::label::parentId` nodes. Use `-` for root nodes.
- `items` property: read or replace using objects `{id,label,parent}`.
- `label`: accessible name for the tree.
- `value`: selected node id.
- `select(id)`, `toggle(id)`, `expandAll()`, and `collapseAll()`.

Duplicate or blank ids/labels are ignored. Missing parent links are promoted to the root level. Cyclic parent links are broken so invalid input cannot cause unbounded recursion.

## Events
- `select`: selected node id, label, and parent.
- `toggle`: node id, label, and expanded state.

## Accessibility
The tree uses tree/treeitem/group roles and roving tab focus. Arrow Up/Down moves between visible nodes, Right expands a folder or moves to its first child, Left collapses a folder or moves to its parent, Home/End moves to the first/last visible node, and Enter/Space activates the focused node.

## Limits
This is a local navigation control, not a filesystem reader. Supply a valid hierarchy from your application.
