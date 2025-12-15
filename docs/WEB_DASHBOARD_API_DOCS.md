# Dokumentasi API Web Dashboard

Dokumentasi ini menyediakan referensi lengkap untuk endpoint API yang digunakan oleh Web Dashboard.

## URL Dasar (Base URL)
Semua request harus diawali dengan prefix `/api`.
Contoh: `http://localhost:8000/api/dashboard`

## Otentikasi
Sebagian besar endpoint memerlukan otentikasi menggunakan Bearer Token (Laravel Sanctum).
Sertakan token pada header `Authorization`:
`Authorization: Bearer <token-anda>`

### 1. Login
*   **Endpoint**: `POST /auth/login`
*   **Deskripsi**: Melakukan otentikasi user dan mendapatkan akses token.
*   **Akses**: Public

**Request Body:**
| Parameter | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `email` | string | Ya | Alamat email pengguna |
| `password` | string | Ya | Kata sandi pengguna |

**Respon (Sukses 200):**
```json
{
    "status": true,
    "message": "User Logged In Successfully",
    "token": "1|laravel_sanctum_token...",
    "user": {
        "id": 1,
        "name": "Nama Admin",
        "email": "admin@example.com",
        "role": "admin"
    }
}
```

### 2. Dapatkan Profil Saya
*   **Endpoint**: `GET /auth/saya`
*   **Deskripsi**: Mendapatkan detail pengguna yang sedang login.
*   **Akses**: Protected (Butuh Token)

### 3. Logout
*   **Endpoint**: `POST /auth/logout`
*   **Deskripsi**: Menghapus token yang sedang aktif (keluar dari sesi).
*   **Akses**: Protected

---

## Analitik Dashboard
Endpoint untuk tampilan utama dashboard.

### 1. Ringkasan Dashboard
*   **Endpoint**: `GET /dashboard`
*   **Deskripsi**: Mengambil data gabungan untuk dashboard, termasuk kartu KPI, grafik, dan aktivitas terbaru.
*   **Akses**: Protected

**Parameter Query:**
| Parameter | Tipe | Wajib | Default | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `time_frame` | string | Tidak | `month` | Filter data berdasarkan `day` (hari), `week` (minggu), `month` (bulan), atau `year` (tahun). |

**Respon (Sukses 200):**
```json
{
    "success": true,
    "data": {
        "kpi_cards": {
            "total_orders": { "value": 150, "growth": 12.5 },
            "otif_rate": 95.5,
            "active_deliveries": 12,
            "fleet_status": { "available_vehicles": 8, "total_vehicles": 10, ... }
        },
        "charts": {
            "orders_trend": [ { "period": "Jan-01", "orders": 5 }, ... ],
            "delivery_status": [ { "status": "Delivered", "count": 100 }, ... ],
            "vehicle_utilization": [ { "status": "Available", "count": 5, "percentage": 50 }, ... ]
        },
        "widgets": {
            "recent_activities": [ ... ],
            "todays_assignments": [ ... ]
        }
    }
}
```

---

## Job Orders (Pesanan Kerja)
Manajemen Job Order.

### 1. Daftar Job Order
*   **Endpoint**: `GET /job-orders`
*   **Deskripsi**: Mendapatkan daftar job order dengan opsi filter dan pagination.
*   **Akses**: Protected

**Parameter Query:**
| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `search` | string | Cari berdasarkan ID, deskripsi, alamat, atau nama pelanggan |
| `status` | string | Filter berdasarkan status (Created, Assigned, Pickup, Delivery, Completed, Cancelled) |
| `customer_id` | string | Filter berdasarkan pelanggan tertentu |
| `order_type` | string | Filter berdasarkan LTL atau FTL |
| `start_date` | date | Filter berdasarkan tanggal pengiriman mulai (YYYY-MM-DD) |
| `end_date` | date | Filter berdasarkan tanggal pengiriman akhir (YYYY-MM-DD) |
| `per_page` | int | Item per halaman (default: 15) |

### 2. Buat Job Order Baru
*   **Endpoint**: `POST /job-orders`
*   **Deskripsi**: Membuat job order baru.
*   **Akses**: Protected

**Request Body:**
| Parameter | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `customer_id` | string | Ya | ID Pelanggan |
| `order_type` | string | Ya | `LTL` atau `FTL` |
| `pickup_address` | string | Ya | Alamat lengkap penjemputan |
| `pickup_city` | string | Tidak | Nama kota penjemputan |
| `delivery_address` | string | Ya | Alamat lengkap pengiriman |
| `delivery_city` | string | Tidak | Nama kota pengiriman |
| `goods_desc` | string | Ya | Deskripsi barang |
| `goods_weight` | number | Ya | Berat dalam kg |
| `goods_volume` | number | Tidak | Volume dalam m3 |
| `ship_date` | date | Ya | Jadwal tanggal pengiriman |
| `order_value` | number | Tidak | Nilai barang/pesanan |

### 3. Detail Job Order
*   **Endpoint**: `GET /job-orders/{jobOrderId}`
*   **Deskripsi**: Mendapatkan informasi detail dari job order tertentu, termasuk penugasan dan riwayat.
*   **Akses**: Protected

### 4. Update Job Order
*   **Endpoint**: `PUT /job-orders/{jobOrderId}`
*   **Deskripsi**: Memperbarui detail job order tertentu.
*   **Akses**: Protected
*   **Catatan**: Kirim hanya field yang ingin diperbarui.

### 5. Penugasan Driver & Kendaraan (Assign)
*   **Endpoint**: `POST /job-orders/{jobOrderId}/assignments`
*   **Deskripsi**: Menugaskan driver dan kendaraan ke job order. Penugasan aktif sebelumnya pada order ini akan dibatalkan.
*   **Akses**: Protected

