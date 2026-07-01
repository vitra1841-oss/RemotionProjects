from pydub import AudioSegment

def cut_audio(file_path, cut_type, time_x):
    """
    Cuts an audio file based on the specified type and time.

    Args:
        file_path (str): The path to the input audio file.
        cut_type (str): "start_to_x" to cut from the beginning to time_x,
                        "x_to_end" to cut from time_x to the end.
        time_x (float): The time in seconds for cutting.
    """
    try:
        sound = AudioSegment.from_wav(file_path)
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return

    time_x_ms = time_x * 1000  # Convert seconds to milliseconds

    if cut_type == "start_to_x":
        trimmed_sound = sound[:time_x_ms]
        print(f"Cắt từ đầu đến {time_x} giây thành công!")
    elif cut_type == "x_to_end":
        trimmed_sound = sound[time_x_ms:]
        print(f"Cắt từ {time_x} giây về sau thành công!")
    else:
        print("Invalid cut_type. Use 'start_to_x' or 'x_to_end'.")
        return

    trimmed_sound.export(file_path, format="wav")
    print(f"Đã lưu đè vào file {file_path}")

if __name__ == "__main__":
    file_path = input("Đường dẫn tệp audio cần cắt: ")
    cut_type = ""
    while cut_type not in ["start_to_x", "x_to_end"]:
        cut_type = input("Loại cắt (start_to_x hoặc x_to_end): ").lower()
        if cut_type not in ["start_to_x", "x_to_end"]:
            print("Loại cắt không hợp lệ. Vui lòng nhập 'start_to_x' hoặc 'x_to_end'.")
    
    time_x_str = input("Thời gian X (tính bằng giây): ")
    try:
        time_x = float(time_x_str)
    except ValueError:
        print("Thời gian X không hợp lệ. Vui lòng nhập một số.")
        exit()

    cut_audio(file_path, cut_type, time_x)
