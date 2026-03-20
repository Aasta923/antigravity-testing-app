"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { Plus, Search, UserPlus, Edit2, Trash2, Heart, X, Save } from "lucide-react";
import { usePersistence } from "@/context/PersistenceContext";
import { clsx } from "clsx";

export default function PatientsPage() {
  const { patients, addPatient, deletePatient } = usePersistence();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newBed, setNewBed] = useState("");
  const [newID, setNewID] = useState("");

  const handleAdd = () => {
    if (!newName || !newBed) return alert("請填寫姓名與床號");
    addPatient({
      name: newName,
      bedNo: newBed,
      hospitalId: newID
    });
    setIsAdding(false);
    setNewName("");
    setNewBed("");
    setNewID("");
  };

  const filteredPatients = patients.filter(p => 
    p.name.includes(searchTerm) || 
    p.bedNo.includes(searchTerm) || 
    p.hospitalId.includes(searchTerm)
  );

  return (
    <PageShell>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-primary mb-2 tracking-tight flex items-center gap-3">
            <Heart className="text-secondary" /> 病人管理
          </h1>
          <p className="text-foreground-muted font-medium">管理您的轄區病人清單及即時健康狀態</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <UserPlus size={20} /> 新增病人
        </button>
      </header>

      {/* Add Patient Modal/Form Overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md animate-fade-in border-none shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-primary">建立新病患檔</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-surface-muted rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1">病患姓名</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如: 王大同"
                  className="w-full p-4 bg-surface-muted rounded-2xl border-none focus:ring-4 focus:ring-primary/20 outline-none font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1">病床號碼</label>
                  <input 
                    type="text" 
                    value={newBed}
                    onChange={(e) => setNewBed(e.target.value)}
                    placeholder="例如: A101"
                    className="w-full p-4 bg-surface-muted rounded-2xl border-none focus:ring-4 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1">病歷號碼</label>
                  <input 
                    type="text" 
                    value={newID}
                    onChange={(e) => setNewID(e.target.value)}
                    placeholder="可選填"
                    className="w-full p-4 bg-surface-muted rounded-2xl border-none focus:ring-4 focus:ring-primary/20 outline-none font-bold"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleAdd}
                className="btn-primary w-full py-5 text-lg mt-4"
              >
                <Save size={20} /> 確認新增
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card border-none shadow-2xl shadow-primary-glow/10 mb-10 overflow-hidden">
        <div className="p-6 border-b border-surface-muted bg-surface-muted/30">
          <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-sm">
            <Search size={20} className="text-primary/40" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋姓名、床號或病歷號碼..." 
              className="bg-transparent border-none outline-none w-full py-2 font-bold text-foreground placeholder:text-foreground-muted/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-muted bg-surface-muted/10 text-foreground-muted text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5 font-black">床號 / Bed</th>
                <th className="px-8 py-5 font-black">姓名 / Name</th>
                <th className="px-8 py-5 font-black">病歷號碼 / ID</th>
                <th className="px-8 py-5 font-black">狀態 / Status</th>
                <th className="px-8 py-5 text-right font-black">操作 / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-muted">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-foreground-muted font-bold italic">
                    找不到相符的病患資料
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-primary-glow/10 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary text-white text-xs font-black rounded-full shadow-md shadow-primary-glow">
                        {patient.bedNo}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-lg font-black text-foreground tracking-tight">{patient.name}</td>
                    <td className="px-8 py-6 text-sm font-bold text-foreground-muted">{patient.hospitalId}</td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 shadow-sm bg-green-50 text-green-600 border-green-100">
                        收治中
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button className="p-3 bg-surface-muted text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deletePatient(patient.id)}
                          className="p-3 bg-surface-muted text-secondary hover:bg-secondary hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-none p-8 flex items-start gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-md">
            <Plus size={32} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary mb-2">快速新增小撇步</h3>
            <p className="text-foreground-muted font-medium text-sm leading-relaxed">
              您可以隨時在這裡新增病患。新增後，前往「紀錄中心」即可開始針對該病患進行攝入與排出的詳細記錄。
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
