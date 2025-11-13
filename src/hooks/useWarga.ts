import { useState, useEffect } from 'react';
import { wargaAPI } from '../utils/api';
import { toast } from 'sonner';

export interface Warga {
  id: string;
  userId: string;
  namaLengkap: string;
  email: string;
  username: string;
  nomorRumah: string;
  blok: string;
  noTelepon: string;
  statusAktif: boolean;
  createdAt: string;
}

export const useWarga = () => {
  const [warga, setWarga] = useState<Warga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarga = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wargaAPI.getAll();
      setWarga(response.warga);
    } catch (err: any) {
      console.error('Error fetching warga:', err);
      setError(err.message);
      toast.error('Gagal memuat data warga');
    } finally {
      setLoading(false);
    }
  };

  const getWargaById = async (id: string) => {
    try {
      const response = await wargaAPI.getById(id);
      return response.warga;
    } catch (err: any) {
      console.error('Error fetching warga by id:', err);
      toast.error('Gagal memuat data warga');
      throw err;
    }
  };

  const updateWarga = async (id: string, data: Partial<Warga>) => {
    try {
      setLoading(true);
      const response = await wargaAPI.update(id, data);
      toast.success('Data warga berhasil diupdate');
      await fetchWarga(); // Refresh list
      return response.warga;
    } catch (err: any) {
      console.error('Error updating warga:', err);
      toast.error(err.message || 'Gagal mengupdate data warga');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWarga = async (id: string) => {
    try {
      setLoading(true);
      await wargaAPI.delete(id);
      toast.success('Warga berhasil dihapus');
      await fetchWarga(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting warga:', err);
      toast.error(err.message || 'Gagal menghapus warga');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarga();
  }, []);

  return {
    warga,
    loading,
    error,
    fetchWarga,
    getWargaById,
    updateWarga,
    deleteWarga,
  };
};
