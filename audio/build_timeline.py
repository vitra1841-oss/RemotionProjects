import sys
import os
import json
import difflib
import re

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
CAPTION_MAX_WORDS    = 8
CAPTION_MAX_CHARS    = 35
CAPTION_MAX_DURATION = 3.0   # seconds


# ─────────────────────────────────────────────
# 1. TRANSCRIBE → word timeline
# ─────────────────────────────────────────────
def transcribe(audio_path: str, script_lines: list[str]) -> tuple[list[dict], float]:
    """Run Faster-Whisper and return flat list of word dicts + total duration."""
    full_script_prompt = " ".join(script_lines)
    model = WhisperModel("medium", device="cpu", compute_type="int8")
    print("Đang chạy Whisper ở cấp độ từ (word-level)...")

    segments, info = model.transcribe(
        audio_path,
        language="vi",
        vad_filter=True,
        word_timestamps=True,
        initial_prompt=full_script_prompt,
        beam_size=5,           # default là 5, tăng lên không giúp nhiều
        temperature=0.0,       # tắt sampling, chỉ dùng greedy/beam
        condition_on_previous_text=True,  # dùng context câu trước
        no_speech_threshold=0.3,          # hạ xuống để ít bỏ từ hơn
        log_prob_threshold=-1.0,          # tắt filter bỏ segment có prob thấp
        compression_ratio_threshold=2.4,
    )

    words = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                cleaned = w.word.strip().lower().replace(".", "").replace(",", "").replace("?", "")
                if cleaned:
                    words.append({"word": cleaned, "start": w.start, "end": w.end})

    print(f"Whisper tìm thấy {len(words)} từ thực tế phát âm.")
    return words, info.duration


# ─────────────────────────────────────────────
# 2. SEGMENT BUILDER — dùng script.txt
# ─────────────────────────────────────────────
def build_segments(script_lines: list[str], words: list[dict], total_duration: float) -> list[dict]:
    """Align each script line to word timing via fuzzy matching."""
    timeline = []
    word_cursor = 0
    total_words = len(words)

    for line in script_lines:
        script_words = [
            w.lower().replace(".", "").replace(",", "").replace("?", "")
            for w in line.split()
        ]
        n = len(script_words)
        if n == 0 or total_words == 0:
            continue

        best_start = word_cursor
        best_end   = min(word_cursor + n, total_words)
        best_score = 0.0

        search = range(
            max(0, word_cursor - 5),
            min(word_cursor + n + 10, total_words),
        )
        for i in search:
            j = min(i + n, total_words)
            chunk = [w["word"] for w in words[i:j]]
            score = difflib.SequenceMatcher(None, script_words, chunk).ratio()
            if score > best_score:
                best_score = score
                best_start = i
                best_end   = j

        if best_start < total_words:
            start_time = words[best_start]["start"]
            end_time   = words[best_end - 1]["end"]
            word_cursor = best_end
        else:
            start_time = timeline[-1]["end"] if timeline else 0.0
            end_time   = start_time + 1.0

        timeline.append({
            "text":  line,
            "start": round(start_time, 2),
            "end":   round(end_time, 2),
        })

    # Fix overlaps & monotonicity
    if timeline:
        timeline[0]["start"] = 0.0
        timeline[-1]["end"]  = round(total_duration, 2)
        for i in range(1, len(timeline)):
            timeline[i]["start"] = timeline[i - 1]["end"]
            if timeline[i]["end"] <= timeline[i]["start"]:
                timeline[i]["end"] = timeline[i]["start"] + 0.5

    return timeline


# ─────────────────────────────────────────────
# 3. CAPTION CHUNKER — dùng word timeline trực tiếp
#    Không cắt ngang ranh giới segment
# ─────────────────────────────────────────────

CAPTION_MAX_WORDS    = 8
CAPTION_MAX_CHARS    = 38
CAPTION_MAX_DURATION = 3.5
CAPTION_MIN_WORDS    = 5   # chunk ít hơn này thì merge vào chunk trước


