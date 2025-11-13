# SendPick OMS API Documentation

Dokumentasi lengkap untuk API SendPick Order Management System (OMS).

## Informasi Umum

**Base URL:** `/api`  
**API Version:** 1.0.0  
**Authentication:** Laravel Sanctum (Token-based)  
**Content-Type:** `application/json`
**Authorization:** `Bearer {{admin_token}}`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Profile Management](#profile-management)
3. [User & Role Management](#user--role-management)
4. [Master Data Management](#master-data-management)
5. [Transaction & Operational Management](#transaction--operational-management)
6. [GPS Tracking Management](#gps-tracking-management)
7. [Dashboard & Analytics](#dashboard--analytics)
8. [Driver App](#driver-app)
9. [Utility Routes](#utility-routes)

---

## Authentication

### Admin Dashboard Login

**POST** `/api/login`

Authentikasi untuk admin dashboard.

**Request Body:**
```json
{
  "email": "admin@sendpick.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@sendpick.com"
    },
    "token": "1|xxxxxxxxxxxx"
  },
  "message": "Login berhasil"
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Driver App Login

**POST** `/api/driver/login`

Authentikasi untuk aplikasi driver mobile.

**Request Body:**
```json
{
  "email": "driver@sendpick.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "driver": {
      "driver_id": "DRV001",
      "driver_name": "John Doe",
      "phone": "081234567890",
      "email": "driver@sendpick.com"
    },
    "token": "2|xxxxxxxxxxxx"
  },
  "message": "Login berhasil"
}
```

---

### Logout

**POST** `/api/logout`

Logout admin dari dashboard. Memerlukan token autentikasi.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## Profile Management

### Get Profile

**GET** `/api/profile`

Mengambil data profil user yang sedang login.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@sendpick.com",
    "created_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

---

### Update Profile

**PUT** `/api/profile`

Update data profil user yang sedang login.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@sendpick.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "newemail@sendpick.com"
  },
  "message": "Profil berhasil diperbarui"
}
```

---

## User & Role Management

### Admin/Users Management

#### List All Admins

**GET** `/api/admins`

Mengambil daftar semua admin.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` (optional): Pencarian nama/email
- `status` (optional): Filter status
- `per_page` (optional): Jumlah data per halaman
- `page` (optional): Nomor halaman

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@sendpick.com",
      "roles": [
        {
          "id": 1,
          "name": "Super Admin"
        }
      ],
      "created_at": "2025-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 10
  }
}
```

---

#### Create Admin

**POST** `/api/admins`

Membuat admin baru.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@sendpick.com",
  "password": "password123",
  "role_ids": [1, 2]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "New Admin",
    "email": "newadmin@sendpick.com"
  },
  "message": "Admin berhasil dibuat"
}
```

---

#### Get Admin Detail

**GET** `/api/admins/{admin_id}`

Mengambil detail admin berdasarkan ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@sendpick.com",
    "roles": [
      {
        "id": 1,
        "name": "Super Admin",
        "description": "Full access"
      }
    ]
  }
}
```

---

#### Update Admin

**PUT** `/api/admins/{admin_id}`

Update data admin.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@sendpick.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated@sendpick.com"
  },
  "message": "Admin berhasil diperbarui"
}
```

---

#### Delete Admin

**DELETE** `/api/admins/{admin_id}`

Menghapus admin.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin berhasil dihapus"
}
```

---

#### Update Admin Status

**PUT** `/api/admins/{admin_id}/status`

Update status admin (Aktif/Non-Aktif).

**Request Body:**
```json
{
  "status": "Non-Aktif"
}
```

---

#### Update Admin Password

**PUT** `/api/admins/{admin_id}/password`

Update password admin.

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

---

### Role Management

#### List All Roles

**GET** `/api/roles`

Mengambil daftar semua role.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Super Admin",
      "description": "Full access to all features",
      "created_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

---

#### Create Role

**POST** `/api/roles`

Membuat role baru.

**Request Body:**
```json
{
  "name": "Operations Manager",
  "description": "Manages day-to-day operations"
}
```

---

#### Get Role Detail

**GET** `/api/roles/{id}`

Mengambil detail role.

---

#### Update Role

**PUT** `/api/roles/{id}`

Update data role.

---

#### Delete Role

**DELETE** `/api/roles/{id}`

Menghapus role.

---

#### Additional Role Routes

**POST** `/api/roles/{role}/assign-admin`  
Assign role kepada admin.

**DELETE** `/api/roles/{role}/remove-admin`  
Remove role dari admin.

**GET** `/api/roles/{role}/admins`  
Mengambil daftar admin yang memiliki role tertentu.

**GET** `/api/roles/available`  
Mengambil daftar role yang tersedia.

**POST** `/api/roles/bulk-assign`  
Bulk assign role ke multiple admin.

**GET** `/api/roles/stats`  
Mengambil statistik role.

---

## Master Data Management

### Customer Management

#### List All Customers

**GET** `/api/customers`

Mengambil daftar semua customer.

**Query Parameters:**
- `search` (optional): Pencarian nama/kode
- `status` (optional): Filter status
- `customer_type` (optional): Filter tipe customer

---

#### Create Customer

**POST** `/api/customers`

Membuat customer baru.

**Request Body:**
```json
{
  "customer_code": "CUST001",
  "customer_name": "PT. Contoh",
  "customer_type": "Enterprise",
  "contact_name": "John Doe",
  "phone": "081234567890",
  "email": "contact@company.com",
  "address": "Jl. Contoh No. 123",
  "status": "Aktif"
}
```

---

#### Get Customer Detail

**GET** `/api/customers/{customer_id}`

Mengambil detail customer.

---

#### Update Customer

**PUT** `/api/customers/{customer_id}`

Update data customer.

---

#### Delete Customer

**DELETE** `/api/customers/{customer_id}`

Menghapus customer.

---

#### Additional Customer Routes

**PUT** `/api/customers/{customer_id}/status`  
Update status customer.

**GET** `/api/customers/{customer_id}/orders`  
Mengambil daftar order customer.

**GET** `/api/customers/{customer_id}/invoices`  
Mengambil daftar invoice customer.

---

### Driver Management

#### List All Drivers

**GET** `/api/drivers`

Mengambil daftar semua driver.

**Query Parameters:**
- `search` (optional): Pencarian nama/phone
- `status` (optional): Filter status
- `shift` (optional): Filter shift

---

#### Create Driver

**POST** `/api/drivers`

Membuat driver baru.

**Request Body:**
```json
{
  "driver_name": "John Doe",
  "phone": "081234567890",
  "email": "driver@sendpick.com",
  "status": "Aktif",
  "shift": "Day"
}
```

---

#### Get Driver Detail

**GET** `/api/drivers/{driver_id}`

Mengambil detail driver.

---

#### Update Driver

**PUT** `/api/drivers/{driver_id}`

Update data driver.

---

#### Delete Driver

**DELETE** `/api/drivers/{driver_id}`

Menghapus driver.

---

#### Additional Driver Routes

**PUT** `/api/drivers/{driver_id}/status`  
Update status driver.

**GET** `/api/drivers/{driver_id}/assignments`  
Mengambil daftar assignment driver.

**GET** `/api/drivers/{driver_id}/deliveries`  
Mengambil daftar delivery driver.

**GET** `/api/drivers/available`  
Mengambil daftar driver yang tersedia (tidak sedang bertugas).

---

### Vehicle Type Management

#### List All Vehicle Types

**GET** `/api/vehicle-types`

Mengambil daftar semua tipe kendaraan.

---

#### Create Vehicle Type

**POST** `/api/vehicle-types`

Membuat tipe kendaraan baru.

**Request Body:**
```json
{
  "name": "Pickup Truck",
  "description": "Small delivery vehicle",
  "capacity_min_kg": 500,
  "capacity_max_kg": 1000,
  "volume_min_m3": 2.5,
  "volume_max_m3": 5.0,
  "status": "Aktif"
}
```

---

#### Get Vehicle Type Detail

**GET** `/api/vehicle-types/{vehicle_type_id}`

---

#### Update Vehicle Type

**PUT** `/api/vehicle-types/{vehicle_type_id}`

---

#### Delete Vehicle Type

**DELETE** `/api/vehicle-types/{vehicle_type_id}`

---

### Vehicle Management

#### List All Vehicles

**GET** `/api/vehicles`

Mengambil daftar semua kendaraan.

**Query Parameters:**
- `search` (optional): Pencarian plat nomor
- `status` (optional): Filter status
- `vehicle_type_id` (optional): Filter tipe kendaraan

---

#### Create Vehicle

**POST** `/api/vehicles`

Membuat kendaraan baru.

**Request Body:**
```json
{
  "plate_no": "B 1234 XY",
  "vehicle_type_id": 1,
  "brand": "Mitsubishi",
  "model": "L300",
  "year": 2020,
  "capacity_label": "1 Ton",
  "odometer_km": 50000,
  "status": "Aktif",
  "condition_label": "Baik",
  "fuel_level_pct": 80,
  "last_maintenance_date": "2025-01-01",
  "next руководство_date": "2025-07-01"
}
```

---

#### Get Vehicle Detail

**GET** `/api/vehicles/{vehicle_id}`

---

#### Update Vehicle

**PUT** `/api/vehicles/{vehicle_id}`

---

#### Delete Vehicle

**DELETE** `/api/vehicles/{vehicle_id}`

---

#### Additional Vehicle Routes

**PUT** `/api/vehicles/{vehicle_id}/status`  
Update status kendaraan.

**PUT** `/api/vehicles/{vehicle_id}/maintenance`  
Update data maintenance kendaraan.

**GET** `/api/vehicles/available`  
Mengambil daftar kendaraan yang tersedia.

**GET** `/api/vehicles/{vehicle_id}/assignments`  
Mengambil daftar assignment kendaraan.

---

## Transaction & Operational Management

### Job Order Management

#### List All Job Orders

**GET** `/api/job-orders`

Mengambil daftar semua job order.

**Query Parameters:**
- `status` (optional): Filter status
- `customer_id` (optional): Filter customer
- `order_type` (optional): Filter tipe order (LTL/FTL)
- `date_from` (optional): Filter tanggal mulai
- `date_to` (optional): Filter tanggal akhir

---

#### Create Job Order

**POST** `/api/job-orders`

Membuat job order baru.

**Request Body:**
```json
{
  "customer_id": 1,
  "order_type": "LTL",
  "pickup_address": "Jl. Pickup No. 123",
  "delivery_address": "Jl. Delivery No. 456",
  "goods_desc": "Barang elektronik",
  "goods_weight": 150.5,
  "ship_date": "2025-01-15",
  "order_value": 5000000,
  "status": "Created"
}
```

---

#### Get Job Order Detail

**GET** `/api/job-orders/{job_order_id}`

Mengambil detail job order termasuk assignments, status history.

---

#### Update Job Order

**PUT** `/api/job-orders/{job_order_id}`

Update data job order.

---

#### Delete Job Order

**DELETE** `/api/job-orders/{job_order_id}`

Menghapus job order.

---

#### Additional Job Order Routes

**PUT** `/api/job-orders/{job_order_id}/status`  
Update status job order.

**POST** `/api/job-orders/{job_order_id}/assignments`  
Membuat assignment baru (driver & vehicle).

**Request Body:**
```json
{
  "driver_id": 1,
  "vehicle_id": 2,
  "notes": "Assignment notes",
  "status": "Active"
}
```

**GET** `/api/job-orders/{job_order_id}/assignments`  
Mengambil daftar assignments job order.

**PUT** `/api/job-orders/{job_order_id}/assignments/{assignment_id}`  
Update assignment.

**DELETE** `/api/job-orders/{job_order_id}/assignments/{assignment_id}`  
Menghapus assignment.

**GET** `/api/job-orders/{job_order_id}/status-history`  
Mengambil history perubahan status.

---

### Manifest Management

#### List All Manifests

**GET** `/api/manifests`

Mengambil daftar semua manifest.

---

#### Create Manifest

**POST** `/api/manifests`

Membuat manifest baru.

**Request Body:**
```json
{
  "origin_city": "Jakarta",
  "dest_city": "Bandung",
  "cargo_summary": "Various packages",
  "cargo_weight": 500.5,
  "planned_departure": "2025-01-15 08:00:00",
  "planned_arrival": "2025-01-15 14:00:00",
  "status": "Pending",
  "job_order_ids": [1, 2, 3]
}
```

---

#### Get Manifest Detail

**GET** `/api/manifests/{manifest_id}`

Mengambil detail manifest termasuk job orders.

---

#### Update Manifest

**PUT** `/api/manifests/{manifest_id}`

Update data manifest.

---

#### Delete Manifest

**DELETE** `/api/manifests/{manifest_id}`

Menghapus manifest.

---

#### Additional Manifest Routes

**PUT** `/api/manifests/{manifest_id}/status`  
Update status manifest.

**POST** `/api/manifatchest/{manifest_id}/job-orders`  
Menambahkan job order ke manifest.

**DELETE** `/api/manifests/{manifest_id}/job-orders/{job_order_id}`  
Menghapus job order dari manifest.

**GET** `/api/manifests/{manifest_id}/job-orders`  
Mengambil daftar job orders dalam manifest.

**POST** `/api/manifests/{manifest_id}/assign`  
Assign driver ke manifest.

---

### Delivery Order Management

#### List All Delivery Orders

**GET** `/api/delivery-orders`

Mengambil daftar semua delivery order.

**Query Parameters:**
- `status` (optional): Filter status
- `customer_id` (optional): Filter customer
- `do_date` (optional): Filter tanggal DO
- `source_type` (optional): Filter tipe sumber (JO/MF)

---

#### Create Delivery Order

**POST** `/api/delivery-orders`

Membuat delivery order baru.

**Request Body:**
```json
{
  "source_type": "JO",
  "source_id": 1,
  "customer_id": 1,
  "status": "Pending",
  "do_date": "2025-01-15",
  "goods_summary": "Delivery items",
  "priority": "High",
  "temperature": "Room Temperature"
}
```

---

#### Get Delivery Order Detail

**GET** `/api/delivery-orders/{do_id}`

---

#### Update Delivery Order

**PUT** `/api/delivery-orders/{do_id}`

---

#### Delete Delivery Order

**DELETE** `/api/delivery-orders/{do_id}`

---

#### Additional Delivery Order Routes

**PUT** `/api/delivery-orders/{do_id}/status`  
Update status delivery order marin .hex

**POST** `/api/delivery-orders/{do_id}/assign`  
Assign driver dan kendaraan ke delivery order.

**GET** `/api/delivery-orders/{do_id}/tracking`  
Mengambil tracking data untuk delivery order.

**POST** `/api/delivery-orders/{do_id}/proof-of-delivery`  
Upload proof of delivery.

---

### Invoice Management

#### List All Invoices

**GET** `/api/invoices`

Mengambil daftar semua invoice.

**Query Parameters:**
- `status` (optional): Filter status (Pending/Paid/Overdue)
- `customer_id` (optional): Filter customer
- `date_from` (optional): Filter tanggal mulai
- `date_to` (optional): Filter tanggal akhir

---

#### Create Invoice

**POST** `/api/invoices`

Membuat invoice baru.

**Request Body:**
```json
{
  "source_type": "JO",
  "source_id": 1,
  "customer_id": 1,
  "invoice_date": "2025-01-15",
  "due_date": "2025-01-30",
  "subtotal": 4500000,
  "tax_amount": 450000,
  "total_amount": 4950000,
  "status": "Pending",
  "notes": "Invoice notes"
}
```

---

#### Get Invoice Detail

**GET** `/api/invoices/{invoice_id}`

---

#### Update Invoice

**PUT** `/api/invoices/{invoice_id}`

---

#### Delete Invoice

**DELETE** `/api/invoices/{invoice_id}`

---

#### Additional Invoice Routes

**PUT** `/api/invoices/{invoice_id}/paid`  
Mark invoice sebagai paid.

**PUT** `/api/invoices/update-overdue`  
Update status overdue untuk semua invoice.

**GET** `/api/invoices/stats`  
Mengambil statistik invoice.

**GET** `/api/invoices/available-sources`  
Mengambil daftar source yang tersedia untuk invoice.

---

## GPS Tracking Management

#### List All GPS Logs

**GET** `/api/gps`

Mengambil daftar GPS tracking logs.

**Query Parameters:**
- `driver_id` (optional): Filter driver
- `vehicle_id` (optional): Filter vehicle
- `order_id` (optional): Filter order
- `date_from` (optional): Filter tanggal mulai
- `date_to` (optional): Filter tanggal akhir

---

#### Create GPS Log

**POST** `/api/gps`

Membuat GPS log baru.

**Request Body:**
```json
{
  "driver_id": 1,
  "vehicle_id": 2,
  "order_id": "JO001",
  "lat": -6.2088,
  "lng": 106.8456,
  "sent_at": "2025-01-15 10:00:00"
}
```

---

#### Get GPS Log Detail

**GET** `/api/gps/{gps_id}`

---

#### Update GPS Log

**PUT** `/api/gps/{gps_id}`

---

#### Delete GPS Log

**DELETE** `/api/gps/{gps_id}`

---

#### Additional GPS Routes

**GET** `/api/gps/current-locations`  
Mengambil lokasi terkini semua driver.

**GET** `/api/gps/tracking-history`  
Mengambil history tracking untuk driver/order tertentu.

**Query Parameters:**
- `driver_id` (required)
- `date_from` (optional)
- `date_to` (optional)

**GET** `/api/gps/live-tracking/{do_id}`  
Live tracking untuk delivery order tertentu.

**POST** `/api/gps/bulk-store`  
Bulk store GPS logs (untuk batch updates).

---

## Dashboard & Analytics

### Dashboard

**GET** `/api/dashboard`

Mengambil data KPI untuk dashboard utama.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_orders": 150,
    "active_drivers": 25,
    "available_vehicles": 40,
    "pending_invoices": 35,
    "today_orders": 12,
    "completed_orders_today": 8,
    "revenue_today": 15000000,
    "revenue_month": 450000000,
    "recent_orders": [...],
    "alerts": [...]
  }
}
```

---

**GET** `/api/dashboard/kpi-summary`

Mengambil summary KPI lengkap.

---

### Reports & Analytics

#### Sales Report

**GET** `/api/reports/sales`

Mengambil sales report.

**Query Parameters:**
- `date_from` (optional)
- `date_to` (optional)
- `customer_id` (optional)
- `format` (optional): json/csv/pdf

---

#### Financial Report

**GET** `/api/reports/financial`

Mengambil financial report.

---

#### Operational Report

**GET** `/api/reports/operational`

Mengambil operational report.

---

#### Customer Analytics

**Apart** `/api/reports/customer-analytics`

Mengambil customer analytics.

---

#### Export Report

**POST** `/api/reports/export`

Export report ke berbagai format.

**Request Body:**
```json
{
  "report_type": "sales",
  "date_from": "2025-01-01",
  "date_to": "2025-01-31",
  "format": "pdf"
}
```

---

## Driver App

Semua endpoint driver app memerlukan authentication token dan menggunakan prefix `/api/driver`.

### Driver Authentication

**POST** `/api/driver/logout`

Logout driver.

**Headers:**
```
Authorization: Bearer {driver_token}
```

---

### Driver Profile

**GET** `/api/driver/profile`

Mengambil profil driver yang login.

---

**PUT** `/api/driver/profile`

Update profil driver.

---

### Driver Jobs

**GET** `/api/driver/jobs`

Mengambil daftar jobs yang ditugaskan kepada driver.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "job_order_id": "JO001",
      "customer_name": "PT. Contoh",
      "pickup_address": "Jl. Pickup",
      "delivery_address": "Jl. Delivery",
      "status": "Assigned",
      "ship_date": "2025-01-15"
    }
  ]
}
```

