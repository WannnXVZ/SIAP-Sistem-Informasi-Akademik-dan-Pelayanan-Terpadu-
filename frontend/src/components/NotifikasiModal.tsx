"use client";

import React, { useState } from "react";
import { NotifikasiItem } from "@/lib/types";
import { 
  Bell, 
  X, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Briefcase, 
  MessageSquareWarning, 
  Award
} from "lucide-react";

interface NotifikasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotifikasiItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotifikasiItem[]>>;
  onNavigate: (module: string) => void;
}

export default function NotifikasiModal({
  isOpen,
  onClose,
  notifications,
  setNotifications,
  onNavigate,
}: NotifikasiModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("SEMUA");

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeCategory === "SEMUA") return true;
    return n.kategori === activeCategory;
  });

  const getCategoryIcon = (kat: NotifikasiItem["kategori"]) => {
    switch (kat) {
      case "Akademik":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "Administrasi":
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case "Magang":
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "Pengaduan":
        return <MessageSquareWarning className="w-4 h-4 text-amber-500" />;
      case "Beasiswa":
        return <Award className="w-4 h-4 text-cyan-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  const handleItemClick = (item: NotifikasiItem) => {
    markOneRead(item.id);
    if (item.deepLink) {
      onNavigate(item.deepLink);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] mt-2 animate-in slide-in-from-right duration-300"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Pusat Notifikasi Terpadu
              </h3>
              <p className="text-[11px] text-zinc-500">
                {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : "Semua pesan telah dibaca"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Tandai semua dibaca"
              >
                Tandai Dibaca
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex gap-1.5 overflow-x-auto text-[11px] bg-white dark:bg-zinc-900 scrollbar-none">
          {["SEMUA", "Akademik", "Administrasi", "Magang", "Pengaduan", "Beasiswa"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => handleItemClick(item)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                !item.read
                  ? "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{getCategoryIcon(item.kategori)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs line-clamp-1">
                      {item.judul}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px]">
                    {item.isi}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.createdAt}
                    </span>
                    {item.deepLink && (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5">
                        Lihat <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-400 text-xs">
              Tidak ada notifikasi dalam kategori ini.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-center">
          <span className="text-[11px] text-zinc-500">
            Terhubung via WebSocket SIAP Realtime Alert & SSE
          </span>
        </div>
      </div>
    </div>
  );
}
