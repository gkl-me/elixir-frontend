"use client"

import Image from "next/image"
import Link from "next/link"

export default function OnboardingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between container mx-auto">
            <Link href="/" className="flex items-center space-x-2 group">
                 <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                    {/* Assuming elixir-logo.svg exists in public folder as seen in LandingHeader */}
                    <Image src="/elixir-logo.svg" alt="Elixir Logo" fill className="object-contain" />
                 </div>
                 <span className="text-xl font-bold text-white tracking-tight">Elixir</span>
            </Link>
        </div>
    </header>
  )
}
