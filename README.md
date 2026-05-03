# Team Polomarket — Mongol Rally 2026

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in `.env` with your values (see below).

### 3. Set up the database
```bash
npm run db:push    # Creates the SQLite database
npm run db:seed    # Seeds route waypoints
```

### 4. Start the development server
```bash
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path, e.g. `file:./dev.db` |
| `OWNTRACKS_PASSWORD` | Password you set in the OwnTracks app |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics site ID |
| `NEXT_PUBLIC_UMAMI_SRC` | Umami script URL |

---

## OwnTracks Setup

In the OwnTracks app (iOS/Android):
- **Mode:** HTTP
- **URL:** `https://teampolomarket.com/api/owntracks`
- **Password:** The value you set in `OWNTRACKS_PASSWORD`
- **Username:** anything (ignored)

The app will automatically send location updates to the endpoint.

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Team intro, live GPS map, Twitch stream, social links, market teaser |
| Market | `/market` | Live fundraising progress, prediction poll results, and donor leaderboard (data from Spleis) |

Betting and voting happen on [Spleis](https://www.spleis.no/project/494404). The `/market` page displays live stats fetched from the public Spleis API (revalidated every 60 seconds).

---

## Docker

A Docker Compose setup is included for self-hosting. The database is persisted on a named volume (`db_data`) at `/data/prod.db` inside the container.

```bash
docker compose up -d
```

The app is exposed on port `1945`.

---

## Tech Stack

- **Next.js 15** App Router
- **Prisma** + SQLite
- **React Leaflet** for the live map
- **Framer Motion** for animations
- **Tailwind CSS**
- **Umami** for privacy-friendly analytics
