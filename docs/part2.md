## 9. Functional Requirements

### 9.1 Daftar Functional Requirement

| ID | Modul | Nama Fitur | Aktor Utama | Priority |
|---|---|---|---|---|
| FR-001 | Core | Login & Autentikasi | Semua | P0 |
| FR-002 | Core | Manajemen Pengguna & Role | SUPER | P0 |
| FR-003 | Core | Profil Pengguna & Data Diri Mahasiswa | Semua, MHS | P0 |
| FR-004 | Core | Reset & Ganti Password | Semua | P0 |
| FR-010 | Akademik | Pengelolaan Mata Kuliah | ADM_AKD | P0 |
| FR-011 | Akademik | Periode Akademik & Penawaran Kelas | ADM_AKD | P0 |
| FR-012 | Akademik | Pengisian KRS Online | MHS | P0 |
| FR-013 | Akademik | Persetujuan KRS oleh Dosen Wali | DWL | P0 |
| FR-014 | Akademik | Import Data Akademik via Excel | ADM_AKD | P0 |
| FR-015 | Akademik | Import Nilai via Excel | DSN, ADM_AKD | P0 |
| FR-016 | Akademik | Nilai & KHS | MHS, DSN, ADM_AKD | P0 |
| FR-017 | Akademik | Riwayat Akademik / Transkrip | MHS, DWL, ADM_AKD | P0 |
| FR-018 | Akademik | Riwayat Proses Import | ADM_AKD, DSN | P0 |
| FR-019 | Akademik | Data Akademik Mahasiswa (Master) | ADM_AKD | P0 |
| FR-020 | Administrasi | Katalog Jenis Layanan | MHS, SUPER, STF_LYN | P0 |
| FR-021 | Administrasi | Pengajuan Dokumen | MHS | P0 |
| FR-022 | Administrasi | Upload Persyaratan | MHS | P0 |
| FR-023 | Administrasi | Verifikasi & Pemrosesan Pengajuan | STF_LYN | P0 |
| FR-024 | Administrasi | Tracking Status Pengajuan | MHS | P0 |
| FR-025 | Administrasi | Riwayat Pengajuan | MHS, STF_LYN | P0 |
| FR-030 | Magang | Registrasi & Verifikasi Mitra | MTR, KRD_MGG | P0 |
| FR-031 | Magang | Pengelolaan Lowongan | MTR, KRD_MGG | P0 |
| FR-032 | Magang | Pencarian & Filter Lowongan | MHS | P0 |
| FR-033 | Magang | Detail Lowongan | MHS | P0 |
| FR-034 | Magang | Profil / CV Mahasiswa | MHS | P0 |
| FR-035 | Magang | Kirim Lamaran | MHS | P0 |
| FR-036 | Magang | Kelola Pelamar & Ubah Status Kandidat | MTR | P0 |
| FR-037 | Magang | Tracking Status Lamaran | MHS | P0 |
| FR-038 | Magang | Rekomendasi Lowongan Berbasis Profil | MHS | P2 |
| FR-040 | Pengaduan | Membuat Pengaduan | MHS | P0 |
| FR-041 | Pengaduan | Verifikasi & Disposisi Pengaduan | PTG_ADU | P0 |
| FR-042 | Pengaduan | Tanggapan & Tindak Lanjut | UNIT_ADU, PTG_ADU | P0 |
| FR-043 | Pengaduan | Tracking & Riwayat Pengaduan | MHS | P0 |
| FR-044 | Pengaduan | Penilaian Kepuasan & Buka Kembali Tiket | MHS | P2 |
| FR-050 | Beasiswa | Database Beasiswa Internal | ADM_BSW | P0 |
| FR-051 | Beasiswa | Kurasi Beasiswa Eksternal (Manual) | ADM_BSW | P1 |
| FR-052 | Beasiswa | Ingestion / Crawling Beasiswa Eksternal | Sistem, ADM_BSW | P2 |
| FR-053 | Beasiswa | Profile Scanner | Sistem, MHS | P0 |
| FR-054 | Beasiswa | Deadline Forecaster | Sistem, MHS | P1 |
| FR-055 | Beasiswa | Personal Outreach Agent | Sistem | P1 |
| FR-056 | Beasiswa | Pendaftaran Beasiswa | MHS | P0 |
| FR-057 | Beasiswa | Document Verifier | Sistem, ADM_BSW | P0 (checklist + HITL) / P2 (OCR & AI pre-check) |
| FR-058 | Beasiswa | Shortlist Ranker | Sistem, ADM_BSW | P1 |
| FR-059 | Beasiswa | Penjadwalan Wawancara | ADM_BSW, KMT_BSW | P1 |
| FR-060 | Beasiswa | Pengumuman Hasil & Permintaan Dokumen Tambahan | ADM_BSW, KMT_BSW | P1 |
| FR-061 | Beasiswa | Monitoring Pencairan & Follow-up | ADM_BSW | P2 |
| FR-070 | Notifikasi | Pusat Notifikasi In-App | Semua | P0 |
| FR-071 | Notifikasi | Notifikasi Email | Sistem | P1 |
| FR-072 | Notifikasi | Preferensi Notifikasi | Semua | P2 |
| FR-073 | Notifikasi | Reminder Deadline Terjadwal | Sistem | P1 |
| FR-080 | Core | Dashboard per Role | Semua | P0 |
| FR-081 | Core | Laporan & Ekspor | Back-office, PMP | P1 |
| FR-082 | Core | Audit Trail Viewer | SUPER, Admin modul | P1 |
| FR-083 | Core | Konfigurasi Master Data & Aturan | SUPER, ADM_AKD | P0 |

> [!NOTE]
> Penomoran FR sengaja diberi celah per modul (001–009 Core, 010–019 Akademik, 020–029 Administrasi, 030–039 Magang, 040–049 Pengaduan, 050–069 Beasiswa, 070–079 Notifikasi, 080–089 Core lanjutan) agar penambahan fitur tidak mengacak ID.

---

## 10. Detail Requirements Setiap Modul

### 10.0 Modul Core (M0)

#### FR-001 — Login & Autentikasi

