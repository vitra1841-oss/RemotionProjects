import sys
import os
import json
import gc

from faster_whisper import WhisperModel

CAPTION_MAX_WORDS    = 5
CAPTION_MAX_CHARS    = 38
CAPTION_MAX_DURATION = 3.5
CAPTION_MIN_WORDS    = 2

BREAK_PUNCTUATION = {',', '—', ';', ':', '.', '!', '?'}
MATCH_THRESHOLD   = 0.5
GAP_PENALTY       = -0.3
TIME_WINDOW       = 4.0


def similarity(a: str, b: str) -> float:
    """Character-level similarity (0..1). Handles Vietnamese diacritics."""
    a_lower = a.lower().strip(",.!?;:—")
    b_lower = b.lower().strip(",.!?;:—")
    if not a_lower or not b_lower:
        return 0.0
    if a_lower == b_lower:
        return 1.0
    matches = sum(1 for ca, cb in zip(a_lower, b_lower) if ca == cb)
    return matches / max(len(a_lower), len(b_lower))


def transcribe(audio_path: str):
    """faster-whisper word_timestamps — keep text for alignment."""
    print("  [1] faster-whisper small word_timestamps...")
    model = WhisperModel("small", device="cpu", compute_type="int8")
    seg_gen, info = model.transcribe(audio_path, language="vi", word_timestamps=True)
    segments = list(seg_gen)

    wh_words = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                if w.end > w.start or (w.start == w.end and wh_words):
                    wh_words.append({
                        "text": w.word.strip(),
                        "start": round(w.start, 3),
                        "end": round(w.end, 3),
                    })

    print(f"       {len(wh_words)} word timestamps in {info.duration:.1f}s")
    if wh_words:
        print(f"       first: {wh_words[0]['start']:.2f}s \"{wh_words[0]['text']}\"  "
              f"last: {wh_words[-1]['end']:.2f}s \"{wh_words[-1]['text']}\"")
    del model
    gc.collect()
    return wh_words, info.duration


def flatten_script(script_lines: list[str]) -> list[dict]:
    tokens = []
    for li, line in enumerate(script_lines):
        for w in line.split():
            tokens.append({"word": w, "line_idx": li})
    return tokens


def align_script_to_whisper(
    script_tokens: list[dict],
    wh_words: list[dict],
    total_duration: float = 0,
) -> list[dict]:
    """
    Needleman-Wunsch with time-window constraint.
    Script word i can only match Whisper words within ±TIME_WINDOW of its
    expected position. This prevents matching across repeated/reordered sections.
    """
    n = len(script_tokens)
    m = len(wh_words)

    if m == 0:
        return [{"word": t["word"], "line_idx": t["line_idx"],
                 "start": round(i * 0.3, 3),
                 "end": round((i + 1) * 0.3, 3)}
                for i, t in enumerate(script_tokens)]

    if total_duration == 0 and wh_words:
        total_duration = wh_words[-1]["end"]

    avg_spacing = total_duration / max(n, 1)
    window_half = max(TIME_WINDOW, avg_spacing * 3)

    INVALID = -999.0

    # Build DP with time-window constraint
    dp = [[0.0] * (m + 1) for _ in range(n + 1)]
    trace = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i * GAP_PENALTY
        trace[i][0] = 2
    for j in range(m + 1):
        dp[0][j] = j * GAP_PENALTY
        trace[0][j] = 1

    for i in range(1, n + 1):
        expected_t = (i - 1) / n * total_duration
        for j in range(1, m + 1):
            wh_t = wh_words[j - 1]["start"]
            in_window = abs(wh_t - expected_t) <= window_half

            sim = similarity(script_tokens[i - 1]["word"], wh_words[j - 1]["text"])
            match_score = dp[i - 1][j - 1] + (sim if in_window else INVALID)
            insert_score = dp[i][j - 1] + GAP_PENALTY
            delete_score = dp[i - 1][j] + GAP_PENALTY

            if match_score >= insert_score and match_score >= delete_score:
                dp[i][j] = match_score
                trace[i][j] = 0
            elif insert_score >= delete_score:
                dp[i][j] = insert_score
                trace[i][j] = 1
            else:
                dp[i][j] = delete_score
                trace[i][j] = 2

    # Backtrace
    pairs = []
    i, j = n, m
    while i > 0 or j > 0:
        if trace[i][j] == 0:
            sim = similarity(script_tokens[i - 1]["word"], wh_words[j - 1]["text"])
            expected_t = (i - 1) / n * total_duration
            wh_t = wh_words[j - 1]["start"]
            in_window = abs(wh_t - expected_t) <= window_half
            pairs.append({
                "script_word": script_tokens[i - 1]["word"],
                "line_idx": script_tokens[i - 1]["line_idx"],
                "wh_word": wh_words[j - 1] if in_window else None,
                "sim": sim if in_window else 0,
            })
            i -= 1
            j -= 1
        elif trace[i][j] == 1:
            j -= 1
        else:
            pairs.append({
                "script_word": script_tokens[i - 1]["word"],
                "line_idx": script_tokens[i - 1]["line_idx"],
                "wh_word": None,
                "sim": 0,
            })
            i -= 1

    pairs.reverse()

    # Assign timing
    match_count = sum(1 for p in pairs if p["wh_word"] is not None)
    print(f"  [2] NW alignment: {n} script ↔ {m} Whisper → {match_count} matched, "
          f"{n - match_count} unmatched")
    for p in pairs[:8]:
        wh_str = f"{p['wh_word']['start']:.1f}s" if p["wh_word"] else "INTERP"
        print(f"       \"{p['script_word']:<14}\" sim={p['sim']:.2f} → {wh_str}")

    result = _interpolate_timing(pairs, wh_words)
    return result


