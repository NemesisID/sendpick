# Frontend Setup (React + Laravel)

Panduan singkat untuk menyiapkan integrasi frontend React (Vite) dengan backend Laravel pada proyek `sendpick`.

## 1. Persyaratan

- PHP 8.2+, Composer
- Node.js 18+ dan npm
- Database (MySQL/MariaDB atau PostgreSQL sesuai konfigurasi `.env`)

## 2. Instalasi Dependensi

```bash
composer install
npm install
```

## 3. Konfigurasi Backend (`.env`)

Salin file contoh lalu sesuaikan nilai penting:

```bash
cp .env.example .env
php artisan key:generate
```

Atur variabel berikut minimal:

- `APP_URL=http://127.0.0.1:8000`
- `SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173`
- `SESSION_DOMAIN=localhost`
- Kredensial database (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)

Jika melakukan perubahan pada konfigurasi, jalankan:

```bash
php artisan config:clear
```

## 4. Konfigurasi Frontend (Vite React)

Tambahkan variabel environment khusus Vite di file `.env` (root project yang sama dengan `package.json`):

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

- Untuk staging/production, buat file seperti `.env.production` dan sesuaikan `VITE_API_BASE_URL` dengan domain API sebenarnya (mis. `https://api.sendpick.com/api`).
- Vite otomatis membaca variabel dengan prefix `VITE_` saat build/dev.

## 5. Jalan Bersama

Backend dan frontend dapat dijalankan bersamaan:

```bash
php artisan serve --host=0.0.0.0 --port=8000
npm run dev
```

Atau gunakan script bantu di `composer.json`:

```bash
composer run dev
```

## 6. Catatan Integrasi

- `resources/js/utils/api.js` sudah menyiapkan instance axios yang membaca `VITE_API_BASE_URL` dan otomatis menambahkan header `Authorization` bila token tersimpan di `localStorage`.
- `resources/js/bootstrap.js` menyetel axios global dengan base URL dan `withCredentials` untuk dukungan Sanctum.
- Layanan frontend (`resources/js/services/*.js`) menggunakan helper `api` sehingga cukup memanggil endpoint relatif (`/job-orders`, `/customers`, dll).
- Pastikan endpoint backend mengembalikan JSON dengan struktur yang sudah terdokumentasi di `API_DOCS.md`.

## 7. Build Produksi

Untuk menyiapkan aset produksi:

```bash
npm run build
php artisan config:cache
php artisan route:cache
```

File hasil build akan berada di `public/build`. Konfigurasikan server (Nginx/Apache) agar:

- Melayani file statis dari `public/`
- Meneruskan request `/api` ke aplikasi Laravel (PHP-FPM)
- Mengarahkan semua request selain `/api` ke `public/index.php` untuk routing frontend React

---

Jika menemui kendala spesifik (CORS, autentikasi, dsb.), periksa konfigurasi di `config/cors.php`, middleware Sanctum, dan log Laravel (`storage/logs/`). Ajukan pertanyaan dengan detail error/log untuk investigasi lanjutan.

