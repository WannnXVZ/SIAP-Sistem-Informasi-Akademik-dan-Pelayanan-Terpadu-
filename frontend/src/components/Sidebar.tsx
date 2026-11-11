'use client';

import React from 'react';
import { UserRole } from '@/lib/types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  MessageSquareWarning, 
  Sparkles, 
  History, 
  Bell,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (moduleKey: string) => void;
  activeRole: UserRole;
  counts: {
    layanan: number;
    magang: number;
    pengaduan: number;
    beasiswa: number;
    notifikasi: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  activeRole,
  counts,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      roles: ['MHS', 'DSN', 'DWL', 'ADM_AKD', 'STF_LYN', 'MTR', 'KRD_MGG', 'ADM_BSW', 'KMT_BSW', 'PTG_ADU', 'UNIT_ADU', 'PMP', 'SUPER'],
    },
    {
      id: 'akademik',
      label: 'Akademik & SIAKAD',
      icon: GraduationCap,
      roles: ['MHS', 'DSN', 'DWL', 'ADM_AKD', 'PMP', 'SUPER'],
      badge: activeRole === 'DWL' ? 'Persetujuan' : activeRole === 'MHS' ? 'KRS Online' : activeRole === 'ADM_AKD' ? 'Master Jadwal' : undefined,
    },
    {
      id: 'layanan',
      label: 'Layanan Administrasi',
      icon: FileText,
      roles: ['MHS', 'STF_LYN', 'PMP', 'SUPER'],
      badge: activeRole === 'STF_LYN' ? 'Loket 03' : undefined,
      count: counts.layanan,
    },
    {
      id: 'magang',
      label: 'Portal Magang',
      icon: Briefcase,
      roles: ['MHS', 'MTR', 'KRD_MGG', 'PMP', 'SUPER'],
      badge: activeRole === 'MTR' ? 'Rekrutmen' : activeRole === 'KRD_MGG' ? 'Kurasi' : undefined,
      count: counts.magang,
    },
    {
      id: 'pengaduan',
      label: 'Pengaduan Mahasiswa',
      icon: MessageSquareWarning,
      roles: ['MHS', 'PTG_ADU', 'UNIT_ADU', 'PMP', 'SUPER'],
      badge: activeRole === 'UNIT_ADU' ? 'Disposisi' : undefined,
      count: counts.pengaduan,
    },
    {
      id: 'beasiswa',
      label: 'Beasiswa Cerdas (AI)',
      icon: Sparkles,
      roles: ['MHS', 'ADM_BSW', 'KMT_BSW', 'PMP', 'SUPER'],
      badge: activeRole === 'MHS' ? 'Proaktif' : activeRole === 'ADM_BSW' ? 'HITL Verifier' : undefined,
    },
    {
      id: 'notifikasi',
      label: 'Pusat Notifikasi',
      icon: Bell,
      roles: ['MHS', 'DSN', 'DWL', 'ADM_AKD', 'STF_LYN', 'MTR', 'KRD_MGG', 'ADM_BSW', 'KMT_BSW', 'PTG_ADU', 'UNIT_ADU', 'PMP', 'SUPER'],
      count: counts.notifikasi,
    },
    {
      id: 'audit',
      label: 'Audit Trail & Log',
      icon: History,
      roles: ['ADM_AKD', 'STF_LYN', 'ADM_BSW', 'PTG_ADU', 'UNIT_ADU', 'KRD_MGG', 'PMP', 'SUPER'],
    },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(activeRole));

  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-200/90 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl p-4 flex flex-col justify-between min-h-[calc(100vh-4rem)] transition-colors">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Navigasi Modul
          </div>
          <nav className="space-y-1">
            {filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-white/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                      isActive 
                        ? 'bg-white/20 text-white border border-white/30 backdrop-blur-xs' 
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className={`text-[10px] min-w-5 h-5 px-1 rounded-full font-bold flex items-center justify-center ${
                      isActive 
                        ? 'bg-white text-blue-600 shadow-xs' 
                        : 'bg-rose-500 text-white shadow-xs shadow-rose-500/30'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Info Box Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-zinc-800/80 dark:to-indigo-950/30 border border-blue-100/80 dark:border-zinc-700/60">
          <div className="flex items-center gap-2 mb-1.5 text-blue-800 dark:text-blue-300 font-bold text-xs">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Info Semester</span>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Semester Ganjil 2026/2027 aktif. Pengisian KRS ditutup 15 Oktober 2026.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 flex flex-col gap-1 px-2">
        <div className="font-semibold text-zinc-700 dark:text-zinc-300">SIAP POLNES v1.0.0</div>
        <div>Politeknik Negeri Samarinda</div>
      </div>
    </aside>
  );
};
