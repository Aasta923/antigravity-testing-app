"use client";

import React, { useState } from "react";
import { Droplets, Utensils, Save, X, Plus, ChevronDown, Activity, CircleDot, Trash, Scissors, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface RecordFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const RecordForm = ({ onSave, onCancel }: RecordFormProps) => {
  const [type, setType] = useState<'input' | 'output'>('input');
  const [category, setCategory] = useState('water');
  const [amount, setAmount] = useState('');
  const [color, setColor] = useState('');
  const [consistency, setConsistency] = useState('');
  const [notes, setNotes] = useState('');

  const inputCategories = [
    { id: 'water', label: '飲水', icon: Droplets },
    { id: 'diet', label: '飲食', icon: Utensils },
    { id: 'iv', label: '靜脈輸液 (IV)', icon: Activity },
    { id: 'tube', label: '管灌', icon: CircleDot },
  ];

  const outputCategories = [
    { id: 'urine', label: '尿液', icon: Droplets },
    { id: 'stool', label: '糞便', icon: Trash },
    { id: 'drainage', label: '引流', icon: Scissors },
    { id: 'vomit', label: '嘔吐', icon: AlertCircle },
  ];

  const categories = type === 'input' ? inputCategories : outputCategories;

  const handleSubmit = () => {
    if (!amount) return alert("請輸入數值");
    onSave({ 
      type, 
      category, 
      amount: Number(amount), 
      unit: 'ml',
      metadata: { color, consistency, notes } 
    });
  };

  return (
    <div className="card shadow-2xl border-primary/20 animate-fade-in max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h2 className="text-2xl text-primary flex items-center gap-2">
          <Plus className="bg-primary text-white rounded-full p-1" size={24} />
          新增 I/O 紀錄
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-surface-muted rounded-full text-foreground-muted">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex bg-surface-muted p-1 rounded-2xl">
          <button
            onClick={() => setType('input')}
            className={clsx(
              "flex-1 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
              type === 'input' ? "bg-white shadow-md text-primary" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <Plus size={18} /> 輸入量
          </button>
          <button
            onClick={() => setType('output')}
            className={clsx(
              "flex-1 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
              type === 'output' ? "bg-white shadow-md text-secondary" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <ChevronDown size={18} /> 輸出量
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={clsx(
                "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2",
                category === cat.id 
                  ? "border-primary bg-primary-glow text-primary font-bold scale-105 shadow-md" 
                  : "border-transparent bg-background text-foreground-muted hover:border-border"
              )}
            >
              <div className={clsx("p-2 rounded-full", category === cat.id ? "bg-primary text-white" : "bg-white text-foreground-muted shadow-sm")}>
                {React.createElement(cat.icon as any, { size: 24 })}
              </div>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4 px-4 py-6 bg-surface-muted rounded-2xl">
          <label className="block text-xs font-bold text-foreground-muted uppercase tracking-widest">數值 (Volume/Amount)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full text-5xl font-bold bg-transparent border-none focus:border-none outline-none py-2 transition-colors pr-16 text-primary placeholder:opacity-20"
              autoFocus
            />
            <span className="absolute right-0 bottom-4 text-2xl font-bold text-foreground-muted">ml</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest pl-1">性質 / 顏色</label>
            <select 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-4 bg-surface-muted rounded-xl border-none focus:ring-2 focus:ring-primary outline-none font-medium"
            >
              <option value="">選擇屬性...</option>
              <option value="normal">正常 (Normal)</option>
              <option value="cloudy">澄清 (Clear)</option>
              <option value="bloody">血色 (Bloody)</option>
              <option value="loose">稀軟 (Loose)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest pl-1">備註說明</label>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="可留空..."
              className="w-full p-4 bg-surface-muted rounded-xl border-none focus:ring-2 focus:ring-primary outline-none font-medium"
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="btn-primary w-full py-5 text-xl"
        >
          <Save size={24} /> 儲存此筆紀錄
        </button>
      </div>
    </div>
  );
};