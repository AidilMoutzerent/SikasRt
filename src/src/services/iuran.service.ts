import { supabase } from '../lib/supabase'
import type { Iuran, PembayaranIuran } from '../lib/supabase'

export const iuranService = {
  /**
   * Get iuran for current warga
   */
  async getMyIuran() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get warga_id from current user
      const { data: warga, error: wargaError } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (wargaError) throw wargaError
      if (!warga) throw new Error('Warga not found')

      // Get all iuran for this warga
      const { data, error } = await supabase
        .from('iuran')
        .select('*')
        .eq('warga_id', warga.id)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get my iuran error:', error)
      return { 
        success: false, 
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Get iuran for specific month/year
   */
  async getIuranByPeriod(bulan: number, tahun: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      const { data, error } = await supabase
        .from('iuran')
        .select('*')
        .eq('warga_id', warga.id)
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .maybeSingle()

      if (error) throw error

      return { success: true, data: data || null }
    } catch (error: any) {
      console.error('Get iuran by period error:', error)
      return { 
        success: false, 
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Admin: Get all iuran with filters
   */
  async getAllIuran(filters?: { 
    bulan?: number
    tahun?: number
    status?: string
    search?: string
  }) {
    try {
      let query = supabase
        .from('iuran')
        .select(`
          *,
          warga:warga_id (
            id,
            blok,
            nomor_rumah,
            profiles:user_id (
              nama,
              email,
              telepon
            )
          )
        `)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })

      if (filters?.bulan) query = query.eq('bulan', filters.bulan)
      if (filters?.tahun) query = query.eq('tahun', filters.tahun)
      if (filters?.status) query = query.eq('status', filters.status)

      const { data, error } = await query

      if (error) throw error

      // Client-side search filter if needed
      let result = data || []
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(item => 
          item.warga?.profiles?.nama?.toLowerCase().includes(searchLower) ||
          item.warga?.blok?.toLowerCase().includes(searchLower) ||
          item.warga?.nomor_rumah?.toLowerCase().includes(searchLower)
        )
      }

      return { success: true, data: result }
    } catch (error: any) {
      console.error('Get all iuran error:', error)
      return { 
        success: false, 
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Admin: Create iuran for specific warga
   */
  async createIuran(iuranData: {
    warga_id: string
    bulan: number
    tahun: number
    nominal: number
    tanggal_jatuh_tempo?: string
    keterangan?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('iuran')
        .insert({
          ...iuranData,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      return { 
        success: true, 
        data,
        message: 'Iuran berhasil dibuat'
      }
    } catch (error: any) {
      console.error('Create iuran error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal membuat iuran'
      }
    }
  },

  /**
   * Admin: Create bulk iuran for all active warga
   */
  async createBulkIuran(iuranData: {
    bulan: number
    tahun: number
    nominal: number
    tanggal_jatuh_tempo?: string
    keterangan?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get all active warga
      const { data: wargaList, error: wargaError } = await supabase
        .from('warga')
        .select('id')
        .eq('is_active', true)

      if (wargaError) throw wargaError
      if (!wargaList || wargaList.length === 0) {
        throw new Error('Tidak ada warga aktif')
      }

      // Create iuran for each warga
      const iuranList = wargaList.map(warga => ({
        warga_id: warga.id,
        bulan: iuranData.bulan,
        tahun: iuranData.tahun,
        nominal: iuranData.nominal,
        tanggal_jatuh_tempo: iuranData.tanggal_jatuh_tempo,
        keterangan: iuranData.keterangan,
        created_by: user.id,
      }))

      const { data, error } = await supabase
        .from('iuran')
        .insert(iuranList)
        .select()

      if (error) throw error

      return { 
        success: true, 
        data,
        message: `Berhasil membuat ${data.length} tagihan iuran`
      }
    } catch (error: any) {
      console.error('Create bulk iuran error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal membuat tagihan massal'
      }
    }
  },

  /**
   * Admin: Update iuran
   */
  async updateIuran(iuranId: string, updates: {
    nominal?: number
    tanggal_jatuh_tempo?: string
    denda?: number
    keterangan?: string
  }) {
    try {
      const { error } = await supabase
        .from('iuran')
        .update(updates)
        .eq('id', iuranId)

      if (error) throw error

      return { 
        success: true,
        message: 'Iuran berhasil diupdate'
      }
    } catch (error: any) {
      console.error('Update iuran error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal mengupdate iuran'
      }
    }
  },

  /**
   * Admin: Delete iuran
   */
  async deleteIuran(iuranId: string) {
    try {
      const { error } = await supabase
        .from('iuran')
        .delete()
        .eq('id', iuranId)

      if (error) throw error

      return { 
        success: true,
        message: 'Iuran berhasil dihapus'
      }
    } catch (error: any) {
      console.error('Delete iuran error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal menghapus iuran'
      }
    }
  },

  /**
   * Get admin rekening BRI info for payment
   */
  async getAdminRekening() {
    try {
      const { data, error } = await supabase
        .from('admin_rt')
        .select(`
          nomor_rekening_bri,
          nama_pemilik_rekening,
          jabatan,
          profiles:user_id (
            nama
          )
        `)
        .eq('is_active', true)
        .limit(1)
        .single()

      if (error) throw error

      return { 
        success: true, 
        data: {
          bank: 'BRI',
          nomor_rekening: data.nomor_rekening_bri,
          nama_pemilik: data.nama_pemilik_rekening,
          jabatan: data.jabatan,
        }
      }
    } catch (error: any) {
      console.error('Get admin rekening error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal mendapatkan info rekening'
      }
    }
  },
}
