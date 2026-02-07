"use client";

import { useState } from "react";
import { Menu, Church } from "lucide-react";
import { Sidebar } from "@/components/organisms/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        {/* Header mobile */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b border-border lg:hidden">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>

            <div className="flex items-center gap-2">
              <Church className="w-7 h-7 text-primary" />
              <span className="font-semibold">ChurchAdmin</span>
            </div>

            <div className="w-6" />
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
