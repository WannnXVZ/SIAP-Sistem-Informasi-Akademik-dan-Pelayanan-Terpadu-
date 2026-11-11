"use client";

import React, { useState } from "react";
import { User, BeasiswaProgram, PendaftaranBeasiswa, ScholarshipMatchResult } from "@/lib/types";
import { 
  GraduationCap, 
  Sparkles, 
  Clock, 
  FileCheck2, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  Sliders,
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  Target
} from "lucide-react";

interface BeasiswaViewProps {
  currentUser: User;
  beasiswaList: BeasiswaProgram[];
  pendaftaranList: PendaftaranBeasiswa[];
  setPendaftaranList: React.Dispatch<React.SetStateAction<PendaftaranBeasiswa[]>>;
  onNotify: (title: string, msg: string, category: 'Beasiswa') => void;
  onNavigateToLayanan?: () => void;
}

export default function BeasiswaView({
  currentUser,
  beasiswaList,
  pendaftaranList,
  setPendaftaranList,
  onNotify,
  onNavigateToLayanan,
}: BeasiswaViewProps) {
  const isStaffBeasiswa = ["ADM_BSW", "KMT_BSW", "SUPER", "PMP"].includes(currentUser.activeRole);

  const [activeTab, setActiveTab] = useState<"CATALOG" | "SCANNER" | "PENDAFTARAN_SAYA" | "VERIFIER" | "RANKER">(
    isStaffBeasiswa ? "RANKER" : "SCANNER"
  );
  const [selectedProgId, setSelectedProgId] = useState<string>(beasiswaList[0]?.id || "");
  const [selectedPendaftaranId, setSelectedPendaftaranId] = useState<string>(pendaftaranList[0]?.id || "");

  const selectedProg = beasiswaList.find((b) => b.id === selectedProgId) || beasiswaList[0];
  const selectedPendaftaran = pendaftaranList.find((p) => p.id === selectedPendaftaranId) || pendaftaranList[0];

  // AI Matching calculation mock for current user
  const calculateMatch = (prog: BeasiswaProgram): ScholarshipMatchResult => {
    const ipk = currentUser.ipk || 3.65;
    const semester = currentUser.semester || 5;
    const ipkMin = prog.kriteria.ipkMin || 3.25;

    const reasons = [
      {
        kriteria: `IPK Minimum (${ipkMin.toFixed(2)})`,
        poin: "+35 poin",
        lolos: ipk >= ipkMin,
        detail: `IPK Anda saat ini ${ipk.toFixed(2)} memenuhi batas minimum program (${ipkMin.toFixed(2)}).`,
      },
      {
        kriteria: `Semester (${prog.kriteria.semesterMin} - ${prog.kriteria.semesterMax})`,
        poin: "+30 poin",
        lolos: semester >= (prog.kriteria.semesterMin || 1) && semester <= (prog.kriteria.semesterMax || 8),
        detail: `Semester aktif Anda (Semester ${semester}) masuk dalam rentang kriteria eligible beasiswa.`,
      },
      {
        kriteria: "Program Studi Prioritas Kaltim",
        poin: "+25 poin",
        lolos: prog.kriteria.prodiWhitelist?.includes(currentUser.prodi || "") || false,
        detail: `Program Studi ${currentUser.prodi} terdaftar dalam cluster sains & teknologi prioritas daerah.`,
      },
      {
        kriteria: "Kelayakan Kondisi Finansial",
        poin: "+10 poin",
        lolos: true,
        detail: "Penghasilan orang tua tercatat di bawah pagu batas maksimal Rp 5.000.000 / bulan.",
      },
    ];

    const matchScore = reasons.filter((r) => r.lolos).length >= 4 ? 98 : 75;

    return {
      beasiswaId: prog.id,
      matchScore,
      status: matchScore >= 80 ? "LAYAK" : "BERPOTENSI",
      alasan: reasons,
      readinessScore: 85,
      readinessKategori: "AMAN",
      dokumenKurang: ["Surat Keterangan Bebas Beasiswa Lain (Proses 2 hari)"],
      actionPlan: [
        "Unduh KHS Sementara Semester 1-4 di modul Akademik SIAP",
        "Ajukan Surat Keterangan Aktif Kuliah di modul Layanan Administrasi (Loket 03)",
        "Unggah Surat Keterangan Penghasilan & Kartu Keluarga sebelum 18 Oktober 2026",
      ],
    };
  };

  const matchData = calculateMatch(selectedProg);

  // Document Verification by Staff (Human-in-the-Loop)
  const handleVerifyDocument = (docId: string, status: "VALID" | "PERLU_REVISI") => {
    const updated = pendaftaranList.map((item) => {
      if (item.id === selectedPendaftaran.id) {
        return {
          ...item,
          dokumen: item.dokumen.map((d) => {
            if (d.id === docId) {
              return { ...d, statusVerifikasi: status };
            }
            return d;
          }),
        };
      }
      return item;
    });

    setPendaftaranList(updated);
    onNotify(
      "Verifikasi Dokumen Beasiswa",
      `Status dokumen diperbarui menjadi ${status} oleh Verifikator Kampus.`,
      "Beasiswa"
    );
  };

  const handleUpdateStatusPendaftaran = (newStatus: PendaftaranBeasiswa["status"]) => {
    const updated = pendaftaranList.map((item) => {
      if (item.id === selectedPendaftaran.id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setPendaftaranList(updated);
    onNotify(
      "Status Seleksi Beasiswa Diperbarui",
      `Pendaftaran ${selectedPendaftaran.mahasiswaNama} diubah ke status: ${newStatus}`,
      "Beasiswa"
    );
  };

  const handleAjukanBeasiswa = () => {
    // Check if already applied to this program
    const alreadyApplied = pendaftaranList.some(
      (p) => p.beasiswaId === selectedProg.id && p.mahasiswaId === currentUser.id
    );
    if (alreadyApplied) {
      alert(`Anda sudah memiliki berkas pendaftaran aktif untuk program ${selectedProg.nama}.`);
      setActiveTab("PENDAFTARAN_SAYA");
      return;
    }

    // BR-063: Double Funding Validation
    const hasActiveScholarship = pendaftaranList.some(
      (p) => p.mahasiswaId === currentUser.id && (p.status === "TERVERIFIKASI" || p.status === "SHORTLIST" || p.status === "DITERIMA")
    );

    if (hasActiveScholarship) {
      const confirmDouble = confirm(
        "Peringatan Aturan Anti Double-Funding (BR-063):\nSistem mendeteksi Anda telah memiliki pendaftaran beasiswa lain yang sedang aktif atau diterima.\n\nSesuai regulasi Kemendiktisaintek, penerima beasiswa APBN/APBD tidak boleh menerima beasiswa ganda kecuali ada dispensasi resmi.\n\nApakah Anda tetap ingin melanjutkan pendaftaran dengan mengunggah Surat Keterangan Bebas Beasiswa Lain?"
      );
      if (!confirmDouble) return;
    }

    const newId = `bsw-reg-${Date.now()}`;
    const newReg: PendaftaranBeasiswa = {
      id: newId,
      nomor: `BSW-202610-${Math.floor(1000 + Math.random() * 9000)}`,
      beasiswaId: selectedProg.id,
      beasiswaNama: selectedProg.nama,
      mahasiswaId: currentUser.id,
      mahasiswaNama: currentUser.name,
      mahasiswaNim: currentUser.identifier,
      mahasiswaIpk: currentUser.ipk || 3.65,
      penghasilanOrtu: 3500000,
      dokumen: selectedProg.persyaratanDokumen.map((doc, idx) => ({
        id: `doc-${newId}-${idx}`,
        nama: doc.nama,
        ocrDetectedName: `${currentUser.name.toUpperCase()} - NIM ${currentUser.identifier}`,
        ocrConfidence: 97,
        statusVerifikasi: "MENUNGGU",
      })),
      shortlistScore: 91.5,
      shortlistRank: pendaftaranList.length + 1,
      status: "DIAJUKAN",
      createdAt: new Date().toISOString(),
    };

    setPendaftaranList([newReg, ...pendaftaranList]);
    setSelectedPendaftaranId(newReg.id);
    onNotify(
      "Pendaftaran Beasiswa Berhasil",
      `Pendaftaran ${selectedProg.nama} berhasil diajukan dengan nomor ${newReg.nomor}! Berkas diteruskan ke tim verifikator.`,
      "Beasiswa"
    );
    setActiveTab("PENDAFTARAN_SAYA");
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-emerald-500/20 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 dark:border-emerald-400/30 text-emerald-100 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Engine Beasiswa Cerdas POLNES & AI Assistive
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Portal Beasiswa Cerdas & Bantuan Finansial
            </h1>
            <p className="text-emerald-100/90 dark:text-emerald-200/80 text-xs sm:text-sm leading-relaxed">
              Sistem pencocokan profil otomatis (Profile Scanner), estimasi waktu penyiapan berkas (Deadline Forecaster), Verifikator Dokumen HITL, dan Pemeringkatan Transparan berbobot.
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-black/20 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 self-start lg:self-center">
            <button
              onClick={() => setActiveTab("CATALOG")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "CATALOG"
                  ? "bg-white text-emerald-900 shadow-md scale-100"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Katalog Beasiswa
            </button>
            <button
              onClick={() => setActiveTab("SCANNER")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "SCANNER"
                  ? "bg-white text-emerald-900 shadow-md scale-100"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Profile Scanner
            </button>
            <button
              onClick={() => setActiveTab("PENDAFTARAN_SAYA")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "PENDAFTARAN_SAYA"
                  ? "bg-white text-emerald-900 shadow-md scale-100"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Pendaftaran Saya ({pendaftaranList.length})
            </button>
            {isStaffBeasiswa && (
              <>
                <button
                  onClick={() => setActiveTab("VERIFIER")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "VERIFIER"
                      ? "bg-white text-emerald-900 shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Document Verifier (HITL)
                </button>
                <button
                  onClick={() => setActiveTab("RANKER")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "RANKER"
                      ? "bg-white text-emerald-900 shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Shortlist Ranker
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />
      </div>

      {/* VIEW 1: PROFILE SCANNER & FORECASTER */}
      {activeTab === "SCANNER" && (
        <div className="space-y-6">
          {/* Top Selection & Match Score Card */}
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm backdrop-blur-xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Pilih Program Beasiswa untuk Di-scan:
                  </label>
                </div>
                <div className="relative max-w-2xl">
                  <select
                    value={selectedProgId}
                    onChange={(e) => setSelectedProgId(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-300 dark:border-zinc-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer shadow-xs"
                  >
                    {beasiswaList.map((b) => (
                      <option key={b.id} value={b.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                        {b.nama} — {b.penyelenggara} ({b.manfaat})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Match Gauge Widget */}
              <div className="flex items-center gap-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-100/30 dark:from-emerald-950/40 dark:via-zinc-800/60 dark:to-teal-950/30 border border-emerald-200/90 dark:border-emerald-800/60 p-4 rounded-2xl shadow-xs shrink-0">
                <div className="text-center px-2">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    {matchData.matchScore}%
                  </div>
                  <div className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mt-0.5">
                    Kecocokan Profil
                  </div>
                </div>

                <div className="border-l border-emerald-200/80 dark:border-emerald-800/60 pl-4 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs shadow-emerald-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    SANGAT COCOK &amp; LAYAK
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                    Memenuhi 4 dari 4 kriteria utama pendaftaran.
                  </div>
                </div>
              </div>
            </div>

            {/* Why Am I Eligible? (Mengapa Saya Cocok) */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Pilar 1: Analisis Detail Kelayakan Profil Anda
                </h3>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/50">
                  Total Nilai: 100 / 100 Poin
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchData.alasan.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-4.5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/80 dark:bg-zinc-800/50 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-md transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold shadow-2xs group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {reason.kriteria}
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
                          {reason.poin}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                        {reason.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pilar 2: Deadline Forecaster & Document Readiness */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Deadline Forecaster Gauge & Timeline */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Pilar 2: Deadline Forecaster
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 shadow-2xs">
                  Status: {matchData.readinessKategori} (Slack +6 Hari)
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Algoritma forecaster menghitung akumulasi waktu kerja layanan kampus untuk menerbitkan dokumen prasyarat dibanding sisa hari penutupan beasiswa.
              </p>

              {/* Progress Visualizer Box */}
              <div className="p-4.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-900/50 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-cyan-900 dark:text-cyan-200">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                    Waktu Tersisa: 18 Hari
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] font-semibold">
                    Estimasi Pengurusan Dokumen: 5 Hari Kerja
                  </span>
                </div>
                <div className="w-full bg-cyan-200/70 dark:bg-cyan-900/40 h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 h-full w-[80%] rounded-full shadow-xs" />
                </div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Anda memiliki kelonggaran (slack time) yang aman. Pengajuan sebelum 10 Oktober menjamin berkas siap tepat waktu.
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-2.5 uppercase tracking-wide">
                  Langkah Terjadwal yang Direkomendasikan:
                </h4>
                <ul className="space-y-2">
                  {matchData.actionPlan.map((act, i) => (
                    <li
                      key={i}
                      className="text-xs text-zinc-700 dark:text-zinc-200 flex items-start gap-2.5 bg-zinc-50/80 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60"
                    >
                      <span className="w-5 h-5 rounded-lg bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Prerequisite Documents & Quick Action */}
            <div className="lg:col-span-6 bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm backdrop-blur-xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Daftar Persyaratan Berkas &amp; Integrasi Layanan
                  </h3>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    4 Berkas Wajib
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedProg.persyaratanDokumen.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex items-center justify-between text-xs hover:border-emerald-500/50 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {doc.nama}
                        </div>
                        <div className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                          Estimasi SLA: {doc.estimasiHari} hari kerja {doc.wajib ? "(Wajib)" : "(Opsional)"}
                        </div>
                      </div>
                      {doc.nama.includes("Aktif") ? (
                        <button
                          onClick={onNavigateToLayanan}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                        >
                          Ajukan di Layanan
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-2.5 py-1 rounded-lg shrink-0">
                          Tersedia di SIAP
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleAjukanBeasiswa}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  Ajukan Pendaftaran Beasiswa Sekarang
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KATALOG BEASISWA */}
      {activeTab === "CATALOG" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beasiswaList.map((prog) => (
            <div
              key={prog.id}
              className="bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/20">
                    {prog.tipe === "INTERNAL" ? "Internal POLNES" : "Pemerintah / Pemprov"}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    Kuota: {prog.kuota} Mahasiswa
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 mb-1">
                  {prog.nama}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{prog.penyelenggara}</p>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-zinc-700 dark:text-zinc-300 mb-4">
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Cakupan Beasiswa:
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-300 font-bold leading-relaxed">
                    {prog.manfaat}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 mb-4">
                  <div>• IPK Minimal: {prog.kriteria.ipkMin || "-"}</div>
                  <div>• Semester: {prog.kriteria.semesterMin} s/d {prog.kriteria.semesterMax}</div>
                  <div>• Batas Akhir: {prog.tglTutup}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProgId(prog.id);
                    setActiveTab("SCANNER");
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Scan Kecocokan Profil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: DOCUMENT VERIFIER (HITL - Human-in-the-Loop) */}
      {activeTab === "VERIFIER" && isStaffBeasiswa && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Applicant List */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Antrean Berkas Masuk ({pendaftaranList.length})
              </h3>
              <span className="text-xs text-zinc-400">Verifikator Beasiswa</span>
            </div>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {pendaftaranList.map((app) => {
                const isSelected = selectedPendaftaran?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedPendaftaranId(app.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {app.nomor}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {app.status}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {app.mahasiswaNama}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{app.mahasiswaNim} • IPK: {app.mahasiswaIpk}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      {app.beasiswaNama}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: OCR Pre-screening & Human Validation Desk */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
            {selectedPendaftaran ? (
              <>
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                      {selectedPendaftaran.nomor}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">
                      {selectedPendaftaran.mahasiswaNama} ({selectedPendaftaran.mahasiswaNim})
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Penghasilan Orang Tua: Rp {selectedPendaftaran.penghasilanOrtu.toLocaleString("id-ID")} / bulan
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatusPendaftaran("TERVERIFIKASI")}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      Loloskan Berkas
                    </button>
                    <button
                      onClick={() => handleUpdateStatusPendaftaran("SHORTLIST")}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      Masukkan Shortlist
                    </button>
                  </div>
                </div>

                {/* HITL Rule Banner */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Prinsip Human-in-the-Loop (HITL):</strong> AI OCR hanya mengekstrak teks dan mendeteksi skor kecocokan nama/NIM. Keputusan final keabsahan dokumen sepenuhnya berada di tangan Anda sebagai verifikator manusia.
                  </div>
                </div>

                {/* Documents Table */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Hasil Ekstraksi OCR &amp; Verifikasi Manual
                  </h4>

                  <div className="space-y-3">
                    {selectedPendaftaran.dokumen.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                              {doc.nama}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.statusVerifikasi === "VALID" ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Telah Divalidasi
                              </span>
                            ) : doc.statusVerifikasi === "PERLU_REVISI" ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                                <X className="w-3 h-3" /> Perlu Revisi
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Menunggu Verifikasi
                              </span>
                            )}
                          </div>
                        </div>

                        {/* OCR Entity Detection Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          <div>
                            <span className="text-zinc-400 text-[10px]">Teks Terdeteksi OCR:</span>
                            <div className="font-mono text-zinc-900 dark:text-zinc-100 font-bold text-[11px] mt-0.5">
                              {doc.ocrDetectedName || "MUHAMMAD ARIEF IRAWAN - NIM 226151001"}
                            </div>
                          </div>
                          <div>
                            <span className="text-zinc-400 text-[10px]">Confidence Level AI:</span>
                            <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[11px] mt-0.5">
                              {doc.ocrConfidence || 96}% (Sangat Tinggi)
                            </div>
                          </div>
                        </div>

                        {/* Verifier Action Buttons */}
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleVerifyDocument(doc.id, "PERLU_REVISI")}
                            className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Tolak / Minta Revisi
                          </button>
                          <button
                            onClick={() => handleVerifyDocument(doc.id, "VALID")}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            Setujui &amp; Valid
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-400">
                Pilih berkas pendaftaran di sebelah kiri.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: SHORTLIST RANKER & EXPLAINABLE AI */}
      {activeTab === "RANKER" && isStaffBeasiswa && (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2 border border-blue-200 dark:border-blue-900">
                <Sliders className="w-3.5 h-3.5" />
                Explainable Multi-Criteria Decision Model (MCDM)
              </div>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                Pilar 4: Shortlist Ranker &amp; Justifikasi Poin Transparan
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Perhitungan skor objektif berdasarkan formula: IPK (40%) + Kondisi Finansial (40%) + Prestasi (20%).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-500">Kuota Lolos: 30 Mahasiswa</span>
              <button
                onClick={() => onNotify("SK Penerima Diterbitkan", "Daftar shortlist 30 mahasiswa berhasil dikirim ke Pimpinan untuk SK.", "Beasiswa")}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                Terbitkan Rekomendasi Shortlist
              </button>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Peringkat</th>
                  <th className="py-3.5 px-4">Nama Mahasiswa</th>
                  <th className="py-3.5 px-4">IPK (40%)</th>
                  <th className="py-3.5 px-4">Ekonomi (40%)</th>
                  <th className="py-3.5 px-4">Prestasi (20%)</th>
                  <th className="py-3.5 px-4">Total Skor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Justifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {pendaftaranList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs shadow-2xs">
                        {item.shortlistRank || index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">
                        {item.mahasiswaNama}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium">{item.mahasiswaNim}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold">
                      {item.mahasiswaIpk} <span className="text-zinc-400 text-[10px]">(38.2 pt)</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium">
                      Rp {item.penghasilanOrtu.toLocaleString("id-ID")} <span className="text-zinc-400 text-[10px]">(36.0 pt)</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium">
                      Juara 1 Hackathon <span className="text-zinc-400 text-[10px]">(18.5 pt)</span>
                    </td>
                    <td className="py-4 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {item.shortlistScore || 92.7}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        PRIORITAS UTAMA
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() =>
                          alert(
                            `Justifikasi Transparan untuk ${item.mahasiswaNama}:\n• IPK 3.65 -> Bobot 40% = 38.2 poin\n• Penghasilan Ortu Rp 3.5jt -> Bobot 40% = 36.0 poin\n• Prestasi Juara Provinsi -> Bobot 20% = 18.5 poin\nTotal: 92.7 / 100`
                          )
                        }
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold underline text-[11px]"
                      >
                        Buka Rincian
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: PENDAFTARAN SAYA */}
      {activeTab === "PENDAFTARAN_SAYA" && (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Riwayat Pendaftaran Beasiswa Mahasiswa
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {pendaftaranList.length} Berkas Terdaftar
            </span>
          </div>

          <div className="space-y-4">
            {pendaftaranList.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-700/80 pb-3.5">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {p.nomor}
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {p.beasiswaNama}
                    </h4>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    Status: {p.status}
                  </span>
                </div>

                {/* Pencairan Stages if any */}
                {p.tahapPencairan && (
                  <div>
                    <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
                      Rencana &amp; Tahap Pencairan Dana:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {p.tahapPencairan.map((c) => (
                        <div
                          key={c.termin}
                          className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-xs flex justify-between items-center shadow-2xs"
                        >
                          <div>
                            <div className="font-bold text-zinc-800 dark:text-zinc-200">
                              Termin ke-{c.termin}
                            </div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{c.nominal}</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
