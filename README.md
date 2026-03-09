<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=NIVARA&fontSize=80&fontAlignY=38&desc=Clinical-grade%20skin%20intelligence%2C%20built%20in%20India&descAlignY=58&descSize=16&fontColor=C4973A&descColor=e8dcc8&animation=fadeIn">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=NIVARA&fontSize=80&fontAlignY=38&desc=Clinical-grade%20skin%20intelligence%2C%20built%20in%20India&descAlignY=58&descSize=16&fontColor=C4973A&descColor=e8dcc8&animation=fadeIn" width="100%" alt="NIVARA">
</picture>

<br/>

```
नि + वार  ═══  Prevention + Strike
``

<br/>

<table>
<tr>
<td align="center">
<a href="https://github.com/Dixith-ai/NIVARA_PROD/actions/workflows/ci.yml">
<img src="https://github.com/Dixith-ai/NIVARA_PROD/actions/workflows/ci.yml/badge.svg" alt="CI Status"/>
</a>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Next.js-16.1.6-000000?style=flat-square&logo=next.js&logoColor=white"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/TensorFlow-2.16-FF6F00?style=flat-square&logo=tensorflow&logoColor=white"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white"/>
</td>
</tr>
<tr>
<td align="center">
<img src="https://img.shields.io/badge/Firebase-Auth%20+%20DB-FFCA28?style=flat-square&logo=firebase&logoColor=black"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Render-ML%20API-46E3B7?style=flat-square&logo=render&logoColor=white"/>
</td>
<td align="center">
<img src="https://img.shields.io/badge/License-Proprietary-C4973A?style=flat-square"/>
</td>
</tr>
</table>

<br/>

<a href="https://www.nivara.life/demo">
<img src="https://img.shields.io/badge/⚡_Try_Live_Demo-nivara.life%2Fdemo-C4973A?style=for-the-badge&labelColor=1a1a1a" alt="Live Demo"/>
</a>
&nbsp;&nbsp;
<a href="https://github.com/Dixith-ai/NIVARA_PROD/actions">
<img src="https://img.shields.io/badge/📊_Pipeline_Status-GitHub_Actions-2d333b?style=for-the-badge&labelColor=1a1a1a" alt="Pipeline"/>
</a>

</div>

<br/>

---

<div align="center">

## `∿` The Premise

</div>

> **India has 1 dermatologist per 100,000 people.**
> Most skin conditions — trivially treatable when caught early — go undiagnosed for months. Not because medicine failed. Because access did.

NIVARA is a precision skin analysis platform built indigenously in India. Upload a photo. Receive a **ranked differential diagnosis** — not a single guess, but a confidence-weighted breakdown of the most probable conditions, structured the way a clinician actually reasons.

No appointment. No waiting room. No specialist required.

```
Upload image  →  CNN-GRU inference  →  Ranked predictions  →  Book a dermatologist
    ⬆                  ⬆                       ⬆                      ⬆
  Browser          Render.com              Confidence %            Firebase
```

> *"The breakdown was more detailed than I expected. The confidence scores made it feel credible."*
> — Early User, Bengaluru

<br/>

---

<div align="center">

## `⬡` System Architecture

</div>

NIVARA runs as **two independent services** — a Next.js web platform and a FastAPI ML inference engine — communicating over HTTP. Neither knows about the other's internals.

```
╔══════════════════════════════════════════════════════════════════════════╗
║                         N I V A R A   S Y S T E M                       ║
╠══════════════════════════════════════╦═══════════════════════════════════╣
║         WEB PLATFORM                 ║        ML INFERENCE ENGINE        ║
║         github: NIVARA_PROD          ║        github: nivara-api         ║
║                                      ║                                   ║
║  ▸ Next.js 16  (App Router)          ║  ▸ FastAPI        (Python 3.11)   ║
║  ▸ TypeScript  (strict mode)         ║  ▸ TensorFlow     (2.16 CPU)      ║
║  ▸ Firebase    (Auth + Firestore)    ║  ▸ CNN-GRU Model  (custom arch)   ║
║  ▸ Resend      (Transactional email) ║  ▸ 10-class skin classification   ║
║  ▸ GA4 + Clarity  (Analytics)        ║                                   ║
║  ▸ Google Sheets  (Feedback log)     ║  POST /predict  →  JSON scores    ║
║                                      ║                                   ║
║  ⬡  Deployed: Vercel                ║  ⬡  Deployed: Render.com          ║
╚══════════════════════════════════════╩═══════════════════════════════════╝
              ║                                   ║
              ║      multipart/form-data          ║
              ╚══════════  image upload  ══════════╝
                        ← ranked predictions
