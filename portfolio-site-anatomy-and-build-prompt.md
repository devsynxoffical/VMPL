# Single-Page Creative Portfolio: Anatomy and Build Prompt

Based on the structural pattern of heynesh.com. Structure, section logic and interaction patterns are reusable. Copy, imagery, testimonials, project work and personal story are not, and every one of those must be replaced with your own before this goes live.

---

## Part 1. What the reference site actually is

**Platform:** Webflow, with GSAP for motion. Booking via Cal.com. No blog, no CMS-driven pages beyond the project list. One page, anchor navigation.

**Shape:** a single long scroll with eight anchored sections, a sticky side navigation that tracks position, and one conversion action repeated throughout (book a call).

**Why it works:** it's built as a sales page, not a gallery. Every section answers one buyer question in order: who is this, can I trust them, what have they done, what will I get, what does it cost, what do others say, what am I still worried about. That sequence is the thing to copy.

---

## Part 2. Section anatomy

Eight sections plus a persistent nav and footer. For each: what it contains, how it's laid out, and what the interaction is.

### 0. Persistent navigation

- Fixed vertical nav, off to one side, listing all eight anchors: home, about, projects, what you get, services, clients, faq.
- Active state tracks scroll position.
- Contact block sits with it: email with a copy-to-clipboard action, two social links, and the book-a-call button.
- On mobile this collapses to a compact bar with the same anchors.

### 1. Hero

- Small eyebrow line naming the person and specialism.
- One large headline, three words, deliberately terse. Reference uses "Webflow, Applied Differently." The pattern is: your craft, then a claim about your approach.
- Two buttons: primary "Book a Call", secondary "About Me" that anchors down.
- One sentence of positioning beneath.
- Two stat counters: project count and years of experience.
- A horizontal marquee of five single-word traits (Creative, Reliable, Strategist, Builder, Efficient) scrolling continuously.
- A single portrait photo.
- Client logo strip, two rows in opposing directions.

### 2. About / timeline

The signature section. A vertical timeline, one entry per year, seven entries.

Each entry has two layers:
- **Collapsed:** the year as a large abbreviated numeral ('19, '20 ...), a bold one-line title, a two-sentence teaser, one or two small images, a fake social-post attribution line ("@stefan, 7 years ago"), and a "Read more" trigger.
- **Expanded:** the full year, a larger heading, a paragraph of four to six sentences, and a larger image.

The entries are personal, not professional. Brother, first client, a project that scared him, marriage and daughter, current year. The interaction is expand-in-place, not a modal.

This section does the trust work that testimonials can't. It's the hardest section to fake, which is why copying his version would be worthless.

### 3. Selected work

- Section label, heading, one paragraph.
- Nine projects as a grid of cards. Each card: a number (01 to 09), a cover image, three tag chips (CMS, GSAP, SEO, API, Motion, Components, Localization, Performance), the client name, one sentence of description. Whole card is a link to the live site.
- Cards likely reveal on scroll with a stagger.

### 4. What you get

- Heading with a large paragraph that has a text-reveal animation, likely word-by-word on scroll.
- Five capability cards in a row or two rows: title plus one sentence each. Development, Integrations, SEO, Motion, Performance.

### 5. Services and pricing

Three tiers, laid out as cards:
- **Retainer:** monthly price, hours included, list of what's covered, minimum commitment, rollover terms, one-line "who it's for".
- **Fixed build:** single price, scope in bullets, timeline, one-line "who it's for".
- **Custom:** no price, "Book a Call" instead, scope in bullets.

Note the structure: real prices on two tiers, and the third deliberately priced by conversation. That's the pattern, and it's a good one.

### 6. Mid-page CTA break

A short full-width section: heading, one paragraph, portrait, "Have something in mind?" and a button. This sits between pricing and testimonials, catching people who are convinced by price before they read the social proof.

### 7. Testimonials

- Eight cards in a horizontal draggable track. The reference literally labels it "drag" and "click".
- Each card: a bold two-line pull quote as the heading, a paragraph, avatar, name, role, company as a link.
- Drag to browse, click a card to expand or open.

