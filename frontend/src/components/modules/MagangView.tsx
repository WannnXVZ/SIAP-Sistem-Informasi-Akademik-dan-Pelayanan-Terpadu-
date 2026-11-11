'use client';

import React, { useState } from 'react';
import { User, LowonganMagang, LamaranMagang, MagangLogbook } from '@/lib/types';
import { MOCK_LOGBOOK_MAGANG } from '@/lib/mockData';
import { 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  Search, 
  Video, 
  Building,
  Eye,
  Shield,
  Send,
  Plus,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink,
  EyeOff,
  X,
  ShieldCheck
} from 'lucide-react';

interface MagangViewProps {
  currentUser: User;
  lowonganList: LowonganMagang[];
  lamaranList: LamaranMagang[];
  onUpdateLamaran: (newList: LamaranMagang[]) => void;
  onUpdateLowongan: (newList: LowonganMagang[]) => void;
}

export const MagangView: React.FC<MagangViewProps> = ({
  currentUser,
  lowonganList,
  lamaranList,
  onUpdateLamaran,
  onUpdateLowongan,
}) => {
  const isMitra = currentUser.activeRole === 'MTR';
  const isKoordinator = currentUser.activeRole === 'KRD_MGG';
  const isMahasiswa = currentUser.activeRole === 'MHS';
  const isPimpinan = currentUser.activeRole === 'PMP';

  const defaultTab = isMitra ? 'mitra_portal' : isKoordinator ? 'koordinator' : 'lowongan';
  const [activeTab, setActiveTab] = useState<'lowongan' | 'cv_builder' | 'lamaran_saya' | 'logbook' | 'mitra_portal' | 'koordinator'>(defaultTab);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'SEMUA' | 'Onsite' | 'Remote' | 'Hybrid'>('SEMUA');
  const [selectedLowongan, setSelectedLowongan] = useState<LowonganMagang | null>(null);

  // Privacy Protection Toggle for GPA
  const [tampilkanIpk, setTampilkanIpk] = useState<boolean>(true);

  // CV Builder State
  const [keahlianInput, setKeahlianInput] = useState<string>('React, Next.js, TypeScript, PostgreSQL, Tailwind CSS, Docker');
  const [proyekInput, setProyekInput] = useState<string>('Sistem Informasi Akademik & Pelayanan Terpadu POLNES (SIAP), Dashboard IoT Monitoring Cuaca.');
  const [linkGithub, setLinkGithub] = useState<string>('https://github.com/ariefirawan-polnes');

  // Logbook State
  const [logbooks, setLogbooks] = useState<MagangLogbook[]>(MOCK_LOGBOOK_MAGANG);
  const [newLogTanggal, setNewLogTanggal] = useState<string>('16 Oktober 2026');
  const [newLogJamMulai, setNewLogJamMulai] = useState<string>('08:00');
  const [newLogJamSelesai, setNewLogJamSelesai] = useState<string>('17:00');
  const [newLogAktivitas, setNewLogAktivitas] = useState<string>('');
  const [newLogPencapaian, setNewLogPencapaian] = useState<string>('');

  // Mitra Post Job Modal
  const [showNewJobModal, setShowNewJobModal] = useState<boolean>(false);
  const [newJobJudul, setNewJobJudul] = useState<string>('');
  const [newJobBidang] = useState<string>('Software Engineering');
  const [newJobMode, setNewJobMode] = useState<'Onsite' | 'Remote' | 'Hybrid'>('Hybrid');
  const [newJobKuota, setNewJobKuota] = useState<number>(3);
  const [newJobTunjangan, setNewJobTunjangan] = useState<string>('Rp 2.500.000 / bulan + Uang Transport');
  const [newJobDeskripsi, setNewJobDeskripsi] = useState<string>('');

  // Mitra Schedule Interview Modal
  const [interviewApplicantId, setInterviewApplicantId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState<string>('18 Oktober 2026');
  const [interviewTime, setInterviewTime] = useState<string>('10:00 WITA');
  const [interviewLink, setInterviewLink] = useState<string>('Zoom Meeting ID: 855 4321 9876 (Passcode: POLNES2026)');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const filteredLowongan = lowonganList.filter(l => {
    const matchSearch = l.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.mitraNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.bidang.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMode = filterMode === 'SEMUA' || l.modeKerja === filterMode;
    return matchSearch && matchMode;
  });

  const handleKirimLamaran = (lowongan: LowonganMagang) => {
    const existing = lamaranList.find(l => l.lowonganId === lowongan.id && l.mahasiswaId === currentUser.id);
    if (existing) {
      alert('Anda sudah pernah mengirim lamaran untuk lowongan ini.');
      return;
    }

    const newLamaran: LamaranMagang = {
      id: `lmr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nomor: `LMR-202610-${Math.floor(1000 + Math.random() * 9000)}`,
      lowonganId: lowongan.id,
      lowonganJudul: lowongan.judul,
      mitraNama: lowongan.mitraNama,
      mahasiswaId: currentUser.id,
      mahasiswaNama: currentUser.name,
      mahasiswaNim: currentUser.identifier,
      mahasiswaProdi: currentUser.prodi || 'D3 Teknik Informatika',
      mahasiswaIpk: currentUser.ipk,
      tampilkanIpk,
      status: 'DIKIRIM',
      createdAt: new Date().toISOString(),
    };

    onUpdateLamaran([newLamaran, ...lamaranList]);
    setSelectedLowongan(null);
    setActiveTab('lamaran_saya');
    setFeedbackMsg(`Lamaran berhasil dikirim ke ${lowongan.mitraNama}! Snapshot profil CV Anda telah tersimpan.`);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const handleUpdateStatusKandidat = (lamaranId: string, status: LamaranMagang['status'], extra?: { catatan?: string }) => {
    const updated = lamaranList.map(lmr => {
      if (lmr.id === lamaranId) {
        return {
          ...lmr,
          status,
          jadwalWawancara: status === 'WAWANCARA' ? {
            tanggal: interviewDate,
            waktu: interviewTime,
            lokasiOrLink: interviewLink,
          } : lmr.jadwalWawancara,
          catatanMitra: extra?.catatan || lmr.catatanMitra,
        };
      }
      return lmr;
    });

    onUpdateLamaran(updated);
    setInterviewApplicantId(null);
    setFeedbackMsg(`Status pelamar berhasil diperbarui menjadi: ${status}`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleModerateJob = (jobId: string, newStatus: LowonganMagang['status']) => {
    const updated = lowonganList.map(l => {
      if (l.id === jobId) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    onUpdateLowongan(updated);
    setFeedbackMsg(`Status lowongan berhasil diubah menjadi: ${newStatus}`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleAddLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogAktivitas.trim()) {
      alert('Mohon isi uraian aktivitas harian magang.');
      return;
    }

    const newEntry: MagangLogbook = {
      id: `lgb-${Date.now()}`,
      mahasiswaId: currentUser.id,
      mahasiswaNama: currentUser.name,
      mitraNama: 'PT Telkom Indonesia',
      tanggal: newLogTanggal,
      jamMulai: newLogJamMulai,
      jamSelesai: newLogJamSelesai,
      aktivitas: newLogAktivitas,
      pencapaian: newLogPencapaian || 'Menyelesaikan target tugas harian pembimbing lapangan.',
      statusVerifikasi: 'MENUNGGU',
    };

    setLogbooks([newEntry, ...logbooks]);
    setNewLogAktivitas('');
    setNewLogPencapaian('');
    setFeedbackMsg('Logbook harian magang berhasil disimpan & diteruskan ke pembimbing industri!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobJudul.trim()) return;

    const newLowongan: LowonganMagang = {
      id: `mgg-${Date.now()}`,
      mitraId: currentUser.id,
      mitraNama: currentUser.name || 'PT Telkom Indonesia',
      mitraLogo: '🏢',
      judul: newJobJudul,
      bidang: newJobBidang,
      lokasi: 'Samarinda / Balikpapan',
      modeKerja: newJobMode,
      durasiBulan: 6,
      kuota: newJobKuota,
      tunjangan: newJobTunjangan,
      prodiRelevan: ['D3 Teknik Informatika', 'D4 Rekayasa Perangkat Lunak'],
      keterampilan: ['React', 'TypeScript', 'API Integration'],
      deskripsi: newJobDeskripsi || 'Program magang bersertifikat industri untuk talenta vokasi POLNES.',
      tglTutup: '2026-11-15',
      status: 'DIBUKA',
      jumlahPelamar: 0,
    };

    onUpdateLowongan([newLowongan, ...lowonganList]);
    setShowNewJobModal(false);
    setNewJobJudul('');
    setNewJobDeskripsi('');
    setFeedbackMsg(`Lowongan baru "${newLowongan.judul}" berhasil dipublikasikan ke mahasiswa POLNES!`);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-fuchsia-700 dark:from-purple-950 dark:via-indigo-950 dark:to-neutral-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10 border border-purple-500/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-purple-500/20 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 text-purple-100">
              <Building className="w-3.5 h-3.5 text-purple-300" />
              Kemitraan Industri Resmi &amp; Perlindungan Privasi IPK Mahasiswa
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Portal Magang Industri &amp; Rekrutmen Talenta POLNES
            </h1>
            <p className="text-purple-100/90 text-xs sm:text-sm leading-relaxed">
              Jelajahi lowongan magang mitra kampus terverifikasi, kirim berkas snapshot CV aman tanpa kompromi privasi nilai, kelola seleksi kandidat ATS mini, dan catat logbook harian industri.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/20 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 self-start lg:self-center">
            <button
              onClick={() => setActiveTab('lowongan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'lowongan' ? 'bg-white text-purple-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Katalog Lowongan ({lowonganList.length})
            </button>

            {isMahasiswa && (
              <button
                onClick={() => setActiveTab('cv_builder')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'cv_builder' ? 'bg-white text-purple-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Profil &amp; CV Saya
              </button>
            )}

            {isMahasiswa && (
              <button
                onClick={() => setActiveTab('lamaran_saya')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'lamaran_saya' ? 'bg-white text-purple-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Lamaran Saya ({lamaranList.length})
              </button>
            )}

            {(isMahasiswa || isKoordinator) && (
              <button
                onClick={() => setActiveTab('logbook')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'logbook' ? 'bg-white text-purple-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Logbook Harian ({logbooks.length})
              </button>
            )}

            {(isMitra || isKoordinator || isPimpinan) && (
              <button
                onClick={() => setActiveTab('mitra_portal')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'mitra_portal' ? 'bg-white text-purple-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Portal Mitra ({lamaranList.length} Pelamar)
              </button>
            )}

            {(isKoordinator || isPimpinan) && (
              <button
                onClick={() => setActiveTab('koordinator')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'koordinator' ? 'bg-white text-purple-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Monitoring Kampus
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 rounded-full bg-purple-400/15 blur-2xl pointer-events-none" />
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CARI LOWONGAN MAGANG */}
      {/* ========================================================================= */}
      {activeTab === 'lowongan' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari lowongan, mitra industri, keahlian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as 'SEMUA' | 'Onsite' | 'Remote' | 'Hybrid')}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="SEMUA">Semua Mode Kerja</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
              </select>

              {isMitra && (
                <button
                  onClick={() => setShowNewJobModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Pasang Lowongan
                </button>
              )}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLowongan.map(job => (
              <div
                key={job.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-lg transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg font-bold">
                      {job.mitraLogo || '🏢'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{job.judul}</h3>
                      <p className="text-xs text-slate-500 font-medium">{job.mitraNama}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {job.modeKerja}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {job.deskripsi}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {job.keterampilan.map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" /> {job.lokasi}
                  </span>
                  <span>Uang Saku: <strong className="text-emerald-600">{job.tunjangan?.split('+')[0]}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    Batas: {job.tglTutup} • {job.jumlahPelamar} Pelamar
                  </span>
                  <button
                    onClick={() => setSelectedLowongan(job)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
                  >
                    Detail &amp; Lamar <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROFIL / CV BUILDER MAHASISWA */}
      {/* ========================================================================= */}
      {activeTab === 'cv_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Profil Snapshot CV Mahasiswa (ATS Friendly)
              </h3>
              <p className="text-xs text-slate-500">
                Data snapshot ini akan dikunci saat Anda mengirim lamaran ke mitra industri untuk mencegah manipulasi resume.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Nama Lengkap:</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400">NIM &amp; Program Studi:</label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.identifier} • ${currentUser.prodi || 'D3 Teknik Informatika'}`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* PRIVACY TOGGLE IPK */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-200 dark:border-purple-900/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Perlindungan Privasi IPK Mahasiswa</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Nilai IPK Anda ({currentUser.ipk}) {tampilkanIpk ? 'akan ditampilkan ke mitra industri.' : 'akan disembunyikan untuk seleksi berbasis portofolio murni.'}
                  </p>
                </div>
                <button
                  onClick={() => setTampilkanIpk(!tampilkanIpk)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    tampilkanIpk ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tampilkanIpk ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {tampilkanIpk ? 'IPK Ditampilkan' : 'IPK Dirahasiakan'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Daftar Keterampilan Teknis (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  value={keahlianInput}
                  onChange={(e) => setKeahlianInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Pengalaman Proyek &amp; Portofolio Unggulan:
                </label>
                <textarea
                  rows={3}
                  value={proyekInput}
                  onChange={(e) => setProyekInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Tautan Profil GitHub / Portofolio Web:
                </label>
                <input
                  type="url"
                  value={linkGithub}
                  onChange={(e) => setLinkGithub(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => {
                    setFeedbackMsg('Profil snapshot CV Anda berhasil diperbarui!');
                    setTimeout(() => setFeedbackMsg(null), 3500);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-md shadow-purple-500/20"
                >
                  Simpan Perubahan CV
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau ATS Card */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl glass-panel space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200">Pratinjau Snapshot CV</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ATS Score 92%
                </span>
              </div>

              <div className="space-y-2">
                <div className="font-black text-sm text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-slate-500">{currentUser.prodi} • Politeknik Negeri Samarinda</div>
                <div className="text-slate-500 font-mono">
                  IPK: {tampilkanIpk ? <strong className="text-blue-600">{currentUser.ipk}</strong> : 'Terselubung (Fair Review)'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-600 dark:text-slate-400 block">Keahlian:</span>
                <div className="flex flex-wrap gap-1">
                  {keahlianInput.split(',').map((k, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold">
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-600 dark:text-slate-400 block">Tautan Portofolio:</span>
                <a href={linkGithub} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline flex items-center gap-1 font-semibold truncate">
                  {linkGithub} <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LAMARAN SAYA (MAHASISWA TRACKER) */}
      {/* ========================================================================= */}
      {activeTab === 'lamaran_saya' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Status Pengajuan Lamaran Magang Anda ({lamaranList.length})
            </h3>
          </div>

          <div className="space-y-3">
            {lamaranList.map(lmr => (
              <div
                key={lmr.id}
                className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">{lmr.nomor}</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{lmr.lowonganJudul}</h4>
                    <p className="text-xs text-slate-500">{lmr.mitraNama}</p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    lmr.status === 'WAWANCARA' ? 'bg-purple-100 text-purple-800 ring-2 ring-purple-400/20' :
                    lmr.status === 'DITERIMA' ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400/20' :
                    lmr.status === 'SELEKSI' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    Status: {lmr.status}
                  </span>
                </div>

                {/* Sesi Wawancara Card */}
                {lmr.status === 'WAWANCARA' && lmr.jadwalWawancara && (
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-purple-800 dark:text-purple-300">
                      <Video className="w-4 h-4 text-purple-600" />
                      <span>Undangan Wawancara Virtual Resmi Mitra Industri</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>Waktu: <strong>{lmr.jadwalWawancara.tanggal}, {lmr.jadwalWawancara.waktu}</strong></div>
                      <div>Tautan: <strong className="text-purple-600">{lmr.jadwalWawancara.lokasiOrLink}</strong></div>
                    </div>
                    {lmr.catatanMitra && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-purple-200 dark:border-purple-900">
                        Catatan HRD: {lmr.catatanMitra}
                      </p>
                    )}
                  </div>
                )}

                {/* Offering Diterima Card */}
                {lmr.status === 'DITERIMA' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Selamat! Anda Diterima Magang Resmi</div>
                        <div className="text-[11px] text-slate-500">Konfirmasi penerimaan untuk menerbitkan Surat Pengantar Magang ke kampus.</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleUpdateStatusKandidat(lmr.id, 'DIKONFIRMASI_MAHASISWA');
                        alert('Selamat! Anda telah mengonfirmasi penerimaan penawaran magang. Silakan isi Logbook Harian.');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
                    >
                      Konfirmasi Penerimaan Magang
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Diajukan pada: {new Date(lmr.createdAt).toLocaleDateString('id-ID')}</span>
                  <span>Privasi IPK: {lmr.tampilkanIpk ? 'Ditampilkan' : 'Terselubung (Aman)'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LOGBOOK HARIAN MAGANG */}
      {/* ========================================================================= */}
      {activeTab === 'logbook' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri 2/3: Riwayat Logbook */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Riwayat Logbook Harian Magang Mahasiswa ({logbooks.length})
              </h3>
            </div>

            <div className="space-y-3">
              {logbooks.map(lb => (
                <div key={lb.id} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{lb.tanggal}</span>
                        <span className="text-slate-400 font-mono">({lb.jamMulai} - {lb.jamSelesai} WITA)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{lb.mitraNama} • {lb.mahasiswaNama}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lb.statusVerifikasi === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                      lb.statusVerifikasi === 'PERLU_REVISI' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lb.statusVerifikasi}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Uraian Aktivitas:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{lb.aktivitas}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Pencapaian:</span>
                    <p className="text-slate-600 dark:text-slate-400">{lb.pencapaian}</p>
                  </div>

                  {lb.catatanPembimbing && (
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 text-[11px]">
                      <strong>Catatan Pembimbing:</strong> {lb.catatanPembimbing}
                    </div>
                  )}

                  {isKoordinator && lb.statusVerifikasi === 'MENUNGGU' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          const updated = logbooks.map(l => l.id === lb.id ? { ...l, statusVerifikasi: 'DISETUJUI' as const } : l);
                          setLogbooks(updated);
                          setFeedbackMsg('Logbook disetujui oleh Koordinator Kampus.');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                      >
                        Setujui Logbook
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan 1/3: Form Tambah Logbook Harian */}
          {isMahasiswa && (
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Catat Logbook Harian Baru
              </h4>
              <form onSubmit={handleAddLogbook} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Tanggal Kegiatan:</label>
                  <input
                    type="text"
                    value={newLogTanggal}
                    onChange={(e) => setNewLogTanggal(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Mulai:</label>
                    <input
                      type="text"
                      value={newLogJamMulai}
                      onChange={(e) => setNewLogJamMulai(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Selesai:</label>
                    <input
                      type="text"
                      value={newLogJamSelesai}
                      onChange={(e) => setNewLogJamSelesai(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Uraian Aktivitas Kerja:</label>
                  <textarea
                    required
                    rows={3}
                    value={newLogAktivitas}
                    onChange={(e) => setNewLogAktivitas(e.target.value)}
                    placeholder="Apa saja yang Anda kerjakan hari ini..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Pencapaian / Deliverables:</label>
                  <input
                    type="text"
                    value={newLogPencapaian}
                    onChange={(e) => setNewLogPencapaian(e.target.value)}
                    placeholder="Hasil kerja, commit PR, atau modul selesai..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm"
                >
                  Kirim Logbook Harian
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PORTAL MITRA INDUSTRI (ATS MINI & REKRUTMEN) */}
      {/* ========================================================================= */}
      {activeTab === 'mitra_portal' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Dashboard Rekrutmen Mitra Industri • PT Telkom Indonesia
              </h3>
              <p className="text-xs text-slate-500">
                Kelola pelamar magang kampus POLNES, jadwalkan wawancara, dan kirim penawaran resmi.
              </p>
            </div>

            <button
              onClick={() => setShowNewJobModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Pasang Lowongan Baru
            </button>
          </div>

          {/* Applicant Queue Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Pelamar</th>
                  <th className="p-3">Posisi Dilamar</th>
                  <th className="p-3">Status IPK</th>
                  <th className="p-3">Tahap Seleksi</th>
                  <th className="p-3 text-right">Tindakan Rekruter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {lamaranList.map(lmr => (
                  <tr key={lmr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{lmr.mahasiswaNama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">NIM: {lmr.mahasiswaNim} • {lmr.mahasiswaProdi}</div>
                    </td>
                    <td className="p-3 font-semibold">{lmr.lowonganJudul}</td>
                    <td className="p-3">
                      {lmr.tampilkanIpk && lmr.mahasiswaIpk ? (
                        <span className="font-bold text-blue-600">{lmr.mahasiswaIpk.toFixed(2)}</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                          Dirahasiakan (Skills Only)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {lmr.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleUpdateStatusKandidat(lmr.id, 'SELEKSI')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px]"
                      >
                        Lolos CV
                      </button>
                      <button
                        onClick={() => {
                          setInterviewApplicantId(lmr.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px]"
                      >
                        Jadwalkan Wawancara
                      </button>
                      <button
                        onClick={() => handleUpdateStatusKandidat(lmr.id, 'DITERIMA')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                      >
                        Terima
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: MONITORING KAMPUS (KOORDINATOR MAGANG) */}
      {/* ========================================================================= */}
      {activeTab === 'koordinator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel space-y-1">
              <span className="text-xs font-bold text-slate-500">Mahasiswa Aktif Magang</span>
              <div className="text-2xl font-black text-purple-600">342 Mahasiswa</div>
              <p className="text-[11px] text-slate-500">Tersebar di 14 mitra industri</p>
            </div>
            <div className="p-5 rounded-2xl glass-panel space-y-1">
              <span className="text-xs font-bold text-slate-500">Tingkat Keterserapan Magang</span>
              <div className="text-2xl font-black text-emerald-600">84.5%</div>
              <p className="text-[11px] text-slate-500">Mencapai target IKU-2 Vokasi</p>
            </div>
            <div className="p-5 rounded-2xl glass-panel space-y-1">
              <span className="text-xs font-bold text-slate-500">Kepatuhan Logbook Harian</span>
              <div className="text-2xl font-black text-indigo-600">91.8%</div>
              <p className="text-[11px] text-slate-500">Terisi rutin per minggu</p>
            </div>
            <div className="p-5 rounded-2xl glass-panel space-y-1">
              <span className="text-xs font-bold text-slate-500">Evaluasi Pembimbing Industri</span>
              <div className="text-2xl font-black text-amber-500">4.9 / 5.0 ★</div>
              <p className="text-[11px] text-slate-500">Puas dengan performa mahasiswa</p>
            </div>
          </div>

          {/* Vacancy Moderation Queue (FR-031) */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  Moderasi &amp; Kurasi Lowongan Mitra Industri (FR-031)
                </h3>
                <p className="text-xs text-slate-500">
                  Pastikan kesesuaian kompetensi vokasi, tunjangan layak, dan legalitas kerjasama mitra industri POLNES.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Total {lowonganList.length} Lowongan Terdaftar
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                  <tr>
                    <th className="p-3">Mitra Industri</th>
                    <th className="p-3">Posisi Lowongan</th>
                    <th className="p-3">Mode &amp; Lokasi</th>
                    <th className="p-3">Kuota &amp; Tunjangan</th>
                    <th className="p-3 text-center">Status Moderasi</th>
                    <th className="p-3 text-right">Aksi Koordinator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {lowonganList.map((low) => (
                    <tr key={low.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{low.mitraNama}</div>
                        <div className="text-[11px] text-slate-400">Tutup: {low.tglTutup}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-purple-600 dark:text-purple-400">{low.judul}</div>
                        <div className="text-[11px] text-slate-500">{low.bidang}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {low.modeKerja}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">{low.lokasi}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold">{low.kuota} Mahasiswa</div>
                        <div className="text-[11px] text-emerald-600">{low.tunjangan || '-'}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          low.status === 'DIBUKA' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          low.status === 'MENUNGGU_MODERASI' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {low.status === 'MENUNGGU_MODERASI' ? 'MENUNGGU MODERASI' : low.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {low.status === 'MENUNGGU_MODERASI' ? (
                          <>
                            <button
                              onClick={() => handleModerateJob(low.id, 'DIBUKA')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm"
                            >
                              Setujui &amp; Tayangkan
                            </button>
                            <button
                              onClick={() => handleModerateJob(low.id, 'DITUTUP')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[11px]"
                            >
                              Tolak
                            </button>
                          </>
                        ) : low.status === 'DIBUKA' ? (
                          <button
                            onClick={() => handleModerateJob(low.id, 'DITUTUP')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[11px]"
                          >
                            Tutup Lowongan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerateJob(low.id, 'DIBUKA')}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px]"
                          >
                            Buka Kembali
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL LOWONGAN & LAMAR */}
      {selectedLowongan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600">{selectedLowongan.bidang}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedLowongan.judul}</h3>
                <p className="text-xs text-slate-500">{selectedLowongan.mitraNama} • {selectedLowongan.lokasi}</p>
              </div>
              <button onClick={() => setSelectedLowongan(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p>{selectedLowongan.deskripsi}</p>
              <div className="pt-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Kualifikasi Keahlian:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedLowongan.keterampilan.map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy toggle before apply */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Privasi Nilai IPK:</div>
                <div className="text-[11px] text-slate-500">{tampilkanIpk ? 'IPK Anda ditampilkan' : 'IPK Anda dirahasiakan'}</div>
              </div>
              <button
                type="button"
                onClick={() => setTampilkanIpk(!tampilkanIpk)}
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                {tampilkanIpk ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLowongan(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleKirimLamaran(selectedLowongan)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md shadow-purple-500/20"
              >
                Kirim Lamaran Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PASANG LOWONGAN BARU (MITRA) */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Pasang Lowongan Magang Baru</h3>
              <button onClick={() => setShowNewJobModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Judul Posisi:</label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Mobile Flutter Developer Intern"
                  value={newJobJudul}
                  onChange={(e) => setNewJobJudul(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Mode Kerja:</label>
                  <select
                    value={newJobMode}
                    onChange={(e) => setNewJobMode(e.target.value as 'Onsite' | 'Remote' | 'Hybrid')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Kuota:</label>
                  <input
                    type="number"
                    value={newJobKuota}
                    onChange={(e) => setNewJobKuota(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Tunjangan / Uang Saku:</label>
                <input
                  type="text"
                  value={newJobTunjangan}
                  onChange={(e) => setNewJobTunjangan(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Deskripsi Lowongan &amp; Tugas:</label>
                <textarea
                  rows={3}
                  value={newJobDeskripsi}
                  onChange={(e) => setNewJobDeskripsi(e.target.value)}
                  placeholder="Tuliskan tugas utama dan lingkungan kerja..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowNewJobModal(false)} className="px-4 py-2 text-slate-500 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">Publikasikan Lowongan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: JADWALKAN WAWANCARA (MITRA) */}
      {interviewApplicantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Jadwalkan Sesi Wawancara Virtual</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Tanggal Wawancara:</label>
                <input
                  type="text"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Waktu (WITA):</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Link Zoom / Lokasi Pertemuan:</label>
                <input
                  type="text"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setInterviewApplicantId(null)} className="px-4 py-2 text-slate-500 font-bold">Batal</button>
              <button
                onClick={() => handleUpdateStatusKandidat(interviewApplicantId, 'WAWANCARA')}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Kirim Undangan Wawancara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
