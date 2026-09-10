"""Create web delivery copies; source photos, videos, and the resume stay untouched."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import re
import subprocess
import sys
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '.media-tools.local'))
import imageio_ffmpeg

PUBLIC = ROOT / 'public'
OUTPUT = PUBLIC / 'media'
OUTPUT.mkdir(exist_ok=True)
ENCODER = imageio_ffmpeg.get_ffmpeg_exe()


def optimize(source):
    relative = source.relative_to(PUBLIC).as_posix()
    stem = re.sub(r'[^a-zA-Z0-9_-]', '-', relative.rsplit('.', 1)[0])
    if source.suffix.lower() in {'.jpg', '.jpeg', '.png'}:
        if source.name not in {'Me.jpg', 'background.png'} and len(source.relative_to(PUBLIC).parts) == 1:
            return None
        with Image.open(source) as original:
            picture = ImageOps.exif_transpose(original).convert('RGB')
            width, height = picture.size
            variants = {}
            for label, limit in [('small', 720), ('large', 1800)]:
                output = OUTPUT / f'{stem}-{limit}.webp'
                resized = picture.copy()
                resized.thumbnail((limit, limit * 2), Image.Resampling.LANCZOS)
                resized.save(output, 'WEBP', quality=86, method=6)
                variants[label] = output.relative_to(PUBLIC).as_posix()
            variants.update(width=width, height=height, type='image')
            print(f'Optimized image: {relative}', flush=True)
            return relative, variants
    if source.suffix.lower() in {'.mp4', '.mov'}:
        output = OUTPUT / f'{stem}.mp4'
        poster = OUTPUT / f'{stem}-poster.webp'
        command = [ENCODER, '-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', str(source),
                   '-map', '0:v:0', '-map', '0:a?', '-vf', 'scale=min(1280\\,iw):-2',
                   '-c:v', 'libx264', '-preset', 'fast', '-crf', '25', '-pix_fmt', 'yuv420p',
                   '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-threads', '2', str(output)]
        subprocess.run(command, check=True, capture_output=True)
        subprocess.run([ENCODER, '-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-ss', '0.2',
                        '-i', str(output), '-frames:v', '1', '-vf', 'scale=640:-2', str(poster)],
                       check=True, capture_output=True)
        if output.stat().st_size >= 24 * 1024 * 1024:
            raise ValueError(f'Video still exceeds delivery budget: {relative}')
        print(f'Optimized video: {relative} ({output.stat().st_size // 1024} KB)', flush=True)
        return relative, dict(small=output.relative_to(PUBLIC).as_posix(), large=output.relative_to(PUBLIC).as_posix(),
                              poster=poster.relative_to(PUBLIC).as_posix(), type='video')
    return None


if __name__ == '__main__':
    sources = [path for path in PUBLIC.rglob('*') if path.is_file() and OUTPUT not in path.parents]
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(optimize, sources))
    manifest = dict(result for result in results if result)
    (ROOT / 'src/data/media.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print(f'Preserved all originals. Created delivery variants for {len(manifest)} media files.', flush=True)
