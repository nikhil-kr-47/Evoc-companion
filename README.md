# Evoc Companion — Meta Ads Launchpad

High-converting client intake and campaign onboarding engine powered by **Evoc Labs**. Built with Next.js 16 (App Router), Tailwind CSS v4, and dual-layer AI Website Intelligence (Google Gemini & Semantic DOM analysis).

## Features
- **8-Step Guided Intake Flow**: Business identity, objective, industry/niches, website AI scan, audience targeting, tax invoicing/payment, Meta Business Manager access, and creative uploads.
- **AI Website Intelligence Engine**: Automatically scans live domains, catalog schema (JSON-LD), headings, and trust factors to generate tailored Meta ad copy hooks (Problem-Solution, Social Proof, Urgency).
- **Light & Dark Mode**: Majority white theme with royal blue accents, matching Orbit-360 design tokens.
- **Mobile Responsive**: Custom zero-scroll mobile layout for objectives and adaptive compact cards.
- **Zero Dummy Data**: Clean initial state requiring intentional user choices.
- **Orbit CRM Sync**: Automatically pushes campaign intakes directly into Orbit's CRM backend.

## Environment Variables
Create `.env.local` or configure in Vercel:
```bash
# 1. Orbit CRM Sync Endpoint
ORBIT_API_URL=https://api.evoclabs.com/api/leads

# 2. Official WhatsApp Support Number
NEXT_PUBLIC_WHATSAPP_NUMBER=919548833953

# 3. Official UPI VPA
NEXT_PUBLIC_UPI_VPA=evoclabs@icici

# 4. Google Gemini API Key (Optional)
GEMINI_API_KEY=your_gemini_key

# 5. Production URL (Optional)
NEXT_PUBLIC_APP_URL=https://evoc-companion.vercel.app
```

## Getting Started
```bash
npm install
npm run dev -p 3005
```
Open [http://localhost:3005](http://localhost:3005) in your browser.
