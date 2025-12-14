import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

export const api = treaty<App>(
  process.env.NEXT_PUBLIC_APP_URL || "localhost:3000"
).api;
