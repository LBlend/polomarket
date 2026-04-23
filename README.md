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
npm run db:seed    # Seeds bets, charities, and route locations
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
| `NEXTAUTH_SECRET` | Random string — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your URL, e.g. `https://teampolomarket.com` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `OWNTRACKS_PASSWORD` | Password you set in the OwnTracks app |
| `RIMCOIN_RATE` | Exchange rate: 1 EUR = X rimcoins (default: `100`) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics site ID |
| `NEXT_PUBLIC_UMAMI_SRC` | Umami script URL |

### Google OAuth setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google+ API** and **Google Identity**
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` as an allowed redirect URI

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
| Market | `/market` | Parimutuel betting with rimcoins + charity selection |

---

## Admin

Mark a user as admin in the database:
```bash
npm run db:studio
# Find the user → set isAdmin = true
```

As admin you can:
- Add / edit / delete route waypoints on the map
- Create and resolve betting events via the API

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
- **Prisma** + SQLite (switch to PostgreSQL for production scale)
- **NextAuth v4** with Google OAuth
- **React Leaflet** for the live map
- **Framer Motion** for animations
- **Tailwind CSS**
- **Umami** for privacy-friendly analytics
