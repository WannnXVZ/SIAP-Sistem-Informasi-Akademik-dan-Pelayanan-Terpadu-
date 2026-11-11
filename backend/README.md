# Backend — SIAP POLNES (Sistem Informasi Akademik & Pelayanan)

Layanan Application Programming Interface (API) & Worker Platform SIAP Politeknik Negeri Samarinda (POLNES).

Arsitektur yang digunakan adalah **Modular Monolith (Domain-Driven)** dengan basis Laravel 11 (PHP 8.3) / Node.js Microservices, PostgreSQL 16 sebagai primary database, Redis 7 untuk background job queue & caching, serta MinIO untuk penyimpanan berkas privat.

Dokumentasi lengkap spesifikasi API dan arsitektur database dapat dilihat di:
- [docs/PRD_SIAP_Lengkap.md (Bab 14 & 15)](../docs/PRD_SIAP_Lengkap.md)
- [docs/IMPLEMENTATION_PLAN_SIAP.md (Bab 2)](../docs/IMPLEMENTATION_PLAN_SIAP.md)

---

## 🏛️ Struktur Modul Domain (`app/Modules`)

Sistem dibagi ke dalam domain modular independen untuk memudahkan kolaborasi:

1. **`Core/`**:
   - Autentikasi multi-aktor (NIM untuk Mahasiswa, NIP untuk Dosen/Staf, Email untuk Mitra).
   - Role-Based Access Control (RBAC) dengan 7 peran pengguna.
   - Konfigurasi sistem dinamis (`system_configs`) & audit trail log (`audit_logs`).
2. **`Academic/`**:
   - Master data kurikulum, mata kuliah, kelas perkuliahan, dan ruang kelas.
   - Engine KRS Online dengan *concurrency lock* & *anti-overbooking*.
   - Input Nilai Dosen, BAP Perkuliahan, Import Nilai Excel (*chunked*), dan kalkulasi IPK/IPS.
3. **`Administration/`**:
   - Katalog jenis layanan persuratan & formulir dinamis (JSON Schema).
   - Mesin transisi status (*State Machine*) permohonan surat & stepper tracking.
   - Integrasi tanda tangan digital (QR Code terverifikasi).
4. **`Internship/`**:
   - Pendaftaran & verifikasi profil mitra industri.
   - Lowongan magang, ATS CV parser/builder, dan alur pendaftaran mahasiswa.
   - Log harian magang (*daily activity logbook*) & penilaian pembimbing lapangan.
5. **`Complaint/`**:
   - Tiket pengaduan mahasiswa (Publik, Rahasia, & Sensitif/Satgas Khusus).
   - Disposisi unit kerja, tracking batas waktu SLA, dan enkripsi pelapor rahasia.
6. **`Scholarship/`**:
   - Pendaftaran program beasiswa (Internal & Eksternal).
   - *Profile Scanner & Eligibility Matcher* (pencocokan otomatis kriteria mahasiswa).
   - *Deadline Forecaster* & Document Verifier (OCR ktm/transkrip/sktm).
7. **`Notification/`**:
   - Dispatcher notifikasi terpadu (In-App notification, email alert, dan reminder deadline).

---

## 📁 Struktur Direktori Backend
```
backend/
├── app/
│   ├── Modules/                # Modul domain fungsional (DDD)
│   │   ├── Core/
│   │   ├── Academic/
│   │   ├── Administration/
│   │   ├── Internship/
│   │   ├── Complaint/
│   │   ├── Scholarship/
│   │   └── Notification/
│   ├── Services/               # Shared engine (ExcelEngine, StateMachine, StorageService)
│   └── Models/                 # Eloquent entities & model relationships
├── database/
│   ├── migrations/             # Skema tabel berurutan sesuai PRD Bab 14
│   └── seeders/                # Dummy & testing data seeder
├── routes/                     # Definisi endpoint RESTful
│   └── api.php
├── tests/                      # Unit & feature test suites
├── .env.example                # Konfigurasi environment template
└── README.md
```

---

## ⚡ Standar Kontrak API
Semua respon API mematuhi standar JSON terpadu:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-10-11T10:00:00Z",
    "request_id": "req-uuid-12345"
  }
}
```

Format error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Data yang dikirim tidak valid",
    "details": []
  },
  "meta": {
    "timestamp": "2026-10-11T10:00:00Z",
    "request_id": "req-uuid-12345"
  }
}
```
*(Seluruh timestamp menggunakan format ISO 8601 UTC).*
