# 🎧 Audio Player

A custom accessible transport around the browser's native HTMLAudioElement, with dynamic source updates, seeking, playback state, loop and preload controls, and media lifecycle events.

## Quick start

~~~html
<script src="./components/audio-player/index.js"></script>
<vfx-audio-player
  src="./audio/preview.wav"
  title="Product preview"
  artist="Demo track"
  preload="metadata"
></vfx-audio-player>
~~~

The component registers as **vfx-audio-player**. It has no playback dependency beyond the browser's native audio support.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| src | src | Empty | Media URL. Removing the attribute clears the current source. |
| title | title | Audio track | Track title shown in the player and used in the play/pause accessible name. |
| artist | artist | Artist | Supporting track metadata. |
| disabled | disabled | false | Prevents play and seek actions, and pauses current playback. |
| preload | preload | metadata | Native preload hint: none, metadata, or auto. |
| loop | loop | false | Repeats the media when playback reaches the end. |

Changes to the attributes are reflected by the visible controls and underlying audio element. Invalid preload values normalize to metadata.

Read-only state properties are playing and duration. currentTime is readable and writable in seconds. Setting currentTime uses the same bounds checks as seekTime().

## Methods

| Method | Result | Description |
|---|---|---|
| play() | Promise<boolean> | Requests playback. Resolves to false if disabled, no source is configured, or the browser rejects playback. |
| pause() | boolean | Pauses active playback. |
| toggle() | Promise<boolean> | Starts or pauses playback based on the current state. |
| seek(percent) | boolean | Seeks to a normalized position from 0 to 1. Values are clamped. |
| seekTime(seconds) | boolean | Seeks to a time in seconds, clamped to the available duration. |

The seek control stays disabled until a finite media duration is available. The component pauses playback when it is disconnected from the document.

## Events

Events bubble and cross the component's shadow boundary.

| Event | Detail |
|---|---|
| play | { currentTime } |
| pause | { currentTime } |
| ended | { currentTime } |
| timeupdate | { currentTime, duration } |
| loadedmetadata | { duration }, emitted only for the native metadata-loaded event. |
| durationchange | { duration }, emitted for native duration changes. |
| seek | { currentTime, duration } |
| error | Native error code and/or a reason describing missing source, unavailable media, or rejected playback. |

The loadedmetadata and durationchange events are separate. The component does not report a duration update as a second metadata-loaded event.

## Keyboard and accessibility

- The play/pause control is a native button with an accessible name that includes the track title.
- The seek control is a native range input with a descriptive label and a time-based aria-valuetext.
- Status, loading, and error messages are announced through a polite live region.
- Native keyboard operation is retained for both controls.
- The disabled attribute disables interaction and pauses active playback.

## Browser behavior and limits

- Actual playback and supported formats are determined by the browser and the media server.
- Autoplay is not attempted. Applications should call play() from a user action and handle its boolean result.
- No playlist, volume control, playback-rate control, waveform, or media-session integration is provided.
- Remote audio may be subject to server availability, CORS configuration, codec support, and browser autoplay policy.