- **Nama fitur:** Login & Autentikasi
- **Tujuan:** Memastikan hanya pengguna sah yang dapat mengakses SIAP sesuai role.
- **Aktor:** Semua pengguna.
- **Deskripsi:** Login menggunakan identitas (NIM untuk mahasiswa, NIP/NIDN/username untuk dosen & staf [PERLU VALIDASI format], email untuk mitra) dan password. Setelah login, sistem menerbitkan sesi/token dan mengarahkan ke dashboard sesuai role. Jika pengguna memiliki >1 role, pengguna dapat berpindah role aktif.
- **User Story:** As a pengguna SIAP, I want login dengan akun saya, so that saya dapat mengakses layanan sesuai peran saya.
- **Preconditions:** Akun berstatus `AKTIF`.
- **Trigger:** Pengguna membuka halaman login dan menekan "Masuk".
- **Main Flow:**
  1. Pengguna memasukkan identitas & password.
  2. Sistem memvalidasi format input.
  3. Sistem memverifikasi kredensial (hash).
  4. Sistem membuat sesi/token, mencatat `last_login_at` dan audit log `AUTH_LOGIN_SUCCESS`.
  5. Sistem mengarahkan ke dashboard role default.
- **Alternative Flow:**
  - A1: Akun wajib ganti password (login pertama/akun hasil import) → diarahkan ke halaman ganti password (FR-004).
  - A2: Multi-role → tampil pemilih role aktif.
- **Exception Flow:**
  - E1: Kredensial salah → pesan generik "Identitas atau password salah" (tanpa menyebut mana yang salah).
  - E2: 5× gagal dalam 15 menit → akun dikunci sementara 15 menit (SEC-005).
  - E3: Akun `NONAKTIF`/`DIBLOKIR` → pesan akun tidak aktif, hubungi admin.
- **Input:** `identifier` (string, wajib), `password` (string, wajib).
- **Process:** Rate limit check → lookup user → verifikasi hash → cek status → issue token → audit.
- **Output:** Token/sesi, profil ringkas, daftar role & permission.
- **Business Rules:** BR-001.
- **Validation:** Identifier 3–100 karakter; password tidak kosong; maksimal percobaan sesuai SEC-005.
- **Acceptance Criteria:**
  - AC1: Given akun aktif dan kredensial benar, When pengguna menekan "Masuk", Then pengguna diarahkan ke dashboard sesuai role dan audit `AUTH_LOGIN_SUCCESS` tercatat.
  - AC2: Given kredensial salah, When login, Then pesan error generik tampil dan audit `AUTH_LOGIN_FAILED` tercatat.
  - AC3: Given 5 kegagalan dalam 15 menit, When percobaan ke-6, Then akun terkunci 15 menit.
  - AC4: Given akun dengan flag `must_change_password`, When login berhasil, Then pengguna wajib mengganti password sebelum mengakses fitur lain.
- **Priority:** P0

#### FR-002 — Manajemen Pengguna & Role

- **Nama fitur:** Manajemen Pengguna & Role
- **Tujuan:** Mengelola akun, role, dan permission secara terpusat.
- **Aktor:** SUPER (penuh); ADM_AKD (membuat akun mahasiswa/dosen via import).
- **Deskripsi:** CRUD pengguna, penetapan role (multi-role), aktivasi/nonaktivasi, reset password oleh admin, penetapan scope (prodi/unit/jenis layanan).
- **User Story:** As a Super Admin, I want mengelola akun dan role, so that setiap pengguna hanya memiliki akses sesuai tugasnya.
- **Preconditions:** Login sebagai SUPER.
- **Trigger:** Admin membuka menu "Pengguna".
- **Main Flow:**
  1. Admin mencari/menyaring pengguna.
  2. Admin menambah/mengubah pengguna dan menetapkan role + scope.
  3. Sistem memvalidasi keunikan identifier & email.
  4. Sistem menyimpan, mengirim notifikasi aktivasi (jika akun baru), mencatat audit.
- **Alternative Flow:** A1: Akun mahasiswa/dosen dibuat massal melalui import (FR-014) dengan flag `must_change_password`.
- **Exception Flow:** E1: Identifier/email duplikat → ditolak. E2: Upaya menghapus role SUPER terakhir → ditolak.
- **Input:** nama, identifier, email, role[], scope[], status.
- **Process:** Validasi → simpan → assign role → audit `USER_CREATED/UPDATED/ROLE_CHANGED`.
- **Output:** Data pengguna tersimpan.
- **Business Rules:** BR-001, BR-002, BR-008.
- **Validation:** Email format valid & unik; minimal 1 role; scope wajib untuk role ber-scope (STF_LYN, UNIT_ADU, ADM_AKD per jurusan bila diterapkan).
- **Acceptance Criteria:**
  - AC1: Given admin mengisi data valid, When menyimpan, Then akun dibuat dengan status `AKTIF` dan audit tercatat.
  - AC2: Given pengguna dinonaktifkan, When pengguna itu mencoba login, Then akses ditolak dan sesi aktifnya dicabut.
  - AC3: Given perubahan role, When disimpan, Then permission baru berlaku pada request berikutnya.
- **Priority:** P0

#### FR-003 — Profil Pengguna & Data Diri Mahasiswa

- **Nama fitur:** Profil Pengguna
- **Tujuan:** Menyediakan data diri yang akurat untuk layanan, magang, dan beasiswa.
- **Aktor:** Semua; MHS (field tambahan).
- **Deskripsi:** Pengguna melihat profil. Mahasiswa dapat memperbarui data kontak dan data pendukung beasiswa (mis. penghasilan orang tua, jumlah tanggungan, prestasi, organisasi) [REKOMENDASI; field final PERLU VALIDASI]. Data akademik resmi (NIM, prodi, IPK, semester) **read-only** bagi mahasiswa.
- **User Story:** As a mahasiswa, I want memperbarui data diri dan data pendukung, so that rekomendasi beasiswa dan lamaran magang saya akurat.
- **Preconditions:** Login.
- **Trigger:** Membuka menu "Profil".
- **Main Flow:** 1) Lihat profil; 2) Edit field yang diizinkan; 3) Validasi; 4) Simpan; 5) Sistem memicu re-scan Profile Scanner (FR-053) bila field relevan berubah.
- **Alternative Flow:** A1: Unggah foto profil.
- **Exception Flow:** E1: Field tidak valid → pesan per field.
- **Input:** no HP, email pribadi, alamat, data ekonomi (opsional), prestasi[], organisasi[], foto.
- **Process:** Validasi → simpan → audit perubahan (nilai lama/baru untuk field sensitif disamarkan di log).
- **Output:** Profil ter-update; persentase kelengkapan profil.
- **Business Rules:** BR-006, BR-069.
- **Validation:** No HP format Indonesia (`^(\+62|0)8[0-9]{8,12}$`); foto JPG/PNG ≤ 2 MB.
- **Acceptance Criteria:**
  - AC1: Given mahasiswa mengubah no HP valid, When menyimpan, Then data tersimpan dan indikator kelengkapan diperbarui.
  - AC2: Given mahasiswa mencoba mengubah IPK via API, When request dikirim, Then sistem menolak dengan 403.
  - AC3: Given data pendukung beasiswa berubah, When disimpan, Then job re-scan beasiswa dijadwalkan.
