1. Kebutuhan Method "Fix" untuk DriverAppController
Berdasarkan UI yang sudah dibuat, controller ini harus memiliki method-method berikut:

a. Method yang Sudah Kita Konfirmasi (Sesuai SRS & UI)
login(Request $request)

UI: Halaman "Login" (dari link di login v1.png).

Logika: Memvalidasi email dan password driver ke tabel drivers.

logout(Request $request)

UI: Tombol "Keluar" di halaman profil.png.

Logika: Menghapus token autentikasi driver.

getProfile(Request $request)

UI: Halaman profil.png.

Logika: Mengambil data driver yang login ("Ahmad", "+62 812...", "247 Total Order").

getJobs(Request $request)

UI: Halaman homepage.png.

Logika: Mengambil data "Order Aktif" (SP-2025-001) dan "Order Pending" yang ditampilkan di homepage.

getJobDetails(Request $request, $id)

UI: Halaman tab "Detail Order" (pod.png).

Logika: Mengambil semua detail order (Nama Penerima, Alamat, dll.) saat driver mengklik sebuah order.

updateJobStatus(Request $request, $id)

UI: Tombol "Selesaikan Orderan" di homepage.png dan tombol "Selesai" di pod (1).png.

Logika: Mengubah status order (misalnya dari 'Menuju Pickup' -> 'Barang Diambil', atau 'Menuju Lokasi Antar' -> 'Delivered').

uploadPod(Request $request, $id)

UI: Halaman tab "Proof of Delivery" (pod (1).png).

Logika: Menerima file foto/tanda tangan yang di-upload driver saat menekan "Selesai".

b. Method Baru (Teridentifikasi dari UI)
acceptOrder(Request $request, $id)

UI: Tombol checkmark (Setuju) di card "Order Pending" pada homepage.png.

Logika: Mengubah status order (misalnya dari 'Pending' menjadi 'Assigned'/'Diterima') dan menugaskannya ke driver tersebut.

rejectOrder(Request $request, $id)

UI: Tombol 'X' (Tolak) di card "Order Pending" pada homepage.png.

Logika: Menolak order, mungkin mengembalikannya ke pool agar bisa diambil driver lain.

getJobHistory(Request $request)

UI: Halaman histori.png.

Logika: Mengambil daftar order yang telah selesai (status = 'Completed') untuk driver yang login, beserta data ringkasannya.

getHistoryStats(Request $request)

UI: KPI Card "210 Order Terkirim" dan "143 kg Total Order" di histori.png.

Logika: Menghitung statistik total dari riwayat order driver.

updateDriverStatus(Request $request)

UI: Toggle "Status Driver" (online/offline) di profil.png.

Logika: Mengubah status driver di tabel drivers (misal: 'Aktif' <-> 'Tidak Aktif') agar Admin tahu driver tersebut siap menerima order atau tidak.

scanQrCode(Request $request)

UI: Halaman scan.png.

Logika: Menerima data dari QR code yang dipindai. Backend kemudian akan memvalidasi kode tersebut (misal: "QR-SP-2025-001") dan mungkin secara otomatis mengubah status order (misal: 'Menuju Pickup' -> 'Barang Diambil').

2. Pengaruh ke Database (Revisi Skema)
UI ini memunculkan dua (2) revisi penting pada skema database kita:

a. (KRITIS) Kebutuhan Kolom qr_code_string
Masalah: Halaman scan.png memperkenalkan fitur Scan QR Code.

Analisis: Agar fitur ini berfungsi, Admin di dashboard harus bisa men-generate QR code untuk sebuah order, dan Driver harus bisa memindainya.

Revisi Database: Anda wajib menambahkan kolom baru (misalnya, qr_code_string (VARCHAR, Unique, Nullable)) di tabel job_orders (atau delivery_orders) untuk menyimpan teks unik yang akan dijadikan QR code tersebut.
