"use client";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LogoutModal } from "../modal/LogoutModal";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/5 bg-navyDark px-4 lg:px-8">
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8">
          <Image
            src="/elixir-logo.svg"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">Elixir</h1>
      </div>

      {/* Right: Admin button */}
      <Button
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-2 rounded-lg border-none bg-[#2D1B69] px-4 text-white hover:bg-[#3D2588]"
      >
        <div className="rounded-md bg-[#8735C9] p-1">
          <User className="h-4 w-4" />
        </div>

        <span className="hidden sm:inline">Admin</span>
      </Button>

      <LogoutModal isOpen={open} onClose={() => setOpen(false)} />
    </header>
  );
}
