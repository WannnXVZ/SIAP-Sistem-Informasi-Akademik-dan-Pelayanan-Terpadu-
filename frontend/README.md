# Frontend — SIAP POLNES (Sistem Informasi Akademik & Pelayanan)

Aplikasi antarmuka web modern untuk platform SIAP Politeknik Negeri Samarinda (POLNES), dibangun dengan Next.js App Router, React 19, TypeScript, dan Tailwind CSS.

---

## 🚀 Fitur & Modul Utama
- **Dashboard Multi-Role**: Mahasiswa (`MHS`), Dosen (`DSN`), Admin Akademik (`ADM_AKD`), Staf Layanan (`STF_LYN`), Mitra Magang (`MTR`), Pengelola Beasiswa (`ADM_BSW`), Petugas Pengaduan (`ADM_PGD`).
- **Modul Akademik**: KRS Online, Jadwal Kuliah, KHS & Transkrip Nilai, Input Nilai & BAP Perkuliahan.
- **Modul Layanan Administrasi**: Katalog surat/legalisir, dynamic form, stepper tracking status, validasi berkas.
- **Modul Magang & Karir**: Portal lowongan mitra, ATS-friendly CV builder, sistem apply lamaran.
- **Modul Pengaduan Mahasiswa**: Tiket pengaduan transparan/rahasia, tracking SLA, penanganan satgas.
- **Modul Beasiswa Cerdas**: Scanner kecocokan kriteria, deadline forecaster, ranking otomatis.
- **Notification Modal & Toast**: Push update terintegrasi untuk seluruh event kampus.

---

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Library UI**: React 19, Lucide React (Icons)
- **Styling**: Tailwind CSS
- **State & Data**: Mock Data Service & Modular View Architecture

---

## 💻 Menjalankan Frontend Secara Lokal

1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Pasang dependensi (jika belum terpasang):
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```

4. Akses melalui browser:
   Buka [http://localhost:3000](http://localhost:3000)

5. Build untuk produksi:
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Struktur Direktori Frontend
```
frontend/
├── public/                 # Aset statis & favicon
├── src/
│   ├── app/                # Next.js App Router (layout, page, global css)
│   ├── components/         # Komponen UI utama
│   │   ├── Header.tsx      # Top bar & profil role switcher
│   │   ├── Sidebar.tsx     # Navigasi role-based
│   │   ├── NotifikasiModal.tsx # Panel notifikasi sistem
│   │   └── modules/        # Tampilan modul bisnis spesifik
│   │       ├── AkademikView.tsx
│   │       ├── AuditView.tsx
│   │       ├── BeasiswaView.tsx
│   │       ├── DashboardView.tsx
│   │       ├── LayananView.tsx
│   │       ├── MagangView.tsx
│   │       └── PengaduanView.tsx
│   └── lib/                # Definisi tipe & mock data service
│       ├── types.ts        # TypeScript interfaces
│       └── mockData.ts     # Data simulasi lengkap
├── package.json
└── tsconfig.json
```
