"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell = ({ children }: PageShellProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Sidebar />
      <main className="pl-64 pt-16 min-h-screen flex justify-center">
        <div className="w-full max-w-5xl p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};