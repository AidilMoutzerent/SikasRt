import { supabase } from '../lib/supabase'

export interface RegisterData {
  email: string
  password: string
  nama: string
  role: 'admin' | 'warga' | 'petugas'
  telepon?: string
  // Warga specific
  blok?: string
  nomor_rumah?: string
  // Admin specific
  jabatan?: string
  nomor_rekening_bri?: string
  nama_pemilik_rekening?: string
}

export interface LoginData {
  email: string
  password: string
}

export const authService = {
  /**
   * Register new user (Admin or Warga)
   * Petugas harus ditambahkan oleh Admin
   */
  async register(data: RegisterData) {
    try {
      // 1. Create auth user di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nama: data.nama,
            role: data.role,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      // 2. Create profile di public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          nama: data.nama,
          role: data.role,
          telepon: data.telepon,
        })

      if (profileError) throw profileError

      // 3. Create role-specific data
      if (data.role === 'warga') {
        if (!data.blok || !data.nomor_rumah) {
          throw new Error('Blok dan nomor rumah wajib diisi untuk warga')
        }

        const { error: wargaError } = await supabase
          .from('warga')
          .insert({
            user_id: authData.user.id,
            blok: data.blok,
            nomor_rumah: data.nomor_rumah,
            rt: '05',
            rw: '02',
            kelurahan: 'Mekar Sari',
          })

        if (wargaError) throw wargaError
      } else if (data.role === 'admin') {
        if (!data.jabatan || !data.nomor_rekening_bri || !data.nama_pemilik_rekening) {
          throw new Error('Jabatan, nomor rekening BRI, dan nama pemilik rekening wajib diisi untuk admin')
        }

        const { error: adminError } = await supabase
          .from('admin_rt')
          .insert({
            user_id: authData.user.id,
            jabatan: data.jabatan,
            nomor_rekening_bri: data.nomor_rekening_bri,
            nama_pemilik_rekening: data.nama_pemilik_rekening,
          })

        if (adminError) throw adminError
      }

      return { 
        success: true, 
        data: authData,
        message: 'Registrasi berhasil! Silakan login dengan akun Anda.'
      }
    } catch (error: any) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.message || 'Terjadi kesalahan saat registrasi'
      }
    }
  },

  /**
   * Login user dengan email dan password
   */
  async login(data: LoginData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw profileError

      return { 
        success: true, 
        data: {
          user: authData.user,
          profile: profile,
          session: authData.session,
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // User-friendly error messages
      let errorMessage = 'Terjadi kesalahan saat login'
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email atau password salah'
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email belum diverifikasi. Cek inbox Anda.'
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  },

  /**
   * Logout current user
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      return { 
        success: false, 
        error: error.message || 'Terjadi kesalahan saat logout'
      }
    }
  },

  /**
   * Get current logged in user with profile
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return { success: false, data: null }

      // Get profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      return { 
        success: true, 
        data: { user, profile } 
      }
    } catch (error: any) {
      console.error('Get current user error:', error)
      return { 
        success: false, 
        data: null,
        error: error.message
      }
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return { success: true, data: session }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(updates: {
    nama?: string
    telepon?: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      return { success: true, message: 'Profile berhasil diupdate' }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal mengupdate profile'
      }
    }
  },

  /**
   * Change password
   */
  async changePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      return { success: true, message: 'Password berhasil diubah' }
    } catch (error: any) {
      console.error('Change password error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal mengubah password'
      }
    }
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return { 
        success: true, 
        message: 'Link reset password telah dikirim ke email Anda'
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return { 
        success: false, 
        error: error.message || 'Gagal mengirim email reset password'
      }
    }
  },
}