- **Priority:** P0

#### FR-004 — Reset & Ganti Password

- **Nama fitur:** Reset & Ganti Password
- **Tujuan:** Memulihkan akses secara aman.
- **Aktor:** Semua.
- **Deskripsi:** Lupa password via tautan reset ke email terdaftar (token sekali pakai, kedaluwarsa 30 menit). Ganti password dari profil dengan verifikasi password lama.
- **User Story:** As a pengguna, I want mereset password saat lupa, so that saya tetap bisa mengakses SIAP tanpa datang ke admin.
- **Preconditions:** Email terdaftar (untuk reset mandiri).
- **Trigger:** Klik "Lupa Password" / menu "Ganti Password".
- **Main Flow:** 1) Masukkan identifier; 2) Sistem selalu menampilkan pesan netral "Jika akun terdaftar, tautan dikirim"; 3) Email berisi tautan bertoken; 4) Pengguna menetapkan password baru; 5) Semua sesi lama dicabut.
- **Alternative Flow:** A1: Tidak punya email → reset oleh admin (FR-002), password sementara + `must_change_password`.
- **Exception Flow:** E1: Token kedaluwarsa/terpakai → minta ulang. E2: Password tidak memenuhi kebijakan → ditolak.
- **Input:** identifier; token; password baru; konfirmasi.
- **Process:** Generate token acak (hash disimpan) → kirim email → verifikasi → hash password baru → revoke sesi → audit.
- **Output:** Password diperbarui.
- **Business Rules:** —
- **Validation:** Kebijakan password SEC-003.
- **Acceptance Criteria:**
  - AC1: Given token valid, When password baru memenuhi kebijakan, Then password diperbarui dan semua sesi lama dicabut.
  - AC2: Given identifier tidak terdaftar, When meminta reset, Then pesan yang sama dengan akun terdaftar ditampilkan (anti-enumerasi).
  - AC3: Given token >30 menit, When digunakan, Then ditolak.
- **Priority:** P0

---

### 10.1 Modul Akademik / SIAKAD (M1)

> [!IMPORTANT]
> Aturan akademik POLNES (skala nilai, batas SKS, prasyarat, mekanisme perubahan KRS, mekanisme mengulang) **[PERLU VALIDASI]**. Semua aturan diimplementasikan sebagai konfigurasi (FR-083).

#### FR-010 — Pengelolaan Mata Kuliah

- **Nama fitur:** Pengelolaan Mata Kuliah
- **Tujuan:** Menyediakan katalog mata kuliah per kurikulum & prodi.
- **Aktor:** ADM_AKD.
- **Deskripsi:** CRUD mata kuliah: kode, nama, SKS (teori/praktik [PERLU VALIDASI]), semester rekomendasi, prodi, kurikulum, jenis (wajib/pilihan), prasyarat (opsional), status aktif. Dapat juga diisi via import (FR-014).
- **User Story:** As an admin akademik, I want mengelola data mata kuliah, so that KRS dan nilai mengacu pada katalog yang benar.
- **Preconditions:** Prodi & kurikulum sudah ada (FR-083).
- **Trigger:** Menu "Mata Kuliah".
- **Main Flow:** 1) Cari/filter; 2) Tambah/ubah; 3) Validasi keunikan kode per kurikulum; 4) Simpan; 5) Audit.
- **Alternative Flow:** A1: Import massal via FR-014. A2: Nonaktifkan mata kuliah (tidak dihapus jika sudah dipakai).
- **Exception Flow:** E1: Kode duplikat dalam kurikulum sama → ditolak. E2: Prasyarat melingkar (A→B→A) → ditolak.
- **Input:** kode, nama, sks, semester, prodi_id, kurikulum_id, jenis, prasyarat_ids[].
- **Process:** Validasi → simpan → audit.
- **Output:** Mata kuliah tersimpan.
- **Business Rules:** BR-008, BR-013.
- **Validation:** Kode alfanumerik 3–20; SKS 1–6 [PERLU VALIDASI]; semester 1–8.
- **Acceptance Criteria:**
  - AC1: Given data valid, When disimpan, Then mata kuliah tampil di katalog prodi terkait.
  - AC2: Given mata kuliah sudah memiliki nilai/KRS, When admin menghapus, Then sistem hanya mengizinkan nonaktif (soft delete).
  - AC3: Given prasyarat membentuk siklus, When disimpan, Then sistem menolak dengan pesan jelas.
- **Priority:** P0

#### FR-011 — Periode Akademik & Penawaran Kelas

- **Nama fitur:** Periode Akademik & Penawaran Kelas
- **Tujuan:** Mengatur semester aktif, jadwal pengisian KRS, dan kelas yang ditawarkan.
- **Aktor:** ADM_AKD.
- **Deskripsi:** Admin membuat periode (tahun akademik + ganjil/genap), menetapkan rentang tanggal KRS, perubahan KRS, input nilai. Admin membuat penawaran kelas: mata kuliah, nama kelas, dosen pengampu, kuota, jadwal (hari, jam, ruang).
- **User Story:** As an admin akademik, I want menetapkan periode dan kelas yang ditawarkan, so that mahasiswa dapat mengisi KRS pada waktu dan kelas yang tepat.
- **Preconditions:** Mata kuliah & dosen tersedia.
- **Trigger:** Menu "Periode" / "Penawaran Kelas".
- **Main Flow:** 1) Buat periode + rentang tanggal; 2) Aktifkan periode (hanya satu periode aktif); 3) Tambah kelas (manual atau import); 4) Publikasikan penawaran.
- **Alternative Flow:** A1: Salin penawaran dari periode sebelumnya.
- **Exception Flow:** E1: Rentang tanggal tidak logis → ditolak. E2: Jadwal dosen bentrok → peringatan (blocking/non-blocking dapat dikonfigurasi).
- **Input:** tahun_akademik, semester_tipe, tgl_krs_mulai/selesai, tgl_perubahan_mulai/selesai, tgl_nilai_mulai/selesai; kelas: mk_id, nama_kelas, dosen_id[], kuota, jadwal[].
- **Process:** Validasi → simpan → jadwalkan notifikasi pembukaan KRS (FR-073).
- **Output:** Periode aktif & daftar kelas.
- **Business Rules:** BR-004, BR-010, BR-014.
- **Validation:** Hanya satu periode `AKTIF`; kuota > 0.
- **Acceptance Criteria:**
  - AC1: Given periode baru diaktifkan, When disimpan, Then periode sebelumnya otomatis berstatus `SELESAI`.
  - AC2: Given penawaran dipublikasi, When mahasiswa membuka KRS dalam rentang tanggal, Then kelas tampil.
