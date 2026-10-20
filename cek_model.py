import os
from google import genai
from dotenv import load_dotenv

# Muat API Key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

print("Mencari model yang tersedia untuk API Key kamu...")
try:
    # Meminta daftar model langsung dari server Google
    for model in client.models.list():
        print(f"- {model.name}")
except Exception as e:
    print("Gagal mengambil daftar model:", e)