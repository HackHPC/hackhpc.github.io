# HackHPC Site Design

Reference doc for how [hackhpc.github.io](https://hackhpc.github.io) is built, how to run it
locally, and how to add data (events, partners, resources, etc.) without touching templates.

## 1. What this is

A static site built with [Jekyll](https://jekyllrb.com/) and published via GitHub Pages. There's
no build step beyond Jekyll's own — GitHub Pages runs `jekyll build` automatically on every push
to `main`. Content pages are plain HTML with Liquid templating; almost everything that changes
regularly (events, partners, resources) lives in `_data/*.json` / `.yml` files rather than being
hand-written into pages, so adding an event or partner is a data edit, not a template edit.

## 2. Running it locally

```bash
gem install jekyll bundler
jekyll serve
```

Then visit `http://localhost:4000`. Add `--livereload` to auto-refresh on file changes, or
`--incremental` for faster rebuilds while iterating. There's no Gemfile checked in, so a plain
`gem install jekyll` (not `bundle exec`) is the working path today.

To sanity-check the production build (the one GitHub Pages actually serves):

```bash
jekyll build
```

Output lands in `_site/` (gitignored).

## 3. Site layout

```
_config.yml         site title, URL, github_org_url, and other global Liquid variables
_layouts/
  default.html       the only layout — head + nav + <main>{{ content }}</main> + footer
_includes/
  head.html           <head>: meta tags, Open Graph, fonts, Font Awesome, favicon
  nav.html            top navbar (desktop links + mobile hamburger menu)
  footer.html         site footer: link columns, social icons, copyright
  resource-icon.html  renders one resource's icon (Font Awesome brand/solid, or an <img>)
  citation-modal.html shared "cite this event" modal used on the Events Archive
assets/
  css/main.css        the entire design system — one file, no preprocessor
  js/main.js           mobile nav toggle + every page's search/filter behavior
  js/citations.js       citation modal logic (APA/IEEE/BibTeX)
  img/logos/            HackHPC logo files (mark, wordmark, square, light/dark)
  img/partners/         partner org logos (SVG, referenced from partners.json)
  img/schools/          school logos (SVG, referenced from schools.json)
  img/organizers/       organizer headshots
  icons/favicons/       auto-fetched favicon SVGs for external resource links (see §5)
_data/                 see §4 — every JSON/YAML file that feeds the site's content
```

Each top-level content directory is one site section, always `index.html` (+ occasionally more
pages) with Jekyll front matter (`layout: default`, `title:`, `description:`):

| Directory | Section |
|---|---|
| `/` (`index.html`) | Homepage |
| `about/` | About, Organizers, FAQs, Code of Conduct |
| `events/` | Events Archive (filterable grid over `events.json`) |
| `programs/` | Programs overview, Participants, Mentors, Faculty |
| `partners/` | Schools + partner organizations, by tier |
| `resources/` | Brand guide, repos, curricula, data sources, resource library |
| `research/` | Publications & media coverage (from `research.yml`) |
| `get-involved/` | Ways to join (participant / mentor / partner / funder) |

**Styling conventions** (see `main.css` `:root` for the full token list): sections alternate
`section` (white) / `section--soft` (light gray) backgrounds; `.card` is the base content-card
class; `.events-grid` / `.grid-3` / `.grid-4` are the common grid layouts; long lists on the
Resources page are wrapped in `<details class="section-collapse">` so they load collapsed.

**Search/filter pages** are server-rendered (every item is real HTML, good for SEO/no-JS) and
then progressively enhanced by a matching block in `assets/js/main.js` — each block finds its
grid by `id`, reads a `data-search="..."` attribute off each card, and hides non-matching cards
on `input`. If you add a new searchable grid, give each card a `data-search` attribute and add a
matching filter block (copy the "Data sources search" block as a template).

## 4. `_data/` files

Every file below is an array of objects (JSON) or an equivalent YAML list, looped over directly
in the page templates with `{% for x in site.data.<file-without-extension> %}`. **To add a new
item, add a new object to the array/list — no other file needs to change** unless noted.

### `events.json` — every HackHPC event
Source of truth for the Events Archive, homepage event cards, the events network graph, and the
per-program pages (`programs/faculty.html` filters this by `type: "faculty"`, etc.).

```json
{
  "id": "unique-slug",
  "name": "HackHPC@Example26",
  "url": "https://hackhpc.github.io/example26/",
  "github_repo": "https://github.com/HackHPC/example26",
  "start_date": "2026-06-22",
  "end_date": "2026-06-26",
  "date_display": "June 22–26, 2026",
  "type": "hackathon",
  "category": "ADMI",
  "description": "One-sentence description shown on event cards.",
  "partners": ["ADMI", "SGX3"],
  "teams_url": "https://hackhpc.github.io/example26/teams.html",
  "schedule_url": null,
  "organizers_url": null,
  "mentors_url": null,
  "doi": null,
  "citation_url": "https://hackhpc.github.io/example26/",
  "citation_key": "hackhpc2026example26",
  "citation_apa": "HackHPC. (2026). *HackHPC@Example26*. https://hackhpc.github.io/example26/",
  "citation_ieee": "HackHPC, \"HackHPC@Example26,\" 2026. [Online]. Available: https://hackhpc.github.io/example26/",
  "citation_bibtex": "@misc{hackhpc2026example26,\n  author = {HackHPC},\n  title = {HackHPC@Example26},\n  year = {2026},\n  url = {https://hackhpc.github.io/example26/}\n}",
  "teams": [
    { "name": "Team Name", "github": "https://github.com/org/repo", "award": null }
  ],
  "videos": [
    { "name": "Session Title", "summary": "One-sentence summary.", "url": "https://www.youtube.com/watch?v=..." }
  ]
}
```

- `type` drives the badge color/label and which "Programs" page picks it up: `hackathon`,
  `codeathon`, `faculty`, or `training`.
- `category` is the hosting conference/program (ADMI, Gateways, SGX3, TACC, PEARC, SC, MS-CC,
  International, …) — it's the hub grouping used by the network graph on the About page (see
  `events_network.json` below). Reuse an existing category where it fits.
- `teams` and `videos` are optional arrays; omit the key entirely if an event has neither.
- Fields left `null` are simply not rendered (e.g. no "Mentors" link shown if `mentors_url` is
  `null`).

### `partners.json` — partner organizations
Powers the homepage "Core Partners" strip and the full tiered list on `/partners/`.

```json
{
  "name": "Organization Name",
  "url": "https://example.org/",
  "mentions": 3,
  "tier": "core",
  "description": "One sentence on how they've supported HackHPC.",
  "icon": "/assets/img/partners/organization-name.svg",
  "fa_icon": null
}
```

- `tier` controls which section it appears in and is a manual editorial call, not purely derived
  from `mentions`: `core` ("Core Partners", homepage strip + top billing on `/partners/`),
  `program` ("Program & Event Partners"), or `collaborating` ("Collaborating Organizations").
- `mentions` is just a display count (shown as "N events") — update it by hand when you add an
  event that credits this partner; nothing recomputes it automatically.
- Icon: set either `icon` (a path to an SVG/PNG under `assets/img/partners/` or
  `assets/icons/favicons/`) **or** `fa_icon` (a Font Awesome brand icon name, e.g. `"github"` →
  rendered as `fa-brands fa-github`) — not both. Leave both `null` for a plain letter-avatar
  fallback.

### `schools.json` — participating colleges & universities
Powers the searchable school grid on `/partners/`.

```json
{
  "name": "Example University",
  "url": "https://www.example.edu",
  "slug": "example-university",
  "icon": "/assets/img/schools/example-university.svg",
  "event_count": 2,
  "events": ["event-id-one", "event-id-two"]
}
```

`events` is a list of `events.json` `id`s. `event_count` is just the length of that list, kept
as a separate field for quick display — update both together.

### `resources.json` — standing resource links
The small "Mentor Gallery / curricula / etc." grid at the top of `/resources/`. Deliberately
short — this is for a handful of permanent, non-event-specific resources.

```json
{
  "name": "Resource Name",
  "url": "https://example.org/",
  "github_repo": "https://github.com/HackHPC/repo",
  "type": "Mentor Directory",
  "description": "One sentence describing it."
}
```

### `courses.json` — FacultyHack-redesigned courses
Powers the searchable "FacultyHack Modified Courses" grid on `/resources/`.

```json
{
  "event": "FacultyHack@Gateways 2026",
  "event_id": "facultyhack-gateways26",
  "course_name": "Intro to Data Science",
  "course_number": "CSC 1311",
  "school": "Example University",
  "description": "What the faculty member changed about the course.",
  "github": null
}
```

`event_id` should match an `id` in `events.json` so the card can link back to that event; if it
doesn't match anything, the card still renders with plain (non-linked) event text.

### `data_sources.json` — public dataset links
The "Data Sources" grid on `/resources/` — external datasets useful for hack projects.

```json
{
  "name": "Dataset Name",
  "description": "One sentence on what it is.",
  "url": "https://example.org/data",
  "icon_type": "img",
  "icon": "/assets/icons/favicons/example-org.svg"
}
```

See §5 for `icon_type`/`icon`.

### `external_resources.json` — the curated resource library
The big, categorized "Resource Library" grid on `/resources/` (science gateways, computing
platforms, dev tools, AI tools, careers, etc.).

```json
{
  "category": "AI Tools & Resources",
  "name": "Resource Name",
  "url": "https://example.org/",
  "description": "One sentence describing it.",
  "icon_type": "img",
  "icon": "/assets/icons/favicons/example-org.svg"
}
```

Items are grouped on the page by `category` (via Liquid's `group_by`), in the order each
category first appears in the file — reuse an existing category string to land a new item in an
existing group, or introduce a new category string to create a new group automatically.

### `organizers.json` — the organizing team
Powers `/about/organizers.html`.

```json
{
  "name": "Full Name",
  "slug": "full-name",
  "affiliation": "Institution or Company",
  "affiliation_url": "https://example.org/",
  "bio": "A few sentences.",
  "linkedin": null,
  "twitter": null,
  "github": null,
  "website": null,
  "google_scholar": null,
  "orcid": null,
  "photo": "/assets/img/organizers/full-name.png",
  "affiliation_icon": "/assets/img/partners/institution.svg"
}
```

Every social/profile field is optional — set unused ones to `null` and that link is omitted.
`slug` is used for in-page anchors (other pages link to `/about/organizers.html#slug`).

### `research.yml` — publications & media coverage
Powers `/research/`. YAML instead of JSON (long multi-line `summary`/`citation_bibtex` fields
read better as YAML block scalars). Header comment in the file itself documents the schema; the
short version:

```yaml
- category: paper   # paper | media | video
  authors: "Last, F., Last, F."
  title: "Paper Title"
  venue: "Conference or Publication Name"
  date: "2026-06-01"          # ISO date, used for sorting
  date_display: "June 2026"   # human-readable date shown on the page
  summary: >-
    A paragraph describing the work, using YAML's folded block scalar (>-) so long
    prose can wrap across lines in the source file.
  citation_key: "lastname2026title"
  citation_apa: "..."
  citation_ieee: "..."
  citation_bibtex: |
    @article{lastname2026title,
      ...
    }
```

`media` and `video` entries follow the same shape but typically omit the citation fields.

### `socials.yml` — footer social links
Powers the icon row in the footer.

```yaml
- name: Mastodon
  url: "https://example.social/@hackhpc"
  username: hackhpc
  icon: "fa-brands fa-mastodon"
```

`icon` is a full Font Awesome class string (`fa-brands fa-<name>`), used as-is — check
[fontawesome.com](https://fontawesome.com/search?o=r&f=brands) for available brand icons. The
footer renders every entry in the list in order, so just append a new item.

### `general_videos.json` — non-event-specific videos
A short list shown at the top of the Events Archive's video section (things like the Code of
Conduct video that aren't tied to one event).

```json
{
  "name": "Video Title",
  "summary": "One sentence.",
  "url": "https://www.youtube.com/watch?v=..."
}
```

### `participants_dashboard.json` and `events_network.json` — generated, don't hand-edit items
These two are **not** simple append-to-a-list files:

- **`participants_dashboard.json`** is a pre-aggregated snapshot (counts, percentages, chart
  data) computed from a participant roster that isn't itself in this repo — see its own
  `generated_note` field. It powers the "Community Dashboard" charts on `/about/`. To update it,
  regenerate the whole file from the source roster; don't hand-edit individual numbers.
- **`events_network.json`** holds precomputed `(x, y)` node/edge positions for the network graph
  on `/about/` (conferences as hubs, events as spokes), laid out once with Python's `networkx`
  (`spring_layout`) because Jekyll/Liquid can't run a force-directed layout. If you add or remove
  events in `events.json`, this file goes stale — regenerate it by rebuilding the graph from
  `events.json` (root → one hub per unique `category` → one node per event) and rerunning the
  layout; there's no way to add a single node by hand and have it look right.

## 5. Icons on resource cards

`data_sources.json` and `external_resources.json` (and `partners.json`, less formally) share one
icon convention, rendered through `_includes/resource-icon.html`:

| `icon_type` | `icon` value | Renders as |
|---|---|---|
| `fa-brand` | a Font Awesome brand name, e.g. `"github"` | `<i class="fa-brands fa-github">` |
| `fa-solid` | a Font Awesome solid icon name, e.g. `"globe"` | `<i class="fa-solid fa-globe">` — the fallback used when no logo/favicon is available |
| `img` | a path, e.g. `"/assets/icons/favicons/example-org.svg"` | `<img src="...">` |

For `img`, the convention used across `assets/icons/favicons/` is: fetch the site's real favicon
if one exists, and if it's a raster image (ICO/PNG/JPG), wrap it in a minimal SVG (a single
`<image>` element with the raster embedded as a base64 `href`) so every icon file is a `.svg`
regardless of source format. Fall back to `fa-solid fa-globe` only when no usable favicon exists
at all.

## 6. Quick checklist for adding new content

1. **New event** → add an object to `events.json`. If it should show up as a hub-connected node
   on the About page graph, also regenerate `events_network.json` (§4).
2. **New partner** → add an object to `partners.json`, pick a `tier`, drop a logo in
   `assets/img/partners/` (or use `fa_icon` if it's a recognizable brand already in Font
   Awesome).
3. **New resource link** (dataset or general resource) → add an object to `data_sources.json` or
   `external_resources.json`, and fetch/convert an icon per §5.
4. **New team/video on an existing event** → edit that event's `teams` / `videos` array in
   `events.json` directly.
5. **New publication** → append to `research.yml`.

None of these require editing an `.html` template — the templates iterate over `site.data.*`
already.