- **Priority:** P0

#### FR-012 — Pengisian KRS Online

- **Nama fitur:** KRS Online
- **Tujuan:** Mahasiswa merencanakan studi secara mandiri dengan validasi otomatis.
- **Aktor:** MHS.
- **Deskripsi:** Mahasiswa memilih kelas dari penawaran, sistem menampilkan total SKS, batas SKS, deteksi bentrok jadwal, prasyarat, kuota. KRS disimpan sebagai `DRAFT` lalu diajukan ke dosen wali.
- **User Story:** As a mahasiswa, I want mengisi KRS secara online dengan pengecekan otomatis, so that saya tidak salah memilih mata kuliah dan tidak perlu datang ke kampus.
- **Preconditions:** Status mahasiswa `AKTIF` (BR-016); periode KRS dibuka (BR-010); memiliki dosen wali.
- **Trigger:** Menu "KRS".
- **Main Flow:**
  1. Sistem menampilkan batas SKS (BR-011) dan kelas yang tersedia untuk prodi/semester.
  2. Mahasiswa menambah/menghapus kelas; sistem memvalidasi real-time (bentrok, kuota, prasyarat, duplikasi, batas SKS).
  3. Mahasiswa menyimpan `DRAFT`.
  4. Mahasiswa menekan "Ajukan" → status `DIAJUKAN`; kuota dikunci (reservasi).
  5. Notifikasi ke dosen wali.
- **Alternative Flow:**
  - A1: KRS `PERLU_REVISI` (ditolak dosen wali) → mahasiswa mengubah lalu mengajukan ulang.
  - A2: Mahasiswa menarik pengajuan sebelum disetujui → kembali `DRAFT`.
- **Exception Flow:**
  - E1: Kuota penuh saat pengajuan (race condition) → kelas tersebut ditolak, mahasiswa diminta memilih kelas lain.
  - E2: Periode KRS ditutup → form read-only.
  - E3: Status mahasiswa tidak aktif → akses KRS ditolak dengan alasan.
- **Input:** periode_id, kelas_kuliah_id[].
- **Process:** Validasi aturan → reservasi kuota secara atomik (transaksi + row lock) → simpan → status history → notifikasi.
- **Output:** KRS berstatus `DIAJUKAN`, ringkasan total SKS, dapat dicetak (PDF P2).
- **Business Rules:** BR-010, BR-011, BR-012, BR-013, BR-014, BR-015, BR-016.
- **Validation:** Total SKS ≤ batas; tidak ada bentrok; prasyarat lulus; kuota tersedia; tidak ada MK ganda.
- **Acceptance Criteria:**
  - AC1: Given periode KRS terbuka dan mahasiswa aktif, When memilih kelas tanpa konflik dan mengajukan, Then status KRS menjadi `DIAJUKAN` dan dosen wali menerima notifikasi.
  - AC2: Given dua kelas berjadwal bentrok, When mahasiswa menambah kelas kedua, Then sistem menolak dan menunjukkan kelas yang bentrok.
  - AC3: Given total SKS melebihi batas, When mengajukan, Then pengajuan ditolak dengan info batas SKS.
  - AC4: Given sisa kuota 1 dan dua mahasiswa mengajukan bersamaan, When diproses, Then hanya satu yang berhasil dan kuota tidak pernah negatif.
- **Priority:** P0

#### FR-013 — Persetujuan KRS oleh Dosen Wali

- **Nama fitur:** Persetujuan KRS
- **Tujuan:** Dosen wali memvalidasi rencana studi mahasiswa bimbingan.
- **Aktor:** DWL.
- **Deskripsi:** Dosen wali melihat daftar KRS bimbingan (filter status), melihat detail + riwayat akademik ringkas, menyetujui atau mengembalikan untuk revisi dengan catatan. Mendukung persetujuan massal untuk KRS tanpa peringatan.
- **User Story:** As a dosen wali, I want menyetujui atau mengembalikan KRS mahasiswa bimbingan dengan catatan, so that rencana studi mereka sesuai aturan dan kemampuan akademik.
- **Preconditions:** KRS berstatus `DIAJUKAN`; dosen adalah wali mahasiswa tersebut.
- **Trigger:** Notifikasi / menu "Persetujuan KRS".
- **Main Flow:** 1) Buka daftar; 2) Lihat detail; 3) Pilih "Setujui" → status `DISETUJUI`, KRS terkunci; 4) Notifikasi ke mahasiswa.
- **Alternative Flow:** A1: "Kembalikan" dengan catatan wajib → `PERLU_REVISI`, kuota reservasi tetap dipegang hingga batas periode [REKOMENDASI]. A2: Persetujuan massal.
- **Exception Flow:** E1: Dosen bukan wali → 403. E2: Periode persetujuan lewat → mengikuti kebijakan [PERLU VALIDASI].
- **Input:** krs_id[], aksi (`APPROVE`/`RETURN`), catatan.
- **Process:** Cek scope → transisi status → history → notifikasi → audit.
- **Output:** Status KRS ter-update.
- **Business Rules:** BR-007, BR-015, BR-024.
- **Validation:** Catatan wajib saat `RETURN` (min 10 karakter).
- **Acceptance Criteria:**
  - AC1: Given KRS `DIAJUKAN`, When dosen wali menyetujui, Then status `DISETUJUI`, KRS tidak dapat diubah mahasiswa, dan mahasiswa menerima notifikasi.
  - AC2: Given dosen mengembalikan tanpa catatan, When submit, Then sistem menolak.
  - AC3: Given dosen membuka KRS mahasiswa yang bukan bimbingannya, When request dikirim, Then respons 403.
- **Priority:** P0

#### FR-014 — Import Data Akademik via Excel

