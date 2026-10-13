# Sistem Kas dan Pemesanan Photobox

Aplikasi web sederhana untuk membantu pengelolaan pemesanan photobox dan pencatatan keuangan usaha. Sistem ini mengintegrasikan data pelanggan, jadwal sesi, pilihan paket, serta transaksi kas dalam satu aplikasi agar pencatatan operasional lebih teratur.

## Tentang Aplikasi

Photobox Accounting System merupakan proyek pengembangan web berbasis sistem akuntansi yang berfokus pada pengelolaan pesanan pelanggan dan pencatatan arus kas usaha photobox.

Aplikasi ini dirancang untuk mempermudah pencatatan informasi pelanggan, pengaturan jadwal sesi photobox, serta dokumentasi transaksi pemasukan dan pengeluaran.

**Live Preview:** [Buka Aplikasi Photobox](https://afifarizqa.github.io/sistem-kas-dan-pemesanan-pelanggan-photobox/)

## Modul Aplikasi

* **Dashboard** — menampilkan ringkasan jumlah pelanggan, pemesanan, pemasukan, dan pengeluaran.
* **Data Pelanggan** — menyimpan informasi nama dan nomor telepon pelanggan.
* **Pemesanan Photobox** — mencatat tanggal pemesanan, jadwal sesi, jenis paket, harga, dan status pesanan.
* **Transaksi Kas** — mendokumentasikan pemasukan dan pengeluaran yang berkaitan dengan pemesanan.
* **Ringkasan Keuangan** — membantu memantau total pemasukan dan pengeluaran berdasarkan transaksi yang tercatat.

## Database dan Relasi

Database menggunakan PostgreSQL melalui Supabase dengan tiga entitas utama:

| Tabel           | Deskripsi                                                           |
| --------------- | ------------------------------------------------------------------- |
| `pelanggan`     | Menyimpan identitas pelanggan.                                      |
| `pemesanan`     | Menyimpan informasi booking, jadwal sesi, paket, harga, dan status. |
| `transaksi_kas` | Mencatat transaksi pemasukan dan pengeluaran kas.                   |

**Relasi antartabel:**

* Satu pelanggan dapat memiliki beberapa pemesanan.
* Satu pemesanan dapat memiliki beberapa transaksi kas.
* Setiap tabel memiliki primary key, sedangkan hubungan antartabel menggunakan foreign key.

## Teknologi

* **Frontend:** HTML5, CSS3, JavaScript vanilla
* **Database:** PostgreSQL
* **Backend Service:** Supabase
* **Hosting:** GitHub Pages

Aplikasi dikembangkan tanpa framework frontend agar kode tetap sederhana, mudah dipahami, dan mudah dikembangkan kembali.

## Struktur Proyek

```text
sistem-photobox/
├── backend/
│   ├── app.js
│   └── database.sql
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Panduan Menjalankan Aplikasi

1. Clone atau unduh repository ke komputer.
2. Buka folder proyek menggunakan Visual Studio Code.
3. Jalankan skrip `backend/database.sql` melalui SQL Editor di Supabase.
4. Masukkan Project URL dan anon/publishable key Supabase ke konfigurasi `frontend/script.js`.
5. Buka folder `frontend` menggunakan ekstensi Live Server.
6. Akses alamat lokal yang ditampilkan pada browser.

## Tujuan Pengembangan

Proyek ini bertujuan menerapkan konsep sistem informasi akuntansi dalam pengelolaan usaha jasa photobox, khususnya pada pencatatan pemesanan dan transaksi kas. Dengan struktur data yang sederhana, aplikasi diharapkan dapat membantu proses pencatatan operasional dan pemantauan keuangan secara lebih terorganisasi.
