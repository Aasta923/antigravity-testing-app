"use client";

import React from "react";
import { PageShell } from "@/components/ui/PageShell";
import { Settings as SettingsIcon, Save, ChevronRight, User, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <PageShell>
      <header className="mb-12">
        <h1 className="text-4xl font-black text-primary mb-2 flex items-center gap-3">
          <SettingsIcon className="text-secondary" /> 系統設定
        </h1>
        <p className="text-foreground-muted font-medium">個人化數據採集標準與系統偏好設定</p>
      </header>

      <div className="max-w-3xl space-y-8 pb-20">
        <section className="card border-none shadow-xl shadow-primary-glow/5 p-8 flex items-center justify-between group cursor-pointer hover:bg-primary-glow/10 transition-all">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
              <User size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">管理員個人資料</h3>
              <p className="text-sm font-bold text-foreground-muted">admin@tracker.com • 班別: A1</p>
            </div>
          </div>
          <ChevronRight className="text-primary group-hover:translate-x-2 transition-transform" />
        </section>

        <section className="card border-none shadow-xl shadow-primary-glow/5 p-8">
          <h3 className="text-xl font-black text-foreground/80 mb-8 flex items-center gap-2">
            <Database className="text-primary" /> 自定義 I/O 標準項目
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1">攝入項目 A (靜脈輸液)</label>
                <input 
                  type="text" 
                  defaultValue="靜脈輸液 (IV Fluids)" 
                  className="w-full p-4 bg-surface-muted rounded-2xl border-none focus:ring-4 focus:ring-primary/20 outline-none font-bold text-foreground"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1">輸出項目 A (引流管)</label>
                <input 
                  type="text" 
                  defaultValue="引流管量 (Drainage Vol.)" 
                  className="w-full p-4 bg-surface-muted rounded-2xl border-none focus:ring-4 focus:ring-primary/20 outline-none font-bold text-foreground"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-muted flex justify-end">
              <button className="btn-primary w-full sm:w-auto px-10">
                <Save size={20} /> 儲存變更
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="card border-none shadow-xl shadow-primary-glow/5 p-8 hover:bg-secondary-glow/10 transition-all cursor-pointer group">
            <Bell className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="text-lg font-black text-foreground mb-1">通知提醒</h4>
            <p className="text-xs font-bold text-foreground-muted leading-tight">自定義推播、Email、與即時醫學警報設定。</p>
          </section>
          
          <section className="card border-none shadow-xl shadow-primary-glow/5 p-8 hover:bg-primary-glow/10 transition-all cursor-pointer group">
            <Shield className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="text-lg font-black text-foreground mb-1">雙重驗證 (2FA)</h4>
            <p className="text-xs font-bold text-foreground-muted leading-tight">為您的病患隱私層級添加額外保護。</p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}