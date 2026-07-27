"use client";

import Image from "next/image";
import Link from "next/link";

export default function OnboardingHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 p-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-2">
          <div className="relative h-8 w-8 transition-transform group-hover:scale-110">
            {/* Assuming elixir-logo.svg exists in public folder as seen in LandingHeader */}
            <Image
              src="/elixir-logo.svg"
              alt="Elixir Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Elixir
          </span>
        </Link>
      </div>
    </header>
  );
}
