"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="p-4 bg-primary rounded-2xl text-white">
          <Activity size={48} />
        </div>
        <p className="text-foreground-muted font-medium">系統載入中...</p>
      </div>
    </div>
  );
}
