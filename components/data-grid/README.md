# 📊 VFX Data Grid

A compact data table with client-side filtering, sortable columns, row selection, and paging. Column definitions, row data, and page size can be replaced while the component is mounted.

```html
<script src="/components/data-grid/index.js"></script>
<vfx-data-grid columns="name:Name|role:Role|status:Status" rows="1::Mika::Designer::Active|2::Ren::Engineer::Review" page-size="4"></vfx-data-grid>
```

## API
- `columns`: pipe-separated `key:Label` definitions. Keys should be unique.
- `rows`: pipe-separated records, first field is the row id and remaining fields align with columns.
- `page-size`: positive integer rows per page, default 4.
- `rows` property: read or replace with objects keyed by column key.
- `page`: current page, readable/writable.
- `selectedRows`: selected row objects.
- `goTo(page)`: move to a page and return whether the page changed.

## Events
- `filter`: `detail.query`.
- `sort`: `detail.key` and `detail.direction`.
- `selection`: selected ids and row objects.
- `page-change`: `detail.page` and `detail.pages`.

## Behavior
Filtering searches all displayed columns. Sorting is locale-aware with numeric comparison. Select-all applies to the visible page. Replacing row data drops selections whose ids no longer exist. Replacing columns rebuilds the header and clears sorting if its key is no longer available.

## Limits
All filtering, sorting, and paging run in memory. For large data sets, remote data, column-specific renderers, or server pagination, connect this control to your own data layer.
