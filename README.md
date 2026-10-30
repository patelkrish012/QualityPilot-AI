# QualityPilot AI 🛡️

**Autonomous Quality Engineering & Release Assurance Platform**

> *From Requirement to Release — AI-Powered Software Quality Engineering*

---

## 🚀 Overview

QualityPilot AI is a full-stack autonomous testing platform that uses AI to scan, test, and audit web applications — giving you a complete **Release Assurance Report** with actionable insights.

### Key Features

- **Mode A — URL Black-Box Testing**: Paste any URL → AI crawls, tests, and audits automatically
- **Mode B — AI Assistant Chat**: Interactive QA assistant for manual testing guidance
- **Autonomous Report Generation**: Professional PDF reports with quality scores, defect analysis, and release recommendations
- **Email Dispatch**: Send branded PDF reports directly to stakeholders via Gmail SMTP
- **GitHub OAuth Integration**: Seamless authentication via GitHub
- **Dark Obsidian Theme**: Premium UI with `#06110C` + `#171717` + `#A31C18` brand palette

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeScript |
| **Auth** | JWT + GitHub OAuth |
| **PDF Generation** | Playwright Chromium (headless) |
| **Email** | Nodemailer + Gmail SMTP |
| **AI Engine** | Google Gemini API |
| **Testing** | Playwright E2E |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/patelkrish012/qualitypilot-ai.git
cd qualitypilot-ai
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Fill in your `.env` file with:
```env
# JWT Secret (generate: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here

# Gmail SMTP (use App Password from Google Account)
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# GitHub OAuth (from github.com/settings/apps)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# Google Gemini API Key (from aistudio.google.com)
GEMINI_API_KEY=your_gemini_key
```

### 3. Run Development Servers

```bash
# Terminal 1 — API (port 4000)
npm run start --workspace=@qualitypilot/api

# Terminal 2 — Web (port 3000)
npm run dev --workspace=@qualitypilot/web
```

Visit: **http://localhost:3000**

---

## 📁 Project Structure

```
qualitypilot-ai/
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/         # Authentication (JWT + GitHub OAuth)
│   │   │   ├── testing/      # Testing engines, PDF/email reports
│   │   │   └── assets/       # Brand assets
│   └── web/              # Next.js frontend
│       ├── src/app/
│       │   ├── page.tsx      # Main dashboard
│       │   ├── login/        # Login page
│       │   └── register/     # Register page
│       └── public/brand/     # Logo & brand assets
├── packages/             # Shared TypeScript types
└── .env.example          # Environment template
```

---

## 🔐 Security

- `.env` files are **gitignored** — never committed
- All credentials must be set via environment variables
- JWT tokens expire in 7 days
- Passwords hashed with bcrypt

---

## 📄 License

UNLICENSED — Private project by QualityPilot AI Team.

---

<div align="center">
  <strong>Built with ❤️ by the QualityPilot AI Team</strong><br/>
  <em>Autonomous Quality Engineering · From Requirement to Release</em>
</div>
