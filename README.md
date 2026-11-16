# Petar Nojner — portfolio

A public static portfolio for freelance clients and engineering teams. The site is written in English for an international audience and uses only HTML, CSS and JavaScript.

Live site: https://nokibuzz.github.io/petarnojner/

## Local preview

From this directory:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`.

## Content notes

- Employment and education details come from `Petar_Nojner_CV_2026_Java_AWS.pdf` supplied for this project.
- The autonomous agriculture engagement was described by Petar and is intentionally presented without a client name, dates or unsupported performance figures.
- The Upwork review is quoted from Petar's connected public Upwork profile. The link leads to that profile.
- Public source and demo links are provided where available. Harness Lab is a local prototype. Company work is summarized without internal links, screenshots or implementation secrets.
- Pitwall Race Companion is the eighth case study. Its public demo uses historical snapshots and simulated strategies; the private AI agent and authenticated API version are described from Petar’s supplied account. The preview screenshot comes from the public repository.
- Employment corrections supplied by Petar: Hooloovoo full-stack work runs from 2022 to present, overlapping with Letzz technical leadership in 2025–2026. NetSeT and GNation are separate employers.
- IT and HR workshops cover engineering topics and teamwork, communication and collaboration.
- The portrait was supplied by Petar.

Before publishing, review all copy and confirm which client projects may be named publicly. Replace the contact email if a dedicated business address is preferred.

## Cinematic edition

The opening scene moves from a photographic portrait through an anime interpretation and back to project evidence. It uses scroll-controlled transforms, particles, perspective layers and pointer parallax. Six filterable technology groups cover the CV and additional supplied experience.

The site remains a static HTML/CSS/JavaScript project. Read [DESIGN_NOTES.md](DESIGN_NOTES.md) for the three reviewed GitHub references, implementation scope, generated asset prompts and validation. Reduced motion and the pause button keep all content accessible without continuous animation.

## Earlier repository studies

Six smaller source-only projects appear within Selected Work after the eight featured case studies: Insightful, BidApplication, youtube-testing, movie-catalog, single-pass-assembler and Compiler-for-micro-Java. Their cards link to repository README instructions. The SVG thumbnails are conceptual illustrations made for this portfolio; they are not screenshots of running applications.

## Interactive sections

`dist/sections.css` and `dist/sections.js` add project entrances, scroll-colored lettering, timeline reveals, workshop motion, a six-step engineering walkthrough and a contact topic selector. The selector prepares an email with relevant prompts; it never sends mail automatically. All animation honors the global pause button and the operating system’s reduced-motion preference.

## Publishing

Push to `main`. The GitHub Pages workflow publishes `dist/` automatically. The public Pages address is configured as the repository homepage. A custom domain can be attached in GitHub Pages after the domain is registered and its DNS is under Petar’s control.
