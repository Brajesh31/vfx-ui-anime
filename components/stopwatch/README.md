# ⏱️ VFX UI Anime Stopwatch

A performance-clock stopwatch with start/stop, lap splits, reset, accessible status feedback, and reconnect-safe rendering.

## Quick start

```html
<script src="/components/stopwatch/index.js"></script>
<vfx-stopwatch></vfx-stopwatch>
```

## API

| Member | Type | Description |
|---|---|---|
| `running` | boolean | Whether the stopwatch is running. |
| `elapsed` | number | Current elapsed time in milliseconds. |
| `laps` | array | A defensive copy of lap records. |
| `start()` | method | Starts timing. Returns false if already running or disabled. |
| `stop()` | method | Stops and freezes elapsed time. |
| `lap()` | method | Records the current cumulative time and split. Returns the lap record or false. |
| `reset()` | method | Stops the watch and clears elapsed time and laps. |

Each lap record contains `number`, cumulative `elapsed` milliseconds, and the `split` duration since the previous lap.

### Attributes

- `disabled`: disables controls and blocks programmatic actions. If set while running, the stopwatch stops.
- The display switches to an hours format once elapsed time reaches one hour.

## Events

- `start`: stopwatch started.
- `stop`: stopwatch stopped with its final elapsed time.
- `lap`: includes lap number, elapsed milliseconds, and split milliseconds.
- `reset`: stopwatch and lap list cleared.

Events bubble and cross the shadow boundary. Display updates use animation frames, while elapsed time is calculated from the browser's monotonic performance clock. Background-tab throttling and display refresh rate do not change the elapsed-time calculation.

## Lifecycle and accessibility

A running stopwatch continues to measure elapsed time while disconnected. Its display loop resumes when reconnected. Start/Stop uses one toggle button, Lap and Reset have clear disabled states, and a polite status message announces discrete actions without announcing every frame.

## Limits

This is a general-purpose browser stopwatch, not a regulated or calibrated precision instrument. Its elapsed time is not persisted across page reloads.
