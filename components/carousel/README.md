# 🎞️ VFX Carousel

A manually controlled carousel with touch swipe, previous/next buttons, dot navigation, live position feedback, and keyboard controls.

## 🚀 Quick start
\`\`\`html
<script src="/components/carousel/index.js"></script>
<vfx-carousel slides="Impact|Momentum|Afterglow"></vfx-carousel>
\`\`\`

## ⚙️ API

| API | Description |
|---|---|
| \`slides\` attribute | Pipe-separated labels. Changing it rebuilds the slides. |
| \`label\` attribute | Accessible name for the viewport. Defaults to "Carousel slides". |
| \`activeIndex\` | Read or write the zero-based active slide index. |
| \`value\` | Read-only alias for \`activeIndex\`. |
| \`goTo(index)\` | Navigate to a clamped index. Returns \`true\` only when the active slide changes. |
| \`next()\`, \`previous()\` | Navigate with wraparound. Return \`false\` when fewer than two slides exist. |

Omitting \`slides\` uses the built-in examples. Setting \`slides=""\` creates an empty state. Previous/Next controls are disabled when there are fewer than two slides.

## 📣 Events
- \`change\`: detail includes \`index\`, \`total\`, and \`slide\`.

## ⌨️ Interaction and accessibility
- Use the Previous/Next buttons or slide dots.
- Swipe horizontally to change slides. Vertical gestures are ignored.
- Focus the viewport and press **ArrowLeft** or **ArrowRight** to navigate, **Home** for the first slide, or **End** for the last slide.
- Inactive slides are marked hidden and inert, keeping their content out of the focus order.
- The active position is announced by a polite live region.
- Transitions respect \`prefers-reduced-motion\`.

## 🧩 Example
\`\`\`js
const carousel = document.querySelector('vfx-carousel');
carousel.addEventListener('change', ({ detail }) => {
  console.log(detail.index, detail.slide);
});
carousel.activeIndex = 1;
\`\`\`

## 🛡️ Scope and limits
The carousel does not auto-advance and has no autoplay timer. It renders concise text labels; compose richer slide content in the host application when needed.
