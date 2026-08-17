# hackhpc.github.io

Source for the HackHPC website, built as a [Jekyll](https://jekyllrb.com/) site and
published via GitHub Pages.

## Structure

- `_data/events.json` — every HackHPC event (source of truth for the Events Archive and homepage)
- `_data/partners.json` — partner organizations, tiered by how many events they've supported
- `_data/resources.json` — standing resources (mentor gallery, curricula, etc.)
- `_layouts/`, `_includes/` — shared page shell, nav, footer
- `assets/` — CSS, JS, images
- Each top-level directory (`about/`, `events/`, `programs/`, `partners/`, `resources/`, `get-involved/`) is a site section

## Local development

```
gem install jekyll
jekyll serve
```

Then visit `http://localhost:4000`.

## Updating event/partner data

Edit `_data/events.json` / `_data/partners.json` directly — no build step beyond Jekyll's
own (which GitHub Pages runs automatically on push).
