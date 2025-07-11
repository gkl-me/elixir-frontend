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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCollapsed } from "@/redux/slices/adminSlice";
import { useEffect } from "react";


const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
  { name: "Company", href: "/company", icon: Building2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];


export function Sidebar() {
  const pathname = usePathname();
  const isCollapsed= useSelector((state:RootState) => state.admin.isCollapsed)
  const dispatch = useDispatch()

  useEffect(() => {
    function handleResize(){
      if(window.innerWidth < 700){
        dispatch(setCollapsed(true))
      }else{
        dispatch(setCollapsed(false))
      }
    }

    window.addEventListener('resize',handleResize)

    return () => {
      window.removeEventListener('resize',handleResize)
    }

  },[])

  return (
    <aside 
      className={cn(
        "sticky top-16 bg-navyDark h-[calc(100vh-4rem)] border-r border-white/10 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-4 pb-2 ">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setCollapsed(!isCollapsed))}
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
                    : " hover:bg-white/5 text-white hover:text-white",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
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