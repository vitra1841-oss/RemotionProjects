from pydub import AudioSegment

file_path = "tmpplbwhirg.wav"

# Tải file audio lên
sound = AudioSegment.from_wav(file_path)

# Cắt giữ lại 8 giây đầu (từ millisecond 0 đến 8000)
# Hoặc dùng: sound[:-2000] để bỏ đi 2000ms cuối mà không cần biết tổng chiều dài
trimmed_sound = sound[:55000] 

# Ghi đè thẳng vào file cũ
trimmed_sound.export(file_path, format="wav")
print("Đã cắt bỏ 2s cuối và lưu đè thành công!")
