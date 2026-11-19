# 🔔 VFX Notification Center

An in-memory notification inbox with unread counts, All/Unread filters, mark-read, bulk mark-read, dismissal, and live data replacement.

## Quick start

```html
<script src="/components/notification-center/index.js"></script>
<vfx-notification-center
  items='[{"id":"welcome","title":"Welcome","message":"Your workspace is ready.","read":false},{"id":"review","title":"Review complete","message":"Build passed.","read":true}]'
></vfx-notification-center>
```

The legacy pipe format remains supported: `id::title::message::unread|id2::title2::message2::read`.

## Public API

| API | Description |
|---|---|
| `items` | Read a defensive copy or replace the notification array |
| `unreadCount` | Current unread notification count |
| `markRead(id)` | Mark one unread notification as read |
| `markAllRead()` | Mark every unread notification as read |
| `dismiss(id)` | Remove a notification |
| `disabled` | Disable all inbox actions |

Items use `{ id, title, message, read, time }`. IDs must be non-empty and unique. Duplicate IDs and malformed entries are ignored. You can replace items using the property or the `items` attribute. The attribute accepts JSON or the legacy pipe-delimited representation.

## Events

- `read`: one notification was marked read.
- `read-all`: bulk read action, with the affected count.
- `dismiss`: a notification was removed.
- `change`: current items and unread count after a state change. Attribute/property replacements include a `source` field.

## Scope and persistence

State lives in the component instance. It is not a push service, durable inbox or cross-device synchronization layer. Connect the emitted events to your application store or backend when persistence, realtime delivery, authorization or multi-device synchronization is required.

Notification titles and messages are rendered as text, not trusted HTML.
