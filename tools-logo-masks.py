#!/usr/bin/env python3
"""Build the single-tone organisation marks used in the Career Timeline.

Reads the original logo files in assets/ and writes assets/logos/*.png: a white
silhouette with alpha, trimmed to the logo's ink and scaled to one shared
height. styles.css uses each PNG as a CSS mask (.org-logo), so the mark takes a
theme text colour and flips between dark and light mode on its own.

Run from the repo root:  python3 tools-logo-masks.py
Requires Pillow and numpy.
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT_H = 160  # shared output height; width follows each logo's proportions

LOGOS = [
    ("assets/ZVV Logo.jpeg",            "assets/logos/zvv.png"),
    ("assets/Analog Devices Logo.webp", "assets/logos/analog-devices.png"),
    ("assets/AWS SBG PUP Logo.jpg",     "assets/logos/aws-sbg-pup.png"),
]


def to_mask(src: Path, dst: Path, soft=(0.2, 0.8)) -> None:
    im = Image.open(src).convert("RGBA")
    flat = Image.new("RGBA", im.size, (255, 255, 255, 255))
    flat.alpha_composite(im)  # transparent sources flatten to white, not black
    rgb = np.asarray(flat.convert("RGB")).astype(float) / 255
    lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
    dark = 1 - lum
    hi = np.percentile(dark, 99.5)  # the darkest real ink becomes fully opaque
    alpha = np.clip(dark / hi, 0, 1)
    lo, up = soft  # soft threshold keeps antialiased edges
    t = np.clip((alpha - lo) / (up - lo), 0, 1)
    alpha = t * t * (3 - 2 * t)

    ys, xs = np.where(alpha > 0.05)
    alpha = alpha[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = alpha.shape
    mask = Image.fromarray((alpha * 255).astype(np.uint8))
    new_w = round(w * OUT_H / h)
    mask = mask.resize((new_w, OUT_H), Image.LANCZOS)

    out = Image.new("RGBA", mask.size, (255, 255, 255, 0))
    out.putalpha(mask)
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, optimize=True)
    print(f"{dst.relative_to(ROOT)}: {new_w}x{OUT_H} (aspect-ratio: {new_w} / {OUT_H})")


if __name__ == "__main__":
    for src, dst in LOGOS:
        to_mask(ROOT / src, ROOT / dst)
