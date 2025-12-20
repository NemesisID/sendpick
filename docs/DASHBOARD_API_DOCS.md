# 💻 SendPick Web Dashboard - API Documentation

Base URL: `https://your-domain.com/api`

## 🔐 Authentication

Semua endpoint (kecuali Login) memerlukan **Bearer Token** di header request.

`Authorization: Bearer <token>`

Token didapatkan dari response login.

## 📋 Daftar Endpoint

| No | Method | Endpoint | Deskripsi |
| :--- | :--- | :--- | :--- |
| 1 | POST | `/auth/login` | Login admin/user |
| 2 | POST | `/auth/logout` | Logout |
| 3 | GET | `/auth/saya` | Get profil user login |
| 4 | GET | `/dashboard` | Get statistik dashboard utama |
| 5 | GET | `/job-orders` | Get daftar job order |
| 6 | POST | `/job-orders` | Buat job order baru |
| 7 | GET | `/job-orders/{id}` | Get detail job order |
| 8 | POST | `/job-orders/{id}/assignments` | Assign driver & kendaraan |
| 9 | POST | `/job-orders/{id}/cancel` | Batalkan job order |
| 10 | GET | `/manifests` | Get daftar manifest |
| 11 | POST | `/manifests` | Buat manifest baru |
| 12 | POST | `/manifests/{id}/add-job-orders` | Tambah job ke manifest |
| 13 | POST | `/manifests/{id}/remove-job-orders` | Hapus job dari manifest |
| 14 | PATCH | `/manifests/{id}/status` | Update status manifest |
| 15 | POST | `/manifests/{id}/cancel` | Batalkan manifest |
| 16 | GET | `/delivery-orders` | Get daftar delivery order |
| 17 | POST | `/delivery-orders/{id}/assign-driver` | Assign driver ke DO (Direct) |
| 18 | POST | `/delivery-orders/{id}/complete` | Selesaikan delivery order |
| 19 | POST | `/delivery-orders/{id}/cancel` | Batalkan delivery order |
| 20 | GET | `/invoices` | Get daftar invoice |
| 21 | POST | `/invoices` | Buat invoice baru |
| 22 | POST | `/invoices/{id}/record-payment` | Catat pembayaran |
| 23 | GET | `/gps/current` | Get lokasi driver realtime |
| 24 | GET | `/drivers` | Get daftar driver |
| 25 | GET | `/vehicles` | Get daftar kendaraan |
| 26 | GET | `/customers` | Get daftar customer |
| 27 | GET | `/reports/sales` | Get laporan penjualan |

---

## 1️⃣ Login

Otentikasi user (Admin/Staff) untuk mendapatkan access token.

### Request

`POST /api/auth/login`  
`Content-Type: application/json`

**Body:**

```json
{
  "email": "admin@sendpick.com",
  "password": "password"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@sendpick.com",
      "role": "super_admin"
    },
    "token": "1|abc123xyz...",
    "token_type": "Bearer"
  }
}
```

### Response Error

| Status Code | Response |
| :--- | :--- |
| 401 | `{"success": false, "message": "Email atau password salah"}` |

---

## 2️⃣ Logout

Menghapus token autentikasi.

### Request

`POST /api/auth/logout`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## 3️⃣ Get Profile (Saya)

Mendapatkan data user yang sedang login.

### Request
`GET /api/auth/saya`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@sendpick.com",
    "role": "super_admin"
  }
}
```

---

## 4️⃣ Dashboard Stats

Mendapatkan ringkasan statistik untuk halaman utama dashboard.

### Request
`GET /api/dashboard`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "metrics": {
      "total_orders": 150,
      "active_manifests": 12,
      "pending_deliveries": 8,
      "revenue_month": 45000000
    },
    "charts": {
      "orders_trend": [ ... ],
      "revenue_trend": [ ... ]
    }
  }
}
```

---

## 5️⃣ Get Job Orders

Mendapatkan daftar Job Order dengan filter.

### Request
`GET /api/job-orders`  
`Authorization: Bearer <token>`

**Query Parameters (Optional):**

