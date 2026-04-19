"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Line
} from "recharts";
import { 
  AlertTriangle, Droplets, Thermometer, Wind, 
  Activity, Settings, Leaf, Power, RefreshCw
} from "lucide-react";

export default function Home() {
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Menghubungkan...");
  const [sensorData, setSensorData] = useState({ suhu: 0, kelembabanUdara: 0, ph: 0, ec: 0, kelembabanTanah: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false); // Fitur Otomasi
  const [lastUpdate, setLastUpdate] = useState("Belum ada data");

  useEffect(() => {
    const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      setConnectionStatus("Online");
      setMqttClient(client);
      client.subscribe("tanggumong/greenhouse_1/sensors");
      toast.success("Koneksi Berhasil", {
        description: "Data Greenhouse Tanggumong tersinkronisasi.",
      });
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const timeLabel = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const newPoint = {
          time: timeLabel,
          suhu: Number(payload.data.environment.temperature_c),
          ph: Number(payload.data.soil_and_nutrition.ph_level),
          ec: Number(payload.data.soil_and_nutrition.ec_level_ms),
          tanah: Number(payload.data.soil_and_nutrition.soil_moisture_percent),
        };

        setSensorData({
          suhu: newPoint.suhu,
          kelembabanUdara: payload.data.environment.humidity_percent,
          ph: newPoint.ph,
          ec: newPoint.ec,
          kelembabanTanah: newPoint.tanah
        });

        setHistory(prev => [...prev, newPoint].slice(-15));
        setLastUpdate(timeLabel);
        checkAlerts(newPoint.suhu, newPoint.ph);

        // --- LOGIKA OTOMASI ---
        if (isAutoMode) {
          if (newPoint.tanah < 60 && !isPumpOn) {
            handlePumpAction(true, "Otomatis: Tanah kering!");
          } else if (newPoint.tanah > 80 && isPumpOn) {
            handlePumpAction(false, "Otomatis: Kelembaban cukup.");
          }
        }

      } catch (e) { 
        console.error("Gagal parsing MQTT:", e);
        toast.error("Data Stream Error");
      }
    });

    return () => { if (client) client.end(); };
  }, [isAutoMode, isPumpOn]); // Re-run effect saat mode berubah

  const handlePumpAction = (state: boolean, reason: string) => {
    if (!mqttClient) return;
    setIsPumpOn(state);
    mqttClient.publish("tanggumong/greenhouse_1/control", JSON.stringify({ 
      command: "PUMP_NUTRISI", 
      state: state ? "ON" : "OFF" 
    }));
    
    if (state) {
      toast.info("Pompa Menyala", { description: reason, icon: <Droplets className="text-blue-500" /> });
    } else {
      toast("Pompa Dimatikan", { description: reason });
    }
  };

  const checkAlerts = (suhu: number, ph: number) => {
    let alerts = [];
    if (suhu > 32) alerts.push(`Suhu kritis (${suhu}°C)`);
    if (ph < 5.5 || ph > 7.5) alerts.push(`pH tidak ideal (${ph})`);
    setNotifications(alerts);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header status={connectionStatus} isOnline={!!mqttClient} />

        <main className="p-6 md:p-10 space-y-8 overflow-y-auto">
          {/* NOTIFICATION POPUP (MODAL STYLE) */}
          {notifications.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle size={20} className="animate-pulse" />
                <span className="text-sm font-bold uppercase">{notifications.join(" & ")}</span>
              </div>
              <button onClick={() => setNotifications([])} className="text-xs font-bold text-red-500 underline">TUTUP</button>
            </div>
          )}

          {/* STATUS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard icon={<Thermometer className="text-orange-500" />} label="Suhu" value={`${sensorData.suhu}°C`} status={sensorData.suhu > 32 ? "Panas" : "Normal"} />
            <StatCard icon={<Wind className="text-blue-500" />} label="Kelembaban" value={`${sensorData.kelembabanUdara}%`} />
            <StatCard icon={<Droplets className="text-purple-500" />} label="pH Air" value={sensorData.ph} />
            <StatCard icon={<Leaf className="text-green-500" />} label="EC Nutrisi" value={`${sensorData.ec}`} unit="mS/cm" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CHART AREA */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-green-600" /> Tren Real-time
                </h3>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase tracking-tighter">Update: {lastUpdate} WIB</span>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="suhu" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    <Line type="monotone" dataKey="ph" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PANEL KENDALI CERDAS */}
            <div className="bg-white p-8 rounded-[32px] border shadow-sm flex flex-col space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Settings size={20} className="text-slate-400" /> Smart Control
              </h3>
              
              {/* Toggle Mode Otomatis */}
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-800 tracking-tight">Mode Otomatis</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">AI Trigger</p>
                </div>
                <button 
                  onClick={() => {
                    setIsAutoMode(!isAutoMode);
                    toast.info(isAutoMode ? "Mode Manual Aktif" : "Mode Otomatis Aktif");
                  }}
                  className={`w-12 h-6 rounded-full transition-all relative ${isAutoMode ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {/* Status & Tombol Pompa */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPumpOn ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                   <Droplets size={32} className={isPumpOn ? 'animate-bounce' : ''} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase">Pompa Nutrisi</p>
                  <p className={`text-[10px] font-black uppercase ${isPumpOn ? 'text-green-600' : 'text-slate-400'}`}>
                    {isPumpOn ? 'Sirkulasi Aktif' : 'Standby'}
                  </p>
                </div>
                <button 
                  disabled={isAutoMode}
                  onClick={() => handlePumpAction(!isPumpOn, "Aksi manual pengguna.")} 
                  className={`w-full py-4 rounded-2xl font-black text-white text-sm shadow-xl transition-all transform active:scale-95 ${
                    isPumpOn ? "bg-red-500" : "bg-green-600"
                  } ${isAutoMode ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {isPumpOn ? "STOP POMPA" : "MULAI POMPA"}
                </button>
              </div>
              
              <p className="text-[9px] text-slate-400 text-center italic">
                {isAutoMode ? "*Manual override terkunci di mode otomatis" : "*Klik untuk kendali manual"}
              </p>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, status }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-slate-800">{value}</span>
          {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
        </div>
        {status && <p className={`text-[10px] font-bold uppercase mt-1 ${status === 'Panas' ? 'text-orange-500' : 'text-green-500'}`}>{status}</p>}
      </div>
    </div>
  );
}