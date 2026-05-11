# PodDashboard

En poddcast-dashboard där du söker efter och lägger till podcasts via Spotify. Episoder hämtas automatiskt och uppdateras varje timme.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Express + TypeScript + Node.js
- **Databas:** MongoDB + Mongoose
- **API:** Spotify Web API (Client Credentials)
- **Schemaläggning:** node-cron (uppdaterar episoder varje timme)

---

## Förutsättningar

- [Node.js](https://nodejs.org/) v20+
- [MongoDB](https://www.mongodb.com/) igång lokalt
- Ett [Spotify Developer](https://developer.spotify.com/dashboard)-konto med en app skapad (för `Client ID` och `Client Secret`)

---

## Installation

### 1. Klona repot

```bash
git clone <repo-url>
cd PodDashboard
```

### 2. Installera beroenden

Kör detta i **rotkatalogen** (frontend) och i **backend/**:

```bash
npm install
cd backend
npm install
```

### 3. Konfigurera miljövariabler

Skapa filen `backend/.env` (kopiera från `backend/.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/poddashboard
PORT=3000
SPOTIFY_CLIENT_ID=din_spotify_client_id
SPOTIFY_CLIENT_SECRET=din_spotify_client_secret
```

---

## Starta projektet

Du behöver två terminaler:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

Servern startar på `http://localhost:3000`

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Frontend startar på `http://localhost:5173`

---

## API-endpoints

| Metod  | Endpoint                        | Beskrivning                               |
| ------ | ------------------------------- | ----------------------------------------- |
| GET    | `/api/podcasts`                 | Hämta alla podcasts                       |
| GET    | `/api/podcasts/:id`             | Hämta en specifik podcast                 |
| POST   | `/api/podcasts`                 | Lägg till podcast (hämtar avsnitt direkt) |
| DELETE | `/api/podcasts/:id`             | Ta bort podcast                           |
| GET    | `/api/episodes`                 | Alla avsnitt, sorterade nyast→äldst       |
| GET    | `/api/episodes?podcast_id=<id>` | Avsnitt filtrerade på podcast             |
| GET    | `/api/episodes/:id`             | Hämta ett specifikt avsnitt               |
| GET    | `/api/search?q=<sökterm>`       | Sök podcasts via Spotify                  |
| GET    | `/health`                       | Hälsokontroll                             |

### POST /api/podcasts — Request body

```json
{
  "title": "Podcast-titel",
  "spotify_id": "spotify_show_id",
  "image_url": "https://example.com/cover.jpg"
}
```

`title` och `spotify_id` är obligatoriska. `image_url` är valfritt.

---

## Projektstruktur

```
PodDashboard/
├── src/                  # React-frontend
│   ├── App.tsx
│   ├── App.css
│   └── api.ts
└── backend/
    └── src/
        ├── server.ts     # Startpunkt — DB-uppkoppling, HTTP-server, graceful shutdown
        ├── app.ts        # Express-app, routes, felhantering
        ├── db.ts         # MongoDB-anslutning
        ├── models/       # Mongoose-modeller (Podcast, Episode)
        ├── routes/       # HTTP-routes (podcasts, episodes, search)
        ├── services/     # Spotify API-logik
        └── jobs/         # Cronjobb (timvis uppdatering)
```
