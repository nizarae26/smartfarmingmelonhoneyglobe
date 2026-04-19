"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function SenderPage() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [status, setStatus] = useState("Menyiapkan Alat Simulator...");
  const [pumpState, setPumpState] = useState("MATI");

  useEffect(() => {
    const brokerUrl = "wss://broker.hivemq.com:8884/mqtt"; 
    const mqttClient = mqtt.connect(brokerUrl);

    mqttClient.on("connect", () => {
      setStatus("Simulator Siap Beroperasi! 🚀");
      setClient(mqttClient);
      
      // Alat simulator mendengarkan perintah dari dashboard
      mqttClient.subscribe("tanggumong/greenhouse_1/control");
    });

    // Menangkap perintah dari dashboard
    mqttClient.on("message", (topic, message) => {
      if (topic === "tanggumong/greenhouse_1/control") {
        try {
          const commandData = JSON.parse(message.toString());
          if (commandData.command === "PUMP_NUTRISI") {
            setPumpState(commandData.state); // Akan berubah jadi "ON" atau "OFF"
          }
        } catch (error) {
          console.error("Gagal membaca perintah:", error);
        }
      }
    });

    return () => { if (mqttClient) mqttClient.end(); };
  }, []);

  const kirimDataAcak = () => {
    if (!client) return;
    const payload = {
      data: {
        environment: { temperature_c: (30 + Math.random() * 5).toFixed(1), humidity_percent: (75 + Math.random() * 10).toFixed(1) },
        soil_and_nutrition: { ph_level: (6.0 + Math.random() * 1).toFixed(1), ec_level_ms: (2.0 + Math.random() * 0.5).toFixed(2), soil_moisture_percent: (60 + Math.random() * 20).toFixed(1) }
      }
    };
    client.publish("tanggumong/greenhouse_1/sensors", JSON.stringify(payload));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center font-sans p-4 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-700 relative overflow-hidden">
        
        {/* Indikator Hardware (Bereaksi terhadap perintah Dashboard) */}
        <div className={`absolute top-0 left-0 w-full h-2 ${pumpState === "ON" ? "bg-green-500 animate-pulse" : "bg-gray-600"}`}></div>
        
        <h1 className="text-2xl font-bold mb-2 text-green-400">Panel Hardware ESP32</h1>
        <p className="text-gray-400 mb-6 text-sm">Status Koneksi: {status}</p>
        
        <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Status Relay Pompa Nutrisi:</p>
          <p className={`text-3xl font-bold ${pumpState === "ON" ? "text-green-500" : "text-red-500"}`}>
            {pumpState}
          </p>
        </div>
        
        <button onClick={kirimDataAcak} disabled={!client} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95">
          Kirim Data Sensor Baru
        </button>
      </div>
    </div>
  );
}