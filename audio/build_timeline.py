import sys
import os
import json
import contextlib
import wave

try:
    hf_token = os.environ.get("HF_TOKEN")
    if hf_token:
        os.environ["HF_TOKEN"] = hf_token
        print("🔒 Đã kích hoạt HF_TOKEN từ hệ thống thành công.")
except Exception:
    pass

from faster_whisper import WhisperModel

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
CAPTION_MAX_WORDS    = 5
CAPTION_MAX_CHARS    = 38
CAPTION_MAX_DURATION = 3.5
CAPTION_MIN_WORDS    = 2


# ─────────────────────────────────────────────
# 1. TRANSCRIBE → chỉ lấy timing, bỏ text
# ─────────────────────────────────────────────
def transcribe(audio_path: str) -> tuple[list[dict], float]:
    """Chạy Whisper, chỉ lấy start/end của từng word. Bỏ hoàn toàn text."""

    print(f"\n🔍 Audio info:")
    print(f"   File: {audio_path}")
    try:
        with contextlib.closing(wave.open(audio_path, 'r')) as f:
            frames   = f.getnframes()
            rate     = f.getframerate()
            duration = frames / float(rate)
            print(f"   Duration:    {duration:.2f}s")
            print(f"   Sample rate: {rate}Hz")
            print(f"   Channels:    {f.getnchannels()}")
    except Exception as e:
        print(f"   Không đọc được wav info: {e}")

    model = WhisperModel("medium", device="cpu", compute_type="int8")
    print("\nĐang chạy Whisper...")

    segments, info = model.transcribe(
        audio_path,
        language="vi",
        vad_filter=True,
        word_timestamps=True,
        initial_prompt="Tiếng Việt.",   # chỉ gợi ý ngôn ngữ, không dump script
        beam_size=5,
        temperature=0.0,
        no_speech_threshold=0.2,
        log_prob_threshold=-1.0,
        compression_ratio_threshold=2.4,
    )

    # Chỉ lấy start/end, bỏ text
    timings = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                if w.end > w.start or (w.start == w.end and timings):
                    timings.append({"start": w.start, "end": w.end})

    print(f"Whisper trả về {len(timings)} word timings / {info.duration:.2f}s")
    print(f"\n🔍 20 timing đầu:")
    for i, t in enumerate(timings[:20]):
        print(f"   {i+1:2d}.  {t['start']:6.2f} - {t['end']:6.2f}s")

    return timings, info.duration


# ─────────────────────────────────────────────
# 2. SEGMENT BUILDER
#    Chia timings tuần tự theo số từ mỗi dòng script
# ─────────────────────────────────────────────
def build_segments(script_lines: list[str], timings: list[dict], total_duration: float) -> list[dict]:
    """
    Không dùng text Whisper.
    Ráp timing tuần tự vào từng dòng script theo số từ.
    Nếu timings ít hơn script words → scale tỉ lệ.
    """
    total_script_words  = sum(len(line.split()) for line in script_lines)
    total_timing_words  = len(timings)

    print(f"\n🔍 Mapping: {total_script_words} script words ↔ {total_timing_words} timings")

    timeline     = []
    timing_cursor = 0

    for line in script_lines:
        n_script = len(line.split())

        # Scale số timings tương ứng với dòng này theo tỉ lệ
        n_timing = round(n_script / total_script_words * total_timing_words)
        n_timing = max(n_timing, 1)

        # Không vượt quá số timings còn lại
        remaining_timings  = total_timing_words - timing_cursor
        remaining_lines    = script_lines.index(line) + 1  # dòng hiện tại (1-based)
        n_timing = min(n_timing, remaining_timings - (len(script_lines) - remaining_lines))
        n_timing = max(n_timing, 1)

        slot = timings[timing_cursor : timing_cursor + n_timing]
        timing_cursor += n_timing

        if slot:
            start_time = slot[0]["start"]
            end_time   = slot[-1]["end"]
        else:
            start_time = timeline[-1]["end"] if timeline else 0.0
            end_time   = start_time + 1.0

        timeline.append({
            "text":  line,
            "start": round(start_time, 2),
            "end":   round(end_time, 2),
        })

    # Fix boundary
    if timeline:
        timeline[0]["start"] = 0.0
        timeline[-1]["end"]  = round(total_duration, 2)
        for i in range(1, len(timeline)):
            timeline[i]["start"] = timeline[i - 1]["end"]
            if timeline[i]["end"] <= timeline[i]["start"]:
                timeline[i]["end"] = timeline[i]["start"] + 0.5

    return timeline


