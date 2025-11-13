import { supabase } from '../lib/supabase'

export const bankSampahService = {
  /**
   * Get saldo bank sampah for current warga
   */
  async getMySaldo() {
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
        .from('saldo_bank_sampah')
        .select('*')
        .eq('warga_id', warga.id)
        .maybeSingle()

      if (error) throw error

      return {
        success: true,
        data: data || {
          saldo: 0,
          total_setoran: 0,
          total_penarikan: 0,
        },
      }
    } catch (error: any) {
      console.error('Get my saldo error:', error)
      return {
        success: false,
        error: error.message,
        data: {
          saldo: 0,
          total_setoran: 0,
          total_penarikan: 0,
        },
      }
    }
  },

  /**
   * Admin: Get all saldo
   */
  async getAllSaldo() {
    try {
      const { data, error } = await supabase
        .from('saldo_bank_sampah')
        .select(`
          *,
          warga:warga_id (
            blok,
            nomor_rumah,
            profiles:user_id (
              nama,
              email
            )
          )
        `)
        .order('saldo', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get all saldo error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Get jenis sampah list
   */
  async getJenisSampah() {
    try {
      const { data, error } = await supabase
        .from('jenis_sampah')
        .select('*')
        .eq('is_active', true)
        .order('nama')

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get jenis sampah error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Admin: Add jenis sampah
   */
  async addJenisSampah(data: {
    nama: string
    harga_per_kg: number
    satuan?: string
    deskripsi?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: result, error } = await supabase
        .from('jenis_sampah')
        .insert({
          ...data,
          satuan: data.satuan || 'kg',
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data: result,
        message: 'Jenis sampah berhasil ditambahkan',
      }
    } catch (error: any) {
      console.error('Add jenis sampah error:', error)
      return {
        success: false,
        error: error.message || 'Gagal menambahkan jenis sampah',
      }
    }
  },

  /**
   * Admin: Update jenis sampah
   */
  async updateJenisSampah(
    id: string,
    updates: {
      nama?: string
      harga_per_kg?: number
      satuan?: string
      deskripsi?: string
      is_active?: boolean
    }
  ) {
    try {
      const { error } = await supabase
        .from('jenis_sampah')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      return {
        success: true,
        message: 'Jenis sampah berhasil diupdate',
      }
    } catch (error: any) {
      console.error('Update jenis sampah error:', error)
      return {
        success: false,
        error: error.message || 'Gagal mengupdate jenis sampah',
      }
    }
  },

  /**
   * Admin: Delete jenis sampah
   */
  async deleteJenisSampah(id: string) {
    try {
      const { error } = await supabase
        .from('jenis_sampah')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      return {
        success: true,
        message: 'Jenis sampah berhasil dihapus',
      }
    } catch (error: any) {
      console.error('Delete jenis sampah error:', error)
      return {
        success: false,
        error: error.message || 'Gagal menghapus jenis sampah',
      }
    }
  },

  /**
   * Petugas: Input setoran sampah
   */
  async inputSetoran(data: {
    warga_id: string
    tanggal_setor: string
    items: Array<{
      jenis_sampah_id: string
      berat: number
      harga_per_kg: number
    }>
    catatan?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get petugas_id
      const { data: petugas } = await supabase
        .from('petugas_bank_sampah')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!petugas) throw new Error('Petugas not found')

      // Calculate totals
      const total_berat = data.items.reduce((sum, item) => sum + item.berat, 0)
      const total_nilai = data.items.reduce(
        (sum, item) => sum + item.berat * item.harga_per_kg,
        0
      )

      // Create setoran record
      const { data: setoran, error: setoranError } = await supabase
        .from('setoran_sampah')
        .insert({
          warga_id: data.warga_id,
          petugas_id: petugas.id,
          tanggal_setor: data.tanggal_setor,
          total_berat: total_berat,
          total_nilai: total_nilai,
          catatan: data.catatan,
        })
        .select()
        .single()

      if (setoranError) throw setoranError

      // Create detail records
      const details = data.items.map((item) => ({
        setoran_id: setoran.id,
        jenis_sampah_id: item.jenis_sampah_id,
        berat: item.berat,
        harga_per_kg: item.harga_per_kg,
        subtotal: item.berat * item.harga_per_kg,
      }))

      const { error: detailError } = await supabase
        .from('detail_setoran_sampah')
        .insert(details)

      if (detailError) throw detailError

      // Saldo akan otomatis update via trigger di database

      return {
        success: true,
        data: setoran,
        message: 'Setoran berhasil dicatat',
      }
    } catch (error: any) {
      console.error('Input setoran error:', error)
      return {
        success: false,
        error: error.message || 'Gagal mencatat setoran',
      }
    }
  },

  /**
   * Get riwayat setoran for current warga
   */
  async getMySetoran() {
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
        .from('setoran_sampah')
        .select(`
          *,
          petugas:petugas_id (
            profiles:user_id (
              nama
            )
          ),
          detail:detail_setoran_sampah (
            *,
            jenis:jenis_sampah_id (
              nama,
              satuan
            )
          )
        `)
        .eq('warga_id', warga.id)
        .order('tanggal_setor', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get my setoran error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Admin/Petugas: Get all setoran
   */
  async getAllSetoran(filters?: {
    warga_id?: string
    start_date?: string
    end_date?: string
  }) {
    try {
      let query = supabase
        .from('setoran_sampah')
        .select(`
          *,
          warga:warga_id (
            blok,
            nomor_rumah,
            profiles:user_id (
              nama
            )
          ),
          petugas:petugas_id (
            profiles:user_id (
              nama
            )
          ),
          detail:detail_setoran_sampah (
            *,
            jenis:jenis_sampah_id (
              nama,
              satuan
            )
          )
        `)
        .order('tanggal_setor', { ascending: false })

      if (filters?.warga_id) query = query.eq('warga_id', filters.warga_id)
      if (filters?.start_date) query = query.gte('tanggal_setor', filters.start_date)
      if (filters?.end_date) query = query.lte('tanggal_setor', filters.end_date)

      const { data, error } = await query

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get all setoran error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Warga: Ajukan penarikan saldo
   */
  async ajukanPenarikan(data: {
    jumlah: number
    keperluan: string
    metode: 'tunai' | 'bayar_iuran' | 'transfer'
    catatan?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      // Check saldo
      const { data: saldo } = await supabase
        .from('saldo_bank_sampah')
        .select('saldo')
        .eq('warga_id', warga.id)
        .single()

      if (!saldo || saldo.saldo < data.jumlah) {
        throw new Error('Saldo tidak mencukupi')
      }

      // Create penarikan record
      const { data: penarikan, error } = await supabase
        .from('penarikan_saldo')
        .insert({
          warga_id: warga.id,
          jumlah: data.jumlah,
          keperluan: data.keperluan,
          metode: data.metode,
          catatan: data.catatan,
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data: penarikan,
        message: 'Pengajuan penarikan berhasil. Menunggu persetujuan admin.',
      }
    } catch (error: any) {
      console.error('Ajukan penarikan error:', error)
      return {
        success: false,
        error: error.message || 'Gagal mengajukan penarikan',
      }
    }
  },

  /**
   * Admin: Approve/Reject penarikan
   */
  async approvePenarikan(
    penarikanId: string,
    action: 'approved' | 'rejected',
    catatan?: string
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('penarikan_saldo')
        .update({
          status: action === 'approved' ? 'completed' : 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          catatan: catatan,
        })
        .eq('id', penarikanId)

      if (error) throw error

      // Saldo akan otomatis update via trigger jika approved

      return {
        success: true,
        message:
          action === 'approved'
            ? 'Penarikan disetujui'
            : 'Penarikan ditolak',
      }
    } catch (error: any) {
      console.error('Approve penarikan error:', error)
      return {
        success: false,
        error: error.message || 'Gagal memproses penarikan',
      }
    }
  },

  /**
   * Get riwayat penarikan for current warga
   */
  async getMyPenarikan() {
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
        .from('penarikan_saldo')
        .select(`
          *,
          approved_by_profile:approved_by (
            nama
          )
        `)
        .eq('warga_id', warga.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get my penarikan error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },

  /**
   * Admin: Get all penarikan
   */
  async getAllPenarikan(status?: string) {
    try {
      let query = supabase
        .from('penarikan_saldo')
        .select(`
          *,
          warga:warga_id (
            blok,
            nomor_rumah,
            profiles:user_id (
              nama,
              telepon
            )
          ),
          approved_by_profile:approved_by (
            nama
          )
        `)
        .order('created_at', { ascending: false })

      if (status) query = query.eq('status', status)

      const { data, error } = await query

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get all penarikan error:', error)
      return {
        success: false,
        error: error.message,
        data: [],
      }
    }
  },
}
