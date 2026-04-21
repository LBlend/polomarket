# Polomarket — Mongol Rally 2025

## Kom i gang

### 1. Installer avhengigheter
```bash
npm install
```

### 2. Sett opp miljøvariabler
```bash
cp .env.example .env
```
Fyll ut `.env` med dine nøkler (se under).

### 3. Sett opp databasen
```bash
npm run db:push    # Oppretter SQLite-databasen
npm run db:seed    # Fyller inn veddmål, veldedigheter og rutesteder
```

### 4. Start utviklingsserveren
```bash
npm run dev
```

---

## Miljøvariabler

| Variabel | Beskrivelse |
|---|---|
| `DATABASE_URL` | SQLite-filsti, f.eks. `file:./dev.db` |
| `NEXTAUTH_SECRET` | Tilfeldig string, generer med `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Din URL, f.eks. `https://polomarket.no` |
| `GOOGLE_CLIENT_ID` | Fra Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Fra Google Cloud Console |
| `OWNTRACKS_PASSWORD` | Passord du setter i OwnTracks-appen |
| `INSTAGRAM_ACCESS_TOKEN` | Valgfritt — viser placeholder-poster uten denne |

### Google OAuth oppsett
1. Gå til [Google Cloud Console](https://console.cloud.google.com/)
2. Lag et nytt prosjekt
3. Aktiver **Google+ API** og **Google Identity**
4. Opprett OAuth 2.0-legitimasjon
5. Legg til `http://localhost:3000/api/auth/callback/google` som tillatt redirect-URI

---

## OwnTracks-oppsett

I OwnTracks-appen (iOS/Android):
- **Modus:** HTTP
- **URL:** `https://polomarket.no/api/owntracks`
- **Passord:** Det du satte i `OWNTRACKS_PASSWORD`
- **Bruker:** hva som helst (ignoreres)

Appen sender automatisk posisjonsoppdateringer til endepunktet.

---

## Instagram-feed

Uten `INSTAGRAM_ACCESS_TOKEN` vises placeholder-poster automatisk.

For å koble til ekte Instagram:
1. Opprett en [Meta Developer App](https://developers.facebook.com/)
2. Aktiver **Instagram Basic Display API**
3. Generer et access token
4. Sett `INSTAGRAM_ACCESS_TOKEN=...` i `.env`

---

## Sideoversikt

| Side | Rute | Beskrivelse |
|---|---|---|
| Forsiden | `/` | Lag, kart, Instagram, markedsteaser |
| Markedet | `/market` | Veddemål med rimcoins + veldedighetsvalg |

---

## Admin-funksjonalitet

Merk en bruker som admin i databasen:
```bash
npm run db:studio
# Finn brukeren → sett isAdmin = true
```

Som admin kan du:
- Legge til/endre/slette rutesteder på kartet
- Opprette og løse veddemålshendelser via API

---

## Teknisk stack

- **Next.js 15** App Router
- **Prisma** + SQLite (produksjon: bytt til PostgreSQL)
- **NextAuth v4** med Google OAuth
- **React Leaflet** for live kart
- **Framer Motion** for animasjoner
- **Tailwind CSS**
