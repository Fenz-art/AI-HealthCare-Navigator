# CareCompass Elite Design System

Category-defining healthcare navigation — Apple Maps × Airbnb × Uber × Linear.

## Palette (dark-first)

| Token | Value | Use |
|---|---|---|
| `--cc-bg` | `#06070A` | Page canvas |
| `--cc-surface` | `#0E1015` | Panels, sidebar |
| `--cc-elevated` | `#161A22` | Cards, inputs |
| `--cc-text` | `#F7F8FA` | Primary copy |
| `--cc-text-secondary` | `#9CA3AF` | Supporting copy |
| `--cc-border` | `rgba(255,255,255,0.06)` | Hairlines |
| `--cc-pharmacy` | `#3B82F6` | Pharmacy / primary accent |
| `--cc-clinic` | `#8B5CF6` | Clinic |
| `--cc-hospital` | `#EC4899` | Hospital |
| `--cc-emergency` | `#FF4D4F` | Emergency |
| `--cc-success` | `#52C41A` | Self-care |

## Typography

- **Display:** Satoshi (Fontshare)
- **Body:** Inter
- **Mono:** Geist Mono

## Motion

| Token | Duration | Use |
|---|---|---|
| `motion.fast` | 150ms | Hovers, toggles |
| `motion.normal` | 250ms | UI transitions |
| `motion.slow` | 500ms | Hero reveals |

Lenis → scroll · GSAP → storytelling · Framer → interactions. No bounce.

## Utilities

`.cc-surface` `.cc-elevated` `.cc-panel` `.btn-primary` `.btn-secondary` `.hairline`

## Product components (`components/product/`)

| Component | Role |
|---|---|
| `WorldMapHero` | Fullscreen hero + flight paths |
| `StoryTokyo` | Scroll-pinned problem narrative |
| `NavigationNotDiagnosis` | Diagnosis → Navigation typography |
| `NavigationEngine` | Three engine cards |
| `HealthGraph` | Investor-grade moat graph |
| `StoryCard` | Shared scroll-reveal section |
| `EmergencyBanner` | Severity strip |
| `CommandCenterLayout` | Map-dominant session UI |
| `FloatingCommandBar` | ⌘K agent |
| `InterpreterWave` | Push-to-talk waveform |
| `MedicationFlowCard` / `ProviderCard` / `OutcomeCard` | Session panels |

## App shell

Top nav · Linear sidebar · Main workspace · Right context panel · Mobile bottom nav · Floating agent button.

## Marketing theme (`.theme-marketing`)

Light Tsenta-inspired canvas for landing, login, and marketing pages.

| Token | Value | Use |
|---|---|---|
| `--mk-bg` | `#FAFAF8` | Page canvas |
| `--mk-surface` | `#FFFFFF` | Cards, demos |
| `--mk-accent` | `#C45C26` | Stage labels, accents |
| `--mk-text` | `#0A0A0A` | Headlines |

Utilities: `.mk-label` `.mk-headline` `.mk-demo-card` `.mk-btn-primary` `.mk-btn-outline`

## Story card framework (`components/story/`)

| Component | Role |
|---|---|
| `MarketingHero` | Living canvas hero + flight paths |
| `ChaosNarrative` | Scroll-pinned problem → resolution |
| `StoryStage` | Tsenta-style pipeline section |
| `DemoCard` | Inner product demonstration card |
| `pipeline-demos` | Detect / Navigate / Locate / Translate / Resolve |
| `PlatformsMatrix` | Four doors grid |
| `FaqSection` | Refined accordion |
| `MarketingFooter` | CTA + site footer |

## Landing sections

1. Hero (animated world map)
2. Trust marquee (countries)
3. Chaos narrative (scroll pin)
4. Five-stage pipeline with demo cards
5. Platforms matrix
6. Health graph moat
7. Real scenarios grid
8. FAQ + footer CTA
