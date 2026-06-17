# build_timeline.py
import sys
import os
from faster_whisper import WhisperModel
import json

if len(sys.argv) < 2:
    print("Usage: python build_timeline.py <audio_file>")
    sys.exit(1)

audio_path = sys.argv[1]
base_name = os.path.splitext(os.path.basename(audio_path))[0]
output_path = f"{base_name}.json"

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="float32"
)

segments, info = model.transcribe(
    audio_path,
    language="vi",
    vad_filter=False,
    word_timestamps=False
)

fw_segments = list(segments)
total_duration = info.duration

print(f"Audio duration: {total_duration:.2f}s")
print(f"Số segment whisper: {len(fw_segments)}")

with open(
    "script.txt",
    "r",
    encoding="utf-8"
) as f:
    script_lines = [
        line.strip()
        for line in f
        if line.strip()
    ]

print(f"Số dòng script.txt: {len(script_lines)}")

# Map theo tỉ lệ độ dài ký tự của mỗi dòng -> chia tổng thời gian
lengths = [len(line) for line in script_lines]
total_chars = sum(lengths)

timeline = []
cursor = 0.0

for line, length in zip(script_lines, lengths):
    seg_duration = total_duration * (length / total_chars)
    start = cursor
    end = cursor + seg_duration
    timeline.append({
        "text": line,
        "start": round(start, 2),
        "end": round(end, 2)
    })
    cursor = end

# Đảm bảo end cuối khớp chính xác total_duration (tránh sai số cộng dồn)
timeline[-1]["end"] = round(total_duration, 2)

with open(
    output_path,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        timeline,
        f,
        ensure_ascii=False,
        indent=2
    )

for seg in timeline:
    print(f"  {seg['start']:7.2f} -> {seg['end']:7.2f}: {seg['text']}")

print(f"\nĐã ghi {output_path} — tổng: {timeline[-1]['end']:.2f}s")