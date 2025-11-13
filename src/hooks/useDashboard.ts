import { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import { toast } from 'sonner';

export interface AdminStats {
  totalWarga: number;
  totalIuranLunas: number;
  totalIuranBelumBayar: number;
  totalPendapatanIuran: number;
  totalSetoranBulanIni: number;
  periode: string;
}

export interface WargaStats {
  saldoBankSampah: number;
  statusIuranBulanIni: string;
  jumlahIuranBulanIni: number;
  totalSetoran: number;
  periode: string;
}

export interface PetugasStats {
  totalSetoranDiproses: number;
  totalSetoranBulanIni: number;
  totalBeratBulanIni: number;
  totalNilaiBulanIni: number;
  periode: string;
}

export type DashboardStats = AdminStats | WargaStats | PetugasStats;

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getStats();
      setStats(response.stats);
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
      toast.error('Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};
