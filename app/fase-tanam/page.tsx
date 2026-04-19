"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Leaf, Calendar, Info } from "lucide-react";

export default function FasePage() {
  const faseList = [
    { nama: "Vegetatif", hari: "1 - 14", deskripsi: "Fokus pada pertumbuhan daun dan batang.", ec: "1.2 - 1.5" },
    { nama: "Generatif", hari: "15 - 45", deskripsi: "Pembentukan bunga dan bakal buah.", ec: "1.8 - 2.2" },
    { nama: "Pematangan", hari: "46 - 70", deskripsi: "Peningkatan kadar gula (Brix).", ec: "2.5" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header status="Fase Tanam" isOnline={true} />
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          <header>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Fase Pertumbuhan</h1>
            <p className="text-slate-500 text-sm">Atur ambang batas sensor berdasarkan usia tanaman.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faseList.map((fase, i) => (
              <div key={i} className={`p-6 rounded-[32px] border bg-white shadow-sm hover:shadow-md transition-all ${i === 1 ? 'ring-2 ring-green-500' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${i === 1 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Leaf size={24} />
                  </div>
                  {i === 1 && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">AKTIF</span>}
                </div>
                <h3 className="font-black text-lg text-slate-800">{fase.nama}</h3>
                <p className="text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase">Hari ke {fase.hari}</p>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{fase.deskripsi}</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target EC Nutrisi</p>
                  <p className="font-bold text-slate-800">{fase.ec} mS/cm</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-[32px] flex gap-4 items-center">
            <Info className="text-blue-500 shrink-0" />
            <p className="text-sm text-blue-700">
              <strong>Tips Petani:</strong> Pastikan melakukan kalibrasi sensor pH setiap memasuki fase baru untuk hasil panen maksimal di <strong>Tanggumong</strong>.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}