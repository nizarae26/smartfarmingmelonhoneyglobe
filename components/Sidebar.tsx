"use client"; // Wajib ditambahkan untuk menggunakan usePathname

import { LayoutDashboard, History, Leaf, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 text-green-700 font-bold text-xl">
          <Leaf size={42} />
          <span className="leading-tight">Tanggumong Smart Farming</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <NavItem 
          href="/" 
          icon={<LayoutDashboard size={20}/>} 
          label="Dashboard" 
          active={pathname === "/"} 
        />
        <NavItem 
          href="/history" 
          icon={<History size={20}/>} 
          label="Riwayat Data" 
          active={pathname === "/history"} 
        />
        <NavItem 
          href="/fase-tanam" 
          icon={<Leaf size={20}/>} 
          label="Fase Tanam" 
          active={pathname === "/fase-tanam"} 
        />
        <NavItem 
          href="/settings" 
          icon={<Settings size={20}/>} 
          label="Pengaturan Alat" 
          active={pathname === "/settings"} 
        />
      </nav>

      <div className="p-4 border-t text-[10px] text-gray-400 text-center font-medium">
        PENS D4 TEKNIK TELEKOMUNIKASI © 2026
      </div>
    </aside>
  );
}

// Komponen NavItem yang sudah mendukung navigasi Link
function NavItem({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-green-50 text-green-700 font-bold shadow-sm" 
          : "text-gray-500 hover:bg-gray-50 hover:text-green-600"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}