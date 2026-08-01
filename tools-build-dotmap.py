#!/usr/bin/env python3
"""Turn the Vision cutout into a compact tone-mapped luma+alpha map for the dot renderer."""
import base64, io, sys
import numpy as np
from PIL import Image, ImageFilter

SRC = "lawrence-cutout.png"
OUT_PNG = "lawrence-dotmap.png"
OUT_B64 = "lawrence-dotmap.b64"

im = Image.open(SRC).convert("RGBA")
arr = np.asarray(im).astype(np.float32)
rgb, a = arr[..., :3], arr[..., 3]

# --- 1. Find the subject bounding box from alpha ---
mask = a > 24
ys, xs = np.where(mask)
y0, y1 = ys.min(), ys.max()
x0, x1 = xs.min(), xs.max()
print(f"subject bbox: x[{x0}:{x1}] y[{y0}:{y1}]  ({x1-x0}x{y1-y0}) of {im.size}")

# --- 2. Crop to head + complete shoulders ---
# The crop width is derived from the widest row it actually contains, so the
# shoulders are never clipped at the frame edges.
top = max(0, y0 - int((y1 - y0) * 0.028))
bottom = min(im.height, y0 + int((y1 - y0) * 0.71))   # through the shoulder line

rows = mask[top:bottom]
cols_any = rows.any(axis=0)
sx = np.where(cols_any)[0]
span_l, span_r = int(sx.min()), int(sx.max())
margin = int((span_r - span_l) * 0.05)

left = max(0, span_l - margin)
right = min(im.width, span_r + margin)
box = (left, top, right, bottom)
target_w, target_h = right - left, bottom - top
print(f"crop box: {box} -> {target_w}x{target_h}  "
      f"(silhouette spans x[{span_l}:{span_r}], margin {margin}px)")

im = im.crop(box)
arr = np.asarray(im).astype(np.float32)
rgb, a = arr[..., :3], arr[..., 3]

# --- 3. Luminance (Rec.709) ---
luma = rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722
luma = luma / 255.0
alpha = a / 255.0

# --- 4. Tone map ---
# The quarter-zip is near-black; without lifting it the silhouette vanishes in the
# dot field. Lift shadows hard, then compress highlights so the face keeps its form.
luma = np.clip(luma, 0.0, 1.0)
# Gentle lift only. The renderer applies its own silhouette floor to dot size,
# so this map does not have to fake presence in the shadows and can spend its
# whole range on modelling the face.
lifted = np.power(luma, 0.72)
# Local contrast so eyes, brows and jaw survive quantisation into dot sizes.
tmp = Image.fromarray((np.clip(lifted, 0, 1) * 255).astype(np.uint8), "L")
tmp = tmp.filter(ImageFilter.UnsharpMask(radius=3, percent=165, threshold=1))
# Second, wider pass. The fine radius sharpens edges; this one separates whole
# features — it is what pulls the eye sockets away from the cheeks so the face
# still reads once the tone is quantised into dot sizes.
tmp = tmp.filter(ImageFilter.UnsharpMask(radius=14, percent=75, threshold=0))
lifted = np.asarray(tmp).astype(np.float32) / 255.0
# S-curve: pushes the face's midtones apart so features read at dot resolution.
lifted = np.clip(lifted, 0.0, 1.0)
lifted = lifted * lifted * (3 - 2 * lifted) * 0.72 + lifted * 0.28

# Percentile stretch across the subject only. Without this the face sits bunched
# in the top of the range and every dot renders at max radius, so it fills in
# solid instead of reading as a face.
sub = lifted[alpha > 0.5]
lo, hi = np.percentile(sub, 1.5), np.percentile(sub, 99.0)
lifted = (lifted - lo) / max(hi - lo, 1e-6)
lifted = np.clip(lifted, 0.0, 1.0)

# Soft knee on the top end. The white collar is the brightest thing in the frame
# and without this it blows out and pulls focus off the face.
knee = 0.78
lifted = np.where(lifted > knee, knee + (lifted - knee) * 0.52, lifted)

lifted = 0.06 + lifted * 0.94
lifted = np.clip(lifted, 0.0, 1.0)

# Edge falloff: soften alpha slightly so the silhouette edge dithers out rather
# than ending on a hard line.
am = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.6))
alpha = np.asarray(am).astype(np.float32) / 255.0

# --- 5. Downsample to the map resolution (area average keeps tone honest) ---
# Derive the map size from the crop so the renderer never stretches the face.
# Must stay ahead of the finest dot grid the renderer uses, or the map becomes
# the limit on how much face survives rather than the dot pitch.
MAP_W = 210
MAP_H = int(round(MAP_W * target_h / target_w))
def down(chan):
    img = Image.fromarray((np.clip(chan, 0, 1) * 255).astype(np.uint8), "L")
    return np.asarray(img.resize((MAP_W, MAP_H), Image.LANCZOS)).astype(np.float32) / 255.0

L = down(lifted)
A = down(alpha)
L = np.clip(L, 0, 1)
A = np.clip(A, 0, 1)

# --- 6. Pack as LA (grayscale + alpha) PNG ---
out = np.zeros((MAP_H, MAP_W, 2), dtype=np.uint8)
out[..., 0] = (L * 255).astype(np.uint8)
out[..., 1] = (A * 255).astype(np.uint8)
png = Image.fromarray(out, "LA")
png.save(OUT_PNG, optimize=True)

buf = io.BytesIO()
png.save(buf, format="PNG", optimize=True)
raw = buf.getvalue()
b64 = base64.b64encode(raw).decode("ascii")
open(OUT_B64, "w").write(b64)

print(f"map {MAP_W}x{MAP_H}  png={len(raw)} bytes  b64={len(b64)} chars ({len(b64)/1024:.1f} KB)")
print(f"luma range in-subject: {L[A>0.5].min():.3f} .. {L[A>0.5].max():.3f}")

# preview: what the dot field will roughly look like
prev = (L * A * 255).astype(np.uint8)
Image.fromarray(prev, "L").resize((MAP_W*3, MAP_H*3), Image.NEAREST).save("preview-luma.png")
