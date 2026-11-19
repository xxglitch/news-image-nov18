// news-image-nov18 — the entrypoint: hand the day's front page to the grader.
//
// The entry is a single image, entry.png, sitting beside this file. This program
// copies it into the output directory the grader provides. The image path is
// resolved from this file's own location (import.meta.url), never from the
// working directory: the grader runs this program from elsewhere, and a relative
// path would not find the image.

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const entryImage = new URL("./entry.png", import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
copyFileSync(entryImage, join(outputDir, "entry.png"));
