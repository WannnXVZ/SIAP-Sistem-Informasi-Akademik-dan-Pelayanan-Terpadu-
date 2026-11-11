'use client';

import React, { useState } from 'react';
import { User, KrsRecord, KelasKuliah, AdviseeKrs, KrsItem } from '@/lib/types';
import { MOCK_ADVISEES_KRS } from '@/lib/mockData';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Clock, 
  Trash2, 
  Plus, 
  ArrowRight,
  BookOpen,
  Calendar,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  Users,
  Printer,
  CheckCheck,
  ShieldCheck,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  Building
} from 'lucide-react';

interface AkademikViewProps {
  currentUser: User;
  krs: KrsRecord;
  onUpdateKrs: (newKrs: KrsRecord) => void;
  kelasList: KelasKuliah[];
}

export const AkademikView: React.FC<AkademikViewProps> = ({
  currentUser,
  krs,
  onUpdateKrs,
  kelasList,
}) => {
  const isDosenWali = currentUser.activeRole === 'DWL';
  const isDosen = currentUser.activeRole === 'DSN';
  const isAdmin = currentUser.activeRole === 'ADM_AKD' || currentUser.activeRole === 'SUPER';
  const isMahasiswa = currentUser.activeRole === 'MHS';
  const isPimpinan = currentUser.activeRole === 'PMP';

  const defaultTab = isDosenWali ? 'dosen_wali' : isDosen ? 'nilai_kelas' : isAdmin ? 'admin_master' : isPimpinan ? 'khs' : 'krs';
  const [activeTab, setActiveTab] = useState<'krs' | 'dosen_wali' | 'nilai_kelas' | 'import_excel' | 'khs' | 'admin_master'>(defaultTab);

  // Advisees State for DPA
  const [adviseesList, setAdviseesList] = useState<AdviseeKrs[]>(MOCK_ADVISEES_KRS);
  const [selectedAdviseeId, setSelectedAdviseeId] = useState<string>(MOCK_ADVISEES_KRS[0].id);
  const selectedAdvisee = adviseesList.find(a => a.id === selectedAdviseeId) || adviseesList[0];
  const [waliCatatan, setWaliCatatan] = useState<string>('Disetujui. Pertahankan performa akademik semester ini.');

  // Student KRS search & filter
  const [searchMk, setSearchMk] = useState<string>('');
  const [filterJenis, setFilterJenis] = useState<'SEMUA' | 'Wajib' | 'Pilihan'>('SEMUA');

  // Excel Import state
  const [excelStep, setExcelStep] = useState<number>(1);
  const [mockExcelRows, setMockExcelRows] = useState([
    { no: 1, nim: '230102001', nama: 'Muhammad Arief Irawan', tugas: 85, uts: 88, uas: 90, akhir: 88.2, huruf: 'A', status: 'VALID', pesan: '' },
    { no: 2, nim: '230102015', nama: 'Siti Nurhaliza', tugas: 80, uts: 82, uas: 84, akhir: 82.4, huruf: 'A-', status: 'VALID', pesan: '' },
    { no: 3, nim: '230102028', nama: 'Bayu Saputra Pratama', tugas: 105, uts: 65, uas: 70, akhir: 76.0, huruf: 'B', status: 'ERROR', pesan: 'Nilai tugas 105 melebihi batas maksimum 100' },
    { no: 4, nim: '230102040', nama: 'Citra Dewi Anggraini', tugas: 90, uts: 88, uas: 92, akhir: 90.2, huruf: 'A', status: 'VALID', pesan: '' },
  ]);

  // Class roster grading state for Dosen Pengampu
  const [selectedClassId, setSelectedClassId] = useState<string>('kls-1');
  const [classStudents, setClassStudents] = useState([
    { nim: '230102001', nama: 'Muhammad Arief Irawan', tugas: 85, uts: 88, uas: 90 },
    { nim: '230102015', nama: 'Siti Nurhaliza', tugas: 82, uts: 85, uas: 88 },
    { nim: '230102028', nama: 'Bayu Saputra Pratama', tugas: 75, uts: 70, uas: 72 },
    { nim: '230102040', nama: 'Citra Dewi Anggraini', tugas: 90, uts: 92, uas: 95 },
  ]);

  // Admin Master State
  const [isKrsPeriodOpen, setIsKrsPeriodOpen] = useState<boolean>(true);
  const [masterClasses, setMasterClasses] = useState<KelasKuliah[]>(kelasList);

  // Print Modal (KRS / KHS)
  const [printModalType, setPrintModalType] = useState<'KRS' | 'KHS' | null>(null);
  const [selectedSemesterKhs, setSelectedSemesterKhs] = useState<number>(5);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Schedule Conflict Detection
  const checkConflicts = (items: KrsItem[]) => {
    const conflicts: { mk1: string; mk2: string; hari: string; waktu: string }[] = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i].kelas;
        const b = items[j].kelas;
        if (a.hari === b.hari) {
          // Check hour overlap
          if (a.jamMulai < b.jamSelesai && a.jamSelesai > b.jamMulai) {
            conflicts.push({
              mk1: a.mkNama,
              mk2: b.mkNama,
              hari: a.hari,
              waktu: `${a.jamMulai} - ${a.jamSelesai} vs ${b.jamMulai} - ${b.jamSelesai}`
            });
          }
        }
      }
    }
    return conflicts;
  };

  const scheduleConflicts = checkConflicts(krs.items);

  // Toggle Kelas Mahasiswa
  const handleToggleKelas = (kelas: KelasKuliah) => {
    if (!isKrsPeriodOpen) {
      alert('Masa pengisian KRS telah ditutup oleh Bagian Akademik Pusat.');
      return;
    }

    if (krs.status === 'DISETUJUI') {
      alert('KRS Anda telah disetujui Dosen Pembimbing Akademik dan dikunci. Hubungi DPA untuk pembukaan revisi.');
      return;
    }

    const exists = krs.items.some(item => item.kelasId === kelas.id);
    if (exists) {
      const updatedItems = krs.items.filter(item => item.kelasId !== kelas.id);
      const newTotalSks = updatedItems.reduce((acc, curr) => acc + curr.kelas.sks, 0);
      onUpdateKrs({
        ...krs,
        items: updatedItems,
        totalSks: newTotalSks,
        status: 'DRAFT',
      });
    } else {
      if (krs.totalSks + kelas.sks > krs.maxSks) {
        alert(`Batas SKS terlampaui! Maksimum rencana studi Anda adalah ${krs.maxSks} SKS.`);
        return;
      }
      const updatedItems = [
        ...krs.items,
        {
          id: `krs-item-${kelas.id}-${krs.items.length + 1}`,
          kelasId: kelas.id,
          kelas,
          status: 'DRAFT' as const,
        }
      ];
      const newTotalSks = updatedItems.reduce((acc, curr) => acc + curr.kelas.sks, 0);
      onUpdateKrs({
        ...krs,
        items: updatedItems,
        totalSks: newTotalSks,
        status: 'DRAFT',
      });
    }
  };

  const handleAjukanKrs = () => {
    if (krs.items.length === 0) {
      alert('Pilih minimal 1 mata kuliah rencana studi sebelum mengajukan.');
      return;
    }
    if (scheduleConflicts.length > 0) {
      if (!confirm('Terdapat bentrok jadwal kuliah pada pilihan Anda. Apakah Anda yakin tetap ingin mengajukan?')) {
        return;
      }
    }
    onUpdateKrs({
      ...krs,
      status: 'DIAJUKAN',
      diajukanAt: new Date().toISOString(),
    });
    setFeedbackMsg('KRS Berhasil diajukan ke Dosen Pembimbing Akademik (Dr. Andi Pratama)!');
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Dosen Wali handlers
  const handleApproveAdvisee = (adviseeId: string) => {
    const updated = adviseesList.map(adv => {
      if (adv.id === adviseeId) {
        return {
          ...adv,
          status: 'DISETUJUI' as const,
          disetujuiAt: new Date().toISOString(),
          catatanDosenWali: waliCatatan,
        };
      }
      return adv;
    });
    setAdviseesList(updated);

    // If approving Arief, sync main krs state
    if (selectedAdvisee.mahasiswaId === krs.mahasiswaId) {
      onUpdateKrs({
        ...krs,
        status: 'DISETUJUI',
        disetujuiAt: new Date().toISOString(),
        catatanDosenWali: waliCatatan,
      });
    }

    setFeedbackMsg(`KRS Mahasiswa ${selectedAdvisee.mahasiswaNama} berhasil disetujui & dikunci!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleRejectAdvisee = (adviseeId: string) => {
    if (!waliCatatan.trim()) {
      alert('Wajib mengisi catatan revisi untuk mahasiswa bimbingan!');
      return;
    }
    const updated = adviseesList.map(adv => {
      if (adv.id === adviseeId) {
        return {
          ...adv,
          status: 'PERLU_REVISI' as const,
          catatanDosenWali: waliCatatan,
        };
      }
      return adv;
    });
    setAdviseesList(updated);

    if (selectedAdvisee.mahasiswaId === krs.mahasiswaId) {
      onUpdateKrs({
        ...krs,
        status: 'PERLU_REVISI',
        catatanDosenWali: waliCatatan,
      });
    }

    setFeedbackMsg(`KRS Mahasiswa ${selectedAdvisee.mahasiswaNama} dikembalikan untuk revisi.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleBatchApproveAdvisees = () => {
    const updated = adviseesList.map(adv => {
      if (adv.status === 'DIAJUKAN') {
        return {
          ...adv,
          status: 'DISETUJUI' as const,
          disetujuiAt: new Date().toISOString(),
          catatanDosenWali: 'Disetujui massal oleh DPA.',
        };
      }
      return adv;
    });
    setAdviseesList(updated);
    if (krs.status === 'DIAJUKAN') {
      onUpdateKrs({ ...krs, status: 'DISETUJUI', disetujuiAt: new Date().toISOString() });
    }
    setFeedbackMsg('Seluruh 2 KRS berstatus DIAJUKAN berhasil disetujui secara massal!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Grade calculation helpers
  const calculateFinalGrade = (t: number, u: number, a: number) => {
    const finalScore = Number((t * 0.3 + u * 0.3 + a * 0.4).toFixed(1));
    let letter = 'E';
    let bobot = 0.0;
    if (finalScore >= 85) { letter = 'A'; bobot = 4.0; }
    else if (finalScore >= 80) { letter = 'A-'; bobot = 3.7; }
    else if (finalScore >= 75) { letter = 'B+'; bobot = 3.3; }
    else if (finalScore >= 70) { letter = 'B'; bobot = 3.0; }
    else if (finalScore >= 65) { letter = 'B-'; bobot = 2.7; }
    else if (finalScore >= 60) { letter = 'C+'; bobot = 2.3; }
    else if (finalScore >= 55) { letter = 'C'; bobot = 2.0; }
    else if (finalScore >= 40) { letter = 'D'; bobot = 1.0; }
    return { finalScore, letter, bobot };
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,NIM,Nama Mahasiswa,Nilai Tugas (30%),Nilai UTS (30%),Nilai UAS (40%)\n230102001,Muhammad Arief Irawan,85,88,90\n230102015,Siti Nurhaliza,80,82,84\n230102028,Bayu Saputra Pratama,75,70,72\n230102040,Citra Dewi Anggraini,90,88,92";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Template_Nilai_TI-5A_POLNES.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackMsg('Template file nilai Excel (.csv) berhasil diunduh.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 dark:from-blue-950 dark:via-indigo-950 dark:to-neutral-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 border border-blue-500/20">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-blue-500/20 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 text-blue-100">
              <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
              SIAKAD POLNES • Rencana Studi, Penilaian &amp; Transkrip
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Portal Akademik &amp; Perkuliahan Terpadu
            </h1>
            <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed">
              Pengisian KRS mandiri bebas bentrok jadwal, sistem persetujuan bimbingan Dosen Pembimbing Akademik (DPA), entry nilai kelas, dan engine import nilai Excel chunked.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/20 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 self-start lg:self-center">
            {(isMahasiswa || isPimpinan || isAdmin) && (
              <button
                onClick={() => setActiveTab('krs')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'krs' ? 'bg-white text-blue-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                KRS Online
              </button>
            )}

            {(isDosenWali || isAdmin || isDosen) && (
              <button
                onClick={() => setActiveTab('dosen_wali')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'dosen_wali' ? 'bg-white text-blue-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                Persetujuan DPA ({adviseesList.filter(a => a.status === 'DIAJUKAN').length})
              </button>
            )}

            {(isDosen || isAdmin) && (
              <button
                onClick={() => setActiveTab('nilai_kelas')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'nilai_kelas' ? 'bg-white text-blue-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Input Nilai Kelas
              </button>
            )}

            {(isDosen || isAdmin) && (
              <button
                onClick={() => setActiveTab('import_excel')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'import_excel' ? 'bg-white text-blue-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel Nilai
              </button>
            )}

            <button
              onClick={() => setActiveTab('khs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'khs' ? 'bg-white text-blue-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              KHS &amp; Transkrip
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin_master')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin_master' ? 'bg-white text-blue-950 shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Master Jadwal
              </button>
            )}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Schedule Conflict Alert Banner */}
      {activeTab === 'krs' && scheduleConflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Peringatan Bentrok Jadwal Kuliah Terdeteksi!</span>
          </div>
          {scheduleConflicts.map((c, idx) => (
            <p key={idx} className="text-[11px] text-amber-700 dark:text-amber-300/90 pl-6">
              • <strong>{c.mk1}</strong> bertabrakan dengan <strong>{c.mk2}</strong> pada hari <strong>{c.hari}</strong> ({c.waktu}).
            </p>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: KRS ONLINE MAHASISWA */}
      {/* ========================================================================= */}
      {activeTab === 'krs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri 2/3: Katalog Kelas Tersedia */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Katalog Kelas Kuliah Semester 5 • D3 Teknik Informatika
                </h3>
                <p className="text-xs text-slate-500">Pilih mata kuliah sesuai paket kurikulum atau pilihan minat Anda.</p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari mata kuliah..."
                    value={searchMk}
                    onChange={(e) => setSearchMk(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <option value="SEMUA">Semua Jenis</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Pilihan">Pilihan</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {masterClasses
                .filter(k => {
                  const matchSearch = k.mkNama.toLowerCase().includes(searchMk.toLowerCase()) || k.mkKode.toLowerCase().includes(searchMk.toLowerCase());
                  return matchSearch;
                })
                .map(kelas => {
                  const isSelected = krs.items.some(it => it.kelasId === kelas.id);
                  const isFull = kelas.terisi >= kelas.kuota;

                  return (
                    <div 
                      key={kelas.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected 
                          ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                              {kelas.mkKode}
                            </span>
                            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                              {kelas.sks} SKS
                            </span>
                            <span className="text-xs text-slate-500">• Kelas {kelas.namaKelas}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {kelas.mkNama}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Dosen: {kelas.dosenPengampu}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-blue-500" />
                              {kelas.hari}, {kelas.jamMulai} - {kelas.jamSelesai} WITA
                            </span>
                            <span>•</span>
                            <span>Ruang: <strong>{kelas.ruang}</strong></span>
                            <span>•</span>
                            <span className={isFull ? 'text-rose-600 font-bold' : 'text-emerald-600 font-semibold'}>
                              Kuota: {kelas.terisi}/{kelas.kuota} mhs
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleKelas(kelas)}
                          disabled={isFull && !isSelected}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                            isSelected
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400'
                              : isFull
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Trash2 className="w-3.5 h-3.5" /> Batalkan
                            </>
                          ) : isFull ? (
                            'Kelas Penuh'
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> Pilih Kelas
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Kolom Kanan 1/3: Ringkasan Rencana Studi */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Ringkasan Rencana Studi
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  krs.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                  krs.status === 'DIAJUKAN' ? 'bg-blue-100 text-blue-800' :
                  krs.status === 'PERLU_REVISI' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  {krs.status}
                </span>
              </div>

              {/* Progress SKS */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Total SKS Diambil</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {krs.totalSks} / {krs.maxSks} SKS
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (krs.totalSks / krs.maxSks) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Selected List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mata Kuliah Terpilih ({krs.items.length})
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {krs.items.map(it => (
                    <div key={it.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">{it.kelas.mkNama}</div>
                        <div className="text-[11px] text-slate-500">{it.kelas.namaKelas} • {it.kelas.hari} ({it.kelas.jamMulai})</div>
                      </div>
                      <span className="font-bold text-blue-600">{it.kelas.sks} SKS</span>
                    </div>
                  ))}
                  {krs.items.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">Belum ada mata kuliah yang dipilih.</div>
                  )}
                </div>
              </div>

              {krs.catatanDosenWali && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs">
                  <span className="font-bold text-blue-800 dark:text-blue-300 block mb-0.5">Catatan Dosen Wali:</span>
                  <p className="text-slate-600 dark:text-slate-300">{krs.catatanDosenWali}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAjukanKrs}
                  disabled={krs.status === 'DISETUJUI' || krs.items.length === 0}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {krs.status === 'DISETUJUI' ? 'KRS Telah Dikunci (Disetujui)' : 'Ajukan KRS ke Dosen Wali'}
                </button>

                <button
                  onClick={() => setPrintModalType('KRS')}
                  className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Pratinjau Lembar KRS Resmi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERSETUJUAN DOSEN WALI (DPA) */}
      {/* ========================================================================= */}
      {activeTab === 'dosen_wali' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri 1/3: Daftar Mahasiswa Bimbingan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Mahasiswa Bimbingan ({adviseesList.length})
              </h3>
              <button
                onClick={handleBatchApproveAdvisees}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900"
              >
                Setujui Semua (Batch)
              </button>
            </div>

            <div className="space-y-2">
              {adviseesList.map(adv => (
                <div
                  key={adv.id}
                  onClick={() => setSelectedAdviseeId(adv.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedAdviseeId === adv.id
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{adv.mahasiswaNama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">NIM: {adv.mahasiswaNim}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      adv.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                      adv.status === 'DIAJUKAN' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {adv.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <span>IPK Lalu: <strong className="text-slate-800 dark:text-slate-200">{adv.ipkLalu.toFixed(2)}</strong></span>
                    <span>Total SKS: <strong className="text-blue-600">{adv.totalSks} SKS</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan 2/3: Detail Verifikasi & Review Rencana Studi */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl glass-panel space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Verifikasi KRS Mahasiswa: {selectedAdvisee.mahasiswaNama}
                  </h3>
                  <p className="text-xs text-slate-500">
                    NIM: {selectedAdvisee.mahasiswaNim} • {selectedAdvisee.prodi} • Semester {selectedAdvisee.semester}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-bold">
                    Status: {selectedAdvisee.status}
                  </span>
                </div>
              </div>

              {/* Table of courses requested */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="p-3">Kode</th>
                      <th className="p-3">Mata Kuliah</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">SKS</th>
                      <th className="p-3">Jadwal Kuliah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {selectedAdvisee.items.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-semibold">{item.kelas.mkKode}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{item.kelas.mkNama}</td>
                        <td className="p-3">{item.kelas.namaKelas}</td>
                        <td className="p-3 font-bold text-blue-600">{item.kelas.sks}</td>
                        <td className="p-3 text-slate-500">{item.kelas.hari}, {item.kelas.jamMulai}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Indeks Prestasi Kumulatif Lalu: {selectedAdvisee.ipkLalu.toFixed(2)}</span>
                <span>Total Diambil: {selectedAdvisee.totalSks} / {selectedAdvisee.maxSks} SKS</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Catatan Pembimbing Akademik / Dosen Wali:
                </label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={waliCatatan}
                  onChange={(e) => setWaliCatatan(e.target.value)}
                  placeholder="Masukkan instruksi atau catatan evaluasi untuk mahasiswa..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleRejectAdvisee(selectedAdvisee.id)}
                  className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 text-xs font-bold transition"
                >
                  Kembalikan untuk Revisi
                </button>
                <button
                  onClick={() => handleApproveAdvisee(selectedAdvisee.id)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Setujui &amp; Kunci KRS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INPUT NILAI KELAS (DOSEN PENGAMPU) */}
      {/* ========================================================================= */}
      {activeTab === 'nilai_kelas' && (
        <div className="p-6 rounded-3xl glass-panel space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Roster Penilaian Mahasiswa Kelas TI-5A
              </h3>
              <p className="text-xs text-slate-500">
                Mata Kuliah: Rekayasa Perangkat Lunak (TI3501) • 3 SKS • Dosen: Dr. Andi Pratama, S.T., M.Kom.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" /> Unduh Format Roster (.csv)
              </button>
              <button
                onClick={() => setActiveTab('import_excel')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Excel Chunked
              </button>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">NIM</th>
                  <th className="p-3">Nama Mahasiswa</th>
                  <th className="p-3 text-center">Tugas (30%)</th>
                  <th className="p-3 text-center">UTS (30%)</th>
                  <th className="p-3 text-center">UAS (40%)</th>
                  <th className="p-3 text-center">Nilai Akhir</th>
                  <th className="p-3 text-center">Huruf Mutu</th>
                  <th className="p-3 text-center">Bobot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {classStudents.map((st, idx) => {
                  const result = calculateFinalGrade(st.tugas, st.uts, st.uas);
                  return (
                    <tr key={st.nim} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-semibold">{st.nim}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{st.nama}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={st.tugas}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = [...classStudents];
                            updated[idx].tugas = val;
                            setClassStudents(updated);
                          }}
                          className="w-16 p-1 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={st.uts}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = [...classStudents];
                            updated[idx].uts = val;
                            setClassStudents(updated);
                          }}
                          className="w-16 p-1 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={st.uas}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = [...classStudents];
                            updated[idx].uas = val;
                            setClassStudents(updated);
                          }}
                          className="w-16 p-1 text-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                        />
                      </td>
                      <td className="p-3 text-center font-black text-blue-600">{result.finalScore}</td>
                      <td className="p-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {result.letter}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold">{result.bobot.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">Skala Penilaian Baku POLNES: A (&gt;=85), A- (&gt;=80), B+ (&gt;=75), B (&gt;=70)</span>
            <button
              onClick={() => {
                setFeedbackMsg('Nilai kelas TI-5A berhasil disimpan & disinkronisasi ke KHS mahasiswa!');
                setTimeout(() => setFeedbackMsg(null), 4000);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan &amp; Publikasikan Nilai
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EXCEL IMPORT NILAI (ENGINE BULK CHUNKED) */}
      {/* ========================================================================= */}
      {activeTab === 'import_excel' && (
        <div className="p-6 rounded-3xl glass-panel space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Engine Import Nilai Perkuliahan via Excel (Chunked &amp; Validated)
              </h3>
              <p className="text-xs text-slate-500">
                Mencegah kesalahan ketik dan duplikasi nilai mahasiswa dengan validasi error real-time per baris.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" /> Unduh Template Resmi (.csv)
            </button>
          </div>

          {/* Stepper Status */}
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <div className={`flex-1 text-center py-2 rounded-xl text-xs font-bold ${excelStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              1. Pilih Berkas
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className={`flex-1 text-center py-2 rounded-xl text-xs font-bold ${excelStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              2. Validasi &amp; Preview
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className={`flex-1 text-center py-2 rounded-xl text-xs font-bold ${excelStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              3. Selesai
            </div>
          </div>

          {excelStep === 1 && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Seret Berkas Excel Nilai ke Sini
                </h4>
                <p className="text-xs text-slate-500">Mendukung format .xlsx dan .csv (Ukuran maks. 10MB)</p>
              </div>
              <button
                onClick={() => setExcelStep(2)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
              >
                Pilih Berkas: Nilai_TI5A_RPL_Final.xlsx
              </button>
            </div>
          )}

          {excelStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Hasil Validasi Baris Nilai (4 Records Ditemukan)
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold">
                  1 Baris Perlu Koreksi
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="p-3">No</th>
                      <th className="p-3">NIM</th>
                      <th className="p-3">Nama Mahasiswa</th>
                      <th className="p-3">Tugas</th>
                      <th className="p-3">UTS</th>
                      <th className="p-3">UAS</th>
                      <th className="p-3">Akhir</th>
                      <th className="p-3">Huruf</th>
                      <th className="p-3">Status Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {mockExcelRows.map((row) => (
                      <tr key={row.no} className={row.status === 'ERROR' ? 'bg-rose-50/70 dark:bg-rose-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'}>
                        <td className="p-3 font-semibold">{row.no}</td>
                        <td className="p-3 font-mono">{row.nim}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{row.nama}</td>
                        <td className="p-3">{row.tugas}</td>
                        <td className="p-3">{row.uts}</td>
                        <td className="p-3">{row.uas}</td>
                        <td className="p-3 font-bold text-blue-600">{row.akhir}</td>
                        <td className="p-3 font-bold">{row.huruf}</td>
                        <td className="p-3">
                          {row.status === 'VALID' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">VALID</span>
                          ) : (
                            <div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">ERROR</span>
                              <div className="text-[10px] text-rose-600 mt-0.5">{row.pesan}</div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setExcelStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Batal &amp; Upload Ulang
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const corrected = mockExcelRows.map(r => r.nim === '230102028' ? { ...r, tugas: 80, akhir: 75.0, huruf: 'B+', status: 'VALID', pesan: '' } : r);
                      setMockExcelRows(corrected);
                      setExcelStep(4);
                      setFeedbackMsg('Koreksi otomatis berhasil! 4 Record nilai telah tersimpan di master akademik.');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                  >
                    Auto-Fix Nilai &amp; Komit Database
                  </button>
                </div>
              </div>
            </div>
          )}

          {excelStep === 4 && (
            <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Import Nilai Selesai!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Seluruh 4 record nilai kelas TI-5A telah masuk ke database akademik, tersinkronisasi ke KHS mahasiswa, dan dicatat dalam audit log immutable.
              </p>
              <button
                onClick={() => setExcelStep(1)}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
              >
                Import Kelas Lainnya
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: KHS & TRANSKRIP AKADEMIK */}
      {/* ========================================================================= */}
      {activeTab === 'khs' && (
        <div className="p-6 rounded-3xl glass-panel space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Kartu Hasil Studi (KHS) — Semester {selectedSemesterKhs}
              </h3>
              <p className="text-xs text-slate-500">
                Muhammad Arief Irawan • NIM: 230102001 • D3 Teknik Informatika POLNES
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedSemesterKhs}
                onChange={(e) => setSelectedSemesterKhs(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value={5}>Semester 5 (Ganjil 2026/2027)</option>
                <option value={4}>Semester 4 (Genap 2025/2026)</option>
                <option value={3}>Semester 3 (Ganjil 2025/2026)</option>
                <option value={2}>Semester 2 (Genap 2024/2025)</option>
                <option value={1}>Semester 1 (Ganjil 2024/2025)</option>
              </select>

              <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                IPS: 3.75
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                IPK: 3.65
              </div>
              <button
                onClick={() => setPrintModalType('KHS')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak KHS Resmi
              </button>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Kode MK</th>
                  <th className="p-3">Nama Mata Kuliah</th>
                  <th className="p-3">SKS</th>
                  <th className="p-3">Nilai Angka</th>
                  <th className="p-3">Huruf Mutu</th>
                  <th className="p-3">Bobot</th>
                  <th className="p-3">SKS × Bobot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {krs.items.map(item => {
                  const angka = item.nilaiAngka || 86;
                  const huruf = item.nilaiHuruf || 'A';
                  const bobot = item.bobot || 4.0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-semibold">{item.kelas.mkKode}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{item.kelas.mkNama}</td>
                      <td className="p-3 font-bold">{item.kelas.sks}</td>
                      <td className="p-3">{angka}</td>
                      <td className="p-3 font-bold text-emerald-600">{huruf}</td>
                      <td className="p-3">{bobot.toFixed(1)}</td>
                      <td className="p-3 font-bold text-blue-600">{(bobot * item.kelas.sks).toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500">Total SKS Lulus Kumulatif: </span>
              <strong className="text-slate-900 dark:text-white">96 SKS</strong>
            </div>
            <div>
              <span className="text-slate-500">Predikat Akademik: </span>
              <strong className="text-emerald-600">Sangat Memuaskan (Cum Laude Track)</strong>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ADMIN MASTER JADWAL & KUOTA (ADMIN AKADEMIK) */}
      {/* ========================================================================= */}
      {activeTab === 'admin_master' && (
        <div className="p-6 rounded-3xl glass-panel space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Pengelolaan Master Jadwal &amp; Kapasitas Kuota KRS
              </h3>
              <p className="text-xs text-slate-500">
                Akses khusus Bagian Akademik Pusat (ADM_AKD) untuk pengaturan kuota, ruang kelas, dan pembukaan masa KRS.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsKrsPeriodOpen(!isKrsPeriodOpen);
                  setFeedbackMsg(`Status Periode KRS berhasil diubah menjadi: ${!isKrsPeriodOpen ? 'DIBUKA' : 'DITUTUP'}`);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isKrsPeriodOpen ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isKrsPeriodOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {isKrsPeriodOpen ? 'Tutup Periode KRS' : 'Buka Periode KRS'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 space-y-1">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Status Periode KRS</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                {isKrsPeriodOpen ? 'DIBUKA (Aktif)' : 'DITUTUP (Terkunci)'}
              </div>
              <p className="text-[11px] text-slate-500">Masa revisi s/d 15 Oktober 2026</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 space-y-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Total Kelas Ditawarkan</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{masterClasses.length} Kelas Kuliah</div>
              <p className="text-[11px] text-slate-500">Semester Ganjil 2026/2027</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 space-y-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Kapasitas Kursi Terisi</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">88.6%</div>
              <p className="text-[11px] text-slate-500">Rata-rata 27 dari 30 kursi terisi</p>
            </div>
          </div>

          {/* Master Class Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Mata Kuliah</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Dosen Pengampu</th>
                  <th className="p-3">Ruang</th>
                  <th className="p-3 text-center">Kapasitas (Terisi/Kuota)</th>
                  <th className="p-3 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {masterClasses.map((cls, idx) => (
                  <tr key={cls.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-semibold">{cls.mkKode}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{cls.mkNama}</td>
                    <td className="p-3">{cls.namaKelas}</td>
                    <td className="p-3 text-slate-500">{cls.dosenPengampu}</td>
                    <td className="p-3">{cls.ruang}</td>
                    <td className="p-3 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded ${cls.terisi >= cls.kuota ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {cls.terisi} / {cls.kuota}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          const updated = [...masterClasses];
                          updated[idx].kuota += 5;
                          setMasterClasses(updated);
                          setFeedbackMsg(`Kuota kelas ${cls.mkNama} (${cls.namaKelas}) ditambah +5 kursi.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold"
                      >
                        +5 Kuota
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
      {/* MODAL PRINT RESMI: KRS / KHS */}
      {/* ========================================================================= */}
      {printModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Header Surat POLNES */}
            <div className="text-center pb-4 border-b-2 border-slate-900 dark:border-white space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Kementerian Pendidikan Tinggi, Sains, dan Teknologi
              </div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                Politeknik Negeri Samarinda
              </h2>
              <p className="text-[11px] text-slate-500">
                Jalan Cipto Mangunkusumo Kampus Gunung Lipan, Samarinda 75131 • Laman: www.polnes.ac.id
              </p>
              <div className="pt-2 font-black text-sm uppercase underline tracking-wider text-slate-900 dark:text-white">
                {printModalType === 'KRS' ? 'Kartu Rencana Studi (KRS) Mahasiswa' : 'Kartu Hasil Studi (KHS) Mahasiswa'}
              </div>
            </div>

            {/* Biodata */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">Nama:</span> <strong>Muhammad Arief Irawan</strong></div>
              <div><span className="text-slate-500">Semester:</span> <strong>5 (Ganjil 2026/2027)</strong></div>
              <div><span className="text-slate-500">NIM:</span> <strong className="font-mono">230102001</strong></div>
              <div><span className="text-slate-500">Dosen Pembimbing Akademik:</span> <strong>Dr. Andi Pratama</strong></div>
              <div><span className="text-slate-500">Program Studi:</span> <strong>D3 Teknik Informatika</strong></div>
              <div><span className="text-slate-500">Status Validasi:</span> <strong className="text-emerald-600">{printModalType === 'KRS' ? krs.status : 'DISAHKAN'}</strong></div>
            </div>

            {/* Content Table based on type */}
            {printModalType === 'KRS' ? (
              <div className="space-y-2">
                <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2">No</th>
                        <th className="p-2">Kode</th>
                        <th className="p-2">Mata Kuliah</th>
                        <th className="p-2">Kelas</th>
                        <th className="p-2 text-center">SKS</th>
                        <th className="p-2">Jadwal &amp; Ruang</th>
                        <th className="p-2">Dosen Pengampu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {krs.items.map((it, idx) => (
                        <tr key={it.id}>
                          <td className="p-2 text-slate-400">{idx + 1}</td>
                          <td className="p-2 font-mono">{it.kelas.mkKode}</td>
                          <td className="p-2 font-semibold">{it.kelas.mkNama}</td>
                          <td className="p-2 font-bold text-blue-600">{it.kelas.namaKelas}</td>
                          <td className="p-2 text-center font-bold">{it.kelas.sks}</td>
                          <td className="p-2 text-slate-600 dark:text-slate-400">{it.kelas.hari}, {it.kelas.jamMulai} ({it.kelas.ruang})</td>
                          <td className="p-2 text-slate-500 text-[11px]">{it.kelas.dosenPengampu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center text-xs px-2 pt-1 font-bold">
                  <span>Total Beban Studi Semester Ini:</span>
                  <span className="text-blue-600 font-extrabold">{krs.totalSks} SKS (Maksimal {krs.maxSks} SKS)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2">Kode</th>
                        <th className="p-2">Mata Kuliah</th>
                        <th className="p-2">SKS</th>
                        <th className="p-2">Nilai</th>
                        <th className="p-2">Huruf</th>
                        <th className="p-2">SKS × Bobot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {krs.items.map(it => (
                        <tr key={it.id}>
                          <td className="p-2 font-mono">{it.kelas.mkKode}</td>
                          <td className="p-2">{it.kelas.mkNama}</td>
                          <td className="p-2 font-bold">{it.kelas.sks}</td>
                          <td className="p-2">{it.nilaiAngka || 86}</td>
                          <td className="p-2 font-bold text-emerald-600">{it.nilaiHuruf || 'A'}</td>
                          <td className="p-2 font-bold">{((it.bobot || 4.0) * it.kelas.sks).toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-center font-bold">
                  <div>Indeks Prestasi Semester (IPS): <span className="text-blue-600 font-black">3.75</span></div>
                  <div>Indeks Prestasi Kumulatif (IPK): <span className="text-emerald-600 font-black">3.65</span></div>
                  <div>Total SKS Lulus: <span className="text-purple-600 font-black">98 SKS</span></div>
                </div>
              </div>
            )}

            {/* Signature & Watermark Footer */}
            <div className="flex items-center justify-between pt-4 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-mono">
                  Kode Autentikasi QR: POLNES-2026-{printModalType}-230102001
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4" /> Dokumen Sah Terverifikasi Sistem SIAP POLNES
                </div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-[11px] text-slate-500">Samarinda, 15 Oktober 2026</div>
                <div className="text-[11px] font-bold">
                  {printModalType === 'KRS' ? 'Dosen Pembimbing Akademik' : 'Ketua Jurusan Teknologi Informasi'}
                </div>
                <div className="h-10"></div>
                <div className="font-bold underline">Dr. Andi Pratama, S.T., M.Kom.</div>
                <div className="text-[10px] text-slate-500 font-mono">NIP: 198504122010121001</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPrintModalType(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert(`Mencetak dokumen resmi ${printModalType} via print dialog browser...`);
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak Dokumen Resmi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