### 8. FAQ

Eight questions as an accordion. The last one is a soft CTA: "Not sure which plan fits? Email me." Questions are objection handlers, not general information: why this platform, can you fix what I have, what's the process, NDA, do you design, what does support look like, how do revisions work.

### 9. Footer

Minimal. Repeats the anchors, email, socials, book a call.

---

## Part 3. What you must supply before building

Every one of these is yours to write. There are no defaults.

```
NAME              =
SPECIALISM        =   (e.g. "Framer developer", "Shopify developer", "Brand designer")
HEADLINE          =   three to four words, craft + claim
POSITIONING_LINE  =   one sentence
STAT_1            =   e.g. "60+ Projects"
STAT_2            =   e.g. "5 Years"
TRAITS            =   five single words
PORTRAIT          =   your photo
CLIENT_LOGOS      =   real clients only, with permission
TIMELINE          =   five to seven entries, one per year, your actual story
PROJECTS          =   six to nine, real, live links, with permission to show
CAPABILITIES      =   five, title + sentence
PRICING           =   your real tiers and numbers
TESTIMONIALS      =   real, attributed, with permission
FAQ               =   eight objection-handling questions
EMAIL, SOCIALS, BOOKING_LINK
```

If you don't have testimonials or a timeline yet, leave those sections out rather than inventing them. A six-section site with true content outperforms an eight-section site with two fake ones.

---

## Part 4. Build prompt

Paste this into Claude Code or Fable 5 with Part 3 filled in.

