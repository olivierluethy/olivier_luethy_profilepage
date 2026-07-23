import path from "node:path";
import { cache } from "react";

import sharp from "sharp";

export interface ImageSize {
  width: number;
  height: number;
}

/** 16:9 — used when an image is missing so a placeholder never breaks a build. */
const FALLBACK: ImageSize = { width: 1600, height: 900 };

/**
 * Reads the intrinsic dimensions of an image in `/public` at build time.
 *
 * Authors write plain `![alt](/images/x.png)` in MDX with no dimensions; this
 * supplies the real ones so `next/image` reserves the correct space and the
 * page has no layout shift. Remote and missing images fall back to 16:9.
 */
export const getImageSize = cache(async (src: string): Promise<ImageSize> => {
  if (!src.startsWith("/")) return FALLBACK;

  try {
    const filePath = path.join(process.cwd(), "public", src);
    const { width, height } = await sharp(filePath).metadata();
    if (!width || !height) return FALLBACK;
    return { width, height };
  } catch {
    return FALLBACK;
  }
});
