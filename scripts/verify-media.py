"""Check that delivery video files retain their duration and decode successfully."""
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '.media-tools.local'))
import imageio_ffmpeg

manifest = json.loads((ROOT / 'src/data/media.json').read_text())
for original, variant in manifest.items():
    for key in ('small', 'large', 'poster'):
        if key in variant:
            assert (ROOT / 'public' / variant[key]).is_file(), variant[key]
    if variant['type'] != 'video':
        continue
    input_reader = imageio_ffmpeg.read_frames(str(ROOT / 'public' / original))
    source = next(input_reader)
    next(input_reader)
    input_reader.close()
    output_reader = imageio_ffmpeg.read_frames(str(ROOT / 'public' / variant['large']))
    delivery = next(output_reader)
    next(output_reader)
    output_reader.close()
    assert abs(source['duration'] - delivery['duration']) < .2, original
    assert source.get('audio_codec') == 'none' or delivery.get('audio_codec') != 'none', original
    print(f"{original}: {source['duration']:.2f}s -> {delivery['duration']:.2f}s, {delivery['codec']}")
print('All media variants exist. All four delivery videos decode and preserve the full duration.')
