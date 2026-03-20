"use client";

import React from "react";
import { User, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass z-10 border-b border-primary/5 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h1 className="text-xl font-black text-foreground/80 tracking-tight">專業護理紀錄系統</h1>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 text-foreground-muted hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
          </button>
          
          <div className="flex items-center gap-4 pl-6 border-l border-primary/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-foreground tracking-tight">{user?.email?.split('@')[0] || '管理員'}</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">高級護理師</p>
            </div>
            <button 
              onClick={logout}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-muted text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              title="登出系統"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};