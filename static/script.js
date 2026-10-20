const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fungsi untuk menambahkan pesan ke layar
function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar', sender === 'user' ? 'user-avatar' : 'ai-avatar');
    avatarDiv.textContent = sender === 'user' ? 'ME' : 'AI';

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.innerHTML = text.replace(/\n/g, '<br>'); // Menangani enter/baris baru

    if (sender === 'user') {
        messageDiv.appendChild(textDiv);
        messageDiv.appendChild(avatarDiv);
    } else {
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(textDiv);
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll ke bawah
}
// Fungsi utama mengirim pesan ke backend Python (Versi Streaming)
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Tampilkan pesan user di layar
    appendMessage('user', text);
    userInput.value = '';

    // 2. Siapkan tempat kosong untuk AI mengetik (Bubble Chat AI)
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'ai-message');
    
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar', 'ai-avatar');
    avatarDiv.textContent = 'AI';

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.innerHTML = '<span style="color:var(--text-muted);">Menerjemahkan...</span>';

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(textDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Kirim permintaan ke server
        const response = await fetch('/get_response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        // 4. Proses membaca data mengalir (Streaming)
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let isFirstChunk = true;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break; // Berhenti jika AI sudah selesai bicara

            const chunk = decoder.decode(value, { stream: true });
            
            // Hapus teks "Menerjemahkan..." saat kata pertama masuk
            if (isFirstChunk) {
                textDiv.innerHTML = ''; 
                isFirstChunk = false;
            }
            
            // Tambahkan kata baru dan ubah format "enter" menjadi <br>
            textDiv.innerHTML += chunk.replace(/\n/g, '<br>');
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll dinamis
        }

    } catch (error) {
        textDiv.innerHTML = 'Maaf, terjadi kesalahan jaringan pada server.';
        console.error(error);
    }
}
// Event Listener untuk klik tombol atau tekan Enter
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
// ==========================================
// FITUR TAMBAHAN: OBROLAN BARU & TOMBOL CEPAT
// ==========================================

const quickPromptsContainer = document.getElementById('quick-prompts');
const promptButtons = document.querySelectorAll('.prompt-btn');
const newChatBtn = document.querySelector('.new-chat-btn');

// 1. Logika Tombol Cepat (Quick Prompts)
promptButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Ambil teks dari atribut data-text pada HTML
        const textToSend = button.getAttribute('data-text');
        
        // Masukkan ke kolom input dan langsung kirim
        userInput.value = textToSend;
        sendMessage();
        
        // Sembunyikan tombol cepat setelah mulai mengobrol
        quickPromptsContainer.style.display = 'none';
    });
});

// 2. Logika Tombol + Obrolan Baru
newChatBtn.addEventListener('click', () => {
    // Kosongkan layar chat dan kembalikan pesan sambutan awal
    chatBox.innerHTML = `
        <div class="message ai-message">
            <div class="avatar ai-avatar">AI</div>
            <div class="text">Ya'ahowu! Saya asisten pintar Li Ono Niha. Ada kalimat bahasa Indonesia yang ingin kamu terjemahkan ke bahasa Nias hari ini?</div>
        </div>
    `;
    
    // Munculkan kembali tombol cepat
    quickPromptsContainer.style.display = 'flex';
});

// Tambahan: Sembunyikan tombol cepat jika user mengetik manual lalu menekan enter/kirim
sendBtn.addEventListener('click', () => {
    quickPromptsContainer.style.display = 'none';
});
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        quickPromptsContainer.style.display = 'none';
    }
});
// ==========================================
// MENU RESPONSITF UNTUK HP
// ==========================================
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');

// Buka menu saat klik ☰
openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
});

// Tutup menu saat klik ×
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// Otomatis tutup menu kalau user klik "+ Obrolan Baru" di layar HP
newChatBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
});
