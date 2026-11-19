# 🎬 Video Player

A dependency-free custom transport around the browser's native `HTMLVideoElement`. It provides playback, seek, mute, fullscreen, source updates, loop/preload configuration, and media lifecycle events.

## Quick start

~~~html
<script src="./components/video-player/index.js"></script>

<vfx-video-player
  src="./media/preview.webm"
  poster="./media/poster.jpg"
  label="Product preview"
  preload="metadata"
></vfx-video-player>
~~~

The component registers as `<vfx-video-player>`. It embeds the shared VFX runtime and can be loaded with a plain script tag.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `src` | `src` | Empty | Video URL. Removing it clears the current source. |
| `poster` | `poster` | Empty | Poster image URL shown before video frames are available. |
| `label` | `label` | Video player | Accessible name applied to the native video element. |
| `disabled` | `disabled` | `false` | Disables all custom controls and pauses active playback. |
| `muted` | `muted` | `false` | Mutes or unmutes the native video element. |
| `loop` | `loop` | `false` | Replays the media when it reaches the end. |
| `preload` | `preload` | `metadata` | Native preload hint: `none`, `metadata`, or `auto`. Invalid values normalize to `metadata`. |

Properties `playing`, `currentTime`, and `duration` expose playback state and time. `playing` and `duration` are read-only. `currentTime` is writable in seconds. `muted`, `loop`, `preload`, and the other reflected attributes can be changed programmatically.

## Methods

| Method | Result | Description |
|---|---|---|
| `play()` | `Promise<boolean>` | Requests playback and resolves to `false` when disabled, source-less, or rejected by the browser. |
| `pause()` | `boolean` | Pauses active playback. |
| `toggle()` | `Promise<boolean>` | Starts or pauses playback based on the current state. |
| `seek(percent)` | `boolean` | Seeks to a normalized position from 0 to 1. |
| `seekTime(seconds)` | `boolean` | Seeks to a time in seconds, clamped to the media duration. |
| `toggleMuted()` | `boolean` | Toggles mute unless disabled. |
| `toggleFullscreen()` | `Promise<boolean>` | Enters or exits fullscreen when the browser supports the request. |

## Events

All custom events bubble and cross the shadow boundary.

| Event | Detail |
|---|---|
| `play` / `pause` / `ended` | `{ currentTime }` |
| `timeupdate` | `{ currentTime, duration }` |
| `loadedmetadata` | `{ duration }`, emitted only for the native metadata-loaded event. |
| `durationchange` | `{ duration }`, emitted independently when the browser reports a duration change. |
| `seek` | `{ currentTime, duration }` |
| `volumechange` | `{ muted }`, emitted by the component's mute action. |
| `fullscreenchange` | `{ fullscreen }`, emitted when this player's fullscreen state actually changes, including exit with Escape. |
| `error` | Native error code and/or a reason for missing source, unavailable media, rejected playback, or unsupported fullscreen. |

The component pauses the video and removes its document-level fullscreen listener when disconnected. Reconnecting it restores fullscreen observation.

## Keyboard and accessibility

- Playback, mute and fullscreen controls are native buttons.
- The seek control is a native range input with a descriptive label and a time-based `aria-valuetext`.
- The video element has an accessible name configured through `label`.
- Loading, missing-source and error feedback use a polite live region.
- Fullscreen state is exposed with `aria-pressed` on the fullscreen button.
- The `disabled` attribute disables the custom controls and pauses playback.

## Browser behavior and known limits

- Playback formats and codecs depend on the browser and media server.
- Autoplay is not attempted. Call `play()` in response to a user action and handle its result.
- Fullscreen may be unavailable in embedded or restricted browsing contexts.
- The component has no playlist, volume slider, playback-rate control, or built-in caption/subtitle track management.
- Remote video can be affected by media-host availability, CORS configuration, and codec support.
