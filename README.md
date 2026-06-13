# Shanti

A cross-platform desktop wellness app that monitors computer activity via AI to detect stress, triggers guided breathing exercises, and sends scheduled check-in emails. *Shanti* (शांति) means "peace."

## Features

- **AI Stress Detection** — background monitor tracks window switches, idle time, typing patterns — analyzed by AI (Hack Club AI + OpenRouter free) every 30 seconds
- **Guided Breathing** — full-screen breathing exercise (4s inhale / 2s hold / 6s exhale, 4 cycles) triggered by stress or manually
- **Scheduled Check-ins** — set email frequency (hourly / daily / weekly / monthly / yearly) — Resend sends wellness reminders automatically
- **Desktop App** — runs in system tray, launches at startup, live tray icon changes color with stress level
- **Auto-Update** — checks GitHub Releases for updates, one-click install
- **Dual Theme** — cinematic dark mode + Air light mode

## Download

[⬇ Download for Windows](https://github.com/the-X-alien/mh3-project/releases/latest) | [⬇ Download for Mac](https://github.com/the-X-alien/mh3-project/releases/latest)

## Web Dashboard

The web version is live at **https://shanti.vercel.app** — log in to view your stress history, manage email schedule, and track wellness trends.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Desktop:** Electron with auto-update (electron-updater)
- **Backend:** Convex (real-time DB + serverless functions)
- **Auth:** Better Auth (Convex component)
- **Email:** Resend
- **AI:** Hack Club AI API + OpenRouter free tier

## Dev Commands

```
npm run dev             # Start Vite dev server (web)
npm run dev:electron    # Start Electron app in dev mode
npm run build           # Build web + Electron TypeScript
npm run pack            # Package for current platform (dev)
npm run dist            # Build distributable installers
npm run convex:deploy   # Deploy Convex functions to production
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_CONVEX_URL` | Convex deployment URL |
| `CONVEX_DEPLOYMENT` | Convex deployment slug |
| `BETTER_AUTH_SECRET` | Better Auth secret key |
| `BETTER_AUTH_URL` | Auth callback URL |
| `RESEND_API_KEY` | Resend API key for emails |

## Privacy

Activity monitoring stays entirely on your machine. The only external calls are:
1. **AI analysis** — activity summary sent to Hack Club AI / OpenRouter (no personal data, just window titles and timing)
2. **Email check-ins** — sent via Resend at your configured frequency
3. **Convex sync** — authentication and schedule preferences