def _interpolate_timing(pairs: list[dict], wh_words: list[dict]) -> list[dict]:
    """Assign timing: matched → Whisper, unmatched → interpolate neighbors."""
    result = []
    last_time = wh_words[0]["start"] if wh_words else 0.0

    for i, p in enumerate(pairs):
        if p["wh_word"] is not None:
            tw = p["wh_word"]
            result.append({
                "word": p["script_word"],
                "line_idx": p["line_idx"],
                "start": tw["start"],
                "end": tw["end"],
            })
            last_time = tw["end"]
        else:
            prev_end = last_time
            next_start = None
            for k in range(i + 1, len(pairs)):
                if pairs[k]["wh_word"] is not None:
                    next_start = pairs[k]["wh_word"]["start"]
                    break
            if next_start is not None:
                est_end = prev_end + (next_start - prev_end) / 2
            else:
                est_end = prev_end + 0.3
            result.append({
                "word": p["script_word"],
                "line_idx": p["line_idx"],
                "start": round(prev_end, 3),
                "end": round(est_end, 3),
            })
            last_time = est_end

    return result


def build_segments(words: list[dict]) -> list[dict]:
    if not words:
        return []
    segs = []
    prev = words[0]["line_idx"]
    line_words = []
    for w in words:
        if w["line_idx"] != prev:
            segs.append({
                "text": " ".join(t["word"] for t in line_words),
                "start": round(line_words[0]["start"], 2),
                "end": round(line_words[-1]["end"], 2),
            })
            line_words = []
            prev = w["line_idx"]
        line_words.append(w)
    if line_words:
        segs.append({
            "text": " ".join(t["word"] for t in line_words),
            "start": round(line_words[0]["start"], 2),
            "end": round(line_words[-1]["end"], 2),
        })
    return segs


def build_captions(
    words: list[dict],
    max_w:    int   = CAPTION_MAX_WORDS,
    max_c:    int   = CAPTION_MAX_CHARS,
    max_d:    float = CAPTION_MAX_DURATION,
    min_w:    int   = CAPTION_MIN_WORDS,
) -> list[dict]:

    def is_break(tok):
        return tok[-1] in BREAK_PUNCTUATION if tok else False

    caps = []

    def flush(chunk):
        if not chunk:
            return
        objs = [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in chunk]
        if len(chunk) < min_w and caps:
            prev = caps[-1]
            prev["text"] += " " + " ".join(w["word"] for w in chunk)
            prev["end"] = round(chunk[-1]["end"], 2)
            prev["words"].extend(objs)
        else:
            caps.append({
                "text": " ".join(w["word"] for w in chunk),
                "start": round(chunk[0]["start"], 2),
                "end": round(chunk[-1]["end"], 2),
                "words": objs,
            })

    chunk = []
    cur_line = words[0]["line_idx"] if words else 0

    for idx, w in enumerate(words):
        if w["line_idx"] != cur_line:
            flush(chunk)
            chunk.clear()
            cur_line = w["line_idx"]

        candidate = chunk + [w]
        cand_text = " ".join(t["word"] for t in candidate)
        cand_dur = candidate[-1]["end"] - candidate[0]["start"]

        hard = len(candidate) > max_w or len(cand_text) > max_c or cand_dur > max_d
        rem = sum(1 for t in words[idx + 1:] if t["line_idx"] == cur_line)
        brk = len(chunk) >= min_w and is_break(w["word"]) and rem >= min_w

        if (hard or brk) and chunk:
            if brk and not hard:
                chunk.append(w)
                flush(chunk)
                chunk.clear()
            else:
                flush(chunk)
                chunk.clear()
                chunk.append(w)
        else:
            chunk.append(w)

    flush(chunk)
    return caps


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python build_timeline.py <audio_file> [script_file]")
        sys.exit(1)

    audio_path  = sys.argv[1]
    script_file = sys.argv[2] if len(sys.argv) > 2 else "script.txt"
    
    audio_dir = os.path.dirname(audio_path)
    base_name = os.path.splitext(os.path.basename(audio_path))[0]
    
    output_base_path = os.path.join(audio_dir, base_name)

    with open(script_file, "r", encoding="utf-8") as f:
        script_lines = [line.strip() for line in f if line.strip()]

    total_sw = sum(len(l.split()) for l in script_lines)
    print(f"\nScript: {len(script_lines)} dong, {total_sw} tu")
    for i, line in enumerate(script_lines):
        print(f"  [{i+1:02d}] ({len(line.split()):2d} tu)  {line}")

    wh_words, total_duration = transcribe(audio_path)
    script_tokens = flatten_script(script_lines)

    words = align_script_to_whisper(script_tokens, wh_words, total_duration)

    segments = build_segments(words)
    captions = build_captions(words)

    print(f"\nSegments ({len(segments)}):")
    for s in segments:
        print(f"  {s['start']:6.2f}-{s['end']:6.2f}s  {s['text'][:60]}")

    with open(f"{output_base_path}.json", "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)
    print(f"  -> {output_base_path}.json")

    print(f"\nCaptions ({len(captions)}):")
    for c in captions:
        print(f"  {c['start']:6.2f}-{c['end']:6.2f}s  ({len(c['words']):2d} w)  {c['text'][:60]}")

    with open(f"{output_base_path}_captions.json", "w", encoding="utf-8") as f:
        json.dump(captions, f, ensure_ascii=False, indent=2)
    print(f"  -> {base_name}_captions.json")
    print("Done!")
