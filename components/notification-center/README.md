# 🔔 VFX Notification Center

An in-memory notification inbox with unread count, All/Unread filtering, mark-read, mark-all-read, and dismiss actions.

```html
<script src="/components/notification-center/index.js"></script>
<vfx-notification-center items="welcome::Welcome::Your workspace is ready.::unread|review::Review complete::Build passed.::read"></vfx-notification-center>
```

## API
- `items`: read a copy of current notifications.
- `unreadCount`: current unread count.
- Methods: `markRead(id)`, `markAllRead()`, and `dismiss(id)`.

## Events
- `read`, `read-all`, `dismiss`, and `change`. Change detail includes the current array and unread count.

## Limits
State is local to the component instance. Connect events to your application store or backend when notifications must persist or synchronize across devices.
