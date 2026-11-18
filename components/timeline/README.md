# 🗓️ VFX Timeline

A compact chronological sequence with milestone descriptions, an active marker, and keyboard-accessible selection.

```html
<script src="/components/timeline/index.js"></script>
<vfx-timeline items="Discover::Define the problem::01 / PLAN|Build::Create the solution::02 / MAKE|Launch::Ship it::03 / SHIP"></vfx-timeline>
```

## API
- `items`: pipe-separated entries formatted as `title::description::date`.
- `activeIndex`: read or set the current zero-based step.
- `select(index)`: select a step.

## Events
- `select`: `detail.index`, `detail.title`, `detail.desc`, and `detail.date`.

## Accessibility
Milestones are buttons inside a semantic ordered list. Up and Down Arrow move the active selection. Active state is reflected with `aria-current="step"`.

## Limits
The timeline is a presentation and selection control. It does not infer dates, calculate durations, or manage task status.
