# 🔔 VFX UI Anime Notification Center

A local notification inbox with unread count, All/Unread filtering, mark-read, mark-all-read, dismiss actions, live data replacement, and explicit state events.

## Quick start

```html
<script src="/components/notification-center/index.js"></script>

<vfx-notification-center
  items='[
    {"id":"welcome","title":"Welcome","message":"Your workspace is ready.","read":false},
    {"id":"review","title":"Review complete","message":"Build passed.","read":true}
  ]'
></vfx-notification-center>
```

The component also accepts the original compact format:
`id::title::message::unread|id2::title2::message2::read`.

## API

| Member | Type | Description |
|---|---|---|
| `items` | array | Read a defensive copy or replace the current list with objects containing `id`, `title`, `message`, `read`, and optional `time`. A JSON or compact-format string may also be assigned. |
| `unreadCount` | number | Current unread notification count. |
| `markRead(id)` | method | Marks one notification as read. Returns false if missing, already read, or disabled. |
| `markAllRead()` | method | Marks all unread items as read. |
| `dismiss(id)` | method | Removes a notification. Returns false if missing or disabled. |

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `items` | built-in sample data | JSON array or compact item string. |
| `disabled` | false | Disables filters and notification actions. |

Duplicate IDs and items without a non-empty ID are ignored. An empty `items` attribute creates a deliberate empty inbox.

### Events

- `read`: one notification was marked read.
- `read-all`: bulk read completed, with the affected count.
- `dismiss`: one notification was removed.
- `change`: carries a defensive `items` snapshot and `unreadCount`. Attribute/property replacements include a `source` field.

Events bubble and cross the shadow boundary.

## Accessibility

The inbox uses a labeled list, native action buttons, an announced unread count, pressed filter states, and a polite status footer. Empty states are announced. Actions can be completed with a keyboard.

## Persistence and integration

State is in-memory and local to one component instance. It is not a notification service, durable store, polling client, or cross-device synchronization layer. Listen for events and connect the control to your own application store or backend when persistence is required. Treat notification content as untrusted text; the component renders it as escaped text.

## Standalone behavior

No framework or package dependency is required.
