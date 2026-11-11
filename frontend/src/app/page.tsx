"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import NotifikasiModal from "@/components/NotifikasiModal";

// Module Components
import { DashboardView } from "@/components/modules/DashboardView";
import { AkademikView } from "@/components/modules/AkademikView";
import { LayananView } from "@/components/modules/LayananView";
import { MagangView } from "@/components/modules/MagangView";
import PengaduanView from "@/components/modules/PengaduanView";
import BeasiswaView from "@/components/modules/BeasiswaView";
import AuditView from "@/components/modules/AuditView";

// Types & Mock Data
import {
  User,
  KrsRecord,
  PengajuanLayanan,
  LowonganMagang,
  LamaranMagang,
  PengaduanTiket,
  BeasiswaProgram,
  PendaftaranBeasiswa,
  NotifikasiItem,
  AuditLogItem,
} from "@/lib/types";

import {
  MOCK_USERS,
  MOCK_KELAS_KULIAH,
  MOCK_KRS_RECORD,
  MOCK_PENGAJUAN_LAYANAN,
  MOCK_LOWONGAN,
  MOCK_LAMARAN,
  MOCK_PENGADUAN,
  MOCK_BEASISWA,
  MOCK_PENDAFTARAN_BEASISWA,
  MOCK_NOTIFIKASI,
  MOCK_AUDIT_LOGS,
} from "@/lib/mockData";

import { CheckCircle2, X } from "lucide-react";

