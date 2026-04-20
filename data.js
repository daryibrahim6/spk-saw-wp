// ===== DATA SAW: PEMILIHAN PAKET UMROH =====
const sawTemplateData = [
    ["Alternatif", "Harga Paket (Juta Rp)", "Durasi (Hari)", 
     "Jarak Hotel ke Masjid (Km)", "Fasilitas Hotel (bintang)", 
     "Rating Maskapai (1-5)", "Muthawif (1-5)"],
    ["Bobot", 0.3, 0.2, 0.2, 0.15, 0.1, 0.05],
    ["Tipe", "cost", "benefit", "cost", "benefit", "benefit", "benefit"],
    ["Paket Arminareka", 28.5, 12, 0.8, 4, 4, 5],
    ["Paket Al-Hijaz Tour", 25, 9, 1.5, 3, 4, 4],
    ["Paket Muhibbah Travel", 32, 14, 0.5, 5, 5, 5],
    ["Paket Patuna Mekar", 22.5, 9, 2, 3, 3, 3],
    ["Paket Wahana Mitra", 30, 12, 1, 4, 4, 4],
    ["Paket Safari Suci", 27, 10, 1.2, 4, 3, 4],
    ["Paket Lintas Imara", 35, 14, 0.3, 5, 5, 5]
];

// ===== DATA WP: PEMILIHAN JURUSAN KULIAH =====
const wpTemplateData = [
    ["Alternatif", "C1 Biaya/Sem (Juta Rp)", "C2 Akreditasi (1-5)", 
     "C3 Prospek Kerja (1-5)", "C4 Passing Grade (poin)", 
     "C5 Fasilitas Kampus (1-5)", "C6 Jarak dari Rumah (Km)"],
    ["Bobot", 0.25, 0.2, 0.25, 0.15, 0.1, 0.05],
    ["Tipe", "cost", "benefit", "benefit", "benefit", "benefit", "cost"],
    ["Teknik Informatika", 6.5, 5, 5, 85, 5, 15],
    ["Sistem Informasi", 5.5, 4, 4, 78, 4, 10],
    ["Manajemen", 5, 4, 4, 72, 4, 20],
    ["Akuntansi", 5, 5, 4, 75, 4, 20],
    ["Teknik Elektro", 7, 4, 5, 82, 5, 25],
    ["Ilmu Komunikasi", 4.5, 3, 3, 65, 3, 12],
    ["Psikologi", 6, 4, 3, 70, 4, 18]
];

// Backward-compat alias — agar saw.js/table.js yang pakai templateData tetap jalan
const templateData = sawTemplateData;

// Active method state — 'saw' atau 'wp'
let activeMethod = 'saw';

// Helper: return dataset berdasarkan metode aktif
function getActiveTemplateData() {
    return activeMethod === 'saw' ? sawTemplateData : wpTemplateData;
}