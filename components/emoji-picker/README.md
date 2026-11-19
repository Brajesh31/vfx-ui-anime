# 😀 VFX UI Anime Emoji Picker

A curated emoji picker with keyword search, category filters, keyboard navigation, selected-value synchronization, and selection events.

## Quick start

```html
<script src="/components/emoji-picker/index.js"></script>

<vfx-emoji-picker value="✨"></vfx-emoji-picker>
```

## API

| Member | Type | Description |
|---|---|---|
| `value` | string | Read or set the selected emoji. |
| `items` | array | Read a defensive copy of the curated emoji records, including name, category, and search keywords. |
| `disabled` | boolean | Whether search and selection are disabled. |
| `selectEmoji(emoji)` | method | Selects a known emoji, updates the value, and emits selection events. Returns false for unknown or disabled choices. |

### Attributes

- `value`: initial/current selected emoji. Dynamic changes synchronize the selected display.
- `placeholder`: search input placeholder.
- `disabled`: disables search, category filters, and emoji buttons.

### Search and categories

Search checks emoji characters, descriptive names, and associated keywords. Category filters include All, Faces, People, Nature, Food, Activities, Travel, Objects, and Symbols. Search and category filters can be combined.

### Events

- `select`: selection detail includes `emoji`, `value`, `name`, and `category`.
- `change`: emitted with the same selection detail.

Events bubble and cross the shadow boundary.

## Accessibility and keyboard behavior

Search has an accessible label. Categories are native buttons with pressed state. Every emoji button exposes a descriptive name and selected state. Arrow keys move between visible emoji buttons; Home and End move to the first and last item; Escape returns focus to search. Enter and Space use native button activation.

## Scope

The picker uses a curated built-in dataset. It does not load remote emoji catalogs, skin-tone variants, custom uploaded emoji, or an operating-system emoji database. The host application owns persistence and text insertion.