export default function Home() {
  // Current active user & role simulation
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Muhammad Arief Irawan (MHS)
  const [activeModule, setActiveModule] = useState<string>("dashboard");

  // Notifications Modal State
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  // Toast Notification state
  const [activeToast, setActiveToast] = useState<{
    id: string;
    title: string;
    message: string;
    category: string;
  } | null>(null);

  // Global App States
  const [krsData, setKrsData] = useState<KrsRecord>(MOCK_KRS_RECORD);
  const [pengajuanList, setPengajuanList] = useState<PengajuanLayanan[]>(MOCK_PENGAJUAN_LAYANAN);
  const [lowonganList, setLowonganList] = useState<LowonganMagang[]>(MOCK_LOWONGAN);
  const [lamaranList, setLamaranList] = useState<LamaranMagang[]>(MOCK_LAMARAN);
  const [pengaduanList, setPengaduanList] = useState<PengaduanTiket[]>(MOCK_PENGADUAN);
  const [beasiswaList] = useState<BeasiswaProgram[]>(MOCK_BEASISWA);
  const [pendaftaranBeasiswaList, setPendaftaranBeasiswaList] = useState<PendaftaranBeasiswa[]>([
    MOCK_PENDAFTARAN_BEASISWA,
  ]);
  const [notifikasiList, setNotifikasiList] = useState<NotifikasiItem[]>(MOCK_NOTIFIKASI);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);

  // Central Notification & Audit Trail Dispatcher
  const handleNotify = (title: string, message: string, category: NotifikasiItem['kategori']) => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const newNotif: NotifikasiItem = {
      id: `ntf-${uniqueSuffix}`,
      userId: currentUser.id,
      kategori: category,
      judul: title,
      isi: message,
      deepLink: activeModule,
      read: false,
      createdAt: "Baru saja",
    };

    const newAudit: AuditLogItem = {
      id: `aud-${uniqueSuffix}`,
      actor: `${currentUser.name} (${currentUser.activeRole})`,
      role: currentUser.activeRole,
      action: title.toUpperCase().replace(/\s+/g, "_"),
      entityType: category.toUpperCase(),
      entityId: `REF-${uniqueSuffix.slice(-6)}`,
      details: message,
      ip: "192.168.1.105",
      timestamp: new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WITA",
    };

    setNotifikasiList((prev) => {
      if (prev.some((n) => n.id === newNotif.id)) return prev;
      return [newNotif, ...prev];
    });

    setAuditLogs((prev) => {
      if (prev.some((a) => a.id === newAudit.id)) return prev;
      return [newAudit, ...prev];
    });

    // Show toast for 4.5 seconds
    const toastId = `toast-${uniqueSuffix}`;
    setActiveToast({
      id: toastId,
      title,
      message,
      category,
    });

    setTimeout(() => {
      setActiveToast((current) => (current?.id === toastId ? null : current));
    }, 4500);
  };

  // Theme state with localStorage & system preference initialization
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Initial theme check on mount
    const saved = localStorage.getItem("siap_theme");
    let isDark = false;
    if (saved) {
      isDark = saved === "dark";
    } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      isDark = true;
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDarkMode(isDark);
  }, []);

  const handleToggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("siap_theme", "dark");
      handleNotify("Mode Gelap Aktif", "Tampilan beralih ke Dark Mode.", "Sistem");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("siap_theme", "light");
      handleNotify("Mode Terang Aktif", "Tampilan beralih ke Light Mode.", "Sistem");
    }
  };

  const unreadNotifCount = notifikasiList.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        users={MOCK_USERS}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          const accessibleModules: Record<string, string[]> = {
            MHS: ['dashboard', 'akademik', 'layanan', 'magang', 'pengaduan', 'beasiswa', 'notifikasi'],
            DSN: ['dashboard', 'akademik', 'notifikasi'],
            DWL: ['dashboard', 'akademik', 'notifikasi'],
            ADM_AKD: ['dashboard', 'akademik', 'notifikasi', 'audit'],
            STF_LYN: ['dashboard', 'layanan', 'notifikasi', 'audit'],
            MTR: ['dashboard', 'magang', 'notifikasi'],
            KRD_MGG: ['dashboard', 'magang', 'notifikasi', 'audit'],
            ADM_BSW: ['dashboard', 'beasiswa', 'notifikasi', 'audit'],
            KMT_BSW: ['dashboard', 'beasiswa', 'notifikasi'],
            PTG_ADU: ['dashboard', 'pengaduan', 'notifikasi', 'audit'],
            UNIT_ADU: ['dashboard', 'pengaduan', 'notifikasi', 'audit'],
            PMP: ['dashboard', 'akademik', 'layanan', 'magang', 'pengaduan', 'beasiswa', 'notifikasi', 'audit'],
            SUPER: ['dashboard', 'akademik', 'layanan', 'magang', 'pengaduan', 'beasiswa', 'notifikasi', 'audit'],
          };
          if (!accessibleModules[user.activeRole]?.includes(activeModule)) {
            setActiveModule('dashboard');
          }
          handleNotify(
            "Peran Pengguna Dialihkan",
            `Beralih ke akun ${user.name} sebagai ${user.activeRole}.`,
            "Sistem"
          );
        }}
        isDark={isDarkMode}
        onToggleTheme={handleToggleTheme}
        notifications={notifikasiList}
        onOpenNotifications={() => setIsNotifOpen(true)}
        activeModule={activeModule}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          activeRole={currentUser.activeRole}
          counts={{
            layanan: pengajuanList.filter((p) => p.status === "SIAP_DIAMBIL").length,
            magang: lamaranList.filter((l) => l.status === "WAWANCARA").length,
            pengaduan: pengaduanList.filter((t) => t.status === "DIAJUKAN").length,
            beasiswa: beasiswaList.length,
            notifikasi: unreadNotifCount,
          }}
        />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeModule === "dashboard" && (
            <DashboardView
              currentUser={currentUser}
              krs={krsData}
              pengajuanList={pengajuanList}
              lowonganList={lowonganList}
              lamaranList={lamaranList}
              pengaduanList={pengaduanList}
              beasiswaList={beasiswaList}
              onNavigate={(mod) => setActiveModule(mod)}
            />
          )}

          {activeModule === "akademik" && (
            <AkademikView
              currentUser={currentUser}
              krs={krsData}
              onUpdateKrs={(newKrs) => {
                setKrsData(newKrs);
                handleNotify("KRS Berhasil Diperbarui", "Data rencana studi berhasil disimpan.", "Akademik");
              }}
              kelasList={MOCK_KELAS_KULIAH}
            />
          )}

          {activeModule === "layanan" && (
            <LayananView
              currentUser={currentUser}
              pengajuanList={pengajuanList}
              onUpdatePengajuan={(newList) => {
                setPengajuanList(newList);
                handleNotify("Layanan Administrasi", "Perubahan status surat permohonan tersimpan.", "Administrasi");
              }}
            />
          )}

          {activeModule === "magang" && (
            <MagangView
              currentUser={currentUser}
              lowonganList={lowonganList}
              lamaranList={lamaranList}
              onUpdateLamaran={(newList) => {
                setLamaranList(newList);
                handleNotify("Lamaran Magang", "Status lamaran diperbarui ke mitra industri.", "Magang");
              }}
              onUpdateLowongan={(newList) => {
                setLowonganList(newList);
                handleNotify("Lowongan Magang", "Katalog lowongan mitra diperbarui.", "Magang");
              }}
            />
          )}

          {activeModule === "pengaduan" && (
            <PengaduanView
              currentUser={currentUser}
              pengaduanList={pengaduanList}
              setPengaduanList={setPengaduanList}
              onNotify={(title, msg, cat) => handleNotify(title, msg, cat)}
            />
          )}

          {activeModule === "beasiswa" && (
            <BeasiswaView
              currentUser={currentUser}
              beasiswaList={beasiswaList}
              pendaftaranList={pendaftaranBeasiswaList}
              setPendaftaranList={setPendaftaranBeasiswaList}
              onNotify={(title, msg, cat) => handleNotify(title, msg, cat)}
              onNavigateToLayanan={() => setActiveModule("layanan")}
            />
          )}

          {activeModule === "audit" && (
            <AuditView currentUser={currentUser} auditLogs={auditLogs} />
          )}
        </main>
      </div>

      {/* Unified Notification Drawer */}
      <NotifikasiModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifikasiList}
        setNotifications={setNotifikasiList}
        onNavigate={(mod) => {
          setActiveModule(mod);
          setIsNotifOpen(false);
        }}
      />

      {/* Floating Realtime Toast Popup */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-zinc-900 border border-blue-500/30 dark:border-blue-500/40 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {activeToast.title}
              </span>
              <button
                onClick={() => setActiveToast(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              {activeToast.message}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {activeToast.category}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
