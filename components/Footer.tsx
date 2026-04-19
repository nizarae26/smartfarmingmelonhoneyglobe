"use client";

import { Cpu, Mail ,Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 px-6 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Sisi Kiri: Branding */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <Cpu size={18} />
            <span className="text-sm tracking-tight">Tanggumong Smart Farming System</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
            PENS D4 Teknik Telekomunikasi • Batch 2024
          </p>
        </div>

        {/* Sisi Tengah: Hak Cipta */}
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium">
            © {currentYear} Naufal Zahlul Nizar Santoso. All Rights Reserved.
          </p>
        </div>

        {/* Sisi Kanan: Links */}
        <div className="flex items-center gap-4">
          {/* Gunakan Github dengan casing yang benar */}
          <FooterIcon icon={<Mail size={18} />} href="https://github.com" />
          <FooterIcon icon={<Globe size={18} />} href="https://pens.ac.id" />
        </div>
      </div>
    </footer>
  );
}

function FooterIcon({ icon, href }: { icon: any; href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300"
    >
      {icon}
    </a>
  );
}