- **Nama fitur:** Import Data Akademik
- **Tujuan:** Memasukkan data akademik massal secara cepat dan tervalidasi.
- **Aktor:** ADM_AKD.
- **Deskripsi:** Mendukung tipe import: Mahasiswa, Dosen, Mata Kuliah, Penawaran Kelas, Relasi Dosen Wali, Riwayat Nilai Historis [REKOMENDASI]. Mengikuti alur wajib **Upload → Validation → Preview → Confirmation → Processing → Result** (detail di Bagian 18).
- **User Story:** As an admin akademik, I want mengimport data akademik dari Excel dengan validasi dan preview, so that data masuk cepat tanpa merusak data yang sudah ada.
- **Preconditions:** Template versi aktif diunduh dari SIAP; data referensi (prodi, kurikulum) sudah ada.
- **Trigger:** Menu "Import Data" → pilih tipe → unggah file.
- **Main Flow:**
  1. Admin memilih tipe import & mode (insert-only / upsert).
  2. Unggah `.xlsx` → status batch `DIUNGGAH`.
  3. Sistem memvalidasi (file, struktur, baris, referensi, duplikasi) → `SIAP_PREVIEW` atau `VALIDASI_GAGAL`.
  4. Preview: ringkasan (total, valid, error, warning, akan insert, akan update) + tabel baris dengan penanda error.
  5. Admin mengonfirmasi → `DIKONFIRMASI` → worker memproses (`DIPROSES`).
  6. Hasil: `SELESAI` / `SELESAI_SEBAGIAN` / `GAGAL`, laporan dapat diunduh, notifikasi ke admin.
- **Alternative Flow:** A1: Admin membatalkan di tahap preview → `DIBATALKAN`. A2: Mode parsial (jika diizinkan untuk tipe ini) → hanya baris valid diproses.
- **Exception Flow:** E1: Bukan .xlsx / >5 MB / template tidak cocok → ditolak di tahap upload. E2: Worker gagal di tengah → transaksi di-rollback, status `GAGAL`, dapat diulang. E3: File hash sama dengan batch sukses sebelumnya → peringatan duplikasi (BR-022).
- **Input:** tipe_import, mode, file.
- **Process:** Lihat Bagian 18.
- **Output:** Data tersimpan; import batch + laporan error.
- **Business Rules:** BR-002, BR-020, BR-021, BR-022.
- **Validation:** Lihat Bagian 18.4.
- **Acceptance Criteria:**
  - AC1: Given file sesuai template tanpa error, When admin mengonfirmasi, Then semua baris tersimpan dan status `SELESAI`.
  - AC2: Given file mengandung NIM duplikat, When divalidasi, Then baris tersebut ditandai error dengan nomor baris, kolom, dan pesan.
  - AC3: Given status `SIAP_PREVIEW`, When admin belum mengonfirmasi, Then tidak ada data yang tersimpan ke tabel utama.
  - AC4: Given import mahasiswa sukses, When selesai, Then akun pengguna mahasiswa dibuat dengan `must_change_password = true`.
- **Priority:** P0

#### FR-015 — Import Nilai via Excel

- **Nama fitur:** Import Nilai
- **Tujuan:** Dosen mengunggah nilai satu kelas secara cepat dan akurat.
- **Aktor:** DSN (kelas yang diampu), ADM_AKD (semua kelas).
- **Deskripsi:** Dosen mengunduh template nilai **yang sudah terisi daftar mahasiswa** kelas tersebut (dari KRS `DISETUJUI`), mengisi komponen nilai (mis. tugas, UTS, UAS — komponen & bobot [PERLU VALIDASI]) atau nilai akhir, lalu mengunggah. Sistem menghitung nilai akhir, huruf mutu, dan bobot sesuai konfigurasi (BR-017).
- **User Story:** As a dosen, I want mengunggah nilai kelas dari Excel dengan preview, so that nilai masuk tanpa salah ketik dan tanpa input satu per satu.
- **Preconditions:** Periode input nilai dibuka; dosen pengampu kelas; nilai kelas belum dikunci.
- **Trigger:** Menu "Nilai" → pilih kelas → "Import Nilai".
- **Main Flow:** 1) Unduh template kelas; 2) Unggah; 3) Validasi (NIM terdaftar di kelas, rentang nilai 0–100, kolom wajib); 4) Preview dengan nilai huruf terhitung; 5) Konfirmasi; 6) Simpan sebagai `DRAFT` nilai; 7) Dosen "Finalisasi" → `DIFINALISASI` → admin "Kunci/Publikasi" → mahasiswa dapat melihat [REKOMENDASI alur dua tahap; PERLU VALIDASI].
- **Alternative Flow:** A1: Input/ubah nilai manual per mahasiswa di grid (sebelum finalisasi). A2: Upload ulang menimpa draft (dengan konfirmasi).
- **Exception Flow:** E1: NIM tidak terdaftar di kelas → error blocking. E2: Mahasiswa di kelas tidak ada di file → warning "nilai kosong" (dapat ditetapkan default sesuai kebijakan [PERLU VALIDASI]). E3: Nilai sudah dikunci → upload ditolak; gunakan alur koreksi.
- **Input:** kelas_kuliah_id, file.
- **Process:** Mode **all-or-nothing** (BR-023) → hitung nilai akhir → simpan draft → audit.
- **Output:** Nilai tersimpan; laporan import.
- **Business Rules:** BR-017, BR-018, BR-021, BR-023, BR-025.
- **Validation:** Nilai numerik 0–100 (2 desimal); NIM ada di KRS disetujui kelas tersebut; tidak ada NIM ganda dalam file.
- **Acceptance Criteria:**
  - AC1: Given file nilai valid, When dikonfirmasi, Then seluruh nilai tersimpan sebagai draft dan huruf mutu sesuai tabel konversi aktif.
  - AC2: Given satu baris memiliki nilai 105, When validasi, Then batch tidak dapat dikonfirmasi dan baris tersebut ditandai.
  - AC3: Given dosen bukan pengampu, When mengunggah, Then 403.
  - AC4: Given nilai dikunci, When dosen mengunggah ulang, Then ditolak dengan arahan alur koreksi.
- **Priority:** P0

#### FR-016 — Nilai & KHS

- **Nama fitur:** Nilai & KHS
- **Tujuan:** Mahasiswa melihat hasil studi per semester.
- **Aktor:** MHS (milik sendiri), DSN (kelasnya), DWL (bimbingan), ADM_AKD.
- **Deskripsi:** Menampilkan nilai per mata kuliah (setelah dipublikasi), IPS, total SKS semester, IPK berjalan. Admin dapat melakukan koreksi nilai terkunci dengan alasan dan lampiran (tercatat audit).
- **User Story:** As a mahasiswa, I want melihat KHS tiap semester, so that saya mengetahui capaian dan merencanakan studi.
- **Preconditions:** Nilai berstatus `DIPUBLIKASI`.
- **Trigger:** Menu "KHS".
- **Main Flow:** 1) Pilih semester; 2) Sistem menampilkan nilai, IPS, IPK.
- **Alternative Flow:** A1: Unduh KHS PDF (P2). A2: Koreksi nilai oleh ADM_AKD → status nilai `DIKOREKSI`, notifikasi ke mahasiswa.
- **Exception Flow:** E1: Nilai belum dipublikasi → tampil "Belum tersedia".
- **Input:** periode_id.
- **Process:** Ambil nilai → hitung IPS/IPK (BR-019).
- **Output:** Tampilan KHS.
- **Business Rules:** BR-017, BR-018, BR-019.
- **Validation:** Koreksi wajib alasan (BR-007).
- **Acceptance Criteria:**
  - AC1: Given nilai dipublikasi, When mahasiswa membuka KHS, Then IPS dihitung = Σ(bobot×SKS)/ΣSKS dan sesuai perhitungan manual.
  - AC2: Given nilai masih draft, When mahasiswa membuka KHS, Then nilai tidak ditampilkan.
  - AC3: Given admin mengoreksi nilai, When disimpan, Then audit menyimpan nilai lama, nilai baru, alasan, dan aktor.
