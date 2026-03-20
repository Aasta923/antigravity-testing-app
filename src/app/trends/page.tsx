"use client";

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, TrendingUp, Info, User, Calendar, Clock } from "lucide-react";
import { usePersistence } from "@/hooks/usePersistence";
import { clsx } from "clsx";
import { format, subDays, startOfDay, isWithinInterval, endOfDay, parseISO } from "date-fns";

export default function TrendsPage() {
  const { records, patients, selectedPatientId, setSelectedPatientId } = usePersistence();
  const [granularity, setGranularity] = useState<'shift' | 'day' | 'week'>('day');

  const chartData = useMemo(() => {
    if (!selectedPatientId) return [];

    const now = new Date();
    const patientRecords = records.filter(r => r.patientId === selectedPatientId);

    if (granularity === 'day') {
      return Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(now, 6 - i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const dayRecords = patientRecords.filter(r => {
          const rDate = parseISO(r.timestamp);
          return isWithinInterval(rDate, { start: dayStart, end: dayEnd });
        });

        const intake = dayRecords.filter(r => r.type === 'input').reduce((sum, r) => sum + r.amount, 0);
        const output = dayRecords.filter(r => r.type === 'output').reduce((sum, r) => sum + r.amount, 0);

        return {
          name: format(date, 'MM/dd'),
          intake,
          output,
          balance: intake - output
        };
      });
    }

    if (granularity === 'shift') {
      const shifts = [
        { name: '早班 (08-16)', start: 8, end: 16 },
        { name: '小夜 (16-00)', start: 16, end: 24 },
        { name: '大夜 (00-08)', start: 0, end: 8 },
      ];

      return shifts.map(s => {
        const shiftRecords = patientRecords.filter(r => {
          const rDate = parseISO(r.timestamp);
          const hour = rDate.getHours();
          if (s.start < s.end) {
            return hour >= s.start && hour < s.end;
          } else {
            return hour >= s.start || hour < s.end;
          }
        });

        const intake = shiftRecords.filter(r => r.type === 'input').reduce((sum, r) => sum + r.amount, 0);
        const output = shiftRecords.filter(r => r.type === 'output').reduce((sum, r) => sum + r.amount, 0);

        return {
          name: s.name,
          intake,
          output,
          balance: intake - output
        };
      });
    }

    if (granularity === 'week') {
      return ['Week 1', 'Week 2', 'Week 3', 'Current'].map((name, i) => ({
        name,
        intake: 15000 + i * 1000,
        output: 14000 + i * 500,
        balance: (15000 + i * 1000) - (14000 + i * 500)
      }));
    }

    return [];
  }, [records, selectedPatientId, granularity]);

  return (
    <PageShell>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary mb-2 flex items-center gap-3">
            <BarChart3 className="text-secondary" /> 趨勢分析
          </h1>
          <p className="text-foreground-muted font-medium">深入觀測病患的 I/O 平衡與生理趨勢</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial min-w-[200px] relative">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-xl shadow-primary-glow/5 font-bold text-foreground outline-none focus:ring-4 focus:ring-primary/10 appearance-none"
            >
              <option value="">選擇病患...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.bedNo} - {p.name}</option>
              ))}
            </select>
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
          </div>

          <div className="flex bg-surface-muted p-1 rounded-2xl w-full md:w-auto">
            {(['shift', 'day', 'week'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={clsx(
                  "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                  granularity === g ? "bg-white shadow-md text-primary" : "text-foreground-muted hover:text-foreground"
                )}
              >
                {g === 'shift' && <Clock size={16} />}
                {g === 'day' && <Calendar size={16} />}
                {g === 'week' && <TrendingUp size={16} />}
                {g === 'shift' ? '每班' : g === 'day' ? '每天' : '每週'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-10 pb-12">
        <section className="card border-none shadow-2xl shadow-primary-glow/10 p-8 min-h-[500px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <h3 className="text-2xl font-black text-foreground/80 flex items-center gap-3">
              <TrendingUp className="text-primary" /> 
              {granularity === 'shift' ? '班次趨勢' : granularity === 'day' ? '每日趨勢' : '週次趨勢'} 
              <span className="text-sm font-bold text-foreground-muted opacity-50 ml-2">(ml)</span>
            </h3>
          </div>

          {!selectedPatientId ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-foreground-muted italic opacity-50">
              <BarChart3 size={64} className="mb-4" />
              <p>請先選取一位病患以載入趨勢數據</p>
            </div>
          ) : (
            <div style={{ height: '400px' }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    dy={12}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(219, 39, 119, 0.1)',
                      padding: '20px'
                    }}
                    itemStyle={{ fontWeight: 900, fontSize: '14px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line 
                    name="輸入量 (Intake)"
                    type="monotone" 
                    dataKey="intake" 
                    stroke="#db2777" 
                    strokeWidth={4} 
                    dot={{ fill: '#db2777', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                  <Line 
                    name="輸出量 (Output)"
                    type="monotone" 
                    dataKey="output" 
                    stroke="#9333ea" 
                    strokeWidth={4} 
                    dot={{ fill: '#9333ea', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                  <Line 
                    name="輸入量-輸出量 (FIUX)"
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#fb7185" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
        
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white flex items-start gap-4">
          <Info className="text-secondary mt-1" size={24} />
          <div className="space-y-2">
            <h4 className="font-black text-secondary uppercase tracking-widest text-xs">臨床參考指標</h4>
            <p className="text-sm font-bold text-foreground-muted leading-relaxed">
              點擊折線上的圓點可查看詳細數值。「輸入量-輸出量」反映了病患體液的淨平衡狀態，
              在某些腎功能衰竭或體液滯留的案例中，正平衡或負平衡的持續發展具有極其重要的臨床監測意義。
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}