def build_captions(
    words: list[dict],
    segments: list[dict],
    max_words:    int   = CAPTION_MAX_WORDS,
    max_chars:    int   = CAPTION_MAX_CHARS,
    max_duration: float = CAPTION_MAX_DURATION,
    min_words:    int   = CAPTION_MIN_WORDS,
) -> list[dict]:

    BREAK_PUNCTUATION = {',', '—', ';', ':'}

    def is_natural_break(token: str) -> bool:
        return token[-1] in BREAK_PUNCTUATION if token else False

    def align_tokens(seg_words: list[dict], script_tokens: list[str]) -> list[dict]:
        whisper_clean = [
            w["word"].lower().replace(".", "").replace(",", "")
                     .replace("?", "").replace("!", "").replace("—", "")
            for w in seg_words
        ]
        script_clean = [
            t.lower().replace(".", "").replace(",", "")
                     .replace("?", "").replace("!", "").replace("—", "")
            for t in script_tokens
        ]

        matcher = difflib.SequenceMatcher(None, script_clean, whisper_clean, autojunk=False)
        opcodes = matcher.get_opcodes()
        result: list[dict] = [None] * len(script_tokens)

        for tag, i1, i2, j1, j2 in opcodes:
            if tag == 'equal':
                for si, wi in zip(range(i1, i2), range(j1, j2)):
                    result[si] = {
                        "display": script_tokens[si],
                        "start":   seg_words[wi]["start"],
                        "end":     seg_words[wi]["end"],
                    }
            elif tag == 'replace':
                t_start = seg_words[j1]["start"]
                t_end   = seg_words[j2 - 1]["end"]
                n_s = i2 - i1
                for k, si in enumerate(range(i1, i2)):
                    frac_s = k / n_s
                    frac_e = (k + 1) / n_s
                    result[si] = {
                        "display": script_tokens[si],
                        "start":   round(t_start + frac_s * (t_end - t_start), 3),
                        "end":     round(t_start + frac_e * (t_end - t_start), 3),
                    }

        # Fill slots còn None bằng interpolation từ neighbors
        n = len(result)
        for i in range(n):
            if result[i] is not None:
                continue
            left  = next((result[j] for j in range(i - 1, -1, -1) if result[j] is not None), None)
            right = next((result[j] for j in range(i + 1, n)      if result[j] is not None), None)
            if left and right:
                t = (left["end"] + right["start"]) / 2
                result[i] = {"display": script_tokens[i], "start": t, "end": t}
            elif left:
                result[i] = {"display": script_tokens[i], "start": left["end"], "end": left["end"]}
            elif right:
                result[i] = {"display": script_tokens[i], "start": right["start"], "end": right["start"]}
            else:
                result[i] = {"display": script_tokens[i], "start": 0.0, "end": 0.0}

        return result

    captions: list[dict] = []
    word_cursor = 0

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

    for seg in segments:
        script_tokens = seg["text"].split()

        # Đếm words thực tế Whisper trả về trong timing window của segment
        n_actual = sum(
            1 for w in words[word_cursor:]
            if w["start"] < seg["end"] + 0.15
        )
        n_actual = max(n_actual, 1)

        seg_words = words[word_cursor : word_cursor + n_actual]
        word_cursor += n_actual  # advance đúng số thực tế

        if not seg_words:
            captions.append({
                "text": seg["text"], "start": seg["start"],
                "end": seg["end"], "words": []
            })
            continue

        mapped = align_tokens(seg_words, script_tokens)
        chunk: list[dict] = []

        for idx, token in enumerate(mapped):
            remaining  = len(mapped) - idx - 1
            candidate  = chunk + [token]
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
                and remaining >= min_words  # chỉ cắt nếu phần còn lại đủ dài
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

        flush(chunk)  # flush phần còn lại, dù ngắn

    return captions


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python build_timeline.py <audio_file>")
        sys.exit(1)

    audio_path = sys.argv[1]
    base_name  = os.path.splitext(os.path.basename(audio_path))[0]

    # Read script
    with open("script.txt", "r", encoding="utf-8") as f:
        script_lines = [line.strip() for line in f if line.strip()]

    # Step 1 — word timeline
    words, total_duration = transcribe(audio_path, script_lines)

    # Step 2 — segment.json  (dùng script)
    segments = build_segments(script_lines, words, total_duration)
    seg_path = f"{base_name}.json"
    with open(seg_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)
    print(f"\n📄 Segment timeline → {seg_path}")
    for s in segments:
        print(f"  {s['start']:7.2f} -> {s['end']:7.2f}: {s['text']}")

    # Step 3 — caption.json  (dùng word timing, không cắt ngang segment)
    captions = build_captions(words, segments)
    cap_path = f"{base_name}_captions.json"
    with open(cap_path, "w", encoding="utf-8") as f:
        json.dump(captions, f, ensure_ascii=False, indent=2)
    print(f"\n💬 Caption chunks   → {cap_path}")
    for c in captions:
        print(f"  {c['start']:7.2f} -> {c['end']:7.2f}: {c['text']}")

    print("\n✅ Hoàn thành!")