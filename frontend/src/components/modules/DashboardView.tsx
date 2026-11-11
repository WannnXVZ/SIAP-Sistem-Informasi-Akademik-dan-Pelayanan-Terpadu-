'use client';

import React from 'react';
import { User, KrsRecord, PengajuanLayanan, LowonganMagang, LamaranMagang, PengaduanTiket, BeasiswaProgram } from '@/lib/types';
import { 
  GraduationCap, 
  FileText, 
  Briefcase, 
  MessageSquareWarning, 
  Sparkles, 
  ArrowUpRight, 
  Calendar, 
  BookOpen,
  TrendingUp,
  ShieldCheck,
  CheckCheck,
  ChevronRight,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  krs: KrsRecord;
  pengajuanList: PengajuanLayanan[];
  lowonganList: LowonganMagang[];
  lamaranList: LamaranMagang[];
  pengaduanList: PengaduanTiket[];
  beasiswaList: BeasiswaProgram[];
  onNavigate: (moduleKey: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  krs,
  pengajuanList,
  lowonganList,
  lamaranList,
  pengaduanList,
  onNavigate,
}) => {
  const role = currentUser.activeRole;
  const isMahasiswa = role === 'MHS';
  const isDosenWali = role === 'DWL';
  const isDosen = role === 'DSN';
  const isAdminAkademik = role === 'ADM_AKD';
  const isStafLayanan = role === 'STF_LYN';
  const isMitra = role === 'MTR';
  const isKoordinatorMagang = role === 'KRD_MGG';
  const isBeasiswaAdmin = role === 'ADM_BSW' || role === 'KMT_BSW';
  const isPetugasPengaduan = role === 'PTG_ADU';
  const isUnitPengaduan = role === 'UNIT_ADU';
  const isPimpinan = role === 'PMP';
  const isSuper = role === 'SUPER';

  // Computed counts
  const pendingLayananCount = pengajuanList.filter(p => p.status === 'DIAJUKAN' || p.status === 'DIPROSES').length;
  const readyPickupLayananCount = pengajuanList.filter(p => p.status === 'SIAP_DIAMBIL').length;
  const activeLowonganCount = lowonganList.filter(l => l.status === 'DIBUKA').length;
  const interviewCandidateCount = lamaranList.filter(l => l.status === 'WAWANCARA').length;
  const pendingAduanCount = pengaduanList.filter(t => t.status === 'DIAJUKAN').length;
  const sensitiveAduanCount = pengaduanList.filter(t => t.isSensitif).length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner with Role Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 dark:from-blue-950 dark:via-indigo-950 dark:to-cyan-950 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 border border-blue-500/20">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-blue-500/20 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 text-blue-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Semester Ganjil 2026/2027 • Politeknik Negeri Samarinda
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.name}!
          </h1>
          <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">
            {isMahasiswa && "Semua urusan rencana studi (KRS/KHS), permohonan surat administrasi tanpa antre, portal magang industri, dan beasiswa cerdas POLNES dalam satu genggaman."}
            {(isDosenWali || isDosen) && "Pantau progres bimbingan akademik mahasiswa, setujui rencana studi (KRS), dan unggah nilai perkuliahan secara akurat via sistem terintegrasi."}
            {isAdminAkademik && "Kelola kalender periode KRS, master penawaran mata kuliah, dan rekapitulasi nilai mahasiswa seluruh jurusan POLNES."}
            {isStafLayanan && "Kelola antrean permohonan dokumen mahasiswa, pantau SLA batas waktu kerja, dan layani pengambilan fisik di Loket No. 03 Direktorat POLNES."}
            {isMitra && "Kelola lowongan magang industri, seleksi snapshot CV mahasiswa yang aman, dan jadwalkan sesi wawancara dengan talenta POLNES."}
            {isKoordinatorMagang && "Pantau kurasi mitra industri, penempatan magang mahasiswa, dan kepatuhan pengisian logbook harian magang kampus."}
            {isBeasiswaAdmin && "Kelola program beasiswa cerdas dengan dukungan AI Profile Scanner, HITL Document Verifier, dan Shortlist Ranker berbobot transparan."}
            {(isPetugasPengaduan || isUnitPengaduan) && "Pusat penanganan aspirasi dan pengaduan mahasiswa POLNES dengan pelindung enkripsi identitas anonim dan SLA monitoring."}
            {isPimpinan && "Executive Leadership Dashboard POLNES: Analitik real-time serapan magang, SLA kepuasan layanan administrasi, dan kinerja akademik makro."}
            {isSuper && "Pusat Kendali Sistem Utama SIAP POLNES: Pengawasan konfigurasi global, audit trail immutable, dan tata kelola akun kampus."}
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-24 bottom-0 -mb-12 w-48 h-48 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none"></div>
      </div>

      {/* ROLE 1: MAHASISWA STATS */}
      {isMahasiswa && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('akademik')}
            className="p-5 rounded-2xl glass-panel hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                krs.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {krs.status}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{krs.totalSks} SKS</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Kartu Rencana Studi</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Lihat KRS <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('layanan')}
            className="p-5 rounded-2xl glass-panel hover:border-amber-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {readyPickupLayananCount > 0 ? 'Siap Diambil' : 'Diproses'}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {readyPickupLayananCount > 0 ? `${readyPickupLayananCount} Dokumen Fisik` : `${pengajuanList.length} Permohonan`}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Loket Layanan No. 03</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Cek Tiket <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('magang')}
            className="p-5 rounded-2xl glass-panel hover:border-purple-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                {lamaranList[0]?.status || 'Lamaran'}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {lamaranList[0]?.mitraNama ? 'Telkom Intern' : 'Portal Magang'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>{lamaranList[0]?.status === 'WAWANCARA' ? 'Sesi Wawancara Aktif' : 'Peluang Terbuka'}</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Buka <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('beasiswa')}
            className="p-5 rounded-2xl glass-panel hover:border-rose-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                Shortlist #3
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">88.5 Poin</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Kaltim Tuntas 2026</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Action Plan <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ROLE 2: DOSEN WALI & DOSEN PENGAMPU */}
      {(isDosenWali || isDosen) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('akademik')}
            className="p-5 rounded-2xl glass-panel hover:border-emerald-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <CheckCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Perlu Tindakan
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">2 KRS Mahasiswa</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Menunggu Persetujuan DPA</span>
              <span className="text-emerald-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Verifikasi <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('akademik')}
            className="p-5 rounded-2xl glass-panel hover:border-blue-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Semester 5
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">2 Kelas Diampu</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>TI-5A Rekayasa PL &amp; MTI</span>
              <span className="text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Detail <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('akademik')}
            className="p-5 rounded-2xl glass-panel hover:border-teal-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Excel Ready
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">Upload Nilai</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Format Chunked Baku</span>
              <span className="text-teal-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                Import <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Total Bimbingan Aktif</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">32 Mahasiswa</div>
            <p className="text-[11px] text-slate-500 mt-1">D3 Teknik Informatika Angkatan 2024 &amp; 2025.</p>
          </div>
        </div>
      )}

      {/* ROLE 3: ADMIN AKADEMIK */}
      {isAdminAkademik && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('akademik')}
            className="p-5 rounded-2xl glass-panel hover:border-indigo-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">Status Periode KRS</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">DIBUKA (Aktif)</div>
            <p className="text-[11px] text-slate-500 mt-2">Batas akhir revisi: 15 Okt 2026 23:59 WITA</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Total Mahasiswa Terdaftar</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">4.820 Mahasiswa</div>
            <p className="text-[11px] text-emerald-500 font-semibold mt-2">94.2% telah mengisi KRS</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Rasio Keterisian Kelas</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">89.4% Terisi</div>
            <p className="text-[11px] text-slate-500 mt-2">5 kelas mencapai kuota maksimum 100%</p>
          </div>

          <div 
            onClick={() => onNavigate('audit')}
            className="p-5 rounded-2xl glass-panel hover:border-cyan-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold mb-1">Audit Trail Akademik</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">Immutable Log</div>
            <p className="text-[11px] text-slate-500 mt-2">Seluruh mutasi KRS &amp; nilai tercatat</p>
          </div>
        </div>
      )}

      {/* ROLE 4: STAF LAYANAN */}
      {isStafLayanan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('layanan')}
            className="p-5 rounded-2xl glass-panel hover:border-amber-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Antrean Masuk</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                {pendingLayananCount} Surat
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{pendingLayananCount} Permohonan</div>
            <p className="text-[11px] text-slate-500 mt-1">Menunggu verifikasi berkas &amp; penomoran surat.</p>
          </div>

          <div 
            onClick={() => onNavigate('layanan')}
            className="p-5 rounded-2xl glass-panel hover:border-emerald-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Siap di Loket 03</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Fisik
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{readyPickupLayananCount} Dokumen</div>
            <p className="text-[11px] text-slate-500 mt-1">Siap diserahkan saat mahasiswa menunjukkan tiket.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Tingkat Kepatuhan SLA</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">98.4%</div>
            <p className="text-[11px] text-slate-500 mt-2">Rata-rata selesai dalam 1.2 hari kerja (Batas: 2 hari).</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Surat Diterbitkan Bulan Ini</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">248 Dokumen</div>
            <p className="text-[11px] text-slate-500 mt-2">Aktif Kuliah, Pengantar Magang &amp; Legalisir.</p>
          </div>
        </div>
      )}

      {/* ROLE 5 & 6: MITRA INDUSTRI & KOORDINATOR MAGANG */}
      {(isMitra || isKoordinatorMagang) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('magang')}
            className="p-5 rounded-2xl glass-panel hover:border-purple-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Lowongan Aktif</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                {activeLowonganCount} Posisi
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{activeLowonganCount} Lowongan</div>
            <p className="text-[11px] text-slate-500 mt-1">Katalog magang mitra industri terverifikasi POLNES.</p>
          </div>

          <div 
            onClick={() => onNavigate('magang')}
            className="p-5 rounded-2xl glass-panel hover:border-indigo-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Pelamar Masuk</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                ATS Mini
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">18 Mahasiswa</div>
            <p className="text-[11px] text-slate-500 mt-1">Snapshot CV terlindung privasi IPK mahasiswa.</p>
          </div>

          <div 
            onClick={() => onNavigate('magang')}
            className="p-5 rounded-2xl glass-panel hover:border-fuchsia-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">Jadwal Wawancara</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300 font-bold">
                Zoom Meeting
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{interviewCandidateCount} Kandidat</div>
            <p className="text-[11px] text-slate-500 mt-1">10 Oktober 2026, Pukul 10:00 WITA.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Mitra Industri Terdaftar</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">14 Perusahaan</div>
            <p className="text-[11px] text-slate-500 mt-2">Telkom, Astra, KPC, Badak NGL, BUMN.</p>
          </div>
        </div>
      )}

      {/* ROLE 7: PENGELOLA BEASISWA */}
      {isBeasiswaAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('beasiswa')}
            className="p-5 rounded-2xl glass-panel hover:border-rose-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Program Aktif</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                2 Program
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">Kaltim Tuntas &amp; POLNES</div>
            <p className="text-[11px] text-slate-500 mt-1">Total kuota gabungan: 75 mahasiswa penerima.</p>
          </div>

          <div 
            onClick={() => onNavigate('beasiswa')}
            className="p-5 rounded-2xl glass-panel hover:border-amber-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">HITL Verifier</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                OCR Berbantu
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">12 Berkas Menunggu</div>
            <p className="text-[11px] text-slate-500 mt-1">Verifikasi dokumen manusia-dalam-siklus (HITL).</p>
          </div>

          <div 
            onClick={() => onNavigate('beasiswa')}
            className="p-5 rounded-2xl glass-panel hover:border-indigo-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="text-xs text-slate-500 font-bold mb-1">Shortlist Ranker</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Bobot Transparan</div>
            <p className="text-[11px] text-slate-500 mt-2">IPK 40%, Ekonomi 40%, Prestasi 20%.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Dana Termin 1 Disalurkan</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Rp 280 Juta</div>
            <p className="text-[11px] text-slate-500 mt-2">Termin 2 dijadwalkan November 2026.</p>
          </div>
        </div>
      )}

      {/* ROLE 8 & 9: PETUGAS & UNIT PENGADUAN */}
      {(isPetugasPengaduan || isUnitPengaduan) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('pengaduan')}
            className="p-5 rounded-2xl glass-panel hover:border-orange-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">Tiket Baru</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold">
                Triage
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{pendingAduanCount} Tiket Masuk</div>
            <p className="text-[11px] text-slate-500 mt-1">Perlu verifikasi &amp; disposisi ke unit terkait.</p>
          </div>

          <div 
            onClick={() => onNavigate('pengaduan')}
            className="p-5 rounded-2xl glass-panel hover:border-rose-500/50 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Sensitif / PPKS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                Enkripsi
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{sensitiveAduanCount} Kasus Terlindungi</div>
            <p className="text-[11px] text-slate-500 mt-1">Identitas pelapor terenkripsi aman.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Rata-rata SLA Penyelesaian</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">1.8 Hari Kerja</div>
            <p className="text-[11px] text-slate-500 mt-2">Batas maksimum tanggapan awal: 48 jam.</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Indeks Kepuasan (CSAT)</div>
            <div className="text-2xl font-black text-amber-500">4.8 / 5.0 ★</div>
            <p className="text-[11px] text-slate-500 mt-2">Berdasarkan ulasan mahasiswa pelapor.</p>
          </div>
        </div>
      )}

      {/* ROLE 10 & 11: PIMPINAN (PMP) & SUPER ADMIN */}
      {(isPimpinan || isSuper) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Kepuasan Pelayanan Kampus (CSAT)</div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">96.4%</div>
            <p className="text-[11px] text-emerald-500 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +2.8% dibanding semester lalu
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">SLA Adherence Terpadu</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">98.2%</div>
            <p className="text-[11px] text-slate-500 mt-2">Surat &amp; aduan selesai tepat waktu</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Penyerapan Magang Industri</div>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">84.5%</div>
            <p className="text-[11px] text-slate-500 mt-2">Target IKU Kampus Vokasi tercapai</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel">
            <div className="text-xs text-slate-500 font-bold mb-1">Alokasi Beasiswa Terdistribusi</div>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400">Rp 450 Juta</div>
            <p className="text-[11px] text-slate-500 mt-2">Stimulan Kaltim Tuntas &amp; POLNES</p>
          </div>
        </div>
      )}

      {/* Callout Notice for Student or Staff */}
      {isMahasiswa && readyPickupLayananCount > 0 && (
        <div className="p-6 rounded-3xl glass-panel border border-amber-200 dark:border-amber-900/40 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Pemberitahuan Pengambilan Dokumen Fisik
                </span>
                <span className="text-xs font-semibold text-slate-500">Tiket: ADM-202610-0012</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Surat Keterangan Aktif Kuliah Siap Diambil di Loket 03
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dokumen cetak resmi bertanda tangan telah tersedia di <strong>Gedung Direktorat POLNES Lt. 1, Loket Layanan Terpadu No. 03</strong>. Jam operasional: 08.30 - 15.00 WITA.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('layanan')}
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition shadow-sm flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Buka Bukti Tiket Loket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Agenda & Module Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri 2/3: Hub Modul */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Modul Layanan Terintegrasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onNavigate('akademik')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                <span>Akademik &amp; SIAKAD</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                KRS online mandiri, deteksi bentrok jadwal kuliah, persetujuan DPA, dan engine import nilai Excel.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('layanan')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                <span>Layanan Administrasi</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pengajuan surat daring tanpa antre, tracking SLA real-time, dan pengambilan fisik di Loket No. 03.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('magang')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                <span>Portal Magang Industri</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Lowongan mitra terverifikasi, pelindung privasi IPK, rekrutmen ATS, dan logbook harian magang.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('beasiswa')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                <span>Beasiswa Cerdas (AI)</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                AI Profile Scanner, Deadline Forecaster, Document Verifier (HITL), dan Shortlist Ranker berbobot.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('pengaduan')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                <span>Pengaduan Mahasiswa</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kanal aduan terenkripsi anonim, penanganan kasus sensitif PPKS, disposisi unit, dan rating ulasan.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('audit')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                <span>Audit Trail &amp; Log</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Catatan mutasi data anti-tamper dengan timestamp WITA, identitas aktor, IP address, dan export CSV.
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan 1/3: Kalender Akademik & Agenda Penting */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Batas Waktu &amp; Agenda
          </h2>

          <div className="p-6 rounded-3xl glass-panel space-y-3">
            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">Akademik POLNES</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                  H-11
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Batas Akhir Revisi KRS Ganjil</div>
              <div className="text-[11px] text-slate-500">15 Oktober 2026, 23:59 WITA</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">Beasiswa Cerdas</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">
                  H-16
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Tutup Pendaftaran Kaltim Tuntas</div>
              <div className="text-[11px] text-slate-500">20 Oktober 2026, 23:59 WITA</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400">Magang Industri</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold">
                  H-21
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Tutup Lowongan PT Telkom Indonesia</div>
              <div className="text-[11px] text-slate-500">25 Oktober 2026, 23:59 WITA</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-100 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Layanan Loket 03</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold">
                  Jam Layanan
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Gedung Direktorat Lt. 1</div>
              <div className="text-[11px] text-slate-500">Senin - Jumat: 08.30 - 15.00 WITA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
