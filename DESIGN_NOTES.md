# Petar Nojner — interactive engineering portfolio

## Three references reviewed

1. [ladunjexa/reactjs18-3d-portfolio](https://github.com/ladunjexa/reactjs18-3d-portfolio): reviewed README and `src/components/canvas/Stars.tsx`. Takeaway: sparse particles and a layered scene give depth without obscuring the work.
2. [adrianhajdin/3d-portfolio](https://github.com/adrianhajdin/3d-portfolio): reviewed README and `src/components/models/hero_models/HeroExperience.jsx`. Takeaway: restrained camera movement, lighting and device-specific interaction keep the central scene readable.
3. [sanidhyy/space-portfolio](https://github.com/sanidhyy/space-portfolio): reviewed README and `components/main/skills.tsx`. Takeaway: skills belong in clear groups with visual rhythm, followed by tangible project evidence.

Original implementation inspired by these patterns. No source or model assets copied from those projects.

## Implementation

A custom 2.5D portrait scene combines transparent photographic and illustrated layers, perspective rings, a projected particle field, pointer parallax and a scroll-controlled scan reveal. It is not a skeletal 3D character or a generated video: the character translates, scales, tilts and breathes as one layered figure. Three narrative states lead from personal identity through the digital interpretation to project evidence. Photos remain available in the asset folder.

Six filterable technology groups include the CV's backend, frontend, data, cloud, operations, testing and AI tools, plus the supplied IoT and agent-workflow experience. Skill labels do not imply equal proficiency; the page explicitly identifies Java, Spring Boot, React and TypeScript as the strongest foundations.

The original projects, demos, source links, contribution dialogs and actual Upwork feedback are retained. Paused startup FurLand and prototype Harness Lab retain their accurate status.

## Generated assets

Tool: built-in imagegen. Input: `WhatsApp Image 2026-11-16 at 22.03.40 (1).jpeg`.

- `dist/assets/petar-real-cutout.png` — transparent photographic rendition.
- `dist/assets/petar-anime.png` — transparent anime interpretation.

Both images have an alpha channel. Original inputs and generated originals were retained.

### Cutout prompt

Use case: background-extraction. Edit target: the supplied photo. Create a clean transparent cutout of this exact man, preserving his identity, face, hair, beard, tattoos, white tiger t-shirt, jeans, pointing gesture, camera angle and proportions exactly. Remove only the white background. Keep original composition and crop (waist up), do not invent legs or new objects. Transparent alpha background, no shadow, no text. This will align with an anime rendition in a scroll-driven portfolio transformation.

### Anime prompt

Use case: style-transfer. Asset type: premium anime character cutout for a software engineer's portfolio. Transform the exact man in the reference photo into a polished contemporary anime illustration, sharp elegant linework, rich cel shading, restrained cinematic lime and teal rim light. Preserve recognizable facial identity, brown short hair, beard, smile, arm tattoos, white tiger graphic t-shirt and jeans. Match the reference pointing pose, foreshortened hand, camera angle, silhouette, crop and proportions precisely so an image overlay can transition from photograph to illustration. Waist-up framing, no extra body parts, do not invent legs. Confident adult engineer, not childlike, not chibi. Transparent background with real alpha. No scenery, no text, no floating objects.

## Validation

Checked desktop at 1440×900 and mobile at 390×844. Verified all three scene states, full digital reveal and return to photographic state, six database entries, technology and project filters, contribution dialog, Escape, and reduced-motion mode. No browser console warnings/errors or horizontal overflow in these checks. The existing local server on port 4173 was reused and left running.

## November 2026 content and motion revision

- Removed the visible Human / Digital / Delivered controls and photographic/anime caption while retaining the portrait transformation. Hero chips now emphasize Java / Spring Boot; PostgreSQL / MongoDB / Redis; and Agents / Harness / MCP / Graphs / Loops.
- Added Pitwall as project eight, with public demo, source, authentic screenshot and contribution dialog. The public historical simulation is explicitly distinguished from the private AI/API version described by Petar. Source: https://github.com/nokibuzz/pitwall-race-companion. Screenshot: `docs/preview-strategy.png` from that repository.
- Split NetSeT and GNation, grouped the overlapping Hooloovoo full-stack and Letzz leadership roles, and added IT and HR workshops. Existing verified Upwork feedback remains unchanged.
- Projects enter with perspective and image reveals; experience uses alternating entrances, timeline progress and dot bursts; feedback and section headlines use progressive letter coloring. Workshops use an orbital composition.
- The engineering toolkit includes six selectable architecture steps and an optional timed walkthrough linked to actual case studies. The contact section adds orbit motion, a pointer-responsive CTA and four useful email topics. Motion runs on native scrolling without scroll hijacking.
- Verified at 1440 px desktop, 390 px mobile and 320 px narrow mobile: no horizontal overflow. Exercised the new Pitwall dialog, toolkit selection/walkthrough, contact topic links, pause and reduced-motion behavior. Reduced-motion mode reported zero running animations. JavaScript syntax checks passed; no browser console warnings or errors.
