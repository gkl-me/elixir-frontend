"use client"

import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { CustomModal } from "../modal/CustomModal"
import { logoutAction } from "@/app/actions/auth.action"

export function Header() {
  const [open,setOpen] = useState(false)

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-navyDark border-b border-white/5 sticky top-0 z-30 w-full">
      
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <Image
            src="/elixir-logo.svg"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Elixir</h1>
      </div>

      {/* Right: Admin button */}
      <Button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#2D1B69] hover:bg-[#3D2588] text-white border-none rounded-lg h-10 px-4"
      >
        <div className="bg-[#8735C9] p-1 rounded-md">
          <User className="h-4 w-4" />
        </div>

        <span className="hidden sm:inline">Admin</span>
      </Button>

      {/* custom modal */}

      <CustomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Admin Logout"
      >
        <Button
          variant="white"
          onClick={() => {
            logoutAction()
          }}
        >
          Logout
        </Button>
      </CustomModal>

    </header>
  )
}