- **Priority:** P0

#### FR-017 — Riwayat Akademik / Transkrip

- **Nama fitur:** Riwayat Akademik
- **Tujuan:** Menampilkan riwayat studi kumulatif.
- **Aktor:** MHS, DWL, ADM_AKD.
- **Deskripsi:** Daftar seluruh mata kuliah yang pernah diambil, nilai, SKS kumulatif, IPK, status mahasiswa per semester (aktif/cuti/dll [PERLU VALIDASI daftar status]). Transkrip resmi bertanda tangan **bukan** keluaran MVP (cetak PDF non-resmi P2).
- **User Story:** As a mahasiswa, I want melihat riwayat akademik lengkap, so that saya tahu progres kelulusan dan dapat menggunakannya untuk beasiswa/magang.
- **Preconditions:** Ada data nilai.
- **Trigger:** Menu "Riwayat Akademik".
- **Main Flow:** Sistem menampilkan riwayat per semester + ringkasan kumulatif + grafik tren IPS.
- **Alternative Flow:** A1: Mata kuliah diulang → tampil nilai sesuai BR-019 dengan penanda "diulang".
- **Exception Flow:** E1: Data historis belum diimport → tampil info "Data semester sebelum X belum tersedia".
- **Input:** mahasiswa_id.
- **Process:** Agregasi nilai.
- **Output:** Riwayat & ringkasan.
- **Business Rules:** BR-019.
- **Validation:** —
- **Acceptance Criteria:**
  - AC1: Given mahasiswa memiliki nilai 4 semester, When membuka riwayat, Then 4 semester tampil dengan IPK yang konsisten dengan KHS.
  - AC2: Given dosen wali membuka riwayat mahasiswa bimbingan, When diakses, Then data tampil; bagi mahasiswa non-bimbingan → 403.
- **Priority:** P0

#### FR-018 — Riwayat Proses Import

- **Nama fitur:** Riwayat Import
- **Tujuan:** Menyediakan jejak lengkap setiap proses import.
- **Aktor:** ADM_AKD (semua batch akademik), DSN (batch miliknya), ADM_BSW (batch beasiswa).
- **Deskripsi:** Daftar import batch: tipe, file, pengunggah, waktu, status, jumlah baris (total/sukses/gagal/warning), durasi, unduh file asli & laporan error.
- **User Story:** As an admin akademik, I want melihat riwayat import beserta hasil dan error-nya, so that saya dapat menelusuri dan memperbaiki masalah data.
- **Preconditions:** Login dengan role terkait.
- **Trigger:** Menu "Riwayat Import".
- **Main Flow:** Filter (tipe, status, tanggal, pengunggah) → buka detail batch → unduh laporan.
- **Alternative Flow:** A1: "Import ulang" dari file yang diperbaiki (batch baru, merujuk batch lama). A2: Rollback batch (P2, hanya tipe tertentu dan bila data belum dipakai transaksi lain) [REKOMENDASI].
- **Exception Flow:** E1: File asli sudah melewati masa retensi → hanya metadata tersedia.
- **Input:** filter.
- **Process:** Query batch sesuai scope.
- **Output:** Daftar & detail batch.
- **Business Rules:** BR-003.
- **Validation:** Scope akses.
- **Acceptance Criteria:**
  - AC1: Given batch selesai, When admin membuka detail, Then tersedia ringkasan angka dan laporan error berformat .xlsx yang memuat nomor baris, kolom, nilai, dan pesan error.
  - AC2: Given dosen, When membuka riwayat import, Then hanya batch yang ia unggah yang tampil.
- **Priority:** P0

#### FR-019 — Data Akademik Mahasiswa (Master)

- **Nama fitur:** Data Akademik Mahasiswa
- **Tujuan:** Mengelola data induk mahasiswa yang menjadi rujukan seluruh modul.
- **Aktor:** ADM_AKD.
- **Deskripsi:** CRUD data mahasiswa: NIM, nama, prodi, angkatan, kelas, dosen wali, status akademik, semester berjalan; data dihitung (IPK, total SKS). Mendukung pencarian, filter, dan edit individual; perubahan status mahasiswa tercatat dalam riwayat.
- **User Story:** As an admin akademik, I want mengelola data induk mahasiswa, so that seluruh layanan menggunakan data yang benar.
- **Preconditions:** Prodi tersedia.
- **Trigger:** Menu "Data Mahasiswa".
- **Main Flow:** Cari → lihat detail (tab: biodata, akademik, KRS, nilai, layanan) → ubah → simpan → audit.
- **Alternative Flow:** A1: Import massal (FR-014). A2: Penetapan dosen wali massal.
- **Exception Flow:** E1: NIM duplikat → ditolak.
- **Input:** Data mahasiswa.
- **Process:** Validasi → simpan → sinkron akun pengguna (nama/email).
- **Output:** Data tersimpan.
- **Business Rules:** BR-002, BR-008, BR-016.
- **Validation:** NIM sesuai format [PERLU VALIDASI pola NIM POLNES]; angkatan 4 digit.
- **Acceptance Criteria:**
  - AC1: Given status mahasiswa diubah menjadi `CUTI`, When disimpan, Then mahasiswa tidak dapat mengisi KRS pada periode tersebut dan riwayat status tercatat.
  - AC2: Given perubahan dosen wali, When disimpan, Then KRS `DIAJUKAN` beralih ke dosen wali baru.
- **Priority:** P0

---

### 10.2 Modul Layanan Administrasi (M2)

> [!NOTE]
> Daftar jenis layanan POLNES (mis. surat keterangan aktif kuliah, legalisir, surat pengantar, dsb.) beserta persyaratan, SLA, dan metode penyerahan **[PERLU VALIDASI]**. Contoh pada dokumen ini bersifat ilustratif.

