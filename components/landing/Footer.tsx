"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-6 md:py-8 px-4 bg-navyDark border-t border-white/5">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-500">
                <div className="mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} SyncProject. All rights reserved.
                </div>
                
                <div className="flex space-x-6">
                    <Link href="#" className="hover:text-purple transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-purple transition-colors">Terms of Service</Link>
                    <div className="flex space-x-4 ml-4 border-l border-white/10 pl-4">
                        <Link href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
                        <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
