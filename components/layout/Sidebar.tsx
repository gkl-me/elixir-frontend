"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  CreditCard,
  Building2,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Repeat,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Company", href: "/admin/company", icon: Building2 },
  { name: "Workspaces", href: "/admin/workspace", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/admin/subscription", icon: Repeat },
  { name: "Transactions", href: "/admin/transaction", icon: Receipt },
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isCollapsedDesktop = !isMobile && isCollapsed;

  return (
    <>
      {/* Mobile Top-Left Toggle Button (Only visible when mobile menu is closed) */}
      {!mobileOpen && (
        <div className="fixed top-3.5 left-3.5 z-50 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e2a4a] bg-[#0c1635]/90 text-white shadow-lg backdrop-blur-md transition-all active:scale-95 hover:bg-[#132353]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5 text-purple-300" />
          </button>
        </div>
      )}

      {/* Mobile Overlay Backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-[#1e2a4a] bg-[#07112b] transition-all duration-300",
          !isMobile && [
            "relative z-30",
            isCollapsed ? "w-[68px]" : "w-60",
          ],
          isMobile && [
            "fixed inset-y-0 left-0 top-0 h-full w-64 z-50 shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ]
        )}
      >
        {/* Header / Admin Badge */}
        <div className="flex items-center justify-between border-b border-[#1e2a4a] p-3">
          <div
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all",
              isCollapsedDesktop && "justify-center w-full"
            )}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] text-white shadow-md shadow-[#8735C9]/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!isCollapsedDesktop && (
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold leading-tight text-white">
                  Admin Panel
                </h2>
                <p className="mt-0.5 text-[10px] text-[#6b7db3]">Control Center</p>
              </div>
            )}
          </div>

          {isMobile ? (
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e2a4a] bg-[#0c1635] text-[#6b7db3] hover:bg-[#132353] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#1e2a4a] bg-[#0c1635] text-[#6b7db3] transition-colors hover:bg-[#132353] hover:text-white"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsedDesktop ? item.name : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isCollapsedDesktop ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                  isActive
                    ? "bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)]"
                    : "text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-[#6b7db3] group-hover:text-purple-300"
                  )}
                />
                {!isCollapsedDesktop && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
