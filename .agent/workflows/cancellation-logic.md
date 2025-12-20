---
description: Logika pembatalan (Cancel) untuk Job Order, Manifest, dan Delivery Order
---

# Cancellation Logic - Blueprint Operasional

Dokumen ini menjelaskan logika pembatalan yang telah diimplementasikan untuk sistem logistik Sendpick.

## 1. Tabel Matriks Logika Pembatalan (Cheat Sheet)

| Aksi Admin (Source) | Status Akhir Job Order | Status Akhir Delivery Order | Status Akhir Manifest | Penjelasan Singkat |
|---------------------|------------------------|-----------------------------|-----------------------|--------------------|
| **Cancel Job Order** (Customer Batal) | ❌ CANCELLED (Order Mati) | ❌ CANCELLED (Hangus Otomatis) | ✅ TETAP/AMAN (Hanya kurangi muatan) | Induk (JO) mati, surat jalan (DO) otomatis tidak berlaku. Truk (Manifest) tetap jalan. |
| **Cancel Manifest** (Truk Batal Jalan) | 🔄 PENDING (Reset & Cari Truk Baru) | ❌ CANCELLED (Hangus Otomatis) | ❌ CANCELLED (Riwayat Batal) | Truk batal, JO diselamatkan (turun dari truk) untuk ikut truk lain. DO lama hangus. |
| **Cancel DO** (Salah Dokumen) | 🔄 PENDING (Reset & Buat DO Baru) | ❌ CANCELLED (Arsip Salah) | ✅ TETAP/AMAN (Hanya kurangi muatan) | Dokumen salah, JO dikembalikan ke antrean untuk dicetak ulang surat jalannya. |

---

## 2. API Endpoints

### Cancel Job Order
```
POST /api/job-orders/{jobOrderId}/cancel
```

**Request Body (Optional):**
```json
{
  "cancellation_reason": "Customer membatalkan pesanan"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Job Order berhasil dibatalkan",
  "data": {
    "job_order_id": "JO-20251219-XXXX",
    "status": "Cancelled",
    "cancelled_at": "2025-12-19T21:48:00Z",
    "cancellation_reason": "Customer membatalkan pesanan",
    "cancelled_delivery_orders": ["DO-20251219-XXXX"],
    "detached_from_manifests": [
      {
        "manifest_id": "MF-20251219-XXXX",
        "remaining_jobs": 2,
        "remaining_weight": 1500
      }
    ]
  }
}
```

**Guard Validasi:**
🛑 DILARANG Cancel Job Order jika Manifest sudah status "In Transit"

---

### Cancel Manifest
```
POST /api/manifests/{manifestId}/cancel
```

**Request Body (Optional):**
```json
{
  "cancellation_reason": "Armada mogok di jalan"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Manifest berhasil dibatalkan. 3 Job Order dikembalikan ke antrian, 2 Delivery Order dibatalkan.",
  "data": {
    "manifest_id": "MF-20251219-XXXX",
    "status": "Cancelled",
    "cancelled_at": "2025-12-19T21:48:00Z",
    "cancellation_reason": "Armada mogok di jalan",
    "reset_job_orders": ["JO-20251219-001", "JO-20251219-002"],
    "cancelled_delivery_orders": ["DO-20251219-001", "DO-20251219-002"]
  }
}
```

---

### Cancel Delivery Order
```
POST /api/delivery-orders/{doId}/cancel
```

**Request Body (Optional):**
```json
{
  "cancellation_reason": "Salah cetak tanggal pengiriman"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Delivery Order berhasil dibatalkan. Job Order dikembalikan ke antrian untuk dicetak ulang.",
  "data": {
    "do_id": "DO-20251219-XXXX",
    "status": "Cancelled",
    "cancelled_at": "2025-12-19T21:48:00Z",
    "cancellation_reason": "Salah cetak tanggal pengiriman",
    "reset_job_orders": ["JO-20251219-001"],
    "recalculated_manifest": {
      "manifest_id": "MF-20251219-XXXX",
      "active_jobs": 2,
      "total_weight": 1200,
      "total_koli": 10
    }
  }
}
```

**Guard Validasi:**
🛑 DILARANG Cancel DO yang sudah berstatus "In Transit", "Delivered", atau "Completed"

---

## 3. Database Changes

Migration menambahkan kolom berikut ke tabel:

### job_orders
- `cancelled_at` (datetime, nullable)
- `cancellation_reason` (string, nullable)

### manifests
- `cancelled_at` (datetime, nullable)
- `cancellation_reason` (string, nullable)

### delivery_orders
- `cancelled_at` (datetime, nullable)
- `cancellation_reason` (string, nullable)

---

## 5. Troubleshooting

### Driver/Armada Masih Muncul Setelah Cancel
**Penyebab**: Frontend mengambil data dari `assignments[0]` sebagai fallback, yang mungkin berisi assignment yang sudah `Cancelled`.

**Solusi**: Frontend sekarang HANYA mengambil assignment dengan status `Active`. Jika tidak ada Active assignment, tampilkan `-`.

**Files yang diperbaiki**:
- `resources/js/features/orders/components/JobOrder.jsx` - `mapJobOrderToRecord()`
- `resources/js/features/orders/components/JobOrderDetail.jsx` - `loadJobOrder()`
- `resources/js/features/manifests/components/Manifest.jsx` - `availableDrivers`, `availableVehicles`, `calculateCombinedData()`

### Delivery Order Tidak Ter-cancel
**Penyebab**: Query hanya mencari DO dengan `source_id = manifestId`, tapi tidak mencari DO yang memiliki `selected_job_order_id` terkait (LTL scenario).

**Solusi**: Backend sekarang mencari DO dalam 2 cara:
1. `source_type = 'MF' AND source_id = manifestId`
2. `source_type = 'MF' AND selected_job_order_id IN (job_order_ids dari manifest)`

**Files yang diperbaiki**:
- `app/Http/Controllers/Api/ManifestController.php` - `cancel()` method

---

## 6. Kesimpulan

- **Cancel JO** = Mematikan Order (Stop Proses)
- **Cancel Manifest/DO** = Mereset Order (Mundur satu langkah untuk diperbaiki/dijadwalkan ulang)

Gunakan logika ini, maka data di sistem akan rapi dan sesuai dengan operasional logistik dunia nyata! 🚀
