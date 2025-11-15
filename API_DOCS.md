# SendPick API Reference

Dokumentasi ini mencakup seluruh endpoint REST API untuk dua klien utama:

1. **Web Dashboard (Admin Panel)** – menggunakan prefix dasar `http{s}://{host}/api`.
2. **Driver Mobile App** – menggunakan prefix `http{s}://{host}/api/driver`.

Seluruh endpoint mengembalikan respons JSON dan dilindungi oleh Laravel Sanctum kecuali login publik yang disebutkan secara eksplisit.

---

## 1. Autentikasi & Otorisasi

### 1.1 Admin Panel
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login admin/user. Mengembalikan bearer token Sanctum. |
| `POST` | `/api/auth/logout` | Logout dan mencabut token aktif. *(Protected)* |
| `GET` | `/api/auth/saya` | Detail akun yang sedang login. *(Protected)* |

Authorization: kirim header `Authorization: Bearer {token}` untuk seluruh permintaan di grup terlindungi.

### 1.2 Driver App
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/driver/login` | Login driver mobile. Mengembalikan token `mobile-driver-token`. |
| `POST` | `/api/driver/logout` | Logout driver (butuh token). |

Token driver juga memakai Sanctum; simpan sebagai bearer token untuk setiap request berikutnya.

---

## 2. Web Dashboard API

Semua endpoint berikut berada di bawah grup `Route::middleware('auth:sanctum')` sehingga memerlukan bearer token admin.

### 2.1 Profil
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/profile` | Mendapatkan profil admin saat ini. |
| `PUT` | `/api/profile` | Memperbarui profil sendiri. |

### 2.2 Manajemen Admin
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/admins/roles` | Daftar role yang tersedia untuk admin. |
| `GET` | `/api/admins` | List admin. |
| `POST` | `/api/admins` | Membuat admin baru. |
| `GET` | `/api/admins/{userId}` | Detail admin. |
| `PUT` | `/api/admins/{userId}` | Memperbarui admin. |
| `DELETE` | `/api/admins/{userId}` | Menghapus admin. |

### 2.3 Role & Permission
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/roles/available` | Role yang dapat ditugaskan. |
| `GET` | `/api/roles/stats` | Statistik penggunaan role. |
| `GET` | `/api/roles` | List role. |
| `POST` | `/api/roles` | Membuat role baru. |
| `GET` | `/api/roles/{roleId}` | Detail role. |
| `PUT` | `/api/roles/{roleId}` | Memperbarui role. |
| `DELETE` | `/api/roles/{roleId}` | Menghapus role. |
| *(Komentar di route menandakan opsi tambahan seperti bulk assign dapat diaktifkan bila dibutuhkan.)* |

### 2.4 Customers
RESTful CRUD melalui `/api/customers` dengan parameter `customerId`.

### 2.5 Drivers
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/drivers/available` | Driver tanpa assignment aktif. |
| CRUD | `/api/drivers` | Manajemen data driver (`driverId`). |

### 2.6 Vehicle Types
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/vehicle-types/active` | Vehicle type dengan status `Aktif`. |
| CRUD | `/api/vehicle-types` | Manajemen tipe kendaraan (`id`). |

### 2.7 Vehicles
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/vehicles/available` | Kendaraan siap assignment. |
| `PATCH` | `/api/vehicles/{vehicleId}/maintenance` | Update status maintenance. |
| CRUD | `/api/vehicles` | Manajemen kendaraan (`vehicleId`). |

### 2.8 Job Orders
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/job-orders/{jobOrderId}/assignments` | Menambah assignment ke job order. |
| `GET` | `/api/job-orders/{jobOrderId}/assignments` | Mengambil assignment job order. |
| CRUD | `/api/job-orders` | Manajemen job order (`jobOrderId`). |

### 2.9 Manifests
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/manifests/{manifestId}/available-job-orders` | Job order yang bisa ditambahkan. |
| `POST` | `/api/manifests/{manifestId}/add-job-orders` | Tambah job ke manifest. |
| `POST` | `/api/manifests/{manifestId}/remove-job-orders` | Hapus job dari manifest. |
| CRUD | `/api/manifests` | Manajemen manifest (`manifestId`). |

### 2.10 Delivery Orders
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/api/delivery-orders/{doId}/assign-driver` | Tetapkan driver & kendaraan. |
| `POST` | `/api/delivery-orders/{doId}/complete` | Menandai DO selesai. |
| CRUD | `/api/delivery-orders` | Manajemen delivery order (`doId`). |