| Parameter | Type | Deskripsi |
| :--- | :--- | :--- |
| `status` | string | Filter status (Pending, Assigned, ...)|
| `customer_id` | int | Filter by customer |
| `date_from` | date | Filter tanggal awal |
| `date_to` | date | Filter tanggal akhir |

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "job_order_id": "JO-2024-001",
      "customer_name": "PT Maju Jaya",
      "pickup_address": "Jakarta",
      "delivery_address": "Bandung",
      "status": "Pending",
      "goods_desc": "Elektronik",
      "weight": 100
    }
  ],
  "links": { ... },
  "meta": { ... }
}
```

---

## 6️⃣ Create Job Order

Membuat Job Order baru.

### Request
`POST /api/job-orders`  
`Authorization: Bearer <token>`  
`Content-Type: application/json`

**Body:**

```json
{
  "customer_id": 1,
  "order_type": "LTL",
  "pickup_address": "Jl. Raya No 1",
  "pickup_city": "Jakarta",
  "delivery_address": "Jl. Baru No 2",
  "delivery_city": "Bandung",
  "goods_desc": "Sparepart",
  "goods_weight": 50,
  "goods_volume": 0.5,
  "ship_date": "2024-12-20",
  "order_value": 1000000
}
```

**Field Wajib:** `customer_id`, `order_type`, `pickup_address`, `delivery_address`, `goods_desc`, `goods_weight`, `ship_date`.

### Response Success (201)

```json
{
  "success": true,
  "message": "Job Order berhasil dibuat",
  "data": {
    "job_order_id": "JO-2024-002",
    "status": "Pending"
  }
}
```

---

## 7️⃣ Get Job Order Detail

Mendapatkan detail lengkap satu Job Order.

### Request
`GET /api/job-orders/{jobOrderId}`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "job_order_id": "JO-2024-001",
    "customer": { "id": 1, "name": "PT Maju Jaya" },
    "pickup_info": { "address": "...", "contact": "..." },
    "delivery_info": { "address": "...", "contact": "..." },
    "cargo_info": { "desc": "...", "weight": 100 },
    "status": "Assigned",
    "assignment": {
      "driver_name": "Budi",
      "vehicle_plate": "B 1234 XX"
    },
    "history": [ ... ]
  }
}
```

---

## 8️⃣ Assign Job Order

Menugaskan Driver dan Kendaraan ke Job Order.

### Request
`POST /api/job-orders/{jobOrderId}/assignments`  
`Authorization: Bearer <token>`  
`Content-Type: application/json`

**Body:**

```json
{
  "driver_id": "DRV-001",
  "vehicle_id": "VH-001",
  "status": "Active",
  "notes": "Urgent delivery"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Driver berhasil ditugaskan",
  "data": {
    "assignment_id": 123,
    "status": "Active"
  }
}
```

---

## 9️⃣ Cancel Job Order

Membatalkan Job Order. Status DO terkait akan ikut Cancelled.

### Request
`POST /api/job-orders/{jobOrderId}/cancel`  
`Authorization: Bearer <token>`  
`Content-Type: application/json`

**Body:**

```json
{
  "reason": "Customer request cancel"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Job Order berhasil dibatalkan",
  "data": { "status": "Cancelled" }
}
```

---

## 🔟 Get Manifests

Mendapatkan daftar Manifest.

### Request
`GET /api/manifests`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "manifest_id": "MNF-2024-001",
      "origin_city": "Jakarta",
      "dest_city": "Surabaya",
      "status": "In Transit",
      "driver_name": "Budi",
      "total_weight": 2500
    }
  ]
}
```

---

## 1️⃣1️⃣ Create Manifest

Membuat Manifest baru.

### Request
`POST /api/manifests`  
`Authorization: Bearer <token>`  
`Content-Type: application/json`

**Body:**

```json
{
  "origin_city": "Jakarta",
  "dest_city": "Surabaya",
  "planned_departure": "2024-12-21 08:00:00",
  "driver_id": "DRV-001",
  "vehicle_id": "VH-101",
  "job_order_ids": ["JO-001", "JO-002"] 
}
```
*Note: `job_order_ids`, `driver_id`, `vehicle_id` opsional saat create.*

### Response Success (201)

```json
{
  "success": true,
  "message": "Manifest berhasil dibuat",
  "data": { "manifest_id": "MNF-2024-002" }
}
```

---

## 1️⃣2️⃣ Add Jobs to Manifest

Menambahkan Job Order ke Manifest yang sudah ada.

### Request
`POST /api/manifests/{manifestId}/add-job-orders`  
`Authorization: Bearer <token>`  
`Content-Type: application/json`

**Body:**

```json
{
  "job_order_ids": ["JO-003", "JO-004"]
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "2 Job Order berhasil ditambahkan ke Manifest"
}
```

---

## 1️⃣3️⃣ Remove Jobs from Manifest

Menghapus Job Order dari Manifest. Status Job kembali ke `Pending`/`Assigned`.

### Request
`POST /api/manifests/{manifestId}/remove-job-orders`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "job_order_ids": ["JO-003"]
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Job Order berhasil dihapus dari Manifest"
}
```

