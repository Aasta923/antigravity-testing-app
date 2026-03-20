"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ClipboardList, BarChart3, Settings, LogOut, Clock } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "儀表板", href: "/dashboard" },
  { icon: Users, label: "病人管理", href: "/patients" },
  { icon: ClipboardList, label: "紀錄中心", href: "/records" },
  { icon: BarChart3, label: "趨勢分析", href: "/trends" },
  { icon: Settings, label: "系統設定", href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-primary/10 flex flex-col z-20 shadow-2xl shadow-primary-glow/20">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tighter">
          Patient Tracker
        </h2>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary-glow scale-[1.02]" 
                  : "text-foreground-muted hover:bg-primary-glow hover:text-primary"
              )}
            >
              <Icon size={22} className={clsx("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary/60")} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary/5 bg-primary-glow/30">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
          <Clock className="text-primary" size={20} />
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">目前班次</p>
            <p className="text-sm font-black text-foreground">早班 (08-16)</p>
          </div>
        </div>
      </div>
    </aside>
  );
};