```

<br/>

---

<div align="center">

## `◈` The ML Engine

</div>

The inference engine is a **custom CNN-GRU hybrid** — not a fine-tuned pretrained model. Built from scratch. Convolutional layers handle spatial feature extraction. A Gated Recurrent Unit processes sequential patterns across the feature map. The combination allows the model to reason about both texture and structural context simultaneously.

> Built by Karthik H S and Pratham Limbani.

### Model Graph

```
 ┌─────────────────────────────────────────────────────┐
 │  INPUT   128 × 128 × 3  (RGB)                        │
 └────────────────────────┬────────────────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Conv2D(32)  → ReLU → MaxPool     │  low-level texture
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Conv2D(64)  → ReLU → MaxPool     │  mid-level patterns
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Conv2D(128) → ReLU → MaxPool     │  high-level features
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Reshape  (spatial → sequential)  │  CNN → RNN bridge
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  GRU(64)                          │  sequential reasoning
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Dropout(0.5)                     │  regularisation
          └───────────────┬──────────────────┘
                          │
          ┌───────────────▼──────────────────┐
          │  Dense(10, softmax)               │  10-class output
          └──────────────────────────────────┘
```

### What It Classifies

<table>
<thead>
<tr>
<th>#</th>
<th>Condition</th>
<th>Category</th>
<th>Severity</th>
</tr>
</thead>
<tbody>
<tr><td><code>01</code></td><td>Eczema</td><td>Inflammatory</td><td>🟡 Moderate</td></tr>
<tr><td><code>02</code></td><td>Melanoma</td><td>Malignant</td><td>🔴 Critical</td></tr>
<tr><td><code>03</code></td><td>Atopic Dermatitis</td><td>Inflammatory</td><td>🟡 Moderate</td></tr>
<tr><td><code>04</code></td><td>Basal Cell Carcinoma</td><td>Malignant</td><td>🔴 Critical</td></tr>
<tr><td><code>05</code></td><td>Melanocytic Nevi</td><td>Benign</td><td>🟢 Low</td></tr>
<tr><td><code>06</code></td><td>Benign Keratosis-like Lesions</td><td>Benign</td><td>🟢 Low</td></tr>
<tr><td><code>07</code></td><td>Psoriasis / Lichen Planus</td><td>Inflammatory</td><td>🟡 Moderate</td></tr>
<tr><td><code>08</code></td><td>Seborrheic Keratoses</td><td>Benign</td><td>🟢 Low</td></tr>
<tr><td><code>09</code></td><td>Tinea / Ringworm / Candidiasis</td><td>Infectious</td><td>🟠 Attention</td></tr>
<tr><td><code>10</code></td><td>Warts / Molluscum / Viral Infections</td><td>Infectious</td><td>🟠 Attention</td></tr>
</tbody>
</table>

### API Contract

```
GET  /            →  { status: "ok", model: "loaded", conditions: 10 }
POST /predict     →  multipart/form-data  { file: <image> }
```

```json
{
  "predictions": [
    { "condition": "Melanoma",              "confidence": 85.3 },
    { "condition": "Basal Cell Carcinoma",  "confidence":  8.1 },
    { "condition": "Eczema",               "confidence":  3.2 },
    { "condition": "...",                  "confidence":  "..." }
  ]
}
```

Results sorted by confidence descending. Frontend renders the top-N as the differential diagnosis.

<br/>

---

<div align="center">

## `⬡` Tech Stack

</div>

<table>
<tr>
<td width="50%" valign="top">

### 🌐 Web Platform

| Layer | Tech | Version |
|-------|------|---------|
| Framework | Next.js App Router | `16.1.6` |
| Language | TypeScript (strict) | `5.x` |
| Auth + DB | Firebase | `12.x` |
| Email | Resend + React Email | `6.x` |
| Analytics | GA4 + MS Clarity | `—` |
| Feedback | Google Sheets API | `v4` |
| PDFs | pdf-lib | `1.17.x` |
| Deploy | Vercel | `—` |
| CI/CD | GitHub Actions | `—` |
| Node | `.nvmrc` pinned | `20` |

</td>
<td width="50%" valign="top">

### 🧠 ML Inference API

| Layer | Tech | Version |
|-------|------|---------|
| Framework | FastAPI | `0.111.0` |
| Runtime | Python | `3.11.0` |
| ML | TensorFlow CPU | `2.16.1` |
| Keras | tf-keras | `2.16.0` |
| Imaging | Pillow | `10.3.0` |
| Server | Uvicorn (ASGI) | `0.29.0` |
| Deploy | Render.com | `—` |

</td>
</tr>
</table>

<br/>

---

<div align="center">

## `⟳` CI/CD Pipeline

</div>

Every change goes through a **Quality Gate** before it can touch production. Direct pushes to `master` are blocked at the repository level.

```
  ┌──────────┐     git push      ┌─────────────────────────────────────┐
  │ dev      │ ────────────────► │         GitHub Actions               │
  │ branch   │                   │                                     │
  └──────────┘                   │  ① npm ci          install clean    │
        ▲                        │  ② tsc --noEmit    type safety      │
        │                        │  ③ eslint          code quality     │
   PR required                   │  ④ next build      build integrity  │
        │                        │                                     │
  ┌─────┴────┐                   │  ALL pass  →  merge unlocked  ✅    │
  │ master   │ ◄── merge ──────  │  ANY fail  →  merge blocked   🔴    │
  └──────────┘                   └─────────────────────────────────────┘
        │                                         │
        │  on merge                               │  auto-cancelled on
        ▼                                         │  new push (concurrency)
  ┌──────────┐
  │  Vercel  │ ──► https://www.nivara.life  🚀
  └──────────┘
