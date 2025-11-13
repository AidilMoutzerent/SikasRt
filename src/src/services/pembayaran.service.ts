import { supabase } from '../lib/supabase'
import type { PembayaranIuran } from '../lib/supabase'

export const pembayaranService = {
  /**
   * Warga: Bayar iuran (Transfer BRI only)
   */
  async bayarIuran(data: {
    iuran_id: string
    jumlah_bayar: number
    nomor_referensi?: string
    bukti_transfer?: string
    catatan?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get warga_id
      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      // Create pembayaran record
      const { data: pembayaran, error } = await supabase
        .from('pembayaran_iuran')
        .insert({
          iuran_id: data.iuran_id,
          warga_id: warga.id,
          jumlah_bayar: data.jumlah_bayar,
          metode_pembayaran: 'transfer_bri', // Fixed: BRI only
          nomor_referensi: data.nomor_referensi,
          bukti_transfer: data.bukti_transfer,
          catatan: data.catatan,
          status: 'pending', // Menunggu verifikasi admin
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data: pembayaran,
        message: 'Pembayaran berhasil dicatat. Menunggu verifikasi admin.',
      }
    } catch (error: any) {
      console.error('Bayar iuran error:', error)
      return {
        success: false,
        error: error.message || 'Gagal mencatat pembayaran',
      }
    }
  },

  /**
   * Get pembayaran history for current warga
   */
  async getMyPembayaran() {
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
        .from('pembayaran_iuran')
        .select(`
          *,
          iuran:iuran_id (
            bulan,
            tahun,
            nominal,
            status
          ),
          verified_by_profile:verified_by (
            nama
          )
        `)
        .eq('warga_id', warga.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get my pembayaran error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Admin: Get all pembayaran with filters
   */
  async getAllPembayaran(filters?: {
    status?: string
    start_date?: string
    end_date?: string
    search?: string
  }) {
    try {
      let query = supabase
        .from('pembayaran_iuran')
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
          ),
          iuran:iuran_id (
            bulan,
            tahun,
            nominal,
            status
          ),
          verified_by_profile:verified_by (
            nama
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.start_date) query = query.gte('created_at', filters.start_date)
      if (filters?.end_date) query = query.lte('created_at', filters.end_date)

      const { data, error } = await query

      if (error) throw error

      // Client-side search filter
      let result = data || []
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(
          (item) =>
            item.warga?.profiles?.nama?.toLowerCase().includes(searchLower) ||
            item.warga?.blok?.toLowerCase().includes(searchLower) ||
            item.nomor_referensi?.toLowerCase().includes(searchLower)
        )
      }

      return { success: true, data: result }
    } catch (error: any) {
      console.error('Get all pembayaran error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Admin: Get pending pembayaran (need verification)
   */
  async getPendingPembayaran() {
    try {
      const { data, error } = await supabase
        .from('pembayaran_iuran')
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
          ),
          iuran:iuran_id (
            bulan,
            tahun,
            nominal
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get pending pembayaran error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Admin: Verify pembayaran
   */
  async verifyPembayaran(
    pembayaranId: string,
    action: 'verified' | 'rejected',
    catatan?: string
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get pembayaran detail
      const { data: pembayaran, error: pembayaranError } = await supabase
        .from('pembayaran_iuran')
        .select('*, iuran:iuran_id (*)')
        .eq('id', pembayaranId)
        .single()

      if (pembayaranError) throw pembayaranError

      // Update pembayaran status
      const { error: updateError } = await supabase
        .from('pembayaran_iuran')
        .update({
          status: action,
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          catatan: catatan,
        })
        .eq('id', pembayaranId)

      if (updateError) throw updateError

      // If verified, update iuran status to lunas
      if (action === 'verified') {
        const { error: iuranError } = await supabase
          .from('iuran')
          .update({ status: 'lunas' })
          .eq('id', pembayaran.iuran_id)

        if (iuranError) throw iuranError
      }

      return {
        success: true,
        message:
          action === 'verified'
            ? 'Pembayaran berhasil diverifikasi'
            : 'Pembayaran ditolak',
      }
    } catch (error: any) {
      console.error('Verify pembayaran error:', error)
      return {
        success: false,
        error: error.message || 'Gagal memverifikasi pembayaran',
      }
    }
  },

  /**
   * Get pembayaran detail by ID
   */
  async getPembayaranById(pembayaranId: string) {
    try {
      const { data, error } = await supabase
        .from('pembayaran_iuran')
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
          ),
          iuran:iuran_id (
            bulan,
            tahun,
            nominal,
            status
          ),
          verified_by_profile:verified_by (
            nama
          )
        `)
        .eq('id', pembayaranId)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      console.error('Get pembayaran by id error:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  },

  /**
   * Upload bukti transfer to Supabase Storage
   */
  async uploadBuktiTransfer(file: File) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `bukti-transfer/${fileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from('pembayaran')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pembayaran')
        .getPublicUrl(filePath)

      return {
        success: true,
        data: {
          path: data.path,
          url: urlData.publicUrl,
        },
      }
    } catch (error: any) {
      console.error('Upload bukti transfer error:', error)
      return {
        success: false,
        error: error.message || 'Gagal mengupload bukti transfer',
      }
    }
  },

  /**
   * Get statistics for admin dashboard
   */
  async getPembayaranStats(bulan?: number, tahun?: number) {
    try {
      let query = supabase
        .from('pembayaran_iuran')
        .select(`
          *,
          iuran:iuran_id (
            bulan,
            tahun
          )
        `)

      const { data, error } = await query

      if (error) throw error

      // Calculate stats
      const stats = {
        total: data?.length || 0,
        pending: data?.filter((p) => p.status === 'pending').length || 0,
        verified: data?.filter((p) => p.status === 'verified').length || 0,
        rejected: data?.filter((p) => p.status === 'rejected').length || 0,
        total_amount: data?.reduce((sum, p) => sum + (p.jumlah_bayar || 0), 0) || 0,
      }

      return { success: true, data: stats }
    } catch (error: any) {
      console.error('Get pembayaran stats error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  },
}
