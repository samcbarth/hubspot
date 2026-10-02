#!/usr/bin/env python3
"""
Annotate raw HubSpot screenshots and export web-ready WebP files.

Raw captures live in shots/<slug>/ (gitignored, may contain private data).
Annotations live in shots/<slug>/annotations.json:

{
  "workflow-list.png": {
    "out": "workflow-list.webp",          # optional, default: same name .webp
    "crop": [0, 60, 1600, 900],           # optional [x0, y0, x1, y1]
    "blur": [[1200, 10, 1500, 50]],       # rectangles to pixelate (emails, names, portal IDs)
    "erase": [[300, 90, 620, 154]],       # rectangles painted over with the color just below them (banners, popups)
    "boxes": [[40, 200, 380, 250]],       # orange highlight rectangles
    "arrows": [[600, 400, 420, 240]],     # [x_from, y_from, x_to, y_to]
    "badges": [[30, 190, "1"]],           # numbered step circles
    "width": 1400                         # max output width
  }
}

All coordinates are in raw-image pixels, before cropping.
Usage: python tools/annotate.py <slug>
Writes to articles/<slug>/ and prints width/height for the <img> tag.
"""
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ORANGE = (255, 92, 53)
FONT_CANDIDATES = ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf",
                   "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]


def font(size):
    for f in FONT_CANDIDATES:
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def pixelate(img, box):
    x0, y0, x1, y1 = [int(v) for v in box]
    region = img.crop((x0, y0, x1, y1))
    w, h = region.size
    if w < 2 or h < 2:
        return
    small = region.resize((max(1, w // 12), max(1, h // 12)), Image.BILINEAR)
    region = small.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(2))
    img.paste(region, (x0, y0))


def arrow(draw, x0, y0, x1, y1, width):
    draw.line((x0, y0, x1, y1), fill=ORANGE, width=width)
    ang = math.atan2(y1 - y0, x1 - x0)
    head = width * 4.5
    p1 = (x1 - head * math.cos(ang - 0.45), y1 - head * math.sin(ang - 0.45))
    p2 = (x1 - head * math.cos(ang + 0.45), y1 - head * math.sin(ang + 0.45))
    draw.polygon([(x1, y1), p1, p2], fill=ORANGE)


def process(slug, name, spec):
    src = ROOT / "shots" / slug / name
    img = Image.open(src).convert("RGB")
    scale = max(1, round(img.width / 1400))  # keep strokes visible on hi-dpi captures
    for box in spec.get("erase", []):
        x0, y0, x1, y1 = [int(v) for v in box]
        color = img.getpixel(((x0 + x1) // 2, min(y1 + 4, img.height - 1)))
        ImageDraw.Draw(img).rectangle((x0, y0, x1, y1), fill=color)
    for box in spec.get("blur", []):
        pixelate(img, box)
    draw = ImageDraw.Draw(img)
    for box in spec.get("boxes", []):
        draw.rounded_rectangle(box, radius=6 * scale, outline=ORANGE, width=4 * scale)
    for a in spec.get("arrows", []):
        arrow(draw, *a, width=5 * scale)
    f = font(20 * scale)
    for x, y, label in spec.get("badges", []):
        r = 17 * scale
        draw.ellipse((x - r, y - r, x + r, y + r), fill=ORANGE, outline=(255, 255, 255), width=3 * scale)
        draw.text((x, y), str(label), font=f, fill=(255, 255, 255), anchor="mm")
    if spec.get("crop"):
        img = img.crop(tuple(spec["crop"]))
    max_w = spec.get("width", 1400)
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    out_dir = ROOT / "articles" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / spec.get("out", Path(name).with_suffix(".webp").name)
    img.save(out, "WEBP", quality=82, method=6)
    print(f'{out.relative_to(ROOT)}  width="{img.width}" height="{img.height}"  {out.stat().st_size // 1024} KB')


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    specs = json.loads((ROOT / "shots" / slug / "annotations.json").read_text(encoding="utf-8"))
    for name, spec in specs.items():
        process(slug, name, spec)


if __name__ == "__main__":
    main()