---

## 1️⃣4️⃣ Update Manifest Status

Mengupdate status perjalanan Manifest.

### Request
`PATCH /api/manifests/{manifestId}/status`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "status": "In Transit"
}
```
*Values: `Pending`, `In Transit`, `Arrived`, `Completed`.*

### Response Success (200)

```json
{
  "success": true,
  "message": "Status Manifest diperbarui"
}
```

---

## 1️⃣5️⃣ Cancel Manifest

Membatalkan Manifest. Job order di dalamnya akan dilepas.

### Request
`POST /api/manifests/{manifestId}/cancel`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "reason": "Truk rusak"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Manifest berhasil dibatalkan"
}
```

---

## 1️⃣6️⃣ Get Delivery Orders

Mendapatkan daftar Delivery Order.

### Request
`GET /api/delivery-orders`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "do_id": "DO-2024-001",
      "job_order_id": "JO-2024-001",
      "status": "In Transit",
      "driver_name": "Budi"
    }
  ]
}
```

---

## 1️⃣7️⃣ Assign Driver to DO

Assign driver langsung ke DO (biasanya untuk last-mile non-manifest).

### Request
`POST /api/delivery-orders/{doId}/assign-driver`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "driver_id": "DRV-002",
  "vehicle_id": "VH-005"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Driver berhasil di-assign ke DO"
}
```

---

## 1️⃣8️⃣ Complete Delivery Order

Menandai DO selesai (dokumen kembali).

### Request
`POST /api/delivery-orders/{doId}/complete`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "notes": "Dokumen lengkap"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Delivery Order selesai"
}
```

---

## 1️⃣9️⃣ Cancel Delivery Order

Membatalkan DO.

### Request
`POST /api/delivery-orders/{doId}/cancel`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "reason": "Salah alamat"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Delivery Order dibatalkan"
}
```

---

## 2️⃣0️⃣ Get Invoices

Mendapatkan daftar Invoice.

### Request
`GET /api/invoices`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "invoice_id": "INV-2024-001",
      "customer_name": "PT Maju Jaya",
      "amount": 1500000,
      "status": "Unpaid",
      "due_date": "2024-12-31"
    }
  ]
}
```

---

## 2️⃣1️⃣ Create Invoice

Membuat Invoice baru dari Job Order atau DO.

### Request
`POST /api/invoices`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "customer_id": 1,
  "source_type": "job_order", 
  "source_ids": ["JO-001", "JO-002"],
  "due_date": "2025-01-15",
  "notes": "Tagihan Desember"
}
```

### Response Success (201)

```json
{
  "success": true,
  "message": "Invoice berhasil dibuat",
  "data": { "invoice_id": "INV-2024-005" }
}
```

---

## 2️⃣2️⃣ Record Payment

Mencatat pembayaran invoice.

### Request
`POST /api/invoices/{invoiceId}/record-payment`  
`Authorization: Bearer <token>`

**Body:**

```json
{
  "amount_paid": 1500000,
  "payment_method": "Bank Transfer",
  "payment_date": "2024-12-20",
  "notes": "Lunas"
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Pembayaran berhasil dicatat"
}
```

---

## 2️⃣3️⃣ GPS Current Location

Mendapatkan lokasi realtime semua driver aktif.

### Request
`GET /api/gps/current`  
`Authorization: Bearer <token>`

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "driver_id": "DRV-001",
      "driver_name": "Budi",
      "lat": -6.200000,
      "lng": 106.816666,
      "last_updated": "2 mins ago"
    }
  ]
}
```

---

## 2️⃣4️⃣ Get Drivers (Master)

Mendapatkan daftar driver.

### Request
`GET /api/drivers`  
`Authorization: Bearer <token>`

---

## 2️⃣5️⃣ Get Vehicles (Master)

Mendapatkan daftar kendaraan.

### Request
`GET /api/vehicles`  
`Authorization: Bearer <token>`

---

## 2️⃣6️⃣ Get Customers (Master)

Mendapatkan daftar customer.

### Request
`GET /api/customers`  
`Authorization: Bearer <token>`

---

## 2️⃣7️⃣ Get Reports

Endpoint untuk laporan (Sales, Financial, Operational).

### Request
`GET /api/reports/sales`  
`GET /api/reports/financial`  
`GET /api/reports/operational`  
`Authorization: Bearer <token>`  

Query Params: `?start_date=2024-01-01&end_date=2024-01-31`

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "total_revenue": 500000000,
    "transaction_count": 50,
    "details": [...]
  }
}
```
