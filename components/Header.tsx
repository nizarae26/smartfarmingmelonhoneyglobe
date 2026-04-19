"use client";
import { BellRing, UserCircle } from "lucide-react";

// Definisikan tipe data untuk props agar tidak error TypeScript
interface HeaderProps {
  status: string;
  isOnline: boolean;
}

export default function Header({ status, isOnline }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="md:hidden flex items-center gap-2 text-green-700 font-bold">
        <span>Tanggumong</span>
      </div>
      
      <div className="hidden md:block">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Monitoring System</p>
        <h2 className="text-sm font-bold text-gray-700 leading-none">Melon Honey Globe - Greenhouse 1</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isOnline ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
          <span className="text-[10px] font-bold uppercase">{status}</span>
        </div>
        <button className="p-2 text-gray-400 hover:text-green-600"><BellRing size={20}/></button>
        <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-gray-300">
           <UserCircle className="text-gray-400 w-full h-full" />
        </div>
      </div>
    </header>
  );
}