---

**GET** `/api/driver/jobs/{job_order_id}`

Mengambil detail job.

---

**PUT** `/api/driver/jobs/{job_order_id}/status`

Update status job.

**Request Body:**
```json
{
  "status": "Picked Up",
  "notes": "Barang sudah diambil"
}
```

---

### Driver Deliveries

**GET** `/api/driver/deliveries`

Mengambil daftar delivery orders yang ditugaskan.

---

**GET** `/api/driver/deliveries/{do_id}`

Mengambil detail delivery order.

---

**PUT** `/api/driver/deliveries/{do_id}/status`

Update status delivery.

---

### Proof of Delivery

**POST** `/api/driver/deliveries/{do_id}/proof-of-delivery`

Upload foto dan tanda tangan bukti kirim.

**Request:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `photo` (file): Foto barang/alamat
- `signature` (file): Tanda tangan penerima
- `delivered_at` (datetime): Waktu pengiriman
- `notes` (text): Catatan tambahan

---

### GPS Location Updates

**POST** `/api/driver/location`

Update lokasi GPS driver.

**Request Body:**
```json
{
  "lat": -6.2088,
  "lng": 106.8456,
  "vehicle_id": 1,
  "order_id": "JO001",
  "sent_at": "2025-01-15 10:00:00"
}
```

