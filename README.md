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
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://www.nivara.life)
[![ML on Render](https://img.shields.io/badge/ML%20API-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)
[![License](https://img.shields.io/badge/License-Proprietary-C4973A?style=flat)](#license)

<br/>

[**→ Live Demo**](https://www.nivara.life/demo) · [**→ Website**](https://www.nivara.life) · [**→ ML API**](https://github.com/Dixith-ai/nivara-api) · [**→ CI/CD Status**](https://github.com/Dixith-ai/NIVARA_PROD/actions)

<br/>

---

</div>

## What Is NIVARA?

NIVARA is a precision skin health platform built indigenously in India. Upload a photo of a skin concern and receive a **structured differential diagnosis** — not one guess, but a ranked analysis of the most likely conditions with confidence scores, the way a clinician actually thinks.

No device required for the demo. No appointment. No waiting room. A custom-trained deep learning model classifies 10 dermatological conditions and returns confidence-scored predictions in under a minute.

> *"The breakdown was more detailed than I expected. The confidence scores made it feel credible."*
> — Early User, Bengaluru

---

## The Problem We're Solving

India has **1 dermatologist per 100,000 people**. Most people with skin concerns either ignore them, self-diagnose incorrectly, or wait months for a specialist. Early-stage conditions that are trivially treatable become serious because nobody caught them.

NIVARA bridges this gap with:

- **Differential diagnosis** — not a single prediction, a ranked clinical framework
- **Confidence scoring** — so users understand the certainty behind each result
- **Dermatologist access** — verified specialists bookable directly from the result
- **Kiosk deployment** — bringing screening to clinics, hospitals, and pharmacies
- **IoT device** — a purpose-built handheld skin imaging device *(in development)*

---

## System Architecture

NIVARA is a two-service system. The frontend web platform and the ML inference API are independent services, deployed separately, communicating over HTTP.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           NIVARA PLATFORM                               │
├───────────────────────────────┬─────────────────────────────────────────┤
│      WEB PLATFORM             │         ML INFERENCE API                │
│      (This Repo)              │         (nivara-api)                    │
│                               │                                         │
│  Next.js 16 (App Router)      │  FastAPI (Python 3.11)                  │
│  TypeScript (strict)          │  TensorFlow 2.16 (CPU)                  │
│  Firebase Auth + Firestore    │  Custom CNN-GRU Model                   │
│  Resend (Email)               │  10-class skin classification           │
│  Google Sheets (Feedback)     │                                         │
│  GA4 + Microsoft Clarity      │  POST /predict → confidence scores      │
│                               │                                         │
│  Deployed: Vercel             │  Deployed: Render.com                   │
└───────────────────────────────┴─────────────────────────────────────────┘
                │                              │
                │    HTTP (image upload)        │
                └──────────────────────────────┘
                         Frontend calls
                     POST /predict with image
                   ← Returns ranked predictions
```

---

## The ML Model

The inference engine is a **custom CNN-GRU hybrid** — a convolutional network for spatial feature extraction feeding into a gated recurrent unit for sequential pattern recognition. Trained to classify 10 dermatological conditions from a single skin image.

### Architecture

```
Input Image (128×128 RGB)
        │
        ▼
Conv2D(32) → ReLU → MaxPool        # Low-level feature extraction
        │
        ▼
Conv2D(64) → ReLU → MaxPool        # Mid-level pattern detection
        │
        ▼
Conv2D(128) → ReLU → MaxPool       # High-level feature maps
        │
        ▼
Reshape (spatial → sequential)     # Bridge CNN → RNN
        │
        ▼
GRU(64)                            # Sequential pattern analysis
        │
        ▼
Dropout(0.5)                       # Regularisation
        │
        ▼
Dense(10, softmax)                 # 10-class probability output
```

### Classified Conditions

| # | Condition | Category |
|---|-----------|----------|
| 1 | Eczema | Inflammatory |
| 2 | Melanoma | Malignant |
| 3 | Atopic Dermatitis | Inflammatory |
| 4 | Basal Cell Carcinoma | Malignant |
| 5 | Melanocytic Nevi | Benign |
| 6 | Benign Keratosis-like Lesions | Benign |
| 7 | Psoriasis / Lichen Planus | Inflammatory |
| 8 | Seborrheic Keratoses | Benign |
| 9 | Tinea / Ringworm / Candidiasis | Infectious |
| 10 | Warts / Molluscum / Viral Infections | Infectious |

### API Endpoints

```
GET  /           → Health check, model status
POST /predict    → Accepts image upload, returns ranked predictions
```

**Prediction response:**
```json
{
  "predictions": [
    { "condition": "Melanoma", "confidence": 85.3 },
    { "condition": "Basal Cell Carcinoma", "confidence": 8.1 },
    { "condition": "Eczema", "confidence": 3.2 },
    ...
  ]
}
```

Results are sorted by confidence (descending). The frontend displays the top results as the differential diagnosis with ranked confidence scores.

---

## Tech Stack

### Web Platform

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript (strict) | 5.x |
| Auth & Database | Firebase | 12.x |
| Email | Resend + React Email | 6.x |
| Analytics | Google Analytics 4 + Microsoft Clarity | — |
| Feedback Logging | Google Sheets API | v4 |
| PDF Generation | pdf-lib | 1.17.x |
| Deployment | Vercel | — |
| CI/CD | GitHub Actions | — |
| Node | 20 (pinned via .nvmrc) | 20.x |

### ML Inference API

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | FastAPI | 0.111.0 |
| Runtime | Python | 3.11.0 |
| ML Framework | TensorFlow (CPU) | 2.16.1 |
| Keras | tf-keras | 2.16.0 |
| Image Processing | Pillow | 10.3.0 |
| Server | Uvicorn (ASGI) | 0.29.0 |
| Deployment | Render.com | — |

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
│  ANY failure   → merge blocked      │
└─────────────────────────────────────┘
      │
      ▼ (on merge to master)
┌─────────────────┐
│  Vercel Deploy  │  → https://www.nivara.life
└─────────────────┘
```

**Branch protection** is enforced on `master`. Direct pushes are blocked. All changes require a Pull Request with a passing Quality Gate.

---

## Project Structure

```
nivara/                             ← This repository (Web Platform)
├── app/                            # Next.js App Router
│   ├── page.tsx                    # Homepage
│   ├── demo/                       # Scan demo (calls ML API)
│   ├── features/                   # Technology page
│   ├── doctors/                    # Doctor directory
│   ├── results/                    # Scan results display
│   ├── profile/                    # User profile
│   ├── onboarding/                 # User onboarding
│   ├── feedback/                   # Feedback form
│   ├── kiosks/                     # Kiosk info
│   ├── buy/                        # Early access
│   ├── api/                        # API route handlers
│   │   ├── email/                  # Transactional emails
│   │   └── cron/                   # Scheduled jobs
│   ├── admin/                      # Admin dashboard
│   └── doctor/                     # Doctor portal
├── components/                     # Shared React components
├── lib/                            # Utilities & config
│   ├── firebase.ts                 # Client Firebase
│   ├── firebaseAdmin.ts            # Server Firebase Admin
│   ├── email.ts                    # Resend email sender
│   └── googleSheets.ts             # Sheets API
├── emails/                         # React Email templates
├── public/images/                  # Static assets
├── scripts/                        # Seed & utility scripts
├── .github/workflows/              # CI/CD pipeline
├── .nvmrc                          # Node 20 pinned
└── eslint.config.mjs               # ESLint flat config

nivara-api/                         ← Separate repository (ML API)
├── main.py                         # FastAPI app + model inference
├── skin_disease_model22.h5         # Trained CNN-GRU weights
├── requirements.txt                # Python dependencies
├── runtime.txt                     # Python 3.11.0
└── Render.yaml                     # Render.com deployment config
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

Branch naming: `feature/` · `fix/` · `chore/` · `ci/` · `ml/`

---

## Team

| Name | Title |
|------|-------|
| **Mufeez** | Research & Clinical Validation |
| **Dixith Adithya** | Full Stack Engineer & IoT Architect |
| **Chethan** | Operations, Deployment & IoT |
| **Karthik H S** | ML Engineer & Frontend Engineer |
| **Pratham Limbani** | ML Engineer & Product |

---

## Deployment

| Service | Platform | Repository | URL |
|---------|----------|-----------|-----|
| Web Platform | Vercel | `NIVARA_PROD` | [nivara.life](https://www.nivara.life) |
| ML Inference API | Render.com | `nivara-api` | `nivara-skin-api` on Render |

Every merge to `master` in this repo triggers an automatic Vercel production deployment.
The ML API is deployed independently on Render.com from the `nivara-api` repository.

---

## License

Copyright © 2026 NIVARA Health Technology. All rights reserved.

This repository contains proprietary and confidential source code. Unauthorised copying, distribution, or use of any part of this codebase — in whole or in part — is strictly prohibited without explicit written permission from NIVARA Health Technology.

---

<div align="center">

<br/>

```
निवार  ·  NIVARA  ·  नि + वार  ·  Prevention + Strike
```

*Precision skin health technology. Indigenously crafted in India.*

<br/>

**[nivara.life](https://www.nivara.life)**

<br/>

</div>
