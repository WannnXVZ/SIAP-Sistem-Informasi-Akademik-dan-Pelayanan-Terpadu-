// TypeScript Types untuk SIAP POLNES berdasarkan PRD & Implementation Plan

export type UserRole = 
  | 'MHS'      // Mahasiswa
  | 'DSN'      // Dosen Pengampu
  | 'DWL'      // Dosen Wali
  | 'ADM_AKD'  // Admin Akademik
  | 'STF_LYN'  // Staf Layanan Administrasi
  | 'PTG_ADU'  // Petugas Pengaduan
  | 'UNIT_ADU' // Unit Penindak Lanjut
  | 'KRD_MGG'  // Koordinator Magang
  | 'MTR'      // Mitra Industri
  | 'ADM_BSW'  // Pengelola Beasiswa
  | 'KMT_BSW'  // Komite Beasiswa
  | 'PMP'      // Pimpinan Kampus
  | 'SUPER';   // Super Admin

export interface User {
  id: string;
  name: string;
  identifier: string; // NIM atau NIP atau Email
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  avatar?: string;
  phone?: string;
  prodi?: string;
  jurusan?: string;
  semester?: number;
  ipk?: number;
  dosenWaliId?: string;
}

// 1. Modul Akademik
export interface MataKuliah {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  jenis: 'Wajib' | 'Pilihan';
  prasyarat?: string[];
}

export interface KelasKuliah {
  id: string;
  mkId: string;
  mkKode: string;
  mkNama: string;
  sks: number;
  namaKelas: string;
  dosenPengampu: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  ruang: string;
  kuota: number;
  terisi: number;
}

export interface KrsItem {
  id: string;
  kelasId: string;
  kelas: KelasKuliah;
  status: 'DRAFT' | 'DIAJUKAN' | 'DISETUJUI' | 'PERLU_REVISI';
  nilaiAngka?: number;
  nilaiHuruf?: string;
  bobot?: number;
}

export interface KrsRecord {
  id: string;
  mahasiswaId: string;
  periode: string;
  status: 'DRAFT' | 'DIAJUKAN' | 'DISETUJUI' | 'PERLU_REVISI';
  totalSks: number;
  maxSks: number;
  items: KrsItem[];
  catatanDosenWali?: string;
  diajukanAt?: string;
  disetujuiAt?: string;
}

export interface AdviseeKrs {
  id: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  mahasiswaNim: string;
  prodi: string;
  semester: number;
  ipkLalu: number;
  maxSks: number;
  totalSks: number;
  status: 'DRAFT' | 'DIAJUKAN' | 'DISETUJUI' | 'PERLU_REVISI';
  catatanDosenWali?: string;
  items: KrsItem[];
  diajukanAt?: string;
  disetujuiAt?: string;
}

export interface MagangLogbook {
  id: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  mitraNama: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  aktivitas: string;
  pencapaian: string;
  statusVerifikasi: 'MENUNGGU' | 'DISETUJUI' | 'PERLU_REVISI';
  catatanPembimbing?: string;
}

// 2. Modul Layanan Administrasi
export type LayananStatus = 
  | 'DRAFT' 
  | 'DIAJUKAN' 
  | 'DIVERIFIKASI' 
  | 'DIPROSES' 
  | 'SELESAI' 
  | 'SIAP_DIAMBIL' 
  | 'DIAMBIL' 
  | 'PERLU_REVISI' 
  | 'DITOLAK' 
  | 'DIBATALKAN';

export interface PersyaratanDoc {
  id: string;
  nama: string;
  wajib: boolean;
  fileUrl?: string;
  fileName?: string;
  statusVerifikasi?: 'MENUNGGU' | 'VALID' | 'TIDAK_VALID';
  catatan?: string;
}

