import { useState, useEffect } from 'react';
import { hargaSampahAPI } from '../utils/api';
import { toast } from 'sonner';

export interface HargaSampah {
  id: string;
  jenisSampah: string;
  kategori: string;
  hargaPerKg: number;
  satuan: string;
  createdAt: string;
  updatedAt?: string;
}

export const useHargaSampah = () => {
  const [hargaSampah, setHargaSampah] = useState<HargaSampah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHargaSampah = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await hargaSampahAPI.getAll();
      setHargaSampah(response.hargaSampah);
    } catch (err: any) {
      console.error('Error fetching harga sampah:', err);
      setError(err.message);
      toast.error('Gagal memuat data harga sampah');
    } finally {
      setLoading(false);
    }
  };

  const createHargaSampah = async (data: {
    jenisSampah: string;
    kategori: string;
    hargaPerKg: number;
    satuan?: string;
  }) => {
    try {
      setLoading(true);
      const response = await hargaSampahAPI.create(data);
      toast.success('Harga sampah berhasil ditambahkan');
      await fetchHargaSampah(); // Refresh list
      return response.hargaSampah;
    } catch (err: any) {
      console.error('Error creating harga sampah:', err);
      toast.error(err.message || 'Gagal menambahkan harga sampah');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHargaSampah = async (id: string, data: Partial<HargaSampah>) => {
    try {
      setLoading(true);
      const response = await hargaSampahAPI.update(id, data);
      toast.success('Harga sampah berhasil diupdate');
      await fetchHargaSampah(); // Refresh list
      return response.hargaSampah;
    } catch (err: any) {
      console.error('Error updating harga sampah:', err);
      toast.error(err.message || 'Gagal mengupdate harga sampah');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHargaSampah = async (id: string) => {
    try {
      setLoading(true);
      await hargaSampahAPI.delete(id);
      toast.success('Harga sampah berhasil dihapus');
      await fetchHargaSampah(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting harga sampah:', err);
      toast.error(err.message || 'Gagal menghapus harga sampah');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHargaSampah();
  }, []);

  return {
    hargaSampah,
    loading,
    error,
    fetchHargaSampah,
    createHargaSampah,
    updateHargaSampah,
    deleteHargaSampah,
  };
};
