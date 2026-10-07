#!/usr/bin/env python3
"""
Build the transparent, full-colour client logos used by the marquee section.

Input : scripts/sources/<slug>.webp   one tile per client, cropped from the CTO's
                                      logo sheet (6 Oct 2026); flat background
        scripts/originals/<slug>.png  original logo (RGBA, any size); used instead of the
                                      tile crop when present (SVGs: rasterise to PNG first)
Output: public/clients/<slug>.webp    colour logo + alpha, 4x upscaled, trimmed
        src/data/clientLogoSizes.ts   pixel sizes for optical size normalisation

The alpha comes from each pixel's colour distance to the tile background, is
upscaled and re-sharpened; colours are un-mixed from the background so edges stay
clean on white. Logos that are white/gold on a dark tile are recoloured to the
brand dark (they would vanish on a white section).

Usage: python3 scripts/build-client-logos.py
"""
import glob
import os

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCES = os.path.join(HERE, "sources")
ORIGINALS = os.path.join(HERE, "originals")
OUT = os.path.join(HERE, "..", "public", "clients")
SIZES_TS = os.path.join(HERE, "..", "src", "data", "clientLogoSizes.ts")
SCALE = 4
# Tiles with a dark background hold white/gold logos: recolour them.
DARK_TILES = {"the-westin-jakarta", "trinland", "hariom-s", "7am-7pm", "sumak"}
BRAND_DARK = (16, 17, 17)
# Transparent originals whose white lettering must become dark grey.
WHITE_TO_GRAY = {"dunex"}


def smoothstep(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def extract(img, dark, margin=3):
    """Key a flat-background image to transparent. dark=True: light logo on a dark
    background, recoloured to the brand dark; otherwise colours are kept."""
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    if margin:
        a = a[margin:-margin, margin:-margin]
    h, w, _ = a.shape
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(border, axis=0)
    d = np.sqrt(((a - bg) ** 2).sum(-1))
    d8 = Image.fromarray(np.clip(d, 0, 255).astype(np.uint8))
    d = np.asarray(d8.filter(ImageFilter.GaussianBlur(0.5))).astype(np.float32)
    fg = d[d > 25]
    ref = max(np.percentile(fg, 85) if fg.size > 50 else 120.0, 60.0)
    n = np.clip(d / ref, 0, 1)
    size = (w * SCALE, h * SCALE)
    n_big = np.asarray(Image.fromarray((n * 255).astype(np.uint8)).resize(size, Image.LANCZOS))
    alpha = smoothstep(n_big.astype(np.float32) / 255, 0.16, 0.62)
    if dark:
        rgb = np.zeros((size[1], size[0], 3), np.uint8)
        rgb[:] = BRAND_DARK
    else:
        # un-mix the tile background from partially covered edge pixels
        c = np.clip(bg + (a - bg) / np.maximum(n, 0.3)[..., None], 0, 255).astype(np.uint8)
        rgb = np.asarray(Image.fromarray(c).resize(size, Image.BICUBIC))
    return Image.fromarray(np.dstack([rgb, (alpha * 255).astype(np.uint8)]))


def from_original(img, slug):
    """Original logos: use as-is when transparent; otherwise key the flat background."""
    alpha = np.asarray(img.getchannel("A"))
    if (alpha < 250).mean() > 0.02:
        if slug in WHITE_TO_GRAY:  # white lettering on transparent: invisible on white
            px = np.asarray(img).copy()
            white = (px[..., :3].min(-1) > 235) & (px[..., 3] > 0)
            px[white, :3] = (74, 78, 84)
            img = Image.fromarray(px)
    else:
        rgb = np.asarray(img.convert("RGB")).astype(np.float32)
        border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
        bg_lum = float((np.median(border, axis=0) * np.array([0.299, 0.587, 0.114])).sum())
        img = extract(img, dark=bg_lum < 110, margin=0)
        # extract() upsamples 4x; bring it back so all originals share one pipeline
        img = img.resize((max(1, img.width // SCALE), max(1, img.height // SCALE)), Image.LANCZOS)
    if max(img.size) > 1400:
        img.thumbnail((1400, 1400), Image.LANCZOS)
    return img


def trim(img, pad):
    bbox = img.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad),
                     min(img.width, x1 + pad), min(img.height, y1 + pad)))


def main():
    os.makedirs(OUT, exist_ok=True)
    sizes = {}
    for path in sorted(glob.glob(os.path.join(SOURCES, "*.webp"))):
        slug = os.path.splitext(os.path.basename(path))[0]
        orig = os.path.join(ORIGINALS, slug + ".png")
        if os.path.exists(orig):
            full = from_original(Image.open(orig).convert("RGBA"), slug)
        else:
            full = extract(Image.open(path), slug in DARK_TILES)
        logo = trim(full, 2 * SCALE)
        if max(logo.size) > 900:
            logo.thumbnail((900, 900), Image.LANCZOS)
        logo.save(os.path.join(OUT, slug + ".webp"), "WEBP", quality=95, method=6)
        sizes[slug] = logo.size
        print(f"{slug:24s} {logo.size[0]}x{logo.size[1]}")
    lines = [
        "// Generated by scripts/build-client-logos.py - do not edit by hand.",
        "// Pixel size [width, height] of each file in public/clients.",
        "export const clientLogoSizes: Record<string, [number, number]> = {",
    ]
    lines += [f"  '{k}': [{w}, {h}]," for k, (w, h) in sorted(sizes.items())]
    lines.append("}")
    with open(SIZES_TS, "w") as f:
        f.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    main()
