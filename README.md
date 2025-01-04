# Nuxt Offline SQLite Query

## TLDR

- Set up SQLite WASM in a Vue 3 application for offline data storage
- Learn how to use Origin Private File System (OPFS) for persistent storage
- Build a SQLite query playground with Vue composables
- Implement production-ready offline-first architecture
- Compare SQLite vs IndexedDB for web applications

> Add offline capabilities to your Nuxt3 application. While browsers offer IndexedDB, SQLite provides a more powerful solution for complex data operations. This project shows you how to integrate SQLite with Vue using WebAssembly for robust offline-first sqlite db query application.



## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm build
```

Locally preview production build:

```bash
# pnpm
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