```
Build a single-page creative portfolio site as a self-contained project.

STACK
Next.js 14 App Router, Tailwind CSS, GSAP with ScrollTrigger, Lenis for
smooth scroll. No CMS. All content lives in one /content.ts file so it can
be edited without touching components. Deployable to Vercel as static.

PAGE STRUCTURE
One route. Eight sections in this order, each with an id used by the nav:
hero, about, projects, overview, services, cta, testimonials, faq.
Footer after.

PERSISTENT NAV
Fixed to the left on desktop (min-width 1024px), vertical list of the eight
anchors. Active anchor tracks scroll via IntersectionObserver with a
threshold of 0.5. Beneath the anchors: email with a copy-to-clipboard button
that shows "Copied" for 1.5s, two social icon links, and a primary button
"Book a Call" linking to BOOKING_LINK. Below 1024px, collapse to a top bar
with a menu toggle that opens a full-screen sheet listing the same anchors.

HERO (#hero)
Eyebrow in small caps: "{SPECIALISM}. That's {NAME}."
H1: {HEADLINE}, clamp(2.75rem, 7vw, 6.5rem), tight line-height, letter-
spacing -0.02em.
Two buttons: primary "Book a Call" (external), secondary "About Me" (anchors
to #about with smooth scroll).
One line: {POSITIONING_LINE}.
Two stat blocks side by side: {STAT_1} and {STAT_2}, numbers count up from
0 over 1.2s when first in view.
A horizontal marquee of {TRAITS}, separated by a small dot, scrolling left
continuously, pause on hover, duplicated twice for a seamless loop.
{PORTRAIT} on the right on desktop, above the text on mobile.
Client logo strip: two rows, row one scrolls left, row two scrolls right,
different speeds, grayscale at 50% opacity, full colour on hover.

ABOUT / TIMELINE (#about)
Section label, H2 "About Me & My Journey", one-line intro.
Vertical timeline from {TIMELINE}. A 1px vertical line runs down the left
of the entries. Each entry has a collapsed and expanded state:
  Collapsed: year abbreviated ('24), bold title, two-sentence teaser, up to
  two small images, a muted attribution line, and a "Read more" button.
  Expanded: full year, larger heading, full paragraph, one large image,
  and the button becomes "Read less".
Expand in place with a height transition of 400ms. Only one entry expanded
at a time. Entries fade and rise 24px on scroll into view, staggered 80ms.

SELECTED WORK (#projects)
Section label "Selected Work", H2, one paragraph.
Grid of {PROJECTS}: 3 columns desktop, 2 tablet, 1 mobile. Each card:
index number (01, 02 ...), cover image with 4:3 ratio, up to three tag
chips, client name, one-line description. Entire card is an <a> to the
live URL, target _blank. Hover: image scales 1.03 inside a clipped
container, card border brightens. Cards reveal on scroll, staggered 60ms.

WHAT YOU GET (#overview)
Section label "Capabilities Overview", H2 "What You Get?".
One paragraph at display size where words fade from 30% to 100% opacity
as the user scrolls through the paragraph (GSAP ScrollTrigger scrub on
each word span).
Five capability cards from {CAPABILITIES}, single row on desktop wrapping
to 2+3, stacked on mobile. Title and one sentence each.

SERVICES (#services)
Section label "Services", H2, one-line intro.
Three pricing cards from {PRICING} side by side, stacked on mobile.
Tier 1: price with "/ {unit}" suffix, description, bullet list, "who it's
for" line, button.
Tier 2: single price, description, bullet list, "who it's for", button.
Tier 3: no price, "Book a Call" in place of the price, description, bullet
list, "who it's for", button.
The middle card is visually elevated: 1px accent border and a slightly
lifted shadow.

CTA BREAK (#cta)
Full-width section with generous vertical padding. H2, one paragraph,
{PORTRAIT} small and round, line "Have something in mind?", primary button
"Let's Talk" to BOOKING_LINK.

TESTIMONIALS (#testimonial)
Section label, H2 "From People I've Worked With".
Horizontal draggable track of {TESTIMONIALS}. Implement drag with pointer
events and momentum, no library. Cursor shows a custom "drag" label while
hovering the track. Each card: bold two-line pull quote as heading,
paragraph, avatar 48px round, name, role, company as an external link.
Cards are 380px wide desktop, 85vw mobile. Keyboard accessible: arrow keys
move between cards when the track is focused.

FAQ (#faq)
Section label, H2 "Got any questions?".
Accordion from {FAQ}. Real <button> elements with aria-expanded and
aria-controls. One open at a time. Height transition 300ms. Plus icon
rotates 45deg to become a close icon. The final item's answer contains a
mailto link to EMAIL.

FOOTER
Two rows. Row one: the eight anchors as links. Row two: EMAIL, socials,
"Book a Call", and a copyright line.

MOTION RULES
Lenis smooth scroll at lerp 0.09. All reveals: opacity 0 to 1 plus
translateY 24px to 0, 600ms, cubic-bezier(0.16, 1, 0.3, 1). No slide from
the side, no scale-in. Respect prefers-reduced-motion: disable Lenis,
marquees stop, all reveals become instant, timeline expands without
animation.

TYPOGRAPHY
Display: a single expressive typeface for H1 and H2, chosen to match the
brand. Body: a neutral sans. Load both from Google Fonts or Fontshare with
display=swap. Type scale: 12 / 14 / 16 / 18 / 22 / 28 / 40 / 56 / 88 / 120.

PERFORMANCE
Images as AVIF with WebP fallback via next/image. Lazy load everything
below the hero. Marquees use CSS transform animation, not JS. Lighthouse
target: 90+ performance on mobile.

ACCESSIBILITY
Semantic landmarks. One H1. Visible focus rings. All interactive elements
reachable by keyboard including the drag track and the timeline expanders.
Alt text on every image from the content file.

DELIVERABLE
Working project with a README covering: how to edit content.ts, how to
swap fonts, how to deploy to Vercel.
```

---

## Part 5. Things to decide before you paste the prompt

**Palette.** I've left it out of the prompt on purpose. A portfolio palette should come from your brand, not the reference. Pick a background, a text colour, one accent, and hand those to the model as three hex values.

**Typeface.** Same. The reference's feel comes mostly from its type choice. Choose yours first.

**Which sections you can honestly fill.** Timeline and testimonials are the two most persuasive sections and the two that cannot be faked. If either is thin, cut it. Add it back when it's real.

**Booking tool.** The reference uses Cal.com. Calendly, Cal.com, or a plain contact form all work. Decide before building so the button target exists.
