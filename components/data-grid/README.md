# 📊 VFX Data Grid

A compact data table with client-side filtering, sortable columns, row selection, and paging.

```html
<script src="/components/data-grid/index.js"></script>
<vfx-data-grid columns="name:Name|role:Role|status:Status" rows="1::Mika::Designer::Active|2::Ren::Engineer::Review" page-size="4"></vfx-data-grid>
```

## API
- `columns`: pipe-separated `key:Label` definitions.
- `rows`: pipe-separated records, first field is the row id and remaining fields align with columns.
- `rows` property: read or replace with objects keyed by column key.
- `page`: current page, readable/writable.
- `selectedRows`: selected row objects.
- `goTo(page)`: move to a page.

## Events
- `filter`, `sort`, `selection`, and `page-change`. Event details include query, sorting key/direction, selected ids/rows, or page metadata.

## Limits
All filtering, sorting, and paging run in memory. For large data sets, remote data, column-specific renderers, or server pagination, connect this control to your own data layer.
