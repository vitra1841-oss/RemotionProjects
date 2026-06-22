import wave

# Danh sách các file cần ghép theo thứ tự
files_to_merge = ["tmpplbwhirg.wav", "tmpc6sexran.wav"]
output_file = "ket_qua_standard.wav"

data = []
for file in files_to_merge:
    with wave.open(file, 'rb') as w:
        # Lấy thông số cấu hình từ file đầu tiên làm chuẩn
        if not data:
            params = w.getparams()
        data.append(w.readframes(w.getnframes()))

# Ghi toàn bộ dữ liệu âm thanh vào file mới
with wave.open(output_file, 'wb') as w:
    w.setparams(params)
    for frame in data:
        w.writeframes(frame)

print("Đã nối file thành công bằng thư viện wave chuẩn!")
