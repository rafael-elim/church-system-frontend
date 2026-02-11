"use client";
import '../globals.css';
import { useState } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";

import styles from '@/styles/home.module.css';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.page}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={styles.container}>
        <Sidebar />

        <div className={styles.HomeArea}>
            {children}
        </div>
      </div>
    </div>
  );
}
