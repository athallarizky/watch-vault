# Watch Vault

A movie and TV catalog built on the TMDB API, with an AI concierge that can actually search the catalog while it talks to you. Ask it for "a dark 90s sci-fi like Blade Runner" and it queries TMDB, picks real titles, and links straight to their pages.

**Live demo:** https://watch-vault.athallarizky.com

## Features

- Browse movies, TV shows, and people across 9 categories (popular, top rated, upcoming, now playing, on the air, airing today, popular people)
- Infinite scroll on Discover, with the next page prefetched before you reach the bottom
- Detail pages for movies, TV shows, and people, all cross-linked: movie → cast → person profile → filmography → another title
- Search driven by the URL, so queries are shareable and the back button behaves
- Watchlist and star ratings, persisted locally
- An AI concierge with streaming answers, conversation memory, and rate limiting

## The AI concierge

This is not a chatbot bolted on top of the app. It is a tool-using agent built on the [Pi agent SDK](https://www.npmjs.com/package/@earendil-works/pi-coding-agent):

1. You ask a question.
2. The model decides which TMDB tool to call: search, discover, similar movies, movie details, or genres.
3. Tool results come back, and the model may call another tool before answering.
4. The answer streams to the browser token by token.

Because every fact comes from a tool result, the agent does not invent titles, years, or ratings.

A few details that make it feel like a product:

- **Page context.** On a movie detail page, the agent knows which movie you are viewing. "Something similar to this one" just works.
- **Conversation memory.** The transcript is replayed on every turn, so follow-ups like "explain the second one" land correctly.
- **Clickable answers.** Recommended titles are rendered as markdown links to internal pages, intercepted for SPA navigation (no full reload).
- **Abuse guards.** The endpoint costs real money per request, so it is rate limited to 10 requests per minute per IP, stays on the topic of movies and TV, and runs with in-memory credentials so no filesystem access is needed on serverless hosts.

## Architecture

### Feature-Sliced Design (FSD)

The `src` folder is organized in layers, and each layer may only import from the layers below it:

```
pages     → one folder per screen (home, discover, search, watchlist, movie, tv, person)
features  → self-contained user actions (watchlist, rating, search, concierge)
entities  → business data: movie, tv, person, genre (types, mappers, queries, cards)
shared    → helpers with no business knowledge (formatting, generic UI)
```

The payoff: everything about "movie" lives in one place, a page never reaches into another page's internals, and dependencies only point downward, so the app stays easy to change as it grows.

### Anti-Corruption Layer (ACL)

TMDB speaks snake_case and returns far more fields than the app uses. Every response passes through a mapper at the server boundary before anything reaches the UI:

```
vote_average   → voteAverage
poster_path    → posterPath
known_for      → knownFor
```

Only the fields the app actually consumes survive the mapping. If TMDB renames or reshapes a field tomorrow, one mapper gets fixed instead of forty components. The UI works with clean domain types and never sees the raw API shape.

### Server functions and SSR

All TMDB traffic runs through TanStack Start server functions, so the API key stays on the server and the browser never talks to TMDB directly. Pages render on the server and stream to the client, and the agent's answer is a streamed `ReadableStream`, which is why recommendations appear word by word.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | TanStack Start (file-based routing, SSR, server functions), React 19, TypeScript |
| Data | TanStack Query for caching and async state, TMDB v3 API |
| Styling | Tailwind CSS v4 with shadcn/ui components |
| AI | Pi agent SDK with a GLM model, TypeBox tool schemas |
| Carousel | Embla, shared by the hero billboard and the content rows |
| Tooling | Bun, Biome |

## Performance notes

- **Query caching.** TanStack Query with a 5 minute stale time. Query keys are mirrored between surfaces: the home row for "popular movies" and the Discover tab read the same cache entry, so navigating between them fires no second request.
- **Smooth search.** `placeholderData: keepPreviousData` keeps the old grid on screen while the next query loads.
- **Image loading.** Posters lazy-load with explicit dimensions to avoid layout shift; the first hero slide is eager with `fetchPriority="high"` for a fast largest contentful paint. Image sizes are picked per surface from TMDB's official size list.
- **Infinite scroll.** A sentinel with a 600px root margin triggers the next page before the user reaches the bottom, guarded against double fetches.
- **Reduced motion.** Autoplay, transitions, and looping animations step aside for users who enable `prefers-reduced-motion`.

## Running locally

```bash
bun install
cp .env.example .env   # then fill in your keys
bun run dev
```

Lint and format with `bun run check` (Biome), typecheck with `bunx tsc --noEmit`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `TMDB_API_KEY` | Required. TMDB v3 API key. |
| `ANTHROPIC_API_KEY` / `ZAI_API_KEY` | LLM key for the concierge agent. |
| `CONCIERGE_PROVIDER` / `CONCIERGE_MODEL` | Agent provider and model (defaults: `zai` / `glm-5-turbo`). |
| `BLOCKED_MOVIE_IDS` / `BLOCKED_PERSON_IDS` | Optional comma-separated TMDB ids, hidden from all lists, credits, and agent results. |
| `NITRO_PRESET` | Deployment only: set to `vercel` to emit the Vercel build output. |

## Deployment

The app deploys to Vercel from the Nitro build output (`NITRO_PRESET=vercel`), with the server function configured for a 60 second max duration to accommodate long agent turns.
