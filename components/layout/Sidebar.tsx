"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
  { name: "Company", href: "/admin/company", icon: Building2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Workspaces", href: "/admin/workspace", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setCollapsed] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside
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
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-purple to-purpleDark text-white shadow-lg shadow-purple/25"
                    : "text-white hover:bg-white/5 hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-4">
          <Separator />
        </div>
      </div>
    </aside>
  );
}
