"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner"; // Import Sonner
import { Table, Download, Filter, Calendar as CalendarIcon, Search } from "lucide-react";

export default function HistoryPage() {
  const [dataHistory, setDataHistory] = useState([
    { id: 1, tanggal: "Minggu, 19 April 2026", waktu: "10:00:05", suhu: 31.2, ph: 6.4, ec: 2.1, status: "NORMAL" },
    { id: 2, tanggal: "Minggu, 19 April 2026", waktu: "11:30:12", suhu: 33.5, ph: 6.2, ec: 2.3, status: "PANAS" },
    { id: 3, tanggal: "Sabtu, 18 April 2026", waktu: "09:15:00", suhu: 29.8, ph: 6.5, ec: 2.0, status: "NORMAL" },
  ]);

  const exportToCSV = () => {
    // Simulasi loading dengan Sonner
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));

    toast.promise(promise, {
      loading: 'Menyiapkan berkas CSV...',
      success: () => {
        const headers = ["Hari/Tanggal", "Waktu", "Suhu", "pH", "EC", "Status"];
        const rows = dataHistory.map(item => [item.tanggal, item.waktu, item.suhu, item.ph, item.ec, item.status]);
        let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `tanggumong_report_${new Date().getTime()}.csv`);
        link.click();
        return "Laporan berhasil diunduh!";
      },
      error: 'Gagal mengunduh laporan.',
    });
  };

  const applyFilter = () => {
    toast.info("Pencarian difilter", {
      description: "Menampilkan data dengan suhu di atas 30°C."
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header status="Riwayat Data" isOnline={true} />
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Riwayat Sensor</h1>
              <p className="text-sm text-slate-500 font-medium">Log data budidaya Tanggumong.</p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={applyFilter} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={16} /> Filter
              </button>
              <button onClick={exportToCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-2xl text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b">
                  <tr>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal & Tahun</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Suhu</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">pH Air</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">EC Nutrisi</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {dataHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-700">
                        <div className="flex items-center gap-2 italic">
                          <CalendarIcon size={14} className="text-slate-300" />
                          {item.tanggal}
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 font-medium">{item.waktu} WIB</td>
                      <td className="p-5 font-bold text-slate-800">{item.suhu}°C</td>
                      <td className="p-5 font-medium text-purple-600">{item.ph}</td>
                      <td className="p-5 font-medium text-green-600">{item.ec} mS/cm</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                          item.status === 'NORMAL' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}