"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

interface MLStats {
  is_trained: boolean;
  total_blogs: number;
  mae: number | null;
  mae_interpretation: string | null;
  algorithm: string;
}

export default function MLRecommendationStats() {
  const [stats, setStats] = useState<MLStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const ML_SERVICE_URL =
    import.meta.env.VITE_ML_SERVICE_URL || "http://localhost:5001";
  const [modal, setModal] = useState<{show: boolean; message: string}>({show: false, message: ""});
  const fetchStats = async () => {
    try {
      const res = await fetch(`${ML_SERVICE_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const res = await fetch(`${ML_SERVICE_URL}/train`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchStats();
        setModal({show: true, message: `Training selesai! MAE = ${data.mae}`});
      } else {
        setModal({show: true, message: `Training gagal: ${data.error}`});
      }
    } catch {
      setModal({show: true, message: "ML service tidak tersedia"});
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getMaeColor = (mae: number | null) => {
    if (mae === null) return "text-gray-500";
    if (mae < 0.1) return "text-green-600";
    if (mae < 0.2) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-black/10 p-6 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
  <>
    <ConfirmModal
      isOpen={modal.show}
      title="Info"
      message={modal.message}
      onConfirm={() => setModal({show: false, message: ""})}
      onCancel={() => setModal({show: false, message: ""})}
      okOnly
    />
    <div className="bg-white rounded-2xl border border-black/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wide">
          Recommendation ML Model
        </h3>
        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="text-xs px-3 py-1 rounded-full border border-black/20 hover:bg-black/5 transition disabled:opacity-50"
        >
          {retraining ? "Training..." : "Retrain"}
        </button>
      </div>
      {stats === null ? (
        <p className="text-sm text-red-500">
          ML Service tidak tersedia (port 5001)
        </p>
      ) : (
        <>
          {/* Status */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-2 h-2 rounded-full ${
                stats.is_trained ? "bg-green-500" : "bg-yellow-400"
              }`}
            />
            <span className="text-sm text-black/70">
              {stats.is_trained ? "Model aktif" : "Belum dilatih"}
            </span>
          </div>

          {/* MAE Score */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-black/50 mb-1">MAE Score</p>
              <p className={`text-2xl font-bold ${getMaeColor(stats.mae)}`}>
                {stats.mae !== null ? stats.mae.toFixed(4) : "—"}
              </p>
              <p className="text-xs text-black/40 mt-1">
                {stats.mae_interpretation || "Belum ada data"}
              </p>
            </div>

            <div>
              <p className="text-xs text-black/50 mb-1">Total Blog</p>
              <p className="text-2xl font-bold text-black">
                {stats.total_blogs}
              </p>
              <p className="text-xs text-black/40 mt-1">digunakan untuk training</p>
            </div>
          </div>

          {/* Algorithm info */}
          <div className="bg-black/5 rounded-xl px-4 py-3">
            <p className="text-xs text-black/50 mb-1">Algoritma</p>
            <p className="text-xs font-medium text-black">
              {stats.algorithm}
            </p>
          </div>

          {/* MAE explanation */}
          <p className="text-xs text-black/40 mt-3">
            MAE (Mean Absolute Error) mengukur rata-rata selisih prediksi vs
            aktual. Semakin kecil semakin akurat.
          </p>
        </>
      )}
    </div>
    </>
  );
}