export interface PengajuanLayanan {
  id: string;
  nomor: string; // ADM-202610-0012
  mahasiswaId: string;
  mahasiswaNama: string;
  mahasiswaNim: string;
  mahasiswaProdi: string;
  jenisLayananId: string;
  jenisLayananNama: string;
  metodePenyerahan: 'DIGITAL' | 'FISIK' | 'KEDUANYA';
  keperluan: string;
  status: LayananStatus;
  persyaratan: PersyaratanDoc[];
  slaDueAt: string;
  fileHasilUrl?: string;
  fileHasilNama?: string;
  infoPengambilan?: {
    lokasi: string;
    jamLayanan: string;
    batasPengambilan: string;
  };
  catatanStaf?: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Modul Magang
export type LamaranMagangStatus = 
  | 'DIKIRIM' 
  | 'DILIHAT' 
  | 'SELEKSI' 
  | 'WAWANCARA' 
  | 'DITERIMA' 
  | 'DITOLAK' 
  | 'DIKONFIRMASI_MAHASISWA';

export interface LowonganMagang {
  id: string;
  mitraId: string;
  mitraNama: string;
  mitraLogo?: string;
  judul: string;
  bidang: string;
  lokasi: string;
  modeKerja: 'Onsite' | 'Remote' | 'Hybrid';
  durasiBulan: number;
  kuota: number;
  tunjangan?: string;
  prodiRelevan: string[];
  keterampilan: string[];
  deskripsi: string;
  tglTutup: string;
  status: 'DIBUKA' | 'DITUTUP' | 'MENUNGGU_MODERASI';
  jumlahPelamar: number;
}

export interface LamaranMagang {
  id: string;
  nomor: string;
  lowonganId: string;
  lowonganJudul: string;
  mitraNama: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  mahasiswaNim: string;
  mahasiswaProdi: string;
  mahasiswaIpk?: number;
  tampilkanIpk: boolean;
  status: LamaranMagangStatus;
  jadwalWawancara?: {
    tanggal: string;
    waktu: string;
    lokasiOrLink: string;
  };
  catatanMitra?: string;
  createdAt: string;
}

// 4. Modul Pengaduan
export type PengaduanStatus = 
  | 'DIAJUKAN' 
  | 'DIVERIFIKASI' 
  | 'DIPROSES' 
  | 'DITINDAKLANJUTI' 
  | 'SELESAI' 
  | 'PERLU_INFO' 
  | 'DITOLAK';

export interface PengaduanTiket {
  id: string;
  nomor: string; // TKT-202610-0005
  pelaporId: string;
  pelaporNama: string;
  pelaporNim: string;
  rahasiakanIdentitas: boolean;
  kategori: 'Akademik' | 'Sarana & Prasarana' | 'Layanan Administrasi' | 'Keuangan' | 'Kekerasan/Etika' | 'Lainnya';
  isSensitif: boolean;
  judul: string;
  deskripsi: string;
  lampiran?: string[];
  unitTerkait?: string;
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';
  status: PengaduanStatus;
  tanggapan: {
    id: string;
    author: string;
    role: string;
    isi: string;
    tipe: 'PUBLIK' | 'INTERNAL';
    createdAt: string;
  }[];
  rating?: number;
  ratingKomentar?: string;
  createdAt: string;
  updatedAt: string;
}

// 5. Modul Beasiswa Cerdas
export interface BeasiswaProgram {
  id: string;
  nama: string;
  penyelenggara: string;
  tipe: 'INTERNAL' | 'EKSTERNAL';
  manfaat: string;
  kuota: number;
  tglBuka: string;
  tglTutup: string;
  kriteria: {
    ipkMin?: number;
    semesterMin?: number;
    semesterMax?: number;
    prodiWhitelist?: string[];
    penghasilanOrtuMax?: number;
  };
  persyaratanDokumen: {
    id: string;
    nama: string;
    estimasiHari: number;
    wajib: boolean;
  }[];
  bobotShortlist: {
    kriteria: string;
    bobotPersen: number;
  }[];
  status: 'DIBUKA' | 'DITUTUP';
}

export interface ScholarshipMatchResult {
  beasiswaId: string;
  matchScore: number; // 0 - 100
  status: 'LAYAK' | 'BERPOTENSI' | 'TIDAK_LAYAK';
  alasan: {
    kriteria: string;
    lolos: boolean;
    detail: string;
    poin?: string;
  }[];
  readinessScore: number;
  readinessKategori: 'SIAP' | 'AMAN' | 'BERISIKO' | 'KRITIS' | 'TIDAK_TERKEJAR';
  dokumenKurang: string[];
  actionPlan: string[];
}

export interface PendaftaranBeasiswa {
  id: string;
  nomor: string; // BSW-202610-0031
  beasiswaId: string;
  beasiswaNama: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  mahasiswaNim: string;
  mahasiswaIpk: number;
  penghasilanOrtu: number;
  dokumen: {
    id: string;
    nama: string;
    fileUrl?: string;
    ocrDetectedName?: string;
    ocrConfidence?: number;
    statusVerifikasi: 'MENUNGGU' | 'VALID' | 'PERLU_REVISI';
    catatan?: string;
  }[];
  shortlistScore?: number;
  shortlistRank?: number;
  shortlistJustifikasi?: {
    kriteria: string;
    nilai: number | string;
    skorNormal: number;
    bobot: number;
    kontribusi: number;
  }[];
  status: 'DIAJUKAN' | 'TERVERIFIKASI' | 'SHORTLIST' | 'DITERIMA' | 'TIDAK_LOLOS';
  tahapPencairan?: {
    termin: number;
    nominal: string;
    status: 'DIJADWALKAN' | 'DIPROSES' | 'DICAIRKAN';
    tglCair?: string;
  }[];
  createdAt: string;
}

// 6. Notifikasi
export interface NotifikasiItem {
  id: string;
  userId: string;
  kategori: 'Akademik' | 'Administrasi' | 'Magang' | 'Pengaduan' | 'Beasiswa' | 'Sistem';
  judul: string;
  isi: string;
  deepLink?: string;
  read: boolean;
  createdAt: string;
}

// 7. Audit Trail
export interface AuditLogItem {
  id: string;
  actor: string;
  role: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ip: string;
  timestamp: string;
}
