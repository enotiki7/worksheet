# Teacher's Day card landing

Mobile-first one-screen landing that generates a greeting card for a teacher.

**Screens**
- Constructor: pick a template, enter teacher name, subject and sender
- Short mock generation
- Result card with download / share / start over
- QR opens a gift dialog

**Variants** (`?variant=`)
- `stack` — Figma home layout
- `sheet` — card as hero, form in a bottom sheet
- `live` — live text overlay while typing

**Scenarios** (`?scenario=`)
- `empty` — blank form
- `filled` — Анна Сергеевна / Русский язык / от Маши Ивановой
- `profanity` — name `мат` to show validation

**Out of scope**
- Real GigaChat generation, file download, Telegram delivery