---

**POST** `/api/driver/location/bulk`

Bulk update lokasi GPS.

**Request Body:**
```json
{
  "locations": [
    {
      "lat": -6.2088,
      "lng": 106.8456,
      "sent_at": "2025-01-15 10:00:00"
    },
    {
      "lat": -6.2090,
      "lng": 106.8460,
      "sent_at": "2025-01-15 10:05:00"
    }
  ],
  "vehicle_id": 1,
  "order_id": "JO001"
}
```

---

## Utility Routes

### Health Check

**GET** `/api/health`

Pengecekan status API.

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "SendPick OMS API is running",
  "timestamp": "2025-01-15T10:00:00.000000Z",
  "version": "1.0.0"
}
```

---

### API Information

**GET** `/api/info`

Mengambil informasi umum tentang API.

**Response (200 OK):**
```json
{
  "name": "SendPick Order Management System API",
  "version": "1.0.0",
  "description": "RESTful API untuk SendPick OMS - Sistem Manajemen Logistik & Order",
  "environment": "production",
  "laravel_version": "11.x",
  "php_version": "8.2",
  "timezone": "Asia/Jakarta",
  "locale": "id",
  "architecture": {
    "total_models": 15,
    "total_controllers": 15,
    "total_migrations": 16
  },
  "endpoints": {
    "authentication": "/api/login",
    "dashboard": "/api/dashboard",
    "driver_app": "/api/driver",
    "documentation": "/api/info",
    "health_check": "/api/health"
  }
}
```

---

## Error Responses

### Standard Error Format

Semua error response mengikuti format standar:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### HTTP Status Codes

- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Request tidak valid
- `401 Unauthorized` - Tidak terautentikasi
- `403 Forbidden` - Tidak memiliki akses
- `404 Not Found` - Resource tidak ditemukan
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

---

## Authentication & Authorization

### Obtaining Token

1. **Admin Dashboard**: Login melalui `POST /api/login`
2. **Driver App**: Login melalui `POST /api/driver/login`

Token akan dikembalikan dalam response login.

### Using Token

Tambahkan header berikut pada setiap request yang memerlukan authentication:

```
Authorization: Bearer {your_token_here}
```

### Token Expiration

Token akan expired setelah periode tertentu. User perlu login ulang untuk mendapatkan token baru.

---

## Rate Limiting

API memiliki rate limiting untuk mencegah abuse:
- **60 requests per minute** untuk authenticated endpoints
- **10 requests per minute** untuk public endpoints

Jika melebihi limit, response akan mengembalikan status code `429 Too Many Requests`.

---

## Pagination

Endpoints yang mengembalikan list data menggunakan pagination dengan format sebagai berikut:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "http://api.sendpick.com/api/resource?page=1",
    "last": "http://api.sendpick.com/api/resource?page=7",
    "prev": null,
    "next": "http://api.sendpick.com/api/resource?page=2"
  }
}
```

