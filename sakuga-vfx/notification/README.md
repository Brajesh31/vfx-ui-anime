# Sakuga Notification

A notification bell with a springing ring, manga impact sparks and an unread counter.

## Usage

```html
<script src="./notification.js"></script>
<sakuga-notification count="3" id="notifications"></sakuga-notification>
<script>
  document.querySelector("#notifications").addEventListener("change", (event) => {
    console.log("Unread:", event.detail.count);
  });
</script>
```

- Read or set `element.count`.
- Clicking the bell clears the unread count.
- Fires a bubbling, composed `change` event with `detail.count`.
- Counts above 99 display as `99+`.
