"use client";

import { toast } from "sonner";

import { useAdminLogoutMutation } from "@/redux/api/admin/adminAuthApi";
import { useRouter } from "next/navigation";
import { useDispatch, } from "react-redux";
import {adminLogout} from "@/redux/slices/adminSlice";
import { LogOut, User } from "lucide-react";
import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import { adminApi } from "@/redux/api/admin/adminApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {

  const [triggerLogout] = useAdminLogoutMutation() 
    const router = useRouter()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            const res = await triggerLogout({}).unwrap()
            dispatch(adminApi.util.resetApiState())
            dispatch(adminLogout())
            toast.success(res.message)
            router.replace(ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.LOGIN)
        } catch (error) {
            toast.error(error as string)
        }
    }

    return (
      <header className="sticky top-0 z-50 w-full bg-navyDark/95 backdrop-blur-md border-b border-white/10 px-6 py-1 flex items-center justify-between shadow-lg">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple to-purpleDark rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Elixir</h1>
            <p className="text-purple text-sm font-medium">Admin Portal</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-white/10 space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple to-purpleDark rounded-lg flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden sm:inline font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-navy/95 backdrop-blur-md border-white/10 shadow-xl">
            <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 cursor-pointer"
              onClick={() => {
                handleLogout()
              }}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  );
}