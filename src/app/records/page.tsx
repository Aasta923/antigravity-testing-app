"use client";

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { RecordForm } from "@/components/io/RecordForm";
import { Plus, Trash2, Clock, Info, User } from "lucide-react";
import { usePersistence } from "@/context/PersistenceContext";
import { clsx } from "clsx";
import { format } from "date-fns";

export default function RecordsPage() {
  const { records, patients, selectedPatientId, setSelectedPatientId, addRecord, clearRecords } = usePersistence();
  const [isAdding, setIsAdding] = useState(false);

  // Filter records for the selected patient
  const filteredRecords = useMemo(() => {
    return records.filter(r => r.patientId === selectedPatientId);
  }, [records, selectedPatientId]);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const calculateShiftTotal = (shiftName: string) => {
    // Basic calculation for the selected patient
    return filteredRecords.reduce((acc, r) => acc + (r.type === 'input' ? r.amount : -r.amount), 0);
  };

  return (
    <PageShell>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary mb-2">紀錄中心</h1>
          <p className="text-foreground-muted flex items-center gap-2">
            <Info size={16} /> 選擇病患並紀錄其攝入與排出數據
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Patient Selector */}
          <div className="flex-1 md:flex-initial min-w-[200px] relative">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl shadow-xl shadow-primary-glow/5 font-bold text-foreground outline-none focus:ring-4 focus:ring-primary/10 appearance-none"
            >
              <option value="">選擇病患...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.bedNo} - {p.name}</option>
              ))}
            </select>
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
          </div>

          {!isAdding && selectedPatientId && (
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={clearRecords}
                className="p-3 bg-surface-muted text-foreground-muted rounded-xl hover:bg-danger/10 hover:text-danger transition-all"
                title="清空該病患紀錄"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={() => setIsAdding(true)}
                className="btn-primary py-3"
              >
                <Plus size={20} /> 新增紀錄
              </button>
            </div>
          )}
        </div>
      </header>

      {!selectedPatientId ? (
        <div className="card text-center py-32 bg-surface-muted/30 border-dashed border-4 flex flex-col items-center justify-center animate-fade-in">
           <User size={64} className="text-primary/20 mb-4" />
           <p className="text-xl font-black text-foreground-muted/60 tracking-tight">請先於上方選取一位病患以載入資料</p>
        </div>
      ) : isAdding ? (
        <RecordForm 
          onSave={(data) => {
            addRecord({
              ...data,
              patientId: selectedPatientId,
              recordedBy: 'user-1'
            });
            setIsAdding(false);
          }} 
          onCancel={() => setIsAdding(false)} 
        />
      ) : (
        <div className="space-y-10 animate-fade-in">
          {/* Current Selection Ribbon */}
          <div className="p-4 bg-primary rounded-2xl shadow-lg shadow-primary-glow flex items-center justify-between text-white">
            <div className="flex items-center gap-4 pl-2">
              <div className="bg-white/20 p-2 rounded-xl">
                 <User size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-70">當前病患資料</p>
                 <p className="text-lg font-black tracking-tight">{selectedPatient?.bedNo} - {selectedPatient?.name}</p>
              </div>
            </div>
            <div className="pr-4 hidden sm:block">
               <p className="text-xs font-bold opacity-70">病歷號: {selectedPatient?.hospitalId || 'N/A'}</p>
            </div>
          </div>

          {/* Shift Summaries */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['早班 (08-16)', '小夜 (16-00)', '大夜 (00-08)'].map((shift, i) => (
              <div key={i} className="card bg-white border-none shadow-xl shadow-primary-glow/5 flex flex-col justify-between p-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 opacity-50">{shift}</span>
                <div className="flex items-baseline gap-1">
                  <span className={clsx(
                    "text-4xl font-black tracking-tighter",
                    calculateShiftTotal(shift) >= 0 ? "text-primary" : "text-danger"
                  )}>
                    {i === 0 ? calculateShiftTotal('day') : 0}
                  </span>
                  <span className="text-xs font-bold text-foreground-muted">ml</span>
                </div>
              </div>
            ))}
          </section>

          {/* Historical List */}
          <section className="space-y-4">
            <h3 className="text-2xl font-black flex items-center gap-3 px-1 text-foreground/80">
              <Clock size={24} className="text-secondary" /> 
              歷史紀錄詳情
            </h3>
            
            {filteredRecords.length === 0 ? (
              <div className="card text-center py-20 bg-surface-muted/20 border-none">
                <p className="text-foreground-muted font-bold mb-4">目前該病患尚無任何紀錄</p>
                <button onClick={() => setIsAdding(true)} className="btn-primary mx-auto">點此立刻新增</button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="card flex items-center justify-between p-6 hover:shadow-2xl hover:shadow-primary-glow/10 transition-all border-none group bg-white">
                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-foreground-muted opacity-40 uppercase tracking-widest">
                          {format(new Date(record.timestamp), 'HH:mm')}
                        </p>
                        <div className={clsx(
                          "w-1.5 h-10 rounded-full my-2",
                          record.type === 'input' ? "bg-primary" : "bg-secondary"
                        )} />
                      </div>
                      <div>
                        <p className="font-black text-xl text-foreground tracking-tighter">{record.category}</p>
                        <p className="text-xs font-bold text-foreground-muted mt-0.5">
                          {record.metadata?.notes || (record.type === 'input' ? '攝入紀錄' : '排出紀錄')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={clsx(
                        "text-3xl font-black tracking-tighter",
                        record.type === 'input' ? "text-primary" : "text-secondary"
                      )}>
                        {record.type === 'input' ? '+' : '-'}{record.amount}
                        <span className="text-xs font-bold ml-1 uppercase">ml</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </PageShell>
  );
}
