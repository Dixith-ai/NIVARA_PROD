<div align="center">

<br/>

```
███╗   ██╗██╗██╗   ██╗ █████╗ ██████╗  █████╗
████╗  ██║██║██║   ██║██╔══██╗██╔══██╗██╔══██╗
██╔██╗ ██║██║██║   ██║███████║██████╔╝███████║
██║╚██╗██║██║╚██╗ ██╔╝██╔══██║██╔══██╗██╔══██║
██║ ╚████║██║ ╚████╔╝ ██║  ██║██║  ██║██║  ██║
╚═╝  ╚═══╝╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**Clinical-grade skin analysis. No appointment. No waiting room. No specialist required.**

<br/>

[![CI](https://github.com/Dixith-ai/NIVARA_PROD/actions/workflows/ci.yml/badge.svg)](https://github.com/Dixith-ai/NIVARA_PROD/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://www.nivara.life)
[![License](https://img.shields.io/badge/License-Proprietary-C4973A?style=flat)](#license)

<br/>

[**→ Live Demo**](https://www.nivara.life/demo) · [**→ Website**](https://www.nivara.life) · [**→ CI/CD Status**](https://github.com/Dixith-ai/NIVARA_PROD/actions)

<br/>

---

</div>

## What Is NIVARA?

NIVARA is a precision skin health platform built indigenously in India. Upload a photo of a skin concern and receive a **structured differential diagnosis** — not one guess, but a ranked analysis of the most likely conditions with confidence scores, the way a clinician actually thinks.

No device required for the demo. No appointment. No waiting room. Clinical-grade AI skin screening, accessible to anyone.

> *"The breakdown was more detailed than I expected. I had no idea — found a great option nearby."*
> — Early User, Bengaluru

---

## The Problem We're Solving

India has **1 dermatologist per 100,000 people**. Most people with skin concerns either ignore them, self-diagnose incorrectly, or wait months for a specialist. Early-stage conditions that are trivially treatable become serious because nobody caught them.

NIVARA bridges this gap with:

- **Differential diagnosis** — not a single prediction, a ranked clinical framework
- **Confidence scoring** — so users understand the certainty behind each result
- **Dermatologist access** — verified specialists bookable directly from the result
- **Kiosk deployment** — bringing screening to clinics, hospitals, and pharmacies

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NIVARA PLATFORM                         │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Frontend       │   Backend        │   Services                │
│                  │                  │                           │
│  Next.js 16      │  App Router API  │  Firebase Auth            │
│  TypeScript      │  Route Handlers  │  Firestore DB             │
│  CSS Modules     │  Server Actions  │  Firebase Storage         │
│  DM Serif Display│                  │  Resend (Email)           │
│  Cormorant       │                  │  Google Sheets (Feedback) │
│  Inter           │                  │  Google Analytics GA4     │
│                  │                  │  Microsoft Clarity        │
└──────────────────┴──────────────────┴───────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Deployment      │
                    │                   │
                    │  Vercel (Prod)    │
                    │  GitHub Actions   │
                    │  (CI/CD)          │
                    └───────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript (strict) | 5.x |
| Auth & DB | Firebase | 12.x |
| Email | Resend + React Email | 6.x |
| Analytics | Google Analytics 4 + Microsoft Clarity | — |
| Feedback Logging | Google Sheets API | v4 |
| PDF Generation | pdf-lib | 1.17.x |
| Deployment | Vercel | — |
| CI/CD | GitHub Actions | — |
| Node | 20 (pinned via .nvmrc) | 20.x |

---

## CI/CD Pipeline

Every change to this repository goes through an automated quality gate before it can reach production.

```
Push to branch
      │
      ▼
┌─────────────────────────────────────┐
│         GitHub Actions              │
│                                     │
│  1. npm ci          (clean install) │
│  2. tsc --noEmit    (type check)    │
│  3. eslint          (lint)          │
│  4. next build      (build verify)  │
│                                     │
│  ALL must pass → merge allowed      │
│  ANY failure → merge blocked        │
└─────────────────────────────────────┘
      │
      ▼ (on merge to master)
┌─────────────────┐
│  Vercel Deploy  │  → https://www.nivara.life
└─────────────────┘
```

**Branch protection** is enforced on `master`. Direct pushes are blocked. All changes require a Pull Request with a passing Quality Gate.

See the full pipeline documentation: [`NIVARA_CICD_Documentation.pdf`](./docs/NIVARA_CICD_Documentation.pdf)

---

## Project Structure

```
nivara/
├── app/                        # Next.js App Router
│   ├── (pages)/                # Route pages
│   │   ├── page.tsx            # Homepage
│   │   ├── demo/               # Scan demo
│   │   ├── features/           # Technology page
│   │   ├── doctors/            # Doctor directory
│   │   ├── results/            # Scan results
│   │   ├── profile/            # User profile
│   │   ├── onboarding/         # User onboarding
│   │   ├── feedback/           # Feedback form
│   │   ├── kiosks/             # Kiosk info
│   │   └── buy/                # Early access
│   ├── api/                    # API route handlers
│   │   ├── email/              # Transactional emails
│   │   └── cron/               # Scheduled jobs
│   ├── admin/                  # Admin dashboard
│   └── doctor/                 # Doctor portal
├── components/                 # Shared components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── FeedbackWidget.tsx
│   └── ClarityScript.tsx
├── lib/                        # Utilities & config
│   ├── firebase.ts             # Client Firebase
│   ├── firebaseAdmin.ts        # Server Firebase Admin
│   ├── email.ts                # Resend email sender
│   └── googleSheets.ts         # Sheets API
├── emails/                     # React Email templates
├── public/
│   └── images/                 # Static assets
│       ├── nivara-device.webp
│       └── nivara-device-clinical.webp
├── scripts/                    # Seed & utility scripts
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Quality Gate pipeline
│   │   └── pr-labels.yml       # Auto PR labeling
│   └── labeler.yml             # Label rules
├── .nvmrc                      # Node 20 pinned
└── eslint.config.mjs           # ESLint flat config
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (use `.nvmrc` with `nvm use`)
- npm
- Firebase project
- Resend account
- Google Cloud service account (for Sheets)

### Installation

```bash
# Clone the repository
git clone https://github.com/Dixith-ai/NIVARA_PROD.git
cd NIVARA_PROD

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in all values in .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```bash
# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM=

# App
NEXT_PUBLIC_APP_URL=

# Cron Security
CRON_SECRET=

# Google Sheets (Feedback logging)
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run typecheck    # TypeScript type check
npm run lint         # ESLint
```

---

## Contributing

This is a private repository. To contribute:

1. **Branch** off `master` with a descriptive name
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally
   ```bash
   npm run typecheck && npm run lint && npm run build
   ```

3. **Push** and open a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Wait** for the Quality Gate to pass — all 4 checks must be green

5. **Merge** once approved

Branch naming convention:
- `feature/` — new features
- `fix/` — bug fixes
- `chore/` — maintenance
- `ci/` — pipeline changes

---

## Team

Built by the NIVARA founding team.

| Name | Title |
|------|-------|
| **Karthik H S** | Frontend Engineer |
| **Dixith Adithya** | Full Stack Engineer & IoT Architect |
| **Mufeez** | Research & Clinical Validation |
| **Chethan** | Operations, Deployment & IoT |
| **Pratham Limbani** | Product & Design |

---

## Deployment

NIVARA is deployed on Vercel. Every merge to `master` triggers an automatic production deployment.

| Branch | Environment | URL |
|--------|------------|-----|
| `master` | Production | [nivara.life](https://www.nivara.life) |
| `feature/*` | Preview | Auto-generated by Vercel |

---

## License

Copyright © 2026 NIVARA Health Technology. All rights reserved.

This repository contains proprietary and confidential source code. Unauthorised copying, distribution, or use of any part of this codebase — in whole or in part — is strictly prohibited without explicit written permission from NIVARA Health Technology.

---

<div align="center">

<br/>

```
·  NIVARA  ·
```

*Precision skin health technology. Indigenously crafted in India.*

<br/>

**[nivara.life](https://www.nivara.life)**

<br/>

</div>
