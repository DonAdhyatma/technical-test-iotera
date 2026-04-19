# IOTERA Admin Dashboard
 
> Technical Test Danni Adhyatma Rachman – Fullstack Developer (2026)
 
Admin dashboard berbasis web untuk monitoring transaksi vending machine dan log device secara real-time.
 
## 🌐 Live Demo
 
**URL:** [https://technical-test-iotera.vercel.app](https://technical-test-iotera.vercel.app)
 
| Field    | Value      |
|----------|------------|
| Username | `user`     |
| Password | `password` |
 
---
 
## 📋 Fitur
 
### 🔐 Authentication
- Login menggunakan kredensial yang divalidasi via REST API
- Token disimpan di session untuk menjaga state login
- Proteksi route — halaman dashboard tidak dapat diakses tanpa login
- Tombol logout untuk mengakhiri sesi
### ⬡ Transaction Monitor
- Menampilkan daftar transaksi yang diambil dari API
- Stat cards: Total transaksi, Sukses, Gagal, Total Revenue
- Fitur pencarian dan filter berdasarkan status transaksi
- Pagination untuk navigasi data yang banyak
### ◈ Device Log Monitor
- Monitoring log device secara real-time dari API
- Filter berdasarkan level log: `INFO`, `WARN`, `ERROR`, `DEBUG`
- Stat cards: Total log, jumlah Error, jumlah Warning, waktu update terakhir
- Fitur pencarian dan pagination
- Raw JSON preview per entri log
### ⚙️ Utilitas
- Auto-refresh setiap 30 detik (dapat diaktifkan/nonaktifkan)
- Tombol refresh manual
- Indikator status koneksi Live / Offline
- Toast notification untuk feedback aksi
---
 
## 🛠️ Tech Stack
 
| Kategori       | Library / Tool                          |
|----------------|-----------------------------------------|
| Framework      | [Next.js 15](https://nextjs.org/) (App Router) |
| Language       | TypeScript 5                            |
| UI Library     | React 19                                |
| Styling        | Tailwind CSS 3                          |
| Icons          | Lucide React                            |
| HTTP Client    | Axios                                   |
| Linter         | ESLint (Next.js config)                 |
| Hosting        | Vercel                                  |
 
---
 
## 📡 API Reference
 
### Login & Data Transaksi
 
```
POST https://asia-southeast2-iotera-vending.cloudfunctions.net/login
```
 
**Request Body:**
```json
{
  "username": "user",
  "password": "password"
}
```
 
### Device Log
 
```
POST https://api-serverless.iotera.io/1000000021/data
```
 
**Headers:** `Authorization: Bearer <token>`
 
---
 
## 📁 Struktur Proyek
 
```
.
├── src/
│   ├── app/
│   │   ├── dashboard/          # Halaman dashboard (protected route)
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Halaman login (root redirect)
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Komponen layout (Sidebar, Topbar)
│   │   └── ui/                 # Komponen UI reusable (Table, Badge, dll)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts             # Helper autentikasi & session
│   │   └── axios.ts            # Konfigurasi Axios instance
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets
├── next.config.ts              # Konfigurasi Next.js
├── tailwind.config.js          # Konfigurasi Tailwind CSS
├── tsconfig.json               # Konfigurasi TypeScript
└── package.json
```
 
---
 
## 🚀 Instalasi & Menjalankan Lokal
 
### Prerequisites
- Node.js >= 18.x
- npm / yarn / pnpm
### Clone & Install
 
```bash
# Clone repository
git clone <repository-url>
cd <nama-folder>
 
# Install dependencies
npm install
```
 
### Menjalankan Development Server
 
```bash
npm run dev
```
 
Buka [http://localhost:3000](http://localhost:3000) di browser.
 
### Build untuk Production
 
```bash
npm run build
npm run start
```
 
---
 
## ☁️ Deployment
 
Project ini di-deploy menggunakan **Vercel**.
 
### Deploy ulang via Vercel CLI
 
```bash
npm i -g vercel
vercel --prod
```
 
### Deploy via GitHub
 
1. Push repository ke GitHub
2. Import project di [vercel.com/new](https://vercel.com/new)
3. Vercel akan otomatis mendeteksi Next.js dan melakukan build
---
 
## 📦 Scripts
 
| Command         | Deskripsi                        |
|-----------------|----------------------------------|
| `npm run dev`   | Menjalankan development server   |
| `npm run build` | Build untuk production           |
| `npm run start` | Menjalankan production server    |
| `npm run lint`  | Menjalankan ESLint               |
 