from flask import Flask, render_template, request, Response
from core.ai_service import generate_response_stream # Panggil fungsi stream

# Menjadikan folder 'static' sebagai tempat file HTML, CSS, dan JS
app = Flask(__name__, template_folder='static', static_folder='static')

# 1. Route Halaman Utama (Chat App)
@app.route("/")
def home():
    return render_template("index.html")

# 2. Route Halaman Login (BARU)
@app.route("/login")
def login_page():
    return render_template("login.html")

# 3. Route API untuk AI Stream
@app.route("/get_response", methods=["POST"])
def get_bot_response():
    user_text = request.json.get("message")
    
    # Membuat fungsi generator untuk menyalurkan kata per kata
    def generate():
        if user_text:
            for chunk in generate_response_stream(user_text):
                yield chunk
        else:
            yield "Pesan kosong tidak dapat diproses."

    # Mimetype text/plain memastikan teks langsung dibaca browser
    return Response(generate(), mimetype='text/plain')

if __name__ == "__main__":
    print("=======================================")
    print("🚀 Server Li Ono Niha AI Berjalan!")
    print("💬 Halaman Chat : http://127.0.0.1:5000/")
    print("🔐 Halaman Login: http://127.0.0.1:5000/login")
    print("=======================================")
    app.run(debug=True)
    import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)