Alur status [REQ]: **Diajukan → Diverifikasi → Diproses → Selesai → Siap Diambil**, ditambah status pendukung [REKOMENDASI] (`DRAFT`, `PERLU_REVISI`, `DITOLAK`, `DIBATALKAN`, `DIAMBIL`). Detail di Bagian 23.

#### FR-020 — Katalog Jenis Layanan

- **Nama fitur:** Katalog Jenis Layanan
- **Tujuan:** Menyajikan daftar layanan beserta persyaratan secara jelas.
- **Aktor:** MHS (lihat), SUPER/Admin layanan (kelola).
- **Deskripsi:** Admin mengonfigurasi jenis layanan: nama, deskripsi, unit penanggung jawab, persyaratan (nama dokumen, wajib/opsional, format, ukuran maks, contoh/template), field form tambahan (mis. keperluan surat), SLA (hari kerja), metode penyerahan (`DIGITAL`/`FISIK`/`KEDUANYA`), kelayakan (status mahasiswa), status aktif.
- **User Story:** As a mahasiswa, I want melihat daftar layanan beserta persyaratannya, so that saya bisa menyiapkan berkas sebelum mengajukan.
- **Preconditions:** —
- **Trigger:** Menu "Layanan".
- **Main Flow:** Mahasiswa menelusuri/mencari layanan → membuka detail (persyaratan, estimasi waktu, metode penyerahan) → "Ajukan".
- **Alternative Flow:** A1: Admin menambah/mengubah layanan (versi persyaratan disimpan; pengajuan lama tetap memakai versi saat diajukan).
- **Exception Flow:** E1: Layanan nonaktif → tidak tampil bagi mahasiswa.
- **Input:** Data jenis layanan & persyaratan.
- **Process:** Simpan dengan versioning.
- **Output:** Katalog.
- **Business Rules:** BR-033, BR-036.
- **Validation:** Minimal 1 unit penanggung jawab; SLA > 0.
- **Acceptance Criteria:**
  - AC1: Given layanan aktif, When mahasiswa membuka katalog, Then layanan tampil dengan persyaratan dan estimasi SLA.
  - AC2: Given admin mengubah persyaratan, When ada pengajuan berjalan, Then pengajuan berjalan tetap menggunakan persyaratan versi lama.
- **Priority:** P0

#### FR-021 — Pengajuan Dokumen

- **Nama fitur:** Pengajuan Dokumen
- **Tujuan:** Mahasiswa mengajukan layanan secara online.
- **Aktor:** MHS.
- **Deskripsi:** Mahasiswa mengisi form layanan, mengunggah persyaratan (FR-022), meninjau, lalu mengajukan. Sistem membuat nomor referensi unik.
- **User Story:** As a mahasiswa, I want mengajukan dokumen secara online, so that saya tidak perlu datang ke kampus berkali-kali.
- **Preconditions:** Memenuhi kelayakan layanan (BR-036).
- **Trigger:** Tombol "Ajukan" pada detail layanan.
- **Main Flow:** 1) Isi form; 2) Unggah persyaratan; 3) Simpan `DRAFT` (opsional); 4) Review ringkasan; 5) "Ajukan" → `DIAJUKAN`, nomor `ADM-YYYYMM-NNNNN`; 6) Notifikasi konfirmasi ke mahasiswa & antrean staf.
- **Alternative Flow:** A1: Batal saat `DIAJUKAN` (BR-031) → `DIBATALKAN`. A2: Lanjutkan draft.
- **Exception Flow:** E1: Persyaratan wajib belum lengkap → tombol "Ajukan" nonaktif + daftar kekurangan (BR-030). E2: Tidak memenuhi kelayakan → pesan alasan.
- **Input:** jenis_layanan_id, field form dinamis, file persyaratan, metode penyerahan (jika `KEDUANYA`).
- **Process:** Validasi → generate nomor → status history → notifikasi → audit.
- **Output:** Pengajuan `DIAJUKAN` + nomor referensi.
- **Business Rules:** BR-005, BR-030, BR-031, BR-036.
- **Validation:** Field wajib terisi; file sesuai BR-006.
- **Acceptance Criteria:**
  - AC1: Given seluruh persyaratan wajib terunggah, When mahasiswa menekan "Ajukan", Then status `DIAJUKAN`, nomor referensi unik dibuat, dan notifikasi terkirim.
  - AC2: Given satu persyaratan wajib kosong, When mahasiswa mencoba mengajukan, Then pengajuan ditolak dan kekurangan ditampilkan.
  - AC3: Given status `DIVERIFIKASI`, When mahasiswa mencoba membatalkan, Then tombol batal tidak tersedia.
- **Priority:** P0

#### FR-022 — Upload Persyaratan

- **Nama fitur:** Upload Persyaratan
- **Tujuan:** Mengunggah dokumen pendukung secara aman.
- **Aktor:** MHS.
- **Deskripsi:** Upload per item persyaratan dengan preview, ganti file sebelum diajukan atau saat `PERLU_REVISI`. File disimpan di storage privat (SEC-012..SEC-016). Komponen upload dipakai ulang oleh modul Pengaduan, Magang, dan Beasiswa.
- **User Story:** As a mahasiswa, I want mengunggah persyaratan dengan mudah dan melihat preview, so that saya yakin berkas yang saya kirim benar.
- **Preconditions:** Pengajuan `DRAFT` atau `PERLU_REVISI`.
- **Trigger:** Klik area unggah.
- **Main Flow:** Pilih file → validasi client → upload → validasi server (MIME, ukuran, malware scan [REKOMENDASI]) → simpan → status dokumen `DIUNGGAH` → preview.
- **Alternative Flow:** A1: Ganti file (versi lama disimpan untuk audit).
- **Exception Flow:** E1: Format/ukuran tidak sesuai → ditolak. E2: Terdeteksi berbahaya → ditolak & dilog. E3: Upload terputus → dapat diulang.
- **Input:** file, persyaratan_id.
- **Process:** Validasi → rename (UUID) → simpan privat → metadata (hash SHA-256, ukuran, MIME).
- **Output:** Dokumen tersimpan.
- **Business Rules:** BR-006.
- **Validation:** Ekstensi & MIME sesuai daftar izin persyaratan; ukuran ≤ batas.
- **Acceptance Criteria:**
  - AC1: Given file PDF 2 MB, When diunggah pada persyaratan yang mengizinkan PDF ≤5 MB, Then tersimpan dan preview tampil.
  - AC2: Given file .exe yang diganti nama menjadi .pdf, When diunggah, Then ditolak karena MIME tidak sesuai.
  - AC3: Given file diunggah, When diakses via URL langsung tanpa otorisasi, Then akses ditolak.
