# Design Document — PodDashboard

## Knowledge Domain

PodDashboard is a podcast aggregation service. The core idea is that podcasts are distributed via RSS feeds — standardized XML files that list episodes with metadata (title, description, audio URL, publish date). This application acts as a personal feed reader: users subscribe to podcasts by providing RSS URLs, and the backend automatically fetches and stores new episodes on a schedule.

---

## Database Design

### Entities

**Podcast**
Represents a subscribed podcast show.

| Field        | Type           | Notes            |
| ------------ | -------------- | ---------------- |
| `_id`        | ObjectId       | Auto-generated   |
| `title`      | String         | Required         |
| `rss_url`    | String         | Required, unique |
| `image_url`  | String \| null | Cover art URL    |
| `created_at` | Date           | Default: now     |

**Episode**
Represents a single episode from a podcast feed.

| Field          | Type                    | Notes                                     |
| -------------- | ----------------------- | ----------------------------------------- |
| `_id`          | ObjectId                | Auto-generated                            |
| `podcast`      | ObjectId (ref: Podcast) | Foreign key                               |
| `title`        | String                  | Required                                  |
| `description`  | String \| null          | Optional                                  |
| `audio_url`    | String                  | Required, unique — used for deduplication |
| `published_at` | Date                    | Required                                  |

### Relationships

A Podcast has many Episodes (one-to-many). The `podcast` field on Episode is a MongoDB reference (`ref: "Podcast"`) and is populated when querying episodes, so callers receive the podcast's `title` and `image_url` inline.

`audio_url` is used as the natural unique key for deduplication — RSS feeds are fetched repeatedly, and this prevents the same episode from being stored twice.

---

## Architecture Reasoning

The project uses a lightweight, flat structure suited to its scale:

- **Routes** handle HTTP concerns (parsing request, sending response, error delegation).
- **Models** (Mongoose schemas) handle data shape and database access.
- **rssService** is kept as a separate service because it handles external I/O (HTTP requests to third-party RSS feeds) and parsing logic — a distinct concern from the REST API layer.
- **rssFetchJob** encapsulates the scheduling concern (node-cron) and is separated to keep `server.ts` clean.

This avoids over-engineering (no separate controller/service/repository layers for simple CRUD) while still maintaining clear separation of concerns for the parts that warrant it.

### Graceful Shutdown

The server listens for `SIGTERM` and `SIGINT` signals. On shutdown:

1. The cron job is stopped.
2. The HTTP server stops accepting new connections and waits for in-flight requests to finish.
3. The MongoDB connection is closed cleanly.

This prevents data loss and ensures the process exits in a known state.

### Error Handling

The global error handler in `app.ts` distinguishes between:

- **409 Conflict** — MongoDB duplicate key errors (e.g. adding a podcast with an existing RSS URL)
- **400 Bad Request** — Mongoose CastError (e.g. invalid ObjectId in a route parameter)
- **500 Internal Server Error** — all other unexpected errors

Route-level validation returns **400** before hitting the database when required fields are missing.
