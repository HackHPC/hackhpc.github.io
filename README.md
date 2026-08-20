<p align="center">
  <img src="assets/img/logos/HackHPC-bar-whitebg.svg" alt="HackHPC" width="360">
</p>

<p align="center">
  <strong>Hackathons and codeathons for the next generation of research computing innovators.</strong><br>
  Since 2018, HackHPC has run hackathons, codeathons, training institutes, and faculty development
  programs in partnership with national laboratories, research computing centers, and industry —
  pairing students and faculty with mentors to work hands-on with HPC, AI, and science gateways.
</p>

<p align="center">
  🌐 <a href="https://hackhpc.github.io">hackhpc.github.io</a>
  &nbsp;·&nbsp;
  <a href="https://twitter.com/ccloudhack">X / Twitter</a>
  &nbsp;·&nbsp;
  <a href="https://www.instagram.com/hack_hpc">Instagram</a>
  &nbsp;·&nbsp;
  <a href="https://www.linkedin.com/groups/8859728">LinkedIn</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/HackHPC">GitHub</a>
  &nbsp;·&nbsp;
  <a href="https://www.youtube.com/@hackhpc2069">YouTube</a>
</p>

---

# hackhpc.github.io

Source for the HackHPC website, built as a [Jekyll](https://jekyllrb.com/) site and
published via GitHub Pages.

For a fuller walkthrough of how the site is laid out, how to run it locally, and how each
`_data/` file works (including the syntax for adding new items), see
**[sitedesign.md](sitedesign.md)**.

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
