# ⏱️ VFX Stopwatch

A stopwatch with start/stop, lap splits, reset, and elapsed-time events.

```html
<script src="/components/stopwatch/index.js"></script>
<vfx-stopwatch></vfx-stopwatch>
```

## API
- `start()`, `stop()`, `reset()`, and `lap()`.
- Read `running`, `elapsed` (milliseconds), and `laps`.

## Events
- `start`, `stop`, `reset`, and `lap`.
- Lap detail includes lap number, cumulative elapsed time, and split duration.

Time uses the browser performance clock and is not a regulated precision instrument.
