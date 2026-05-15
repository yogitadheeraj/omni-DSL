/**
 * Writes one JSON file per brand into server/brand-tokens/
 * Shape of each file:
 *   {
 *     brandKey: "whitelabel",
 *     brandName: "White Label",
 *     generatedAt: "2026-05-15T...",
 *     tokens: { "color.brand.primary": { value, resolvedValue, type, collection }, ... }
 *   }
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const BRAND_TOKENS_DIR = resolve(__dirname, "../../brand-tokens");

export function writeBrandTokenFiles(normalized) {
  mkdirSync(BRAND_TOKENS_DIR, { recursive: true });

  const written = [];

  for (const [brandKey, brandData] of Object.entries(normalized.brands ?? {})) {
    const payload = {
      brandKey,
      brandName: brandData.name,
      collection: brandData.collection,
      generatedAt: new Date().toISOString(),
      tokens: brandData.tokens
    };

    const filePath = resolve(BRAND_TOKENS_DIR, `${brandKey}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
    written.push({ brandKey, filePath });
  }

  return written;
}
