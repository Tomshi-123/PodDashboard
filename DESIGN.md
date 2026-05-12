# Designdokument — PodDashboard

## Kunskapsdomän

PodDashboard är en personlig podcast-dashboard. Användaren söker efter podcasts via Spotify, lägger till dem i sitt bibliotek och kan bläddra bland de senaste avsnitten. Applikationen hämtar automatiskt avsnitt från Spotify API och uppdaterar databasen varje timme via ett schemalagt jobb.



---

## Databasdesign

Databasen har två collections med en en-till-många-relation: en podcast har många avsnitt.

### Podcast

| Fält         | Typ            | Notering                                    |
| ------------ | -------------- | ------------------------------------------- |
| `_id`        | ObjectId       | Auto-genererat av MongoDB                   |
| `title`      | String         | Obligatoriskt                               |
| `spotify_id` | String         | Obligatoriskt, unikt — förhindrar dubletter |
| `image_url`  | String \| null | Omslagsbild från Spotify                    |
| `created_at` | Date           | Sätts automatiskt vid skapande              |

### Episode

| Fält           | Typ                     | Notering                                         |
| -------------- | ----------------------- | ------------------------------------------------ |
| `_id`          | ObjectId                | Auto-genererat av MongoDB                        |
| `podcast`      | ObjectId (ref: Podcast) | Referens till podcasen — som en foreign key      |
| `title`        | String                  | Obligatoriskt                                    |
| `description`  | String \| null          | Valfritt                                         |
| `spotify_url`  | String                  | Obligatoriskt, unikt — används för deduplicering |
| `published_at` | Date                    | Publiceringsdatum från Spotify                   |

### Relation

En Podcast har många Episodes (en-till-många). Fältet `podcast` på Episode är en MongoDB-referens (`ref: "Podcast"`). När avsnitt hämtas via API:et används Mongoose's `populate()` för att hämta in podcastens `title` och `image_url` — vilket gör att klienten får all relevant data i ett anrop.

`spotify_url` används som naturlig unik nyckel för deduplicering. Eftersom avsnitt hämtas om varje timme förhindrar detta att samma avsnitt sparas flera gånger.

---

## Arkitekturresonemang

Projektet är uppdelat i tydliga lager med separation of concerns:

- **Routes** — definierar enbart HTTP-metod och URL, pekar vidare till controllers. Ingen logik.
- **Controllers** — all affärslogik. Läser request, pratar med databasen, skickar svar. Delegerar fel med `next(err)`.
- **Services** — hanterar extern kommunikation med Spotify API. Separerat eftersom det är ett eget ansvarsområde skilt från REST-lagret.
- **Models** — Mongoose-scheman som definierar datastruktur och validering.
- **Middleware** — centraliserad felhantering och request-loggning. Registreras i `app.ts` och gäller för hela applikationen.
- **Jobs** — cronjobbet som schemalägger timvis uppdatering. Separerat för att hålla `server.ts` rent.

Denna uppdelning följer DRY-principen — felhantering, loggning och Spotify-kommunikation är skrivna på ett ställe och återanvänds överallt.

---

## Felhantering

Felhanteringen är centraliserad i `middleware/errorHandler.ts`. Controllers behöver inte hantera fel själva — de skickar vidare med `next(err)` och Express dirigerar till felhanteraren automatiskt.

Följande fel hanteras:

- **409 Conflict** — Mongoose duplicate key (t.ex. lägga till samma podcast igen)
- **400 Bad Request** — Mongoose CastError (ogiltigt MongoDB-ID i URL)
- **500 Internal Server Error** — övriga oväntade fel

---

## Graceful Shutdown

Servern lyssnar på `SIGINT` (Ctrl+C) och `SIGTERM`. Vid shutdown sker följande i ordning:

1. Cronjobbet stoppas
2. HTTP-servern slutar ta emot nya requests och väntar på att pågående ska avslutas
3. MongoDB-anslutningen stängs
4. Processen avslutas med `process.exit(0)`

Detta förhindrar att pågående databasoperationer avbryts mitt i och säkerställer ett rent avslut.
