"""Assemble the captured frames into a README GIF: crop, scale to 800 px, one shared palette."""
import sys
from pathlib import Path
from PIL import Image

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
box = tuple(int(v) for v in sys.argv[3].split(",")) if len(sys.argv) > 3 else None
frames = []
for f in sorted(src.glob("f*.png")):
    im = Image.open(f).convert("RGB")
    if box:
        im = im.crop(box)
    w = 800
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    frames.append(im)
pal = frames[len(frames) // 2].quantize(colors=128, method=Image.MEDIANCUT)
q = [f.quantize(palette=pal, dither=Image.NONE) for f in frames]
q[0].save(dst, save_all=True, append_images=q[1:], duration=250, loop=0, optimize=True)
print(dst, len(q), "frames", dst.stat().st_size // 1024, "KB")
