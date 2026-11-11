'use client';

import React from 'react';
import { User, UserRole, NotifikasiItem } from '@/lib/types';
import { 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  AlertCircle, 
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  notifications: NotifikasiItem[];
  onOpenNotifications: () => void;
  activeModule: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSwitchUser,
  isDark,
  onToggleTheme,
  notifications,
  onOpenNotifications,
  activeModule,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'MHS': return { label: 'Mahasiswa', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' };
      case 'DWL': return { label: 'Dosen Wali (DPA)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' };
      case 'DSN': return { label: 'Dosen Pengampu', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200' };
      case 'ADM_AKD': return { label: 'Admin Akademik', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' };
      case 'STF_LYN': return { label: 'Staf Layanan Terpadu', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' };
      case 'MTR': return { label: 'Mitra Industri', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' };
      case 'KRD_MGG': return { label: 'Koordinator Magang', color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200' };
      case 'ADM_BSW': return { label: 'Pengelola Beasiswa', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200' };
      case 'KMT_BSW': return { label: 'Komite Beasiswa', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200' };
      case 'PTG_ADU': return { label: 'Petugas Pengaduan', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' };
      case 'UNIT_ADU': return { label: 'Unit Penindak Lanjut', color: 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-200' };
      case 'PMP': return { label: 'Pimpinan Kampus', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200' };
      case 'SUPER': return { label: 'Super Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' };
      default: return { label: role, color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' };
    }
  };

  const badge = getRoleBadge(currentUser.activeRole);

  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-panel border-b transition-colors px-4 lg:px-8 flex items-center justify-between">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            SI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white">SIAP</span>
              <span className="text-xs px-2 py-0.5 font-semibold rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                POLNES
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Sistem Informasi Akademik &amp; Pelayanan Terpadu
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center text-xs text-slate-400 dark:text-slate-500 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] capitalize border border-blue-200 dark:border-blue-900/50">
            {activeModule}
          </span>
          <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> WITA (UTC+8)
          </span>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Interactive Role Switcher for Hackathon Demo */}
        <div className="flex items-center gap-2 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ml-0.5 hidden sm:block shrink-0" />
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline whitespace-nowrap">Simulasi:</span>
          <select 
            className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer pr-1"
            value={currentUser.id}
            onChange={(e) => {
              const selected = users.find(u => u.id === e.target.value);
              if (selected) onSwitchUser(selected);
            }}
          >
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {u.name} ({getRoleBadge(u.activeRole).label})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all active:scale-95"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all active:scale-95"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm shadow-rose-500/50">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
              {currentUser.name}
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${badge.color}`}>
              {badge.label}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
