// ========================================
// KONFIGURASI SUPABASE
// ========================================

const SUPABASE_URL = "MASUKKAN_URL_SUPABASE";
const SUPABASE_ANON_KEY = "MASUKKAN_ANON_KEY_SUPABASE";


// ========================================
// INFORMASI DATABASE
// ========================================

const DATABASE = {
    pelanggan: "pelanggan",
    pemesanan: "pemesanan",
    transaksiKas: "transaksi_kas"
};


// ========================================
// INFORMASI SISTEM
// ========================================

const APP_NAME = "Sistem Akuntansi Kas dan Pemesanan Photobox";

console.log(APP_NAME);
console.log("Supabase URL:", SUPABASE_URL);
console.log("Database siap digunakan.");