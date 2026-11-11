'use client';

import React, { useState } from 'react';
import { User, PengajuanLayanan, LayananStatus } from '@/lib/types';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  Plus, 
  Search,
  ShieldCheck,
  Building,
  QrCode,
  Check,
  X,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';

interface LayananViewProps {
  currentUser: User;
  pengajuanList: PengajuanLayanan[];
  onUpdatePengajuan: (newList: PengajuanLayanan[]) => void;
}

export const LayananView: React.FC<LayananViewProps> = ({
  currentUser,
  pengajuanList,
  onUpdatePengajuan,
}) => {
  const isStaf = currentUser.activeRole === 'STF_LYN' || currentUser.activeRole === 'SUPER';
  const isPimpinan = currentUser.activeRole === 'PMP';
  const isMahasiswa = currentUser.activeRole === 'MHS';

  const [activeTab, setActiveTab] = useState<'daftar' | 'ajukan' | 'staf_antrean'>(
    isStaf ? 'staf_antrean' : 'daftar'
  );
  const [selectedLayanan, setSelectedLayanan] = useState<PengajuanLayanan | null>(pengajuanList[0] || null);

  // Filter Staf
  const [stafFilterStatus, setStafFilterStatus] = useState<string>('SEMUA');
  const [stafSearch, setStafSearch] = useState<string>('');

  // Form State Pengajuan Baru
  const [jenisLayananId, setJenisLayananId] = useState<string>('srv-aktif-kuliah');
  const [keperluan, setKeperluan] = useState<string>('');
  const [metodePenyerahan, setMetodePenyerahan] = useState<'DIGITAL' | 'FISIK' | 'KEDUANYA'>('KEDUANYA');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const layananCatalog = [
    { id: 'srv-aktif-kuliah', nama: 'Surat Keterangan Aktif Kuliah', sla: '1 Hari Kerja', deskripsi: 'Untuk syarat beasiswa, tunjangan gaji orang tua (PNS/TNI/Swasta), dan BPJS.' },
    { id: 'srv-pengantar-magang', nama: 'Surat Pengantar Magang Industri / PKL', sla: '2 Hari Kerja', deskripsi: 'Surat resmi permohonan izin magang yang ditujukan ke pimpinan mitra industri.' },
    { id: 'srv-legalisir', nama: 'Legalisir Ijazah & Transkrip Nilai Sementara', sla: '2 Hari Kerja', deskripsi: 'Pemberian cap stempel basah / QR tanda tangan elektronik resmi POLNES.' },
    { id: 'srv-bebas-beasiswa', nama: 'Surat Keterangan Bebas Beasiswa Lain', sla: '1 Hari Kerja', deskripsi: 'Pernyataan resmi bahwa mahasiswa tidak sedang menerima beasiswa ganda.' },
    { id: 'srv-cuti', nama: 'Permohonan Cuti Akademik', sla: '3 Hari Kerja', deskripsi: 'Pengajuan rehat perkuliahan sementara resmi dengan persetujuan DPA dan Kajur.' },
  ];

  const handleAjukanBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluan.trim()) {
      alert('Mohon isi keperluan pengajuan surat.');
      return;
    }

    const selectedCatalog = layananCatalog.find(l => l.id === jenisLayananId) || layananCatalog[0];
    const newId = `lyn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newPengajuan: PengajuanLayanan = {
      id: newId,
      nomor: `ADM-202610-${Math.floor(1000 + Math.random() * 9000)}`,
      mahasiswaId: currentUser.id,
      mahasiswaNama: currentUser.name,
      mahasiswaNim: currentUser.identifier,
      mahasiswaProdi: currentUser.prodi || 'D3 Teknik Informatika',
      jenisLayananId,
      jenisLayananNama: selectedCatalog.nama,
      metodePenyerahan,
      keperluan,
      status: 'DIAJUKAN',
      slaDueAt: '2026-10-18T16:00:00Z',
      persyaratan: [
        { id: 'p-1', nama: 'Scan Kartu Tanda Mahasiswa (KTM)', wajib: true, statusVerifikasi: 'MENUNGGU', fileName: 'KTM_Mahasiswa.pdf' },
        { id: 'p-2', nama: 'Bukti Registrasi / KRS Terakhir', wajib: true, statusVerifikasi: 'MENUNGGU', fileName: 'KRS_Aktif.pdf' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newPengajuan, ...pengajuanList];
    onUpdatePengajuan(updated);
    setSelectedLayanan(newPengajuan);
    setActiveTab('daftar');
    setKeperluan('');
    setFeedbackMsg(`Permohonan ${newPengajuan.nomor} (${newPengajuan.jenisLayananNama}) berhasil diajukan online!`);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const handleUpdateStatusStaf = (id: string, newStatus: LayananStatus, extraInfo?: { catatan?: string }) => {
    const updated = pengajuanList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          infoPengambilan: newStatus === 'SIAP_DIAMBIL' ? {
            lokasi: 'Gedung Direktorat POLNES Lt. 1, Loket Layanan Terpadu No. 03',
            jamLayanan: 'Senin - Jumat, Pukul 08.30 - 15.00 WITA',
            batasPengambilan: '2026-10-31',
          } : item.infoPengambilan,
          catatanStaf: extraInfo?.catatan || item.catatanStaf,
          fileHasilNama: newStatus === 'SELESAI' ? `Surat_${item.nomor}.pdf` : item.fileHasilNama,
          fileHasilUrl: newStatus === 'SELESAI' ? `/docs/${item.nomor}.pdf` : item.fileHasilUrl,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    onUpdatePengajuan(updated);
    const active = updated.find(u => u.id === id);
    if (active) setSelectedLayanan(active);

    setFeedbackMsg(`Status permohonan ${selectedLayanan?.nomor} berhasil diubah menjadi: ${newStatus}`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleBatalkanPermohonan = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pengajuan ini? Sesuai aturan BR-031, permohonan yang dibatalkan tidak akan diproses oleh staf loket.')) {
      return;
    }
    const updated = pengajuanList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'DIBATALKAN' as LayananStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    onUpdatePengajuan(updated);
    const active = updated.find(u => u.id === id);
    if (active) setSelectedLayanan(active);
    setFeedbackMsg(`Permohonan ${selectedLayanan?.nomor} berhasil dibatalkan sesuai aturan BR-031.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const getStatusBadge = (status: LayananStatus) => {
    switch (status) {
      case 'DIAJUKAN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'DIVERIFIKASI': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
      case 'DIPROSES': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
      case 'SIAP_DIAMBIL': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 ring-2 ring-emerald-500/20';
      case 'SELESAI': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300';
      case 'DIAMBIL': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'PERLU_REVISI': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
      case 'DIBATALKAN': return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 line-through';
      case 'DITOLAK': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Stepper Sequence
  const stepperStates: LayananStatus[] = ['DIAJUKAN', 'DIVERIFIKASI', 'DIPROSES', 'SIAP_DIAMBIL', 'DIAMBIL'];

  // Filtered queue for staff
  const stafFilteredList = pengajuanList.filter(item => {
    const matchStatus = stafFilterStatus === 'SEMUA' || item.status === stafFilterStatus;
    const matchSearch = item.nomor.toLowerCase().includes(stafSearch.toLowerCase()) ||
      item.mahasiswaNama.toLowerCase().includes(stafSearch.toLowerCase()) ||
      item.mahasiswaNim.toLowerCase().includes(stafSearch.toLowerCase()) ||
      item.jenisLayananNama.toLowerCase().includes(stafSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-950 dark:via-orange-950 dark:to-neutral-900 p-6 sm:p-8 text-white shadow-xl shadow-amber-500/10 border border-amber-500/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-amber-500/20 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 text-amber-100">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              SLA Pasti 1-2 Hari Kerja • Loket Terpadu No. 03 Gd. Direktorat Lt. 1
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Modul Layanan Administrasi Kemahasiswaan
            </h1>
            <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed">
              Pengajuan dokumen akademik online tanpa antrean fisik berulang, pemantauan waktu proses SLA real-time, penerbitan tanda tangan digital, dan sistem tiket fisik di loket.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/20 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 self-start lg:self-center">
            <button
              onClick={() => setActiveTab('daftar')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'daftar' ? 'bg-white text-amber-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Permohonan ({pengajuanList.length})
            </button>

            {isMahasiswa && (
              <button
                onClick={() => setActiveTab('ajukan')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ajukan' ? 'bg-white text-amber-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Pengajuan Baru
              </button>
            )}

            {(isStaf || isPimpinan) && (
              <button
                onClick={() => setActiveTab('staf_antrean')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'staf_antrean' ? 'bg-white text-amber-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Antrean Loket 03 ({stafFilteredList.length})
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: DAFTAR PERMOHONAN SAYA (MAHASISWA VIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'daftar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri 1/3: List of Applications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Daftar Permohonan Surat ({pengajuanList.length})
              </h3>
              {isMahasiswa && (
                <button
                  onClick={() => setActiveTab('ajukan')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajukan Baru
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {pengajuanList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedLayanan(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedLayanan?.id === item.id
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      {item.nomor}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                    {item.jenisLayananNama}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.keperluan}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span>Metode: <strong>{item.metodePenyerahan}</strong></span>
                    <span>Batas SLA: {new Date(item.slaDueAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan 2/3: Detail Permohonan & Bukti Tiket Pengambilan */}
          {selectedLayanan && (
            <div className="lg:col-span-2 space-y-5">
              <div className="p-6 rounded-3xl glass-panel space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {selectedLayanan.nomor}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadge(selectedLayanan.status)}`}>
                        {selectedLayanan.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {selectedLayanan.jenisLayananNama}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pemohon: {selectedLayanan.mahasiswaNama} (NIM: {selectedLayanan.mahasiswaNim}) • {selectedLayanan.mahasiswaProdi}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Target Waktu SLA</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      1-2 Hari Kerja (Selesai Tepat Waktu)
                    </span>
                  </div>
                </div>

                {/* Stepper Progres Pelayanan */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Alur Tracking Pelayanan
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                    {stepperStates.map((st, idx) => {
                      const isPastOrCurrent = stepperStates.indexOf(selectedLayanan.status) >= idx;
                      const isCurrent = selectedLayanan.status === st;
                      return (
                        <div
                          key={st}
                          className={`p-2 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                              : isPastOrCurrent
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="font-mono text-[9px] opacity-75">{idx + 1}</div>
                          <div className="truncate">{st.replace(/_/g, ' ')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detail Keperluan & Persyaratan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-500 block">Keperluan Dokumen:</span>
                    <p className="text-slate-800 dark:text-slate-200">{selectedLayanan.keperluan}</p>
                    <span className="font-bold text-slate-500 block pt-2">Metode Penyerahan:</span>
                    <p className="font-semibold text-blue-600">{selectedLayanan.metodePenyerahan}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-500 block">Checklist Persyaratan Berkas:</span>
                    {selectedLayanan.persyaratan.map(p => (
                      <div key={p.id} className="flex items-center justify-between text-xs">
                        <span className="truncate pr-2">{p.nama}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                          {p.statusVerifikasi || 'VALID'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PEMBATALAN OLEH MAHASISWA (BR-031) */}
                {selectedLayanan.status === 'DIAJUKAN' && isMahasiswa && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <div className="font-bold">Batalkan Permohonan Surat?</div>
                        <div className="text-[11px] text-rose-600 dark:text-rose-400">
                          Sesuai aturan BR-031, mahasiswa dapat membatalkan permohonan selama berkas masih dalam status antrean DIAJUKAN.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBatalkanPermohonan(selectedLayanan.id)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" /> Batalkan Permohonan
                    </button>
                  </div>
                )}

                {/* KARTU PENGAMBILAN DOKUMEN FISIK DI LOKET 03 */}
                {selectedLayanan.status === 'SIAP_DIAMBIL' && (
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-2 border-amber-400 dark:border-amber-700 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                          <QrCode className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Tiket Pengambilan Dokumen Fisik Resmi
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            Siap Diambil di Loket Layanan Terpadu No. 03
                          </h4>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs font-black text-amber-700 dark:text-amber-400">
                        {selectedLayanan.nomor}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/60">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Lokasi Loket Kampus:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          Gedung Direktorat POLNES Lt. 1, Loket 03
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Jam Pelayanan Loket:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          Senin - Jumat, Pukul 08.30 - 15.00 WITA
                        </strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <p className="text-[11px] text-slate-500">
                        *Tunjukkan layar tiket ini atau sebutkan nomor registrasi kepada petugas loket.
                      </p>

                      <button
                        onClick={() => handleUpdateStatusStaf(selectedLayanan.id, 'DIAMBIL')}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Konfirmasi Dokumen Telah Saya Terima
                      </button>
                    </div>
                  </div>
                )}

                {/* DOKUMEN DIGITAL SELESAI */}
                {(selectedLayanan.status === 'SELESAI' || selectedLayanan.status === 'DIAMBIL') && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          Dokumen Resmi Telah Diterbitkan &amp; Selesai
                        </div>
                        <div className="text-[11px] text-slate-500">
                          File dokumen bertanda tangan elektronik POLNES siap diunduh.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Mengunduh file resmi ${selectedLayanan.nomor}.pdf dengan stempel digital POLNES...`)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Dokumen (.pdf)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BUAT PENGAJUAN BARU (MAHASISWA) */}
      {/* ========================================================================= */}
      {activeTab === 'ajukan' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl glass-panel space-y-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Formulir Pengajuan Surat Administrasi Kampus
            </h3>
            <p className="text-xs text-slate-500">
              Isi data permohonan dengan teliti. Dokumen akan diverifikasi dan diproses oleh staf loket sesuai standar SLA POLNES.
            </p>
          </div>

          <form onSubmit={handleAjukanBaru} className="space-y-5 text-xs">
            {/* Jenis Layanan */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Pilih Jenis Layanan Administrasi:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layananCatalog.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setJenisLayananId(cat.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      jenisLayananId === cat.id
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{cat.nama}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                        {cat.sla}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{cat.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metode Penyerahan */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Metode Penyerahan Dokumen:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'DIGITAL', label: 'Digital (PDF)', desc: 'Unduh langsung via portal' },
                  { id: 'FISIK', label: 'Fisik (Cetak)', desc: 'Ambil di Loket No. 03' },
                  { id: 'KEDUANYA', label: 'Keduanya (Rekomendasi)', desc: 'File digital + Ambil cetak' },
                ] as const).map(m => (
                  <div
                    key={m.id}
                    onClick={() => setMetodePenyerahan(m.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                      metodePenyerahan === m.id
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 font-bold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    <div>{m.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keperluan */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Tujuan / Keperluan Surat:
              </label>
              <textarea
                required
                rows={3}
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
                placeholder="Contoh: Kelengkapan berkas pendaftaran Beasiswa Kaltim Tuntas 2026 atau Pengajuan Magang di PT Telkom..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Upload File Simulasi */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Lampiran Persyaratan (Wajib):
              </span>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Scan KTM Mahasiswa &amp; KHS Terakhir (.pdf)
                </span>
                <span className="text-[11px] font-bold text-emerald-600">Terlampir otomatis dari profil</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('daftar')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 hover:bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold transition shadow-md shadow-amber-500/20"
              >
                Kirim Pengajuan Dokumen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ANTREAN STAF LAYANAN (BACK-OFFICE & LOKET 03) */}
      {/* ========================================================================= */}
      {activeTab === 'staf_antrean' && (
        <div className="space-y-6">
          {/* SLA Performance Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-panel space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Antrean Perlu Diproses</span>
              <div className="text-2xl font-black text-amber-600">
                {pengajuanList.filter(p => p.status === 'DIAJUKAN' || p.status === 'DIPROSES').length} Surat
              </div>
            </div>
            <div className="p-4 rounded-2xl glass-panel space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Siap Ambil di Loket 03</span>
              <div className="text-2xl font-black text-emerald-600">
                {pengajuanList.filter(p => p.status === 'SIAP_DIAMBIL').length} Dokumen
              </div>
            </div>
            <div className="p-4 rounded-2xl glass-panel space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Tingkat Kepatuhan SLA</span>
              <div className="text-2xl font-black text-indigo-600">98.4%</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Lokasi Loket Aktif</span>
              <div className="text-base font-bold text-slate-800 dark:text-slate-200">Gd. Direktorat Lt. 1</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari permohonan, NIM, nama mahasiswa..."
                value={stafSearch}
                onChange={(e) => setStafSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={stafFilterStatus}
                onChange={(e) => setStafFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value="SEMUA">Semua Status</option>
                <option value="DIAJUKAN">Menunggu Verifikasi (DIAJUKAN)</option>
                <option value="DIPROSES">Sedang Diproses (DIPROSES)</option>
                <option value="SIAP_DIAMBIL">Siap Diambil di Loket 03</option>
                <option value="SELESAI">Selesai (Digital)</option>
                <option value="DIAMBIL">Telah Diambil Fisik</option>
              </select>
            </div>
          </div>

          {/* Queue Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">No. Tiket</th>
                  <th className="p-3">Mahasiswa</th>
                  <th className="p-3">Jenis Dokumen</th>
                  <th className="p-3">Metode</th>
                  <th className="p-3">Status Saat Ini</th>
                  <th className="p-3 text-right">Tindakan Staf Loket 03</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {stafFilteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{item.nomor}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{item.mahasiswaNama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">NIM: {item.mahasiswaNim} • {item.mahasiswaProdi}</div>
                    </td>
                    <td className="p-3 font-semibold">{item.jenisLayananNama}</td>
                    <td className="p-3 font-mono">{item.metodePenyerahan}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {item.status === 'DIAJUKAN' && (
                        <button
                          onClick={() => handleUpdateStatusStaf(item.id, 'DIPROSES')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px]"
                        >
                          Verifikasi &amp; Proses
                        </button>
                      )}

                      {item.status === 'DIPROSES' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatusStaf(item.id, 'SIAP_DIAMBIL')}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
                          >
                            Set Siap Diambil di Loket 03
                          </button>
                          <button
                            onClick={() => handleUpdateStatusStaf(item.id, 'SELESAI')}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px]"
                          >
                            Terbitkan Digital
                          </button>
                        </>
                      )}

                      {item.status === 'SIAP_DIAMBIL' && (
                        <button
                          onClick={() => handleUpdateStatusStaf(item.id, 'DIAMBIL')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                        >
                          Serahkan Dokumen Fisik
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedLayanan(item);
                          setActiveTab('daftar');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 font-bold text-[11px]"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
