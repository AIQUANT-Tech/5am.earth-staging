#!/usr/bin/env python3
"""Prepare public/ images for the static export.

Two jobs, both idempotent - re-running only does the work that is missing:

  1. Re-encode every PNG in public/collage and public/uploads to WebP. The
     collages are large-canvas artwork; as PNG they run ~2 MB each, as WebP
     q=82 they are ~150 kB with no visible difference.

  2. Emit a width ladder for each WebP (`name-640w.webp`, ...). This is what
     makes the `srcset` that next/image writes actually mean something:
     `next.config.mjs` uses a custom loader (`lib/imageLoader.ts`), so Next
     does NO image optimization of its own and whatever sits in public/ is
     exactly what the browser downloads. The loader maps a requested width
     onto one of these files.

Ladder widths are capped at the source width - asking for 1280w from a
1192px-wide original just re-encodes at 1192px rather than upscaling, so a
variant is never larger than the original.

Usage:  python3 scripts/optimize-images.py [--force]
Requires Pillow (`pip install Pillow`).
"""

from __future__ import annotations

import glob
import os
import sys

from PIL import Image

QUALITY = 82
DIRS = ("public/collage", "public/uploads")

# Keep in sync with LADDER in lib/imageLoader.ts and `deviceSizes` in
# next.config.mjs. Four steps covers 1x/2x phone, tablet and a 1280px desktop
# column without exploding the file count.
LADDER = (420, 640, 828, 1280)

FORCE = "--force" in sys.argv


def open_rgb(path: str) -> Image.Image:
    im = Image.open(path)
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    return im.convert("RGBA" if has_alpha else "RGB")


def save_webp(im: Image.Image, path: str) -> None:
    im.save(path, "WEBP", quality=QUALITY, method=6)


def kb(path: str) -> float:
    return os.path.getsize(path) / 1024


def main() -> None:
    converted = variants = skipped = 0
    before = after = 0

    for d in DIRS:
        # 1. PNG -> WebP
        for src in sorted(glob.glob(os.path.join(d, "*.png"))):
            dst = os.path.splitext(src)[0] + ".webp"
            if os.path.exists(dst) and not FORCE:
                continue
            save_webp(open_rgb(src), dst)
            before += os.path.getsize(src)
            after += os.path.getsize(dst)
            converted += 1
            print(f"  webp   {src} -> {dst}  ({kb(src):.0f} kB -> {kb(dst):.0f} kB)")

        # 2. width ladder for each full-size WebP
        for src in sorted(glob.glob(os.path.join(d, "*.webp"))):
            if "-" in os.path.basename(src) and src.endswith(tuple(f"-{w}w.webp" for w in LADDER)):
                continue  # already a variant
            stem = os.path.splitext(src)[0]
            source_width = Image.open(src).width
            for w in LADDER:
                dst = f"{stem}-{w}w.webp"
                if os.path.exists(dst) and not FORCE:
                    skipped += 1
                    continue
                im = open_rgb(src)
                target = min(w, source_width)
                if target < source_width:
                    height = max(1, round(im.height * target / im.width))
                    im = im.resize((target, height), Image.LANCZOS)
                save_webp(im, dst)
                variants += 1
            print(f"  ladder {os.path.basename(src)} ({source_width}px) -> "
                  + ", ".join(f"{min(w, source_width)}px" for w in LADDER))

    print()
    if converted:
        print(f"{converted} PNG -> WebP: {before / 1048576:.1f} MB -> {after / 1048576:.1f} MB")
    print(f"{variants} variants written, {skipped} already present")


if __name__ == "__main__":
    main()
