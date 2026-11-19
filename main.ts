// news-image-nov18 — the entrypoint: hand the day's front page to the grader.
//
// The entry is a single image, entry.png, sitting beside this file. This program
// copies it into the output directory the grader provides. The image path is
// resolved from this file's own location (import.meta.url), never from the
// working directory: the grader runs this program from elsewhere, and a relative
// path would not find the image.

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const entryImage = new URL("./entry.png", import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly, before doing anything else, if the image is missing or
// empty: a raw copyFileSync ENOENT would be cryptic, and a 0-byte image
// would otherwise be handed to the grader as a silently broken entry.
let imageBytes;
try {
  imageBytes = statSync(entryImage).size;
} catch {
  throw new Error(`news-image-nov18: entry.png is missing next to main.ts (looked for ${entryImage.pathname})`);
}
if (imageBytes === 0) {
  throw new Error("news-image-nov18: entry.png is empty (0 bytes) — refusing to submit a blank image");
}

mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "entry.png");
copyFileSync(entryImage, outputPath);

// Confirm the copy landed whole: a truncated copy (disk full, interrupted
// write) would otherwise reach the grader as a corrupt image, and the two
// runs the grader compares would no longer agree.
if (statSync(outputPath).size !== imageBytes) {
  throw new Error(`news-image-nov18: copied entry.png is ${statSync(outputPath).size} bytes, expected ${imageBytes} — the copy is incomplete`);
}