**Request Body:**
| Parameter | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `driver_id` | string | Ya | ID Driver |
| `vehicle_id` | string | Ya | ID Kendaraan |
| `status` | string | Ya | Harus `Active` atau `Standby` |
| `notes` | string | Tidak | Catatan tambahan untuk penugasan |

---

## Manifest
Manajemen Manifest (Pengelompokan Job Order untuk transportasi).

### 1. Daftar Manifest
*   **Endpoint**: `GET /manifests`
*   **Deskripsi**: Mendapatkan daftar manifest dengan pagination.
*   **Akses**: Protected

**Parameter Query:**
| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `search` | string | Cari berdasarkan ID, kota, atau ringkasan muatan |
| `status` | string | Filter status (Pending, In Transit, Arrived, Completed) |
| `origin_city` | string | Filter kota asal |
| `dest_city` | string | Filter kota tujuan |

### 2. Buat Manifest
*   **Endpoint**: `POST /manifests`
*   **Deskripsi**: Membuat manifest baru.
*   **Akses**: Protected

**Request Body:**
| Parameter | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `origin_city` | string | Ya | Kota Asal |
| `dest_city` | string | Ya | Kota Tujuan |
| `planned_departure` | date | Tidak | Rencana waktu keberangkatan |
| `job_order_ids` | array | Tidak | Array ID Job Order untuk dilampirkan sejak awal |
| `driver_id` | string | Tidak | ID Driver yang ditugaskan |
| `vehicle_id` | string | Tidak | ID Kendaraan yang ditugaskan |

### 3. Job Order yang Tersedia untuk Manifest
*   **Endpoint**: `GET /manifests/{manifestId}/available-job-orders`
*   **Deskripsi**: Mendapatkan daftar Job Order yang siap (Created/Assigned) dan BELUM masuk ke manifest manapun.
*   **Akses**: Protected
*   **Catatan**: Gunakan `available-job-orders` dengan ID dummy (misal: `new`) jika sedang membuat manifest baru.

### 4. Tambah Job Order ke Manifest
*   **Endpoint**: `POST /manifests/{manifestId}/add-job-orders`
*   **Deskripsi**: Menambahkan job order tertentu ke manifest yang sudah ada.
*   **Akses**: Protected

**Request Body:**
| Parameter | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `job_order_ids` | array | Ya | Daftar ID Job Order yang akan ditambahkan |

### 5. Hapus Job Order dari Manifest
*   **Endpoint**: `POST /manifests/{manifestId}/remove-job-orders`
*   **Deskripsi**: Menghapus job order dari manifest (mengembalikan statusnya menjadi 'Assigned').
*   **Akses**: Protected

**Request Body:**
| Parameter | Tipe | Wajib | Deskripsi |
| :--- | :--- | :--- | :--- |
| `job_order_ids` | array | Ya | Daftar ID Job Order yang akan dihapus |

### 6. Batalkan Manifest
*   **Endpoint**: `POST /manifests/{manifestId}/cancel`
*   **Deskripsi**: Membatalkan manifest dan melepaskan semua job order di dalamnya.
*   **Akses**: Protected

---

## Delivery Orders (Pesanan Pengiriman)
Manajemen Delivery Order (DO).

### 1. Daftar Delivery Order
*   **Endpoint**: `GET /delivery-orders`
*   **Akses**: Protected

### 2. Assign Driver ke DO
*   **Endpoint**: `POST /delivery-orders/{doId}/assign-driver`
*   **Deskripsi**: Menugaskan driver/kendaraan langsung ke Delivery Order.
*   **Akses**: Protected

### 3. Selesaikan Delivery Order
*   **Endpoint**: `POST /delivery-orders/{doId}/complete`
*   **Deskripsi**: Menandai DO sebagai terkirim/selesai.
*   **Akses**: Protected

---

## Sumber Daya (Master Data)

### Drivers (Pengemudi)
*   **GET /drivers**: Daftar semua driver.
*   **POST /drivers**: Buat driver baru.
*   **GET /drivers/{id}**: Detail driver.
*   **PUT /drivers/{id}**: Update driver.
*   **GET /drivers/available**: Dapatkan driver yang tidak sedang bertugas.

### Vehicles (Kendaraan)
*   **GET /vehicles**: Daftar semua kendaraan.
*   **POST /vehicles**: Buat kendaraan baru.
*   **GET /vehicles/{id}**: Detail kendaraan.
*   **PUT /vehicles/{id}**: Update kendaraan.
*   **GET /vehicles/available**: Dapatkan kendaraan yang tersedia.

### Customers (Pelanggan)
*   **GET /customers**: Daftar semua pelanggan.
*   **POST /customers**: Buat pelanggan baru.
*   **GET /customers/{id}**: Detail pelanggan.
*   **PUT /customers/{id}**: Update pelanggan.

### Invoices (Faktur)
*   **GET /invoices**: Daftar semua invoice.
*   **POST /invoices**: Buat invoice baru.
*   **GET /invoices/available-sources**: Dapatkan sumber (Job Order/DO) yang siap ditagihkan.
*   **POST /invoices/{id}/record-payment**: Mencatat pembayaran untuk invoice.

## Laporan (Read-Only)
*   **GET /reports/sales**: Analitik Penjualan.
*   **GET /reports/financial**: Analitik Keuangan.
*   **GET /reports/operational**: Analitik Operasional.
*   **GET /reports/customer-analytics**: Wawasan Pelanggan.

Setiap endpoint laporan menerima parameter query opsional `start_date` dan `end_date`.
