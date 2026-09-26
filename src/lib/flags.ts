/* Feature flags. Flip these in code, rebuild, deploy.

   MERGED_UI   Anthropic folded Cowork into Claude on 16 Sep 2026 (no mode
               switch, Claude Docs and Slides). Magic's Team seats still show
               the separate Cowork toggle, so this stays false until someone
               with a Team seat confirms the new interface. Setup copy and
               screenshots read this flag.
   CLOUD_SYNC  Phase 3: progress synced to Cloudflare D1 by webmail address.
   WORLD_3D    Phase 3: WebGL hub instead of the 2.5D map. */
export const MERGED_UI = false
export const CLOUD_SYNC = false
export const WORLD_3D = false
