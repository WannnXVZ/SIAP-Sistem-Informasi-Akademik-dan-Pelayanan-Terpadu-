"use client";

import React, { useState } from "react";
import { User, AuditLogItem } from "@/lib/types";
import { 
  ShieldCheck, 
  History, 
  Search, 
  Filter, 
  Terminal, 
  Lock, 
  FileSpreadsheet, 
  Clock, 
  Laptop, 
  UserCheck,
  CheckCircle2,
  Database
} from "lucide-react";

interface AuditViewProps {
  currentUser: User;
  auditLogs: AuditLogItem[];
}

export default function AuditView({ currentUser, auditLogs }: AuditViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("SEMUA");
  const [filterEntity, setFilterEntity] = useState("SEMUA");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "SEMUA" || log.role === filterRole;
    const matchesEntity = filterEntity === "SEMUA" || log.entityType === filterEntity;

    return matchesSearch && matchesRole && matchesEntity;
  });

  const handleExportCSV = () => {
    const headers = "Timestamp,Actor,Role,Action,EntityType,EntityId,Details,IP\n";
    const rows = filteredLogs.map(l => 
      `"${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.entityType}","${l.entityId}","${l.details}","${l.ip}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SIAP_POLNES_Audit_Log_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-zinc-900 to-cyan-950 p-6 sm:p-8 text-white shadow-xl shadow-cyan-500/5 border border-cyan-500/20 dark:border-cyan-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Audit Trail Immutable &amp; Tata Kelola Akuntabel POLNES
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Audit Trail &amp; Log Aktivitas Sistem (SIAP-Audit)
            </h1>
            <p className="text-zinc-300/90 text-xs sm:text-sm leading-relaxed">
              Pencatatan setiap interaksi mutasi data (KRS, Persetujuan Dosen Wali, Nilai Excel, Beasiswa, dan Tiket Pengaduan) dengan pencatatan timestamp WITA, IP Address, identitas aktor, dan ringkasan diff data anti-tamper.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold border border-zinc-700 transition-colors shadow-md active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Log Audit (.CSV)
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-10 w-60 h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari aktor, aksi, nomor dokumen, atau detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
            >
              <option value="SEMUA">Semua Peran Aktor</option>
              <option value="MHS">Mahasiswa (MHS)</option>
              <option value="DWL">Dosen Wali (DWL)</option>
              <option value="ADM_AKD">Admin Akademik</option>
              <option value="STF_LYN">Staf Layanan</option>
              <option value="ADM_BSW">Admin Beasiswa</option>
              <option value="PTG_ADU">Petugas Pengaduan</option>
              <option value="UNIT_ADU">Unit Penindak Lanjut</option>
              <option value="KRD_MGG">Koordinator Magang</option>
              <option value="PMP">Pimpinan Kampus</option>
              <option value="SUPER">Super Admin</option>
            </select>

            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
            >
              <option value="SEMUA">Semua Entitas</option>
              <option value="KRS">KRS</option>
              <option value="PENGAJUAN_LAYANAN">Pengajuan Layanan</option>
              <option value="BEASISWA">Beasiswa</option>
              <option value="PENGADUAN">Pengaduan</option>
              <option value="NILAI">Nilai Perkuliahan</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 uppercase font-semibold text-[11px] border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Waktu (WITA)</th>
                <th className="py-3 px-4">Aktor & Peran</th>
                <th className="py-3 px-4">Aksi Dilakukan</th>
                <th className="py-3 px-4">Entitas Terkait</th>
                <th className="py-3 px-4">Detail Mutasi Data</th>
                <th className="py-3 px-4 text-right">IP & Klien</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-normal">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                      {log.actor}
                    </div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-zinc-800 dark:text-zinc-200">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                      {log.entityType} ({log.entityId})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 max-w-xs leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap text-zinc-400 font-mono text-[11px]">
                    <div className="flex items-center justify-end gap-1">
                      <Laptop className="w-3 h-3" />
                      {log.ip}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-zinc-400">
                    Tidak ada aktivitas audit trail yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
