import wave

def graft_audio(input_files, output_file):
    """
    Grafts multiple WAV audio files into a single WAV output file.

    Args:
        input_files (list): A list of paths to the input WAV files.
        output_file (str): The path to the output WAV file.
    """
    data = []
    params = None

    for file in input_files:
        try:
            with wave.open(file, 'rb') as w:
                if params is None:
                    params = w.getparams()
                data.append(w.readframes(w.getnframes()))
        except FileNotFoundError:
            print(f"Error: Input file not found at {file}. Skipping this file.")
            continue
        except wave.Error as e:
            print(f"Error reading {file}: {e}. Skipping this file.")
            continue

    if not data:
        print("No valid audio data to graft. Exiting.")
        return

    try:
        with wave.open(output_file, 'wb') as w:
            w.setparams(params)
            for frame in data:
                w.writeframes(frame)
        print(f"Đã nối các file thành công vào {output_file}!")
    except Exception as e:
        print(f"Error writing output file {output_file}: {e}")

if __name__ == "__main__":
    num_files = int(input("Nhập số lượng file audio muốn ghép: "))
    input_files = []
    for i in range(num_files):
        file_name = input(f"Nhập tên file audio thứ {i+1}: ")
        input_files.append(file_name)
    
    output_file = input("Nhập tên file audio đầu ra: ")

    graft_audio(input_files, output_file)
