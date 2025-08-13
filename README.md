## Vayla - Private sharing that stays under your control.

A fast, minimal static site for GitHub Pages. No frameworks; pure HTML, CSS, and vanilla JS.

### Quick start

- Copy this folder into a new GitHub repository (e.g., `vayla-site`).
- Replace placeholder assets in `assets/img/` and favicons at the root.
- Update the `https://example.com/` canonical/OG/robots/sitemap URLs to your Pages URL.

### Deploy to GitHub Pages

1. Commit and push to `main`.
2. In GitHub, go to Settings → Pages.
3. Source: Deploy from branch → `main` / root.
4. Wait for build; your site will appear at your Pages URL.
5. Optional: Add a custom domain in Settings → Pages. Create a `CNAME` DNS record.

### Structure

- `index.html` Home + waitlist
- `mission.html` Product values
- `app.html` Coming soon + email capture
- `consent.html` Explainer + 3-step SVG diagram
- `anti-capture.html` Non-technical overview
- `resources.html` Resource links + FAQ accordion
- `contact.html` Minimal contact form
- `assets/css/styles.css` Design tokens, components, utilities, motion
- `assets/js/main.js` Mobile nav, accordion, form validation, reveal-on-scroll, smooth anchors

### Design tokens

- Colors and motion tokens live in `:root` in `assets/css/styles.css`.
- Primary color: `var(--brand-picton)`. Accent/danger: `var(--brand-mandy)`.

### Motion and micro-interactions

- Classes:
  - `.fade-in-up`: opacity 0→1; translateY 8px→0; duration `var(--dur-med)`; easing `var(--ease-out)`
  - `.fade-in`: opacity 0→1
  - `.hover-lift`: lift on hover/focus
  - `.underline-slide`: animated underline on hover/focus
- Reveal on scroll: add `[data-reveal]` to an element. JS will add `.is-visible` when it enters the viewport.
- Reduced motion: all animations are minimized under `prefers-reduced-motion: reduce`.

### Glass UI

- Use `.glass` for light surfaces, `.glass--dark` for dark variant:
  - Apply to sticky headers, hero cards, or small callouts.
  - Ensure text contrast:
    - Light: use `--neutral-900`
    - Dark: use `--neutral-50`
  - Example:
    ```html
    <div class="glass" data-theme-surface>...</div>
    <div class="glass glass--dark" data-theme-surface>...</div>
    ```

### Forms

- Forms post to a placeholder endpoint (Formspree-style):
  - Replace `https://formspree.io/f/your-id` with your form endpoint.
  - JS handles basic validation and async submit with inline success/error states.
  - Mailto fallbacks are provided on CTAs.

### Accessibility

- Semantic landmarks, skip link, focus-visible outlines, aria attributes on nav and accordion.
- Keyboard-friendly nav and accordion (Enter/Space toggles).
- Animations respect `prefers-reduced-motion`.

### SEO

- Unique titles/descriptions per page.
- Open Graph/Twitter tags with `/assets/img/og-cover.png` preview.
- JSON-LD Organization on `index.html`.

### Performance tips

- Critical hero CSS inlined on `index.html`.
- JS is deferred.
- Images use width/height to reduce CLS; set `loading="lazy"` where appropriate.
- Consider compressing images and serving SVG where possible.

### Extending animations

- Update motion tokens in `:root`:
  - `--ease-out`, `--dur-fast`, `--dur-med`
- Add new keyframes and pair them with `[data-reveal]` for scroll-triggered effects.
- Disable motion globally by enabling `prefers-reduced-motion` in your OS/browser; the site will respect it.

### Theming

- Place `data-theme="dark"` on `<html>` to shift glass text color helpers. Extend tokens as needed.

### License

- Replace with your preferred license if publishing.

### Checklist

- [ ] Replace logo.svg
- [ ] Update resource links on /resources.html
- [ ] Connect real form endpoint
- [ ] Edit copy where needed
- [ ] Set custom domain (optional)