```

<details>
<summary><b>📋 What each check does</b></summary>

<br/>

| Step | Command | What It Catches |
|------|---------|-----------------|
| **Install** | `npm ci` | Lockfile drift, missing packages |
| **Type Check** | `tsc --noEmit` | Type errors, missing props, bad imports |
| **Lint** | `eslint` | Code quality, unused vars, hook violations |
| **Build** | `next build` | Runtime errors, broken routes, missing env |
| **Verify** | `test -d .next` | Build output existence confirmed |

</details>

<details>
<summary><b>🔐 Secrets managed in pipeline</b></summary>

<br/>

```
NEXT_PUBLIC_FIREBASE_API_KEY          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID       NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_ID     NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID   RESEND_API_KEY
RESEND_FROM                           NEXT_PUBLIC_APP_URL
CRON_SECRET                           GOOGLE_SHEETS_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL          GOOGLE_PRIVATE_KEY
```

All 14 secrets stored as GitHub Actions repository secrets. Never committed.

</details>

<br/>

---

<div align="center">

## `◱` Project Structure

</div>

```
NIVARA_PROD/                            ← Web Platform (this repo)
│
├── app/                                # Next.js App Router
│   ├── page.tsx                        # ↳ Homepage
│   ├── demo/                           # ↳ Scan demo  (calls ML API)
│   ├── features/                       # ↳ Technology page
│   ├── doctors/                        # ↳ Doctor directory
│   │   └── [id]/                       # ↳ Individual doctor profiles
│   ├── results/                        # ↳ Scan results display
│   ├── profile/                        # ↳ User profile
│   ├── onboarding/                     # ↳ New user onboarding
│   ├── feedback/                       # ↳ Feedback form
│   ├── kiosks/                         # ↳ Kiosk information
│   ├── buy/                            # ↳ Early access signup
│   ├── api/                            # ↳ Server-side API routes
│   │   ├── email/                      #   ↳ Transactional emails (Resend)
│   │   └── cron/                       #   ↳ Scheduled jobs
│   ├── admin/                          # ↳ Internal admin dashboard
│   └── doctor/                         # ↳ Doctor portal
│
├── components/                         # Shared React components
├── lib/                                # Utilities & config
│   ├── firebase.ts                     # ↳ Client-side Firebase
│   ├── firebaseAdmin.ts                # ↳ Server-side Admin SDK
│   ├── email.ts                        # ↳ Resend sender wrapper
│   └── googleSheets.ts                 # ↳ Sheets API client
├── emails/                             # React Email templates
├── public/images/                      # Static assets
├── scripts/                            # Seed & utility scripts
├── .github/workflows/                  # CI/CD definitions
├── .nvmrc                              # Node 20 pinned
└── eslint.config.mjs                   # ESLint flat config

