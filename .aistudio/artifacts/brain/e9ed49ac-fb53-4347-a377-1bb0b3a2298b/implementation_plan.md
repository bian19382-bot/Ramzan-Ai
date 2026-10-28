# Replace Intro Video with Welcome Photo Banner & Profile Photo Management

Remove the auto-playing AI video introduction completely and replace it with an elegant welcome photo banner featuring Ramzan Ghafoor's developer portrait with a quick dismiss button, while adding custom photo upload support directly inside Quick Edit and Admin settings.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during clarification:
> - **Confirmed Welcome Display**: Replace the video player overlay with a stylish, non-intrusive welcome photo banner featuring Ramzan Ghafoor's portrait, developer credentials, and an instant dismiss button ("Enter Portfolio" / "✕").
> - **Confirmed Photo Management**: Add direct photo upload (drag-and-drop file upload + image URL input) into Quick Edit and Admin settings so the user can easily swap, update, and preview their profile photo across the site.
> - **Clean Video Deprecation**: Remove dead video references, video timeouts, audio toggles, and replace "Replay Intro Video" actions with "View Welcome Portrait".

---

### 1. Overview & Core Concept

- **What It Does**: Visitors visiting the portfolio are greeted with an elegant welcome photo banner highlighting Ramzan Ghafoor as a professional web developer, with an immediate single-click dismissal to dive into the work. In addition, Ramzan can update his portrait anytime directly from the Quick Edit modal or Admin panel using file upload or image URLs with instant preview.
- **Target Audience / Persona**: Clients, recruiters, and collaborators looking for a skilled web developer without being hindered by video loading buffers, video autoplay restrictions, or sound playback.
- **Key Value**: Instant load speed, zero video playback friction or autoplay blocks, and effortless personal branding customization.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Initial Visit / Welcome Experience**:
   - On page load, if the welcome photo banner is enabled, a sleek top glass banner or hero welcome card appears displaying Ramzan Ghafoor's portrait, title, and key specialties.
   - A high-contrast "Enter Portfolio" or "Dismiss" button closes the banner smoothly, scrolling visitors straight to the core portfolio.
   - A "Don't show again" option saves the preference in local storage so returning visitors land straight on the content.
2. **Reopening Welcome Portrait**:
   - Visitors can reopen the welcome portrait modal or banner anytime from the navigation bar or footer link ("Welcome Card").
3. **Quick Edit / Admin Photo Upload**:
   - Clicking "Quick Edit" in the navbar or accessing `/admin` opens the profile editor.
   - An intuitive photo management widget lets Ramzan upload a JPEG/PNG/WebP file directly from his computer/phone or enter an image URL, with live circular/rounded preview and instant save to database state.

#### Visual Identity & Theme
- **Layout & Composition**: Following the Universal Frontend Design Constitution and Portfolio Guidelines:
  - 60% neutral canvas with deep obsidian/charcoal dark mode and crisp studio light mode.
  - 30% structural glass surfaces with hairline border (`border-white/10` or `border-slate-200`).
  - 10% electric violet / cobalt focal accents for buttons and badges.
- **Typography**: Display typography using `Plus Jakarta Sans` / `Outfit` with balanced headlines and clean metadata separators (`·`). Zero pill clutter or pseudo-technical code comment headers.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Welcome Photo Banner vs Video Overlay**
  - *Chosen Approach*: Lightweight React banner component (`WelcomePhotoBanner.tsx`) that does not block DOM interaction, has zero audio/video dependencies, and dismisses instantly in under 150ms.
  - *Why*: Solves browser autoplay restrictions, eliminates external CDN video buffering, and immediately presents Ramzan Ghafoor's authentic portrait.
  - *Alternatives Considered*: Direct entrance without any banner was considered, but the user explicitly requested a welcome photo banner with a quick dismiss button.

- **Decision 2: FileReader DataURL + Remote URL for Photo Upload**
  - *Chosen Approach*: Support both direct local file selection (with drag & drop) converting to compressed Base64 Data URL and direct HTTPS image URL inputs in `AdminSettings` and `QuickEditModal`.
  - *Why*: Allows instant local updates without needing external cloud bucket storage configuration, while persisting across page reloads in `localStorage` through `dataProvider`.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    PublicPortfolio.tsx                      │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              WelcomePhotoBanner.tsx                 │   │
│   │  [ Portrait Image ] [ "Ramzan Ghafoor" ] [ Dismiss ]│   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    Navbar.tsx                       │   │
│   │    - "Welcome Card" (replaces Replay Intro Video)   │   │
│   │    - "Quick Edit" Button                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌──────────────────┐  ┌───────────────────┐  ┌────────┐   │
│   │ HeroSection.tsx  │  │ AboutSection.tsx  │  │ Footer │   │
│   │ (Dynamic Photo)  │  │ (Dynamic Photo)   │  │        │   │
│   └──────────────────┘  └───────────────────┘  └────────┘   │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │
            ┌──────────────────┴──────────────────┐
            │         dataProvider.ts             │
            │      db.profile.portrait_url        │
            │  db.settings.feature_flags.welcome  │
            └──────────────────┬──────────────────┘
                               ▲
            ┌──────────────────┴──────────────────┐
            │    AdminSettings & Quick Edit Modal │
            │  - Drag & drop local image upload   │
            │  - Live image preview & crop        │
            │  - Instant sync with dataProvider   │
            └─────────────────────────────────────┘
```

#### Files to Update / Create:
1. **Create `src/features/welcome/WelcomePhotoBanner.tsx`**:
   - Modern glassmorphic banner featuring Ramzan Ghafoor's portrait, professional title ("Web Developer"), value proposition, and an instant dismiss CTA.
2. **Update `src/pages/PublicPortfolio.tsx`**:
   - Replace `IntroOverlay` with `WelcomePhotoBanner`.
   - Update navigation and footer handlers (`handleShowWelcomePhoto` instead of `handleReplayIntro`).
3. **Update `src/features/nav/Navbar.tsx` & `src/features/nav/MobileMenu.tsx` & `src/features/footer/Footer.tsx`**:
   - Remove "Replay AI Intro Video" references, replacing with "Welcome Card" trigger or clean omission.
4. **Update `src/admin/pages/AdminSettings.tsx`**:
   - Enhance portrait management with drag-and-drop file upload, file input, image URL option, and instant preview.
5. **Update `src/features/intro/` & `src/data/initialData.ts`**:
   - Cleanly deprecate video configuration fields and enable welcome banner flag.
