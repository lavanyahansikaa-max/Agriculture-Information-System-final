// Worker configuration types placeholder.
// This file exists so TypeScript can resolve the `./worker-configuration.d.ts` type reference.

// Minimal Cloudflare Worker/D1 type definitions for this project.
// For a more complete type experience, consider installing @cloudflare/workers-types.

declare interface D1Database {
  prepare(query: string): any;
}

declare interface Env {
  DB: D1Database;
}
