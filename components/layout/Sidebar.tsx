"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
<<<<<<< HEAD
<<<<<<< Updated upstream
import { 
  Home, 
  Users, 
  CreditCard, 
  Building2, 
  ChevronLeft,
  ChevronRight,
  BarChart3,
=======
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
>>>>>>> Stashed changes
=======
import {
  Home,
  Users,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LayoutDashboard,
>>>>>>> origin/week2
} from "lucide-react";
import { cn } from "@/lib/utils";
<<<<<<< Updated upstream
import { Separator } from "@/components/ui/separator";
<<<<<<< HEAD
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setCollapsed } from "@/redux/slices/adminSlice";
import {  useState } from "react";

=======
>>>>>>> Stashed changes
=======
import { useEffect, useState } from "react";
>>>>>>> origin/week2

const NAVIGATION = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
<<<<<<< Updated upstream
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
<<<<<<< HEAD
  { name: "Company", href: "/company", icon: Building2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
=======
  { name: "Company", href: "/admin/company", icon: Building2 },
  { name: "Workspaces", href: "/admin/workspace", icon: LayoutDashboard },
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
>>>>>>> Stashed changes
=======
  { name: "Company", href: "/admin/company", icon: Building2 },
  { name: "Workspaces", href: "/admin/workspace", icon: LayoutDashboard },
>>>>>>> origin/week2
];

export function Sidebar() {
  const pathname = usePathname();
<<<<<<< HEAD
<<<<<<< Updated upstream
  const [isCollapsed,setCollapsed] = useState(false)
//   const isCollapsed= useSelector((state:RootState) => state.admin.isCollapsed)
//   const dispatch = useDispatch()
=======
  const [isCollapsed, setCollapsed] = useState(false);
>>>>>>> origin/week2

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }

    window.addEventListener("resize", handleResize);

<<<<<<< HEAD
//     return () => {
//       window.removeEventListener('resize',handleResize)
//     }

//   },[dispatch])
=======
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
>>>>>>> Stashed changes

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
<<<<<<< Updated upstream
    <aside 
=======
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
>>>>>>> origin/week2
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] border-r border-white/10 bg-navyDark transition-all duration-300",
        isCollapsed ? "w-16" : "w-40 md:w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-4 pb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((prev) => !prev)}
            className="h-8 w-8 bg-gradient-to-r from-purple to-purpleDark text-white shadow-lg shadow-purple/25"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
=======
    <>
      {/* Mobile Floating Toggle Button */}
      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-xl shadow-[#8735C9]/40 transition-transform active:scale-95"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

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
          "sticky top-16 h-[calc(100vh-4rem)] flex flex-col border-r border-[#1e2a4a] bg-[#07112b] transition-all duration-300 z-40",
          !isMobile && (isCollapsed ? "w-[68px]" : "w-60"),
          isMobile && [
            "fixed inset-y-0 left-0 top-0 h-full w-64 shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ]
        )}
      >
        {/* Header / Admin Badge */}
        <div className="flex items-center justify-between border-b border-[#1e2a4a] p-3">
          <div
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all",
              !isMobile && isCollapsed && "justify-center w-full"
>>>>>>> Stashed changes
            )}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] text-white shadow-md shadow-[#8735C9]/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobile) && (
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
            !isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#1e2a4a] bg-[#0c1635] text-[#6b7db3] transition-colors hover:bg-[#132353] hover:text-white"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )
          )}
        </div>

        {/* Navigation List */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
          {NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

            const isCollapsedDesktop = !isMobile && isCollapsed;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsedDesktop ? item.name : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isCollapsedDesktop ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                  isActive
<<<<<<< Updated upstream
                    ? "bg-gradient-to-r from-purple to-purpleDark text-white shadow-lg shadow-purple/25"
                    : "text-white hover:bg-white/5 hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
<<<<<<< HEAD
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
=======
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
>>>>>>> Stashed changes
=======
                {!isCollapsed && <span className="truncate">{item.name}</span>}
>>>>>>> origin/week2
              </Link>
            );
          })}
        </div>

        {/* Desktop Collapsed Toggle Bar */}
        {!isMobile && isCollapsed && (
          <div className="border-t border-[#1e2a4a] p-2 flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e2a4a] bg-[#0c1635] text-[#6b7db3] transition-colors hover:bg-[#132353] hover:text-white"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
