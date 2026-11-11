# SIAP POLNES — Sistem Informasi Akademik & Pelayanan

Platform Digital Terintegrasi Politeknik Negeri Samarinda (POLNES) yang menyatukan layanan akademik (SIAKAD), administrasi persuratan mahasiswa, magang industri & karir, pengaduan terpadu, dan beasiswa cerdas.

---

## 📂 Struktur Monorepo Proyek

Proyek ini telah distrukturisasi secara bersih dan terisolasi ke dalam 3 direktori utama:

```
Hackathon/
├── backend/                # Layanan REST API & Background Worker (Modular Monolith)
├── frontend/               # Aplikasi Web Klien (Next.js 16, React 19, Tailwind CSS)
└── docs/                   # Pusat Dokumentasi (PRD, Arsitektur, & Rencana Eksekusi)
```

---

## 🧭 Panduan Sub-Direktori

### 1. [frontend/](file:///c:/Antigravity/Project/Hackathon/frontend)
Aplikasi antarmuka pengguna berbasis **Next.js (App Router)** dan **TypeScript**.
- **Role Dashboard**: Mahasiswa, Dosen, Admin Akademik, Staf Layanan, Mitra Industri, Pengelola Beasiswa, Petugas Pengaduan.
- **Modul**: Akademik (KRS/KHS/Nilai), Layanan Surat, Magang & CV Builder, Pengaduan SLA, Beasiswa Scanner & Verifier, Notifikasi Terpadu.
- **Menjalankan**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
  Akses di: `http://localhost:3000`

### 2. [backend/](file:///c:/Antigravity/Project/Hackathon/backend)
Layanan Application Programming Interface (API) berbasis **Modular Monolith** dengan PostgreSQL 16 & Redis 7.
- **Modular Domains**:
  - `app/Modules/Core`: Auth multi-aktor, RBAC, System Configurations, Audit Trail.
  - `app/Modules/Academic`: KRS Concurrency Lock, KHS, Import Nilai Excel Chunked.
  - `app/Modules/Administration`: Dynamic Form JSON Schema, State Machine Tracking.
  - `app/Modules/Internship`: Lowongan Mitra, ATS CV Parser, Logbook Harian.
  - `app/Modules/Complaint`: Tiket Pengaduan (Sensitif/Satgas Khusus), SLA Monitoring.
  - `app/Modules/Scholarship`: Profile Scanner & Matcher, Deadline Forecaster, Document Verifier.
  - `app/Modules/Notification`: In-App, Email Dispatcher, Deadlines.
- **Panduan**: Lihat [backend/README.md](file:///c:/Antigravity/Project/Hackathon/backend/README.md).

### 3. [docs/](file:///c:/Antigravity/Project/Hackathon/docs)
Seluruh dokumen analisis produk, spesifikasi teknis, dan rencana eksekusi:
- **[PRD_SIAP_Lengkap.md](file:///c:/Antigravity/Project/Hackathon/docs/PRD_SIAP_Lengkap.md)**: Product Requirements Document lengkap (72 Aturan Bisnis, skema database 3NF, API specs).
- **[SIAP_PRD_Designed.html](file:///c:/Antigravity/Project/Hackathon/docs/SIAP_PRD_Designed.html)**: Versi interaktif visual dari PRD.
- **[IMPLEMENTATION_PLAN_SIAP.md](file:///c:/Antigravity/Project/Hackathon/docs/IMPLEMENTATION_PLAN_SIAP.md)**: Master Blueprint Arsitektur Sistem, WBS, dan Roadmap Sprint.
- **[PROJECT_EXECUTION_PLAN.md](file:///c:/Antigravity/Project/Hackathon/docs/PROJECT_EXECUTION_PLAN.md)**: Rencana eksekusi proyek dari Day 0 hingga siap demo dan produksi.
- **[part1.md](file:///c:/Antigravity/Project/Hackathon/docs/part1.md) s/d [part4.md](file:///c:/Antigravity/Project/Hackathon/docs/part4.md)**: Modul spesifikasi terperinci.
- **Panduan**: Lihat [docs/README.md](file:///c:/Antigravity/Project/Hackathon/docs/README.md).
