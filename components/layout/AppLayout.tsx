"use client";

import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
}

export function AppLayout({
  children,
  showSidebar = true,
  showHeader = true,
}: AppLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 dark:bg-stone-950">
      {showSidebar && (
        <AppSidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <div className="flex flex-1 flex-col w-full md:w-auto relative">
        {showHeader && (
          <AppHeader
            onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
        )}
        <main className="flex-1 overflow-auto -mt-20">{children}</main>
      </div>
    </div>
  );
}
