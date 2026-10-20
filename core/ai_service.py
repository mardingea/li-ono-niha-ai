import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# 1. Muat konfigurasi dari file .env (typo "dontenv" sudah diperbaiki)
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# 2. Inisialisasi client Gemini (Versi Terbaru!)
client = genai.Client(api_key=API_KEY)

# 3. System Prompt (Instruksi khusus bahasa Nias)
system_prompt = "Mulai sekarang, kamu adalah Asisten Chatbot spesialis Bahasa Nias (Li Ono Niha). Tugas utamamu adalah mengajarkan kosa kata, menerjemahkan bahasa Indonesia ke bahasa Nias (atau sebaliknya), dan melestarikan budaya Nias. Gunakan bahasa yang ramah, sopan, dan edukatif. Jika pengguna menyapa, balas dengan sapaan khas Nias seperti 'Ya'ahowu'. Jangan memberikan informasi yang di luar topik bahasa dan budaya Nias."

# Membuka sesi percakapan dengan memori
chat_session = client.chats.create(
    model="gemini-3.5-flash-lite", # <--- UBAH BARIS INI
    config=types.GenerateContentConfig(
        system_instruction=system_prompt,
    )
)
# Ganti fungsi generate_response yang lama dengan versi streaming ini:
def generate_response_stream(user_message):
    try:
        # Gunakan fungsi send_message_stream agar data mengalir
        response = chat_session.send_message_stream(user_message)
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"Maaf, sistem mengalami gangguan: {str(e)}"