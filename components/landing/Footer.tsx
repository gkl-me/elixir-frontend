"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navyDark px-4 py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center justify-between text-xs text-gray-500 md:flex-row md:text-sm">
        <div className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} SyncProject. All rights reserved.
        </div>

        <div className="flex space-x-6">
          <Link href="#" className="transition-colors hover:text-purple">
            Privacy Policy
          </Link>
          <Link href="#" className="transition-colors hover:text-purple">
            Terms of Service
          </Link>
          <div className="ml-4 flex space-x-4 border-l border-white/10 pl-4">
            <Link href="#" className="transition-colors hover:text-white">
              <Github className="h-4 w-4" />
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