# ─────────────────────────────────────────────
# 3. CAPTION CHUNKER
#    Ráp script tokens + timings tuần tự → chunk
# ─────────────────────────────────────────────
def build_captions(
    script_lines: list[str],
    timings: list[dict],
    segments: list[dict],
    total_duration: float,
    max_words:    int   = CAPTION_MAX_WORDS,
    max_chars:    int   = CAPTION_MAX_CHARS,
    max_duration: float = CAPTION_MAX_DURATION,
    min_words:    int   = CAPTION_MIN_WORDS,
) -> list[dict]:

    BREAK_PUNCTUATION = {',', '—', ';', ':'}

    def is_natural_break(token: str) -> bool:
        return token[-1] in BREAK_PUNCTUATION if token else False

    # Flatten tất cả script tokens, giữ nguyên thứ tự
    all_script_tokens = []
    for line_idx, line in enumerate(script_lines):
        for tok in line.split():
            all_script_tokens.append({"display": tok, "line_idx": line_idx})

    total_script = len(all_script_tokens)
    total_timing = len(timings)

    # Ráp timing vào từng script token theo tỉ lệ vị trí
    mapped: list[dict] = []
    for i, tok in enumerate(all_script_tokens):
        # Tìm timing index tương ứng theo tỉ lệ
        t_idx = round(i / total_script * total_timing)
        t_idx = min(t_idx, total_timing - 1)
        t     = timings[t_idx]
        mapped.append({
            "display":  tok["display"],
            "line_idx": tok["line_idx"],
            "start":    t["start"],
            "end":      t["end"],
        })

    # Đảm bảo timing tăng dần (không bị giật lùi)
    for i in range(1, len(mapped)):
        if mapped[i]["start"] < mapped[i - 1]["end"]:
            mapped[i]["start"] = mapped[i - 1]["end"]
        if mapped[i]["end"] < mapped[i]["start"]:
            mapped[i]["end"] = mapped[i]["start"]

    captions: list[dict] = []

    def flush(chunk: list[dict]) -> None:
        if not chunk:
            return
        if len(chunk) < min_words and captions:
            prev = captions[-1]
            prev["text"] += " " + " ".join(t["display"] for t in chunk)
            prev["end"]   = round(chunk[-1]["end"], 2)
            prev["words"] += [
                {"word": t["display"], "start": t["start"], "end": t["end"]}
                for t in chunk
            ]
        else:
            captions.append({
                "text":  " ".join(t["display"] for t in chunk),
                "start": round(chunk[0]["start"], 2),
                "end":   round(chunk[-1]["end"],  2),
                "words": [
                    {"word": t["display"], "start": t["start"], "end": t["end"]}
                    for t in chunk
                ],
            })

    chunk: list[dict] = []
    current_line = 0

    for idx, token in enumerate(mapped):
        # Flush khi sang dòng script mới (segment boundary)
        if token["line_idx"] != current_line:
            flush(chunk)
            chunk        = []
            current_line = token["line_idx"]

        remaining      = sum(1 for t in mapped[idx + 1:] if t["line_idx"] == current_line)
        candidate      = chunk + [token]
        candidate_text = " ".join(t["display"] for t in candidate)
        candidate_dur  = candidate[-1]["end"] - candidate[0]["start"]

        hard_over = (
            len(candidate) > max_words
            or len(candidate_text) > max_chars
            or candidate_dur > max_duration
        )
        natural_break = (
            len(chunk) >= min_words
            and is_natural_break(token["display"])
            and remaining >= min_words
        )

        if (hard_over or natural_break) and chunk:
            if natural_break and not hard_over:
                chunk.append(token)
                flush(chunk)
                chunk = []
            else:
                flush(chunk)
                chunk = [token]
        else:
            chunk.append(token)

    flush(chunk)
    return captions


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python build_timeline.py <audio_file> [script_file]")
        sys.exit(1)

    audio_path  = sys.argv[1]
    script_file = sys.argv[2] if len(sys.argv) > 2 else "script.txt"
    base_name   = os.path.splitext(os.path.basename(audio_path))[0]

    with open(script_file, "r", encoding="utf-8") as f:
        script_lines = [line.strip() for line in f if line.strip()]

    total_script_words = sum(len(l.split()) for l in script_lines)
    print(f"\n📝 Script: {len(script_lines)} dòng, {total_script_words} từ")
    for i, line in enumerate(script_lines):
        print(f"  [{i+1:02d}] ({len(line.split()):2d} từ) {line}")

    # Step 1 — chỉ lấy timing
    timings, total_duration = transcribe(audio_path)

    # Step 2 — segment.json
    segments = build_segments(script_lines, timings, total_duration)

    print(f"\n📄 Segments ({len(segments)}):")
    for i, s in enumerate(segments):
        print(f"  [{i+1:02d}] {s['start']:6.2f}-{s['end']:6.2f}s  "
              f"({len(s['text'].split()):2d} từ)  {s['text'][:60]}")

    seg_path = f"{base_name}.json"
    with open(seg_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)
    print(f"    → {seg_path}")

    # Step 3 — captions.json
    captions = build_captions(script_lines, timings, segments, total_duration)

    print(f"\n💬 Captions ({len(captions)}):")
    for c in captions:
        print(f"  {c['start']:6.2f}-{c['end']:6.2f}s  "
              f"({len(c['words']):2d} từ, {c['end']-c['start']:.1f}s)  {c['text']}")

    cap_path = f"{base_name}_captions.json"
    with open(cap_path, "w", encoding="utf-8") as f:
        json.dump(captions, f, ensure_ascii=False, indent=2)
    print(f"    → {cap_path}")

    print("\n✅ Hoàn thành!")