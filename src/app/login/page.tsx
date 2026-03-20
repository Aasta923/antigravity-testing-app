"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Activity, Mail, Lock, UserPlus, LogIn, Chrome } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 shadow-2xl border-primary/10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-primary rounded-2xl text-white mb-4 shadow-lg shadow-primary-glow">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Patient I/O Tracker</h1>
          <p className="text-foreground-muted">專業護理紀錄與交接平台</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest pl-1">電子郵件</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-muted rounded-xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="yours@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest pl-1">密碼</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-muted rounded-xl border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="至少 6 位字元"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary-glow transition-all flex items-center justify-center gap-2"
          >
            {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <span className="relative bg-background px-4 text-xs font-bold text-foreground-muted uppercase tracking-widest">或使用</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white border border-border text-foreground rounded-xl font-bold text-lg hover:bg-surface-muted transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <Chrome className="text-primary" size={20} />
            使用 Google 帳號登入
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-primary font-semibold hover:underline"
          >
            {isRegistering ? "已有帳號？立即登入" : "還沒有帳號？點此註冊"}
          </button>
        </div>
      </div>
    </div>
  );
}