nivara-api/                             ← ML Inference API (separate repo)
├── main.py                             # FastAPI app + inference logic
├── skin_disease_model22.h5             # Trained CNN-GRU weights
├── requirements.txt                    # Python dependencies
├── runtime.txt                         # python-3.11.0
└── Render.yaml                         # Render.com deploy config
```

<br/>

---

<div align="center">

## `▷` Getting Started

</div>

### Prerequisites

```
Node.js 20+   (nvm use — reads .nvmrc automatically)
npm
Firebase project with Auth + Firestore enabled
Resend account (for transactional email)
Google Cloud service account with Sheets API access
```

### Installation

```bash
# Clone
git clone https://github.com/Dixith-ai/NIVARA_PROD.git
cd NIVARA_PROD

# Install (respects lockfile)
npm ci

# Environment
cp .env.local.example .env.local
# fill in all 14 values

# Run
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

### Scripts

```bash
npm run dev           # Development server  (hot reload)
npm run build         # Production build
npm run start         # Production server
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
```

### Environment Variables

```bash
# ─── Firebase Client ────────────────────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# ─── Email ──────────────────────────────────────────────────────────────────
RESEND_API_KEY=
RESEND_FROM=

# ─── App ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=

# ─── Security ───────────────────────────────────────────────────────────────
CRON_SECRET=

# ─── Google Sheets ──────────────────────────────────────────────────────────
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

<br/>

---

<div align="center">

## `⟡` Contributing

</div>

This is a private repository. All changes to `master` require a PR. The Quality Gate must pass.

```bash
# 1. Branch
git checkout -b feature/your-feature

# 2. Build confidence locally before pushing
npm run typecheck && npm run lint && npm run build

# 3. Push
git push origin feature/your-feature

# 4. Open PR on GitHub → wait for ✅ Quality Gate
# 5. Merge → Vercel deploys automatically
```

**Branch naming convention**

```
feature/   →  new functionality
fix/       →  bug fixes
chore/     →  maintenance, deps
ci/        →  pipeline changes
ml/        →  model or API changes
docs/      →  documentation only
```

<br/>

---

<div align="center">

## `◉` Team

</div>

<table>
<tr>
<td align="center" width="20%">
<br/>
<b>Karthik H S</b><br/>
<sub>ML Engineer &<br/>Frontend Engineer</sub>
</td>
<td align="center" width="20%">
<br/>
<b>Dixith Adithya</b><br/>
<sub>Full Stack Engineer &<br/>IoT Architect</sub>
</td>
<td align="center" width="20%">
<br/>
<b>Mufeez</b><br/>
<sub>Research &<br/>Clinical Validation</sub>
</td>
<td align="center" width="20%">
<br/>
<b>Pratham Limbani</b><br/>
<sub>ML Engineer &<br/>Product</sub>
</td>
<td align="center" width="20%">
<br/>
<b>Chethan</b><br/>
<sub>Operations,<br/>Deployment & IoT</sub>
</td>
</tr>
</table>

<br/>

---

<div align="center">

## `⬡` Deployment

</div>

| Service | Platform | Repo | Environment | URL |
|---------|----------|------|-------------|-----|
| Web Platform | Vercel | `NIVARA_PROD` | Production | [nivara.life](https://www.nivara.life) |
| Web Platform | Vercel | `NIVARA_PROD` | Preview | auto per PR |
| ML Inference API | Render.com | `nivara-api` | Production | `nivara-skin-api` |

Every merge to `master` → automatic Vercel production deploy.
Every PR → automatic Vercel preview deploy.
ML API is deployed independently from `nivara-api`.

<br/>

---

<div align="center">

## `§` License

</div>

Copyright © 2026 NIVARA Health Technology. All rights reserved.

This repository contains proprietary and confidential source code. Unauthorised copying, distribution, or use of any part of this codebase — in whole or in part — is strictly prohibited without explicit written permission from NIVARA Health Technology.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer&text=nivara.life&fontSize=24&fontColor=C4973A&fontAlignY=65&animation=fadeIn">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer&text=nivara.life&fontSize=24&fontColor=C4973A&fontAlignY=65&animation=fadeIn" width="100%" alt="footer">
</picture>

<div align="center">

```
निवार  ·  NIVARA  ·  नि + वार  ·  Prevention + Strike
```

*Precision skin health technology. Indigenously crafted in India.*

</div>