### 2.11 Invoices
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/invoices/available-sources` | Sumber pembuatan invoice baru. |
| `POST` | `/api/invoices/{invoiceId}/record-payment` | Mencatat pembayaran invoice. |
| CRUD | `/api/invoices` | Manajemen invoice (`invoiceId`). |

### 2.12 GPS Tracking (Admin)
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/gps/current` | Lokasi real time seluruh driver. |
| `GET` | `/api/gps/tracking-history` | Riwayat tracking untuk order tertentu (gunakan query params). |
| `GET` | `/api/gps/live/{doId}` | Live tracking untuk delivery order tertentu. |

### 2.13 Dashboard & Reporting
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Data agregat untuk dashboard admin. |
| `GET` | `/api/reports/sales` | Laporan penjualan. |
| `GET` | `/api/reports/financial` | Laporan finansial. |
| `GET` | `/api/reports/operational` | Laporan operasional. |
| `GET` | `/api/reports/customer-analytics` | Analitik pelanggan. |
| `GET` | `/api/reports/sales/export` | Download laporan penjualan (Excel/CSV). |
| `GET` | `/api/reports/financial/export` | Download laporan finansial. |
| `GET` | `/api/reports/operational/export` | Download laporan operasional. |
| `GET` | `/api/reports/customer-analytics/export` | Download laporan analitik pelanggan. |

---

## 3. Driver Mobile App API

Prefix dasar: `/api/driver`. Semua endpoint (kecuali login) memerlukan header `Authorization: Bearer {driver_token}`.

### 3.1 Autentikasi & Profil
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/login` | Login driver. Body: `email`, `password`. |
| `POST` | `/logout` | Logout driver. |
| `GET` | `/profile` | Profil dan statistik driver (total order, delivered, estimasi jarak). |
| `PUT` | `/status` | Ubah status driver (`Available`, `On Duty`, `Off Duty`, `Tidak Aktif`). |

### 3.2 Job Management
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/jobs` | Daftar job aktif & job pending. |
| `GET` | `/jobs/{jobOrderId}` | Detail job lengkap, termasuk DO dan POD bila tersedia. |
| `POST` | `/jobs/{jobOrderId}/accept` | Menerima job pending. Opsional `vehicle_id`. |
| `POST` | `/jobs/{jobOrderId}/reject` | Menolak job. Opsional `reason`. |
| `PUT` | `/jobs/{jobOrderId}/status` | Update status job (`Processing`, `In Transit`, `Pickup Complete`, `At Destination`, `Delivered`). Opsional `notes`. |

### 3.3 Proof of Delivery
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/jobs/{jobOrderId}/pod` | Upload bukti pengantaran. Form data: `recipient_name` (required), `photo` (opsional, JPG/PNG ≤2MB), `notes` (opsional). Secara otomatis mengubah status job & DO menjadi `Delivered`. |

### 3.4 QR Code
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/scan-qr` | Memindai QR dan memprogres status job otomatis. Body: `qr_code_string`. |

### 3.5 GPS Location Updates
| Method | Path | Deskripsi |
| --- | --- | --- |
| `POST` | `/gps/bulk` | Batch upload titik GPS. Body (JSON):<br>`locations` → array berisi objek `{ lat, lng, sent_at, order_id?, vehicle_id? }`. Field `lat`, `lng`, `sent_at` wajib. Otomatis menyimpan `last_lat` & `last_lng` driver. |

### 3.6 Riwayat & Statistik
| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/history` | Riwayat job yang sudah selesai. Query opsional: `start_date`, `end_date` (default 30 hari terakhir). |
| `GET` | `/history/stats` | KPI driver: total delivered, total berat, estimasi jarak, dsb. |

---

## 4. Catatan Umum

- **Versi API**: Saat ini tanpa versioning eksplisit. Gunakan branch/tag Git untuk tracking perubahan.
- **Format Tanggal/Waktu**: Laravel default (`Y-m-d H:i:s` atau ISO-8601 pada beberapa field – lihat respons aktual).
- **Error Handling**: Validasi form akan mengembalikan HTTP `422` dengan struktur `{ message, errors }`. Kesalahan otentikasi menggunakan `401` atau `403`. Kesalahan server `500`.
- **File Upload**: Endpoint yang menerima file menggunakan storage disk `public`. Respons mengembalikan URL hasil `Storage::url(...)`.
- **Token Management**: Setiap login driver membuat token baru dengan masa berlaku 1 tahun. Pertimbangkan untuk mencabut token lama saat perlu.

Untuk contoh payload & respons lebih detail, lihat koleksi Postman `SendPick API.postman_collection.json` atau dokumentasi tambahan di repo.