"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FilePlus,
} from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/contexts/SidebarContext";

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AppSidebar({ isMobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useSidebar();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <aside
      className={`bg-white dark:bg-stone-900 rounded-2xl ml-4 my-4 mr-2 p-4 flex flex-col shadow-sm transition-all duration-300 ${state.isCollapsed ? "w-20" : "w-64"
        }`}
    >
      <div className="flex items-center justify-between mb-8">
        {!state.isCollapsed && (
          <div className="relative flex-1 mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9 h-9 text-sm rounded-full bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
          className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{
            backgroundColor: state.isCollapsed ? "#FEF3E2" : "transparent",
          }}
        >
          {state.isCollapsed ? (
            <ChevronRight className="h-4 w-4" style={{ color: "#B4813F" }} />
          ) : (
            <ChevronLeft className="h-4 w-4" style={{ color: "#B4813F" }} />
          )}
        </Button>
      </div>

      <nav className="space-y-1 flex-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${pathname === "/dashboard"
            ? "text-[#B4813F]"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          title="Dashboard"
        >
          <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span className="font-medium">Dashboard</span>}
        </Link>
        <Link
          href="/services"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${pathname === "/services"
            ? "text-[#B4813F]"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          title="All Services"
        >
          <FileText className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span>All Services</span>}
        </Link>
        <Link
          href="/services/configure"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${pathname === "/services/configure"
            ? "text-[#B4813F]"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          title="Add New Service"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span>Add New Service</span>}
        </Link>
        <Link
          href="/public/select-service"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            pathname?.startsWith("/public/select-service") || pathname?.startsWith("/public/service")
              ? "text-[#B4813F]"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          title="Create Submission"
        >
          <FilePlus className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span>Create Submission</span>}
        </Link>
        <Link
          href="/submissions"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${pathname?.startsWith("/submissions")
            ? "text-[#B4813F]"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          title="Cases"
        >
          <ClipboardList className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span>Cases</span>}
        </Link>
      </nav>

      <div className="space-y-2 mt-auto">
        {!state.isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm">AK</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Andrew Kaleya</div>
              <div
                className="text-xs px-2 py-0.5 rounded inline-block"
                style={{ color: "#B4813F", backgroundColor: "#FEF3E2" }}
              >
                Admin
              </div>
            </div>
          </div>
        )}
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
          title="Settings"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full"
          title="Log out"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!state.isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
