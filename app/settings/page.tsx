"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  Settings,
  Wifi,
  Shield,
  Cpu,
  Save,
  RefreshCw,
  Trash2,
} from "lucide-react";

// 1. Definisikan Interface untuk Props agar tidak error 'any'
interface ThresholdInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export default function SettingsPage() {
  const [mqttConfig, setMqttConfig] = useState({
    broker: "wss://broker.hivemq.com:8884/mqtt",
    topic: "tanggumong/greenhouse_1/sensors",
  });

  const [thresholds, setThresholds] = useState({
    maxTemp: 32,
    minPh: 5.5,
    maxPh: 7.5,
  });

  const handleSave = (section: string) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));

    toast.promise(promise, {
      loading: `Sinkronisasi pengaturan ${section}...`,
      success: `Konfigurasi ${section} berhasil diperbarui!`,
      error: "Terjadi kesalahan pada server.",
    });
  };

  const handleRestart = () => {
    toast.info("Memulai Ulang Service", {
      description: "Sistem akan disegarkan otomatis dalam 3 detik.",
      action: {
        label: "Batal",
        onClick: () => toast.dismiss(),
      },
    });

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  // BAGIAN DEKLARASI EKSPRESI YANG SALAH SUDAH DIHAPUS DI SINI

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header status="Pengaturan" isOnline={true} />

        <main className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-10">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Pengaturan Sistem
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Konfigurasi operasional Greenhouse Tanggumong.
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              <RefreshCw size={14} /> Restart Service
            </button>
          </header>

          {/* MQTT CONFIGURATION */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 transition-all hover:border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Wifi size={20} />
              </div>
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                Koneksi MQTT Broker
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Broker URL
                </label>
                <input
                  type="text"
                  value={mqttConfig.broker}
                  onChange={(e) =>
                    setMqttConfig({ ...mqttConfig, broker: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Topic Utama
                </label>
                <input
                  type="text"
                  value={mqttConfig.topic}
                  onChange={(e) =>
                    setMqttConfig({ ...mqttConfig, topic: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
            <button
              onClick={() => handleSave("MQTT")}
              className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-2xl text-xs font-bold hover:bg-green-100 transition-all"
            >
              <Save size={16} /> Simpan Perubahan MQTT
            </button>
          </section>

          {/* ALERTS THRESHOLD */}
          <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 transition-all hover:border-orange-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                Ambang Batas Peringatan
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ThresholdInput
                label="Batas Suhu (°C)"
                value={thresholds.maxTemp}
                onChange={(val) =>
                  setThresholds({ ...thresholds, maxTemp: val })
                }
              />
              <ThresholdInput
                label="Min. pH Air"
                value={thresholds.minPh}
                onChange={(val) => setThresholds({ ...thresholds, minPh: val })}
              />
              <ThresholdInput
                label="Maks. pH Air"
                value={thresholds.maxPh}
                onChange={(val) => setThresholds({ ...thresholds, maxPh: val })}
              />
            </div>
            <button
              onClick={() => handleSave("Ambang Batas")}
              className="flex items-center gap-2 px-6 py-3 bg-orange-50 text-orange-700 rounded-2xl text-xs font-bold hover:bg-orange-100 transition-all"
            >
              <Save size={16} /> Update Ambang Batas
            </button>
          </section>

          {/* HARDWARE INFO */}
          <section className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-slate-800 rounded-3xl text-green-400 border border-slate-700 shadow-inner">
                <Cpu size={32} />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">
                  Hardware ESP32 Node 01
                </h4>
                <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">
                  Status: Terkoneksi • PENS-D4-TELKOM © 2026
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20 uppercase tracking-widest">
                System Stable
              </span>
            </div>
          </section>

          {/* DANGER ZONE */}
          <div className="pt-6 border-t border-slate-200 flex justify-center">
            <button
              onClick={() =>
                toast.error("Aksi Ditolak!", {
                  description: "Hubungi Admin PENS untuk menghapus database.",
                })
              }
              className="flex items-center gap-2 px-6 py-3 text-red-500 font-bold text-xs hover:bg-red-50 rounded-2xl transition-all"
            >
              <Trash2 size={16} /> Hapus Seluruh Riwayat Data
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// 2. Implementasi Komponen dengan Tipe Data yang Benar
function ThresholdInput({ label, value, onChange }: ThresholdInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
      />
    </div>
  );
}