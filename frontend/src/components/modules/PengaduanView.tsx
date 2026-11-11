"use client";

import React, { useState } from "react";
import { User, UserRole, PengaduanTiket, PengaduanStatus } from "@/lib/types";
import { 
  MessageSquareWarning, 
  ShieldCheck, 
  ShieldAlert, 
  EyeOff, 
  Clock, 
  CheckCircle2, 
  Send, 
  PlusCircle, 
  Filter, 
  ChevronRight, 
  Star, 
  RefreshCw, 
  Paperclip,
  Lock,
  Tag,
  AlertTriangle,
  Building2
} from "lucide-react";

interface PengaduanViewProps {
  currentUser: User;
  pengaduanList: PengaduanTiket[];
  setPengaduanList: React.Dispatch<React.SetStateAction<PengaduanTiket[]>>;
  onNotify: (title: string, msg: string, category: 'Pengaduan') => void;
}

export default function PengaduanView({
  currentUser,
  pengaduanList,
  setPengaduanList,
  onNotify,
}: PengaduanViewProps) {
  const isStaffOrAdmin = ["PTG_ADU", "UNIT_ADU", "SUPER", "ADM_AKD"].includes(currentUser.activeRole);
  
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    pengaduanList.length > 0 ? pengaduanList[0].id : ""
  );
  const [filterKategori, setFilterKategori] = useState<string>("SEMUA");
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New ticket state
  const [newJudul, setNewJudul] = useState("");
  const [newKategori, setNewKategori] = useState<PengaduanTiket["kategori"]>("Sarana & Prasarana");
  const [newPrioritas, setNewPrioritas] = useState<PengaduanTiket["prioritas"]>("Sedang");
  const [newDeskripsi, setNewDeskripsi] = useState("");
  const [isAnonim, setIsAnonim] = useState(true);
  const [unitTujuan, setUnitTujuan] = useState("UPT Pemeliharaan & Sarpras POLNES");

  // New message state
  const [replyText, setReplyText] = useState("");
  const [replyType, setReplyType] = useState<"PUBLIK" | "INTERNAL">("PUBLIK");

  // Filtered tickets
  const filteredList = pengaduanList.filter((item) => {
    // If student, only show their own tickets
    if (currentUser.activeRole === "MHS" && item.pelaporId !== currentUser.id) {
      return false;
    }
    if (filterKategori !== "SEMUA" && item.kategori !== filterKategori) return false;
    if (filterStatus !== "SEMUA" && item.status !== filterStatus) return false;
    return true;
  });

  const activeTicket = pengaduanList.find((t) => t.id === selectedTicketId) || filteredList[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newDeskripsi.trim()) return;

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newTicket: PengaduanTiket = {
      id: `tkt-${uniqueId}`,
      nomor: `TKT-202610-${Math.floor(1000 + Math.random() * 9000)}`,
      pelaporId: currentUser.id,
      pelaporNama: isAnonim ? "Mahasiswa Anonim" : currentUser.name,
      pelaporNim: isAnonim ? "NIM Disamarkan" : currentUser.identifier,
      rahasiakanIdentitas: isAnonim,
      kategori: newKategori,
      isSensitif: isAnonim || newKategori === "Kekerasan/Etika",
      judul: newJudul,
      deskripsi: newDeskripsi,
      unitTerkait: unitTujuan,
      prioritas: newPrioritas,
      status: "DIAJUKAN",
      tanggapan: [
        {
          id: `tg-${uniqueId}`,
          author: "Sistem Pengaduan SIAP",
          role: "SYSTEM",
          isi: "Tiket pengaduan berhasil dicatat dengan enkripsi identitas. Menunggu verifikasi petugas.",
          tipe: "PUBLIK",
          createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ],
      createdAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      updatedAt: "Baru saja",
    };

    setPengaduanList([newTicket, ...pengaduanList]);
    setSelectedTicketId(newTicket.id);
    setShowNewModal(false);
    setNewJudul("");
    setNewDeskripsi("");
    onNotify(
      "Tiket Pengaduan Dibuat",
      `Tiket #${newTicket.nomor} berhasil didaftarkan secara aman dengan status terlindungi.`,
      "Pengaduan"
    );
  };

  const handleAddReply = () => {
    if (!replyText.trim() || !activeTicket) return;

    const replyId = `tg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updated = pengaduanList.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          updatedAt: "Baru saja",
          tanggapan: [
            ...t.tanggapan,
            {
              id: replyId,
              author: currentUser.activeRole === "MHS" && t.rahasiakanIdentitas ? "Pelapor (Anonim)" : currentUser.name,
              role: currentUser.activeRole,
              isi: replyText,
              tipe: replyType,
              createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return t;
    });

    setPengaduanList(updated);
    setReplyText("");
    onNotify(
      "Tanggapan Ditambahkan",
      `Tanggapan baru berhasil dikirim ke Tiket #${activeTicket.nomor}`,
      "Pengaduan"
    );
  };

  const handleUpdateStatus = (newStatus: PengaduanStatus) => {
    if (!activeTicket) return;
    const statusChangeId = `tg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updated = pengaduanList.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: newStatus,
          updatedAt: "Baru saja",
          tanggapan: [
            ...t.tanggapan,
            {
              id: statusChangeId,
              author: currentUser.name,
              role: currentUser.activeRole,
              isi: `Status tiket diubah menjadi: ${newStatus}`,
              tipe: "PUBLIK" as const,
              createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return t;
    });

    setPengaduanList(updated);
    onNotify("Status Tiket Diperbarui", `Tiket #${activeTicket.nomor} kini berstatus ${newStatus}`, "Pengaduan");
  };

  const handleReopenTicket = () => {
    if (!activeTicket) return;
    const reason = prompt(
      "Alasan Buka Kembali Tiket (Reopen - BR-054):\nMasukkan kendala yang masih terjadi atau alasan pembukaan kembali tiket:"
    );
    if (!reason || !reason.trim()) return;

    const reopenId = `tg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updated = pengaduanList.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: "DIPROSES" as PengaduanStatus,
          updatedAt: "Baru saja",
          tanggapan: [
            ...t.tanggapan,
            {
              id: reopenId,
              author: t.rahasiakanIdentitas ? "Pelapor (Anonim)" : currentUser.name,
              role: currentUser.activeRole,
              isi: `[TIKET DIBUKA KEMBALI - BR-054]: ${reason}`,
              tipe: "PUBLIK" as const,
              createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return t;
    });

    setPengaduanList(updated);
    onNotify(
      "Tiket Dibuka Kembali",
      `Tiket #${activeTicket.nomor} berhasil dibuka kembali (Reopened) untuk investigasi ulang.`,
      "Pengaduan"
    );
  };

  const handleDisposisiUnit = (newUnit: string) => {
    if (!activeTicket) return;
    const disposisiId = `tg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const updated = pengaduanList.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          unitTerkait: newUnit,
          updatedAt: "Baru saja",
          tanggapan: [
            ...t.tanggapan,
            {
              id: disposisiId,
              author: currentUser.name,
              role: currentUser.activeRole,
              isi: `Tiket didisposisikan ke unit penindak lanjut: ${newUnit}`,
              tipe: "PUBLIK" as const,
              createdAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return t;
    });

    setPengaduanList(updated);
    onNotify("Disposisi Unit Berhasil", `Tiket #${activeTicket.nomor} dialihkan ke: ${newUnit}`, "Pengaduan");
  };

  const handleRateTicket = (rating: number) => {
    if (!activeTicket) return;
    const updated = pengaduanList.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          rating,
          ratingKomentar: "Terima kasih atas penanganan cepat dari tim kampus POLNES.",
        };
      }
      return t;
    });
    setPengaduanList(updated);
    onNotify("Rating Diberikan", `Anda memberikan ${rating} bintang untuk penanganan pengaduan ini.`, "Pengaduan");
  };

  const getStatusBadge = (status: PengaduanStatus) => {
    switch (status) {
      case "DIAJUKAN":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">Diajukan</span>;
      case "DIVERIFIKASI":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">Diverifikasi</span>;
      case "DIPROSES":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300">Diproses Unit</span>;
      case "DITINDAKLANJUTI":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-300">Ditindaklanjuti</span>;
      case "SELESAI":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">Selesai</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-700">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: PengaduanTiket["prioritas"]) => {
    switch (priority) {
      case "Darurat":
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-500 text-white">DARURAT</span>;
      case "Tinggi":
        return <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-500 text-white">TINGGI</span>;
      case "Sedang":
        return <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">SEDANG</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">RENDAH</span>;
    }
  };

  // Step tracker order
  const steps: PengaduanStatus[] = ["DIAJUKAN", "DIVERIFIKASI", "DIPROSES", "DITINDAKLANJUTI", "SELESAI"];
  const currentStepIndex = activeTicket ? steps.indexOf(activeTicket.status) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Privacy Guarantee */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-700 via-orange-600 to-amber-600 dark:from-rose-950 dark:via-orange-950 dark:to-neutral-900 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/10 border border-rose-500/20 dark:border-rose-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 dark:bg-rose-500/20 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20 dark:border-rose-400/30 text-rose-100 dark:text-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
              Whistleblowing &amp; Layanan Aspirasi Terlindungi UU PDP &amp; Enkripsi Anonim
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Aspirasi &amp; Pengaduan Kampus (Lapor SIAP)
            </h1>
            <p className="text-rose-100/90 dark:text-rose-200/80 text-xs sm:text-sm leading-relaxed">
              Saluran resmi pelaporan kendala akademik, fasilitas, keuangan, dan etika kampus POLNES dengan penanganan transparan, berjenjang, dan proteksi kerahasiaan identitas pelapor.
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-900 font-extrabold text-xs shadow-lg hover:bg-rose-50 active:scale-95 transition-all self-start md:self-center shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-rose-600" />
            Buat Laporan / Pengaduan Baru
          </button>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 rounded-full bg-orange-400/15 blur-2xl pointer-events-none" />
      </div>

      {/* Main Grid: Ticket List (Left) & Ticket Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-amber-500" />
                Daftar Tiket ({filteredList.length})
              </h3>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {currentUser.activeRole === "MHS" ? "Laporan Saya" : "Antrean Kampus"}
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-800 dark:text-zinc-200"
              >
                <option value="SEMUA">Semua Kategori</option>
                <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                <option value="Akademik">Akademik</option>
                <option value="Layanan Administrasi">Layanan Administrasi</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Kekerasan/Etika">Kekerasan / Etika</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-zinc-800 dark:text-zinc-200"
              >
                <option value="SEMUA">Semua Status</option>
                <option value="DIAJUKAN">Diajukan</option>
                <option value="DIVERIFIKASI">Diverifikasi</option>
                <option value="DIPROSES">Diproses</option>
                <option value="DITINDAKLANJUTI">Ditindaklanjuti</option>
                <option value="SELESAI">Selesai</option>
              </select>
            </div>

            {/* Ticket List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredList.map((ticket) => {
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                          {ticket.nomor}
                        </span>
                        {ticket.rahasiakanIdentitas && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                            <EyeOff className="w-2.5 h-2.5" />
                            Anonim
                          </span>
                        )}
                      </div>
                      {getPriorityBadge(ticket.prioritas)}
                    </div>

                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {ticket.judul}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-zinc-400" />
                        {ticket.kategori}
                      </span>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="text-center py-10 text-zinc-400 text-sm">
                  Tidak ada tiket pengaduan ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Detail & Conversation */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                      {activeTicket.nomor}
                    </span>
                    {getPriorityBadge(activeTicket.prioritas)}
                    {getStatusBadge(activeTicket.status)}
                  </div>
                  <div className="text-xs text-zinc-400">
                    Dibuat: {activeTicket.createdAt}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {activeTicket.judul}
                </h3>

                {/* Sub Metadata */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    Unit: <strong className="text-zinc-800 dark:text-zinc-200">{activeTicket.unitTerkait || "Belum Didisposisi"}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Pelapor:{" "}
                    {activeTicket.rahasiakanIdentitas ? (
                      <span className="font-medium text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Mahasiswa Terproteksi (NIM Disamarkan)
                      </span>
                    ) : (
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {activeTicket.pelaporNama} ({activeTicket.pelaporNim})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Progres Penanganan
                </h4>
                <div className="grid grid-cols-5 gap-2 relative">
                  {steps.map((st, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={st} className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                          } ${isCurrent ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-zinc-900 scale-110" : ""}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400 mt-1.5">
                          {st.charAt(0) + st.slice(1).toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Staff Action Controls (if role is Staff/Admin) */}
              {isStaffOrAdmin && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      Disposisi Unit Penindak Lanjut (FR-042):
                    </div>
                    <select
                      value={activeTicket.unitTerkait || "UPT Pemeliharaan & Sarpras POLNES"}
                      onChange={(e) => handleDisposisiUnit(e.target.value)}
                      className="text-xs bg-white dark:bg-zinc-800 border border-amber-300 dark:border-amber-800 rounded-lg p-1.5 font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="UPT Pemeliharaan & Sarpras POLNES">UPT Pemeliharaan &amp; Sarpras POLNES</option>
                      <option value="Satgas PPKS & Komisi Etika Mahasiswa">Satgas PPKS &amp; Komisi Etika Mahasiswa</option>
                      <option value="Bagian Akademik & Kemahasiswaan (BAK)">Bagian Akademik &amp; Kemahasiswaan (BAK)</option>
                      <option value="Bagian Keuangan & BMN POLNES">Bagian Keuangan &amp; BMN POLNES</option>
                      <option value="Pusat Karir & Kerjasama Industri">Pusat Karir &amp; Kerjasama Industri</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/50 dark:border-amber-900/40">
                    <div className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                      Status Alur Penanganan:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeTicket.status === "DIAJUKAN" && (
                        <button
                          onClick={() => handleUpdateStatus("DIVERIFIKASI")}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Verifikasi Tiket
                        </button>
                      )}
                      {activeTicket.status === "DIVERIFIKASI" && (
                        <button
                          onClick={() => handleUpdateStatus("DIPROSES")}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Kirim ke Unit Lapangan
                        </button>
                      )}
                      {activeTicket.status === "DIPROSES" && (
                        <button
                          onClick={() => handleUpdateStatus("DITINDAKLANJUTI")}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Tandai Selesai Tindakan
                        </button>
                      )}
                      {activeTicket.status === "DITINDAKLANJUTI" && (
                        <button
                          onClick={() => handleUpdateStatus("SELESAI")}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Tutup & Selesaikan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Description Card */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="font-semibold text-xs text-zinc-500 uppercase tracking-wider mb-1.5">
                  Uraian Laporan Mahasiswa:
                </div>
                <p className="whitespace-pre-line leading-relaxed">{activeTicket.deskripsi}</p>
              </div>

              {/* Discussion Thread */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                  <span>Riwayat Tanggapan & Investigasi ({activeTicket.tanggapan.length})</span>
                  {isStaffOrAdmin && (
                    <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">
                      Mode Staf: Dapat mengirim Catatan Internal
                    </span>
                  )}
                </h4>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {activeTicket.tanggapan.map((item) => {
                    const isInternal = item.tipe === "INTERNAL";
                    // Only show internal notes to staff
                    if (isInternal && !isStaffOrAdmin) return null;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                          isInternal
                            ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                            : "bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.author}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                              {item.role}
                            </span>
                            {isInternal && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                                CATATAN INTERNAL
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-400 text-[10px]">{item.createdAt}</span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300">{item.isi}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input Box */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  {isStaffOrAdmin && (
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="replyType"
                          checked={replyType === "PUBLIK"}
                          onChange={() => setReplyType("PUBLIK")}
                        />
                        <span>Tanggapan Publik (Dilihat Mahasiswa)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-rose-600 dark:text-rose-400">
                        <input
                          type="radio"
                          name="replyType"
                          checked={replyType === "INTERNAL"}
                          onChange={() => setReplyType("INTERNAL")}
                        />
                        <span>Catatan Internal (Hanya Petugas)</span>
                      </label>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={
                        isStaffOrAdmin && replyType === "INTERNAL"
                          ? "Tulis catatan rahasia internal tim..."
                          : "Tulis balasan atau informasi tambahan..."
                      }
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
                      className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleAddReply}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Kirim
                    </button>
                  </div>
                </div>
              </div>

              {/* Rating & Reopen Section (If status is Selesai and role is Mahasiswa) */}
              {activeTicket.status === "SELESAI" && (
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-center space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                      Bagaimana kepuasan Anda terhadap penanganan tiket ini?
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">
                      Evaluasi Anda membantu meningkatkan mutu pelayanan kampus POLNES.
                    </p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateTicket(star)}
                          className="p-1 text-amber-500 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (activeTicket.rating || 0) >= star ? "fill-amber-500" : "text-zinc-300 dark:text-zinc-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentUser.activeRole === "MHS" && (
                    <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        <strong className="text-zinc-800 dark:text-zinc-200 block">Masalah belum tuntas atau kendala berulang?</strong>
                        Sesuai aturan BR-054, Anda dapat mengajukan pembukaan kembali tiket dalam 7 hari.
                      </div>
                      <button
                        onClick={handleReopenTicket}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Buka Kembali Tiket (Reopen)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
              Pilih tiket pengaduan di sebelah kiri untuk melihat detail dan tanggapan.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Buat Tiket Baru */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  Buat Laporan / Pengaduan Baru
                </h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              {/* Anonymous Toggle Callout */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonim}
                  onChange={(e) => setIsAnonim(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="anonCheck" className="cursor-pointer">
                  <div className="font-semibold text-amber-950 dark:text-amber-200">
                    Rahasiakan Identitas Saya (Whistleblowing Protection)
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
                    Nama dan NIM Anda akan dienkripsi dan disamarkan dari unit pemeriksa. Hanya Super Admin audit yang memiliki hak akses terbatas.
                  </div>
                </label>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Kategori Pengaduan
                </label>
                <select
                  value={newKategori}
                  onChange={(e) => setNewKategori(e.target.value as PengaduanTiket["kategori"])}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Sarana & Prasarana">Sarana & Prasarana Kampus (Gedung, AC, Lab, Wifi)</option>
                  <option value="Akademik">Akademik (Dosen, Penilaian, Jadwal Kuliah)</option>
                  <option value="Layanan Administrasi">Layanan Administrasi & Surat Menyurat</option>
                  <option value="Keuangan">Keuangan & Pembayaran UKT</option>
                  <option value="Kekerasan/Etika">Kekerasan / Pelanggaran Etika & Satgas PPKS</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={newPrioritas}
                    onChange={(e) => setNewPrioritas(e.target.value as PengaduanTiket["prioritas"])}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="Rendah">Rendah (Aspirasi / Saran)</option>
                    <option value="Sedang">Sedang (Kendala Umum)</option>
                    <option value="Tinggi">Tinggi (Mendesak / Mengganggu KBM)</option>
                    <option value="Darurat">Darurat (Keamanan & Keselamatan)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Unit Terkait (Opsional)
                  </label>
                  <input
                    type="text"
                    value={unitTujuan}
                    onChange={(e) => setUnitTujuan(e.target.value)}
                    placeholder="Contoh: UPT Komputer POLNES"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Judul Ringkas Pengaduan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kerusakan proyektor di Lab Jaringan Gedung TI Lantai 2"
                  value={newJudul}
                  onChange={(e) => setNewJudul(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Uraian Lengkap Kejadian / Kendala
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Sebutkan detail lokasi kejadian, waktu kendala terjadi, dan dampak yang dialami secara objektif..."
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md active:scale-95 transition-all"
                >
                  Kirim Pengaduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