Query parameters untuk pagination:
- `page` - Nomor halaman (default: 1)
- `per_page` - Jumlah data per halaman (default: 15, max: 100)

---

## Filtering & Searching

Kebanyakan endpoints list mendukung filtering dan searching melalui query parameters:

### Common Query Parameters

- `search` - Pencarian umum (nama, kode, dll)
- `status` - Filter berdasarkan status
- `date_from` - Filter tanggal mulai
- `date_to` - Filter tanggal akhir
- `per_page` - Jumlah data per halaman
- `page` - Nomor halaman

### Example

```
GET /api/job-orders?status=Active&date_from=2025-01-01&search=JO001
```

---

## Date & Time Format

Semua tanggal dan waktu menggunakan format ISO 8601:

- **Date**: `YYYY-MM-DD` (contoh: `2025-01-15`)
- **DateTime**: `YYYY-MM-DDTHH:mm:ss.ssssssZ` (contoh: `2025-01-15T10:00:00.000000Z`)
- **Timezone**: Waktu menggunakan timezone server (default: Asia/Jakarta)

---

## Contact & Support

Untuk pertanyaan atau dukungan API:
- **Email**: support@sendpick.com
- **Documentation**: [Link ke dokumentasi lengkap]
- **Status**: [Link ke status page]

---

## Changelog

### Version 1.0.0 (2025-01-15)
- Initial release
- All core endpoints implemented
- Admin dashboard authentication
- Driver app endpoints
- GPS tracking functionality
- Dashboard & analytics endpoints

---

**Generated**: 2025-01-15  
**Last Updated**: 2025-01-15  
**API Version**: 1.0.0