- **Priority:** P0

#### FR-023 — Verifikasi & Pemrosesan Pengajuan

- **Nama fitur:** Verifikasi & Pemrosesan
- **Tujuan:** Staf memproses pengajuan secara terstruktur.
- **Aktor:** STF_LYN.
- **Deskripsi:** Antrean kerja (filter jenis layanan, status, SLA mendekati/terlewati), detail pengajuan, checklist verifikasi per persyaratan (valid/tidak valid + catatan), aksi transisi status, unggah dokumen hasil (untuk `DIGITAL`), penetapan info pengambilan (untuk `FISIK`), konfirmasi pengambilan.
- **User Story:** As a staf layanan, I want antrean pengajuan dengan checklist dan aksi status, so that saya dapat memproses layanan cepat dan terdokumentasi.
- **Preconditions:** Pengajuan dalam scope jenis layanan staf.
- **Trigger:** Pengajuan baru masuk / menu "Antrean Layanan".
- **Main Flow:**
  1. Staf membuka pengajuan `DIAJUKAN`, memeriksa persyaratan.
  2. Semua valid → `DIVERIFIKASI`.
  3. Mulai proses → `DIPROSES`.
  4. Dokumen selesai → `SELESAI` (DIGITAL: unggah file hasil, mahasiswa dapat mengunduh; FISIK: lanjut).
  5. FISIK: tetapkan lokasi, jam, dan batas pengambilan → `SIAP_DIAMBIL`.
  6. Mahasiswa mengambil → staf konfirmasi → `DIAMBIL` [REKOMENDASI].
- **Alternative Flow:** A1: Persyaratan tidak valid → `PERLU_REVISI` + catatan per item + batas revisi (BR-032). A2: Tidak memenuhi syarat → `DITOLAK` + alasan. A3: Aksi massal untuk status `DIPROSES`→`SELESAI` bila tidak ada file hasil individual.
- **Exception Flow:** E1: Transisi tidak sah (mis. `DIAJUKAN`→`SELESAI`) → ditolak (BR-009). E2: Konflik edit oleh dua staf → optimistic locking (version), staf kedua menerima pesan "data telah berubah".
- **Input:** pengajuan_id, aksi, catatan, hasil verifikasi per item, file hasil, info pengambilan.
- **Process:** Cek scope → cek state machine → simpan → history → notifikasi (BR-008) → audit.
- **Output:** Status ter-update.
- **Business Rules:** BR-003, BR-007, BR-009, BR-032, BR-033, BR-034, BR-035.
- **Validation:** Alasan wajib untuk `PERLU_REVISI`/`DITOLAK`; file hasil wajib untuk `SELESAI` metode DIGITAL; info pengambilan wajib untuk `SIAP_DIAMBIL`.
- **Acceptance Criteria:**
  - AC1: Given pengajuan `DIPROSES` metode FISIK, When staf menetapkan `SELESAI` lalu `SIAP_DIAMBIL` dengan lokasi & jam, Then mahasiswa menerima notifikasi "Dokumen selesai" dan "Dokumen siap diambil" beserta info pengambilan.
  - AC2: Given pengajuan `DIAJUKAN`, When staf memilih `PERLU_REVISI` tanpa catatan, Then sistem menolak.
  - AC3: Given pengajuan melewati SLA, When staf membuka antrean, Then pengajuan ditandai "Terlambat".
  - AC4: Given metode DIGITAL, When staf menetapkan `SELESAI` dengan file hasil, Then mahasiswa dapat mengunduh dokumen dan status menjadi final.
- **Priority:** P0

#### FR-024 — Tracking Status Pengajuan

- **Nama fitur:** Tracking Status
- **Tujuan:** Mahasiswa mengetahui posisi pengajuan secara real-time.
- **Aktor:** MHS.
- **Deskripsi:** Tampilan timeline/stepper status dengan waktu tiap transisi, aktor (unit, bukan nama pribadi staf [REKOMENDASI]), catatan, estimasi selesai berdasarkan SLA, dan aksi yang dibutuhkan mahasiswa (mis. revisi).
- **User Story:** As a mahasiswa, I want melacak status pengajuan, so that saya tahu kapan dokumen selesai tanpa bertanya ke kampus.
- **Preconditions:** Memiliki pengajuan.
- **Trigger:** Membuka detail pengajuan / klik notifikasi.
- **Main Flow:** Sistem menampilkan stepper status, riwayat, estimasi, dan dokumen hasil (bila ada).
- **Alternative Flow:** A1: Status `PERLU_REVISI` → tombol "Perbaiki Persyaratan" dan hitung mundur batas revisi.
- **Exception Flow:** E1: Akses pengajuan milik orang lain → 404 (tidak mengungkap keberadaan).
- **Input:** pengajuan_id / nomor referensi.
- **Process:** Ambil status & history.
- **Output:** Timeline status.
- **Business Rules:** BR-003.
- **Validation:** Ownership.
- **Acceptance Criteria:**
  - AC1: Given status berubah, When mahasiswa membuka detail, Then timeline menampilkan status terbaru dengan timestamp WITA.
  - AC2: Given pengajuan milik mahasiswa lain, When diakses, Then respons 404.
- **Priority:** P0

#### FR-025 — Riwayat Pengajuan

- **Nama fitur:** Riwayat Pengajuan
- **Tujuan:** Menyediakan arsip pengajuan.
- **Aktor:** MHS (milik sendiri), STF_LYN (scope).
- **Deskripsi:** Daftar seluruh pengajuan dengan filter status, jenis, rentang tanggal; pencarian nomor referensi; unduh ulang dokumen hasil digital (selama masa retensi).
- **User Story:** As a mahasiswa, I want melihat riwayat seluruh pengajuan, so that saya dapat mengunduh ulang dokumen dan memantau pengajuan lama.
- **Preconditions:** Login.
- **Trigger:** Menu "Riwayat Layanan".
- **Main Flow:** Tampilkan daftar terurut terbaru → filter → buka detail.
- **Alternative Flow:** A1: "Ajukan lagi" — duplikasi form dari pengajuan lama (file tidak ikut disalin) [REKOMENDASI].
- **Exception Flow:** E1: Tidak ada data → empty state dengan CTA ke katalog layanan.
- **Input:** filter.
- **Process:** Query dengan pagination.
- **Output:** Daftar riwayat.
- **Business Rules:** BR-008.
- **Validation:** —
- **Acceptance Criteria:**
  - AC1: Given mahasiswa memiliki 12 pengajuan, When membuka riwayat, Then daftar tampil dengan pagination dan dapat difilter per status.
- **Priority:** P0

---
