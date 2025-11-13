import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-784cdc32`;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Save auth token to localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Save user data to localStorage
export const setUserData = (user: any) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Get user data from localStorage
export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

// Remove user data from localStorage
export const removeUserData = () => {
  localStorage.removeItem('userData');
};

// Helper function for API calls
async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  register: async (data: {
    role: string;
    namaLengkap: string;
    email: string;
    username: string;
    password: string;
    nomorRumah?: string;
    blok?: string;
    noTelepon?: string;
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false);
  },

  login: async (username: string, password: string, role: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    }, false);
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me', { method: 'GET' });
  },
};

// ============================================
// WARGA API
// ============================================

export const wargaAPI = {
  getAll: async () => {
    return apiCall('/warga', { method: 'GET' });
  },

  getById: async (id: string) => {
    return apiCall(`/warga/${id}`, { method: 'GET' });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/warga/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/warga/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// IURAN API
// ============================================

export const iuranAPI = {
  getByWarga: async (wargaId: string) => {
    return apiCall(`/iuran/${wargaId}`, { method: 'GET' });
  },

  getAll: async () => {
    return apiCall('/iuran', { method: 'GET' });
  },

  create: async (data: {
    wargaId: string;
    periode: string;
    jumlah: number;
    status?: string;
    metodePembayaran?: string;
    buktiPembayaran?: string;
  }) => {
    return apiCall('/iuran', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (wargaId: string, periode: string, data: any) => {
    return apiCall(`/iuran/${wargaId}/${periode}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// BANK SAMPAH - HARGA SAMPAH API
// ============================================

export const hargaSampahAPI = {
  getAll: async () => {
    return apiCall('/harga-sampah', { method: 'GET' });
  },

  create: async (data: {
    jenisSampah: string;
    kategori: string;
    hargaPerKg: number;
    satuan?: string;
  }) => {
    return apiCall('/harga-sampah', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/harga-sampah/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/harga-sampah/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// BANK SAMPAH - SETORAN API
// ============================================

export const setoranAPI = {
  getAll: async (wargaId?: string) => {
    const query = wargaId ? `?wargaId=${wargaId}` : '';
    return apiCall(`/setoran${query}`, { method: 'GET' });
  },

  create: async (data: {
    wargaId: string;
    items: Array<{
      jenisSampah: string;
      berat: number;
      hargaPerKg: number;
      totalHarga: number;
    }>;
  }) => {
    return apiCall('/setoran', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getSaldo: async (wargaId: string) => {
    return apiCall(`/saldo/${wargaId}`, { method: 'GET' });
  },
};

// ============================================
// JADWAL API
// ============================================

export const jadwalAPI = {
  getAll: async () => {
    return apiCall('/jadwal', { method: 'GET' });
  },

  create: async (data: {
    hari: string;
    waktu: string;
    jenisSampah: string;
    blok?: string;
  }) => {
    return apiCall('/jadwal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/jadwal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/jadwal/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// INFORMASI RT API
// ============================================

export const informasiAPI = {
  getAll: async () => {
    return apiCall('/informasi', { method: 'GET' });
  },

  create: async (data: {
    judul: string;
    konten: string;
    kategori?: string;
    prioritas?: string;
  }) => {
    return apiCall('/informasi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/informasi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/informasi/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// PETUGAS API
// ============================================

export const petugasAPI = {
  getAll: async () => {
    return apiCall('/petugas', { method: 'GET' });
  },

  create: async (data: {
    namaLengkap: string;
    email: string;
    username: string;
    password: string;
    noTelepon?: string;
  }) => {
    return apiCall('/petugas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/petugas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/petugas/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// DASHBOARD API
// ============================================

export const dashboardAPI = {
  getStats: async () => {
    return apiCall('/dashboard/stats', { method: 'GET' });
  },
};
