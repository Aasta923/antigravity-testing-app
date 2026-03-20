"use client";

import React from "react";
import { PageShell } from "@/components/ui/PageShell";
import { AlertCircle, ArrowUpRight, ArrowDownRight, Activity, Users, PlusCircle } from "lucide-react";
import { usePersistence } from "@/hooks/usePersistence";
import { clsx } from "clsx";

export default function Dashboard() {
  const { records, patients } = usePersistence();

  const totalInput = records.filter(r => r.type === 'input').reduce((sum, r) => sum + r.amount, 0);
  const totalOutput = records.filter(r => r.type === 'output').reduce((sum, r) => sum + r.amount, 0);
  const balance = totalInput - totalOutput;

  const lowUrine = records.filter(r => r.category === 'urine').reduce((sum, r) => sum + r.amount, 0) < 300;

  return (
    <PageShell>
      <header className="mb-12">
        <h1 className="text-5xl font-black text-primary mb-3">儀表板</h1>
        <p className="text-foreground-muted text-lg font-medium">歡迎回來，目前正在監控您的 {patients.length} 位病患紀錄中心。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="card relative overflow-hidden bg-white group border-none shadow-xl shadow-primary-glow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <ArrowUpRight size={120} />
          </div>
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">今日總攝入量 (Input)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-black text-primary tracking-tighter">{totalInput}</h2>
            <span className="text-2xl font-bold text-foreground-muted ml-1">ml</span>
          </div>
        </div>

        <div className="card relative overflow-hidden bg-white group border-none shadow-xl shadow-secondary-glow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            <ArrowDownRight size={120} />
          </div>
          <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">今日總排出量 (Output)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-black text-secondary tracking-tighter">{totalOutput}</h2>
            <span className="text-2xl font-bold text-foreground-muted ml-1">ml</span>
          </div>
        </div>

        <div className="card relative overflow-hidden bg-primary text-white border-none shadow-2xl shadow-primary-glow">
          <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">當前 24h 淨平衡 (Balance)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-black tracking-tighter">
              {balance > 0 ? `+${balance}` : balance}
            </h2>
            <span className="text-2xl font-bold opacity-70 ml-1">ml</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3 text-foreground/80 px-1">
            <AlertCircle className="text-secondary" />
            即時醫學預警
          </h3>
          <div className="space-y-4">
            {lowUrine && (
              <div className="p-6 bg-secondary/10 border-l-8 border-secondary rounded-2xl animate-pulse">
                <div className="flex items-start gap-4">
                  <AlertCircle className="text-secondary mt-1" size={28} />
                  <div>
                    <h4 className="text-xl font-black text-secondary tracking-tight">低尿量警告 (Low Urine)</h4>
                    <p className="text-sm font-bold text-secondary/80 mt-1">
                      當前班次累計尿量低於 {300}ml，請確認病患水分攝取。
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!lowUrine && (
              <div className="card bg-white/50 border-dashed flex items-center justify-center py-12">
                <p className="text-foreground-muted font-bold text-sm italic">目前無重大預警狀況 ✨</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3 text-foreground/80 px-1">
            <Activity className="text-primary" />
            快速操作
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="card flex flex-col items-center justify-center gap-4 py-8 bg-white hover:bg-primary-glow hover:border-primary transition-all group">
              <Users size={32} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-black text-sm uppercase tracking-wider">病患列表</span>
            </button>
            <button className="card flex flex-col items-center justify-center gap-4 py-8 bg-white hover:bg-secondary-glow hover:border-secondary transition-all group">
              <PlusCircle size={32} className="text-secondary group-hover:scale-110 transition-transform" />
              <span className="font-black text-sm uppercase tracking-wider">新增筆錄</span>
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}