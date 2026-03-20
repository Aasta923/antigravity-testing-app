"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isFirebaseInitialized } from "@/lib/firebase";
import { Activity, AlertTriangle, ExternalLink } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && isFirebaseInitialized) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (!mounted) return null;

  // Show diagnostic screen if Firebase is not initialized
  if (!loading && !isFirebaseInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 text-destructive mb-6">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-xl font-bold">系統配置尚未完成</h1>
          </div>
          
          <div className="space-y-4 text-sm leading-relaxed text-foreground-muted">
            <p>
              目前的部署缺少必要的 <strong>Firebase 環境變數</strong>。請在您的 Vercel 或是部署環境中設定以下變數：
            </p>
            
            <ul className="list-disc list-inside bg-muted/50 p-4 rounded-xl font-mono text-xs space-y-1">
              <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
            </ul>

            <div className="pt-4 border-t border-border mt-6">
              <a 
                href="https://vercel.com/docs/concepts/projects/environment-variables" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                查看如何設定 Vercel 環境變數 <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="p-4 bg-primary rounded-2xl text-white">
          <Activity size={48} />
        </div>
        <p className="text-foreground-muted font-medium italic">系統載入中...</p>
      </div>
    </div>
  );
}
