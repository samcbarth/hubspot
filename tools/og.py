#!/usr/bin/env python3
"""
Generate 1200x630 social share images.

  python tools/og.py            # every article in articles.js plus the home image
  python tools/og.py <slug>     # one article

Writes articles/<slug>/og.png and assets/img/og-home.png.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
BG = (10, 10, 10)
ORANGE = (255, 122, 89)
TEXT = (240, 240, 240)
MUTED = (150, 150, 150)
BOLD = ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
REG = ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]


def font(cands, size):
    for f in cands:
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def wrap(draw, text, fnt, max_w):
    lines, line = [], ""
    for word in text.split():
        trial = (line + " " + word).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def card(title, kicker, footer, out):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 14, H), fill=ORANGE)
    d.rounded_rectangle((70, 64, 140, 134), radius=16, fill=ORANGE)
    d.text((105, 99), "HFN", font=font(BOLD, 24), fill=(255, 255, 255), anchor="mm")
    d.text((160, 72), "HubSpot Field Notes", font=font(BOLD, 30), fill=TEXT)
    d.text((160, 108), "by Sam Barth", font=font(REG, 22), fill=MUTED)
    d.text((70, 200), kicker.upper(), font=font(BOLD, 22), fill=ORANGE)
    size = 64
    while True:
        f = font(BOLD, size)
        lines = wrap(d, title, f, W - 140)
        if len(lines) <= 4 or size <= 40:
            break
        size -= 4
    y = 245
    for ln in lines[:4]:
        d.text((70, y), ln, font=f, fill=TEXT)
        y += int(size * 1.18)
    d.text((70, H - 70), footer, font=font(REG, 24), fill=MUTED)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    print(out.relative_to(ROOT))


def articles():
    js = "const a=require(process.argv[1]);console.log(JSON.stringify(a))"
    res = subprocess.run(["node", "-e", js, str(ROOT / "articles.js")], capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for a in articles():
        if only and a["slug"] != only:
            continue
        kicker = ("Quick tip" if a["type"] == "tip" else "Guide") + "  /  " + a["problem"]
        card(a["title"], kicker, f'{a["tier"]}  |  Verified {a["verified"]}', ROOT / "articles" / a["slug"] / "og.png")
    if not only:
        card("The HubSpot fixes I keep explaining, written down.", "Fixes, how-tos, hidden tricks",
             "hubspot.samcbarth.com", ROOT / "assets" / "img" / "og-home.png")


if __name__ == "__main__":
    main()
