import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client with service role for admin operations
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Supabase client for user operations
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
};

// Helper function to generate ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Helper function to hash password (simple, for demo purposes)
const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Middleware to verify authentication
const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }
  
  return user;
};

// Health check endpoint
app.get("/make-server-784cdc32/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Register new user (Warga or Admin)
app.post("/make-server-784cdc32/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { 
      role, 
      namaLengkap, 
      email, 
      username, 
      password,
      // Warga specific
      nomorRumah,
      blok,
      noTelepon,
    } = body;

    // Validate required fields
    if (!role || !namaLengkap || !email || !username || !password) {
      return c.json({ error: "Semua field wajib diisi" }, 400);
    }

    // Validate role
    if (!['warga', 'admin'].includes(role)) {
      return c.json({ error: "Role tidak valid" }, 400);
    }

    // Validate warga specific fields
    if (role === 'warga' && (!nomorRumah || !blok)) {
      return c.json({ error: "Nomor rumah dan blok wajib diisi untuk warga" }, 400);
    }

    // Check if email or username already exists
    const existingEmail = await kv.get(`user:email:${email}`);
    if (existingEmail) {
      return c.json({ error: "Email sudah terdaftar" }, 400);
    }

    const existingUsername = await kv.get(`user:username:${username}`);
    if (existingUsername) {
      return c.json({ error: "Username sudah digunakan" }, 400);
    }

    // Create user with Supabase Auth
    const supabase = getSupabaseAdmin();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since we don't have email server
      user_metadata: {
        role,
        username,
        namaLengkap,
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return c.json({ error: "Gagal membuat akun: " + authError?.message }, 500);
    }

    const userId = authData.user.id;

    // Store user data in KV
    const userData = {
      id: userId,
      role,
      username,
      email,
      namaLengkap,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, userData);
    await kv.set(`user:email:${email}`, userId);
    await kv.set(`user:username:${username}`, userId);

    // If warga, store additional data
    if (role === 'warga') {
      const wargaData = {
        id: userId,
        userId,
        namaLengkap,
        email,
        username,
        nomorRumah,
        blok,
        noTelepon,
        statusAktif: true,
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`warga:${userId}`, wargaData);
      
      // Initialize saldo bank sampah
      await kv.set(`saldo_bank_sampah:${userId}`, {
        wargaId: userId,
        saldo: 0,
        lastUpdated: new Date().toISOString(),
      });
    }

    return c.json({ 
      success: true, 
      message: "Registrasi berhasil",
      userId,
      role,
    });

  } catch (error) {
    console.error('Error in register:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Login
app.post("/make-server-784cdc32/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return c.json({ error: "Username, password, dan role wajib diisi" }, 400);
    }

    // Get userId from username or email
    let userId = await kv.get(`user:username:${username}`);
    if (!userId) {
      userId = await kv.get(`user:email:${username}`);
    }

    if (!userId) {
      return c.json({ error: "Username atau password salah" }, 401);
    }

    // Get user data
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ error: "User tidak ditemukan" }, 404);
    }

    // Verify role
    if (userData.role !== role) {
      return c.json({ error: "Role tidak sesuai" }, 403);
    }

    // Login with Supabase Auth
    const supabase = getSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password,
    });

    if (authError || !authData.session) {
      console.error('Error logging in:', authError);
      return c.json({ error: "Username atau password salah" }, 401);
    }

    // Get additional data based on role
    let additionalData = null;
    if (role === 'warga') {
      additionalData = await kv.get(`warga:${userId}`);
    } else if (role === 'petugas') {
      additionalData = await kv.get(`petugas:${userId}`);
    }

    return c.json({ 
      success: true,
      accessToken: authData.session.access_token,
      user: {
        id: userId,
        username: userData.username,
        email: userData.email,
        namaLengkap: userData.namaLengkap,
        role: userData.role,
        ...additionalData,
      },
    });

  } catch (error) {
    console.error('Error in login:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Get current user
app.get("/make-server-784cdc32/auth/me", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: "User tidak ditemukan" }, 404);
    }

    // Get additional data based on role
    let additionalData = null;
    if (userData.role === 'warga') {
      additionalData = await kv.get(`warga:${user.id}`);
    } else if (userData.role === 'petugas') {
      additionalData = await kv.get(`petugas:${user.id}`);
    }

    return c.json({
      user: {
        id: user.id,
        username: userData.username,
        email: userData.email,
        namaLengkap: userData.namaLengkap,
        role: userData.role,
        ...additionalData,
      },
    });

  } catch (error) {
    console.error('Error in get current user:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// WARGA MANAGEMENT ROUTES (Admin only)
// ============================================

// Get all warga
app.get("/make-server-784cdc32/warga", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    // Get all warga
    const allWarga = await kv.getByPrefix('warga:');
    const wargaList = allWarga.map(item => item.value);

    return c.json({ warga: wargaList });

  } catch (error) {
    console.error('Error in get warga:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Get warga by ID
app.get("/make-server-784cdc32/warga/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const warga = await kv.get(`warga:${id}`);

    if (!warga) {
      return c.json({ error: "Warga tidak ditemukan" }, 404);
    }

    return c.json({ warga });

  } catch (error) {
    console.error('Error in get warga by id:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Update warga
app.put("/make-server-784cdc32/warga/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const existingWarga = await kv.get(`warga:${id}`);
    if (!existingWarga) {
      return c.json({ error: "Warga tidak ditemukan" }, 404);
    }

    const updatedWarga = {
      ...existingWarga,
      ...body,
      id, // Keep original ID
      userId: existingWarga.userId, // Keep original userId
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`warga:${id}`, updatedWarga);

    return c.json({ 
      success: true,
      warga: updatedWarga,
    });

  } catch (error) {
    console.error('Error in update warga:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Delete warga
app.delete("/make-server-784cdc32/warga/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const warga = await kv.get(`warga:${id}`);

    if (!warga) {
      return c.json({ error: "Warga tidak ditemukan" }, 404);
    }

    // Delete warga data
    await kv.del(`warga:${id}`);
    
    // Also delete user auth (optional, or just deactivate)
    const supabase = getSupabaseAdmin();
    await supabase.auth.admin.deleteUser(id);

    return c.json({ 
      success: true,
      message: "Warga berhasil dihapus",
    });

  } catch (error) {
    console.error('Error in delete warga:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// IURAN ROUTES
// ============================================

// Get iuran for a warga
app.get("/make-server-784cdc32/iuran/:wargaId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const wargaId = c.req.param('wargaId');
    
    // Get all iuran for this warga
    const allIuran = await kv.getByPrefix(`iuran:${wargaId}:`);
    const iuranList = allIuran.map(item => item.value);

    return c.json({ iuran: iuranList });

  } catch (error) {
    console.error('Error in get iuran:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Create or update iuran
app.post("/make-server-784cdc32/iuran", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const body = await c.req.json();
    const { wargaId, periode, jumlah, status, metodePembayaran, buktiPembayaran } = body;

    if (!wargaId || !periode || !jumlah) {
      return c.json({ error: "wargaId, periode, dan jumlah wajib diisi" }, 400);
    }

    const iuranKey = `iuran:${wargaId}:${periode}`;
    const existingIuran = await kv.get(iuranKey);

    const iuranData = {
      id: existingIuran?.id || generateId(),
      wargaId,
      periode,
      jumlah,
      status: status || 'belum_bayar',
      metodePembayaran: metodePembayaran || null,
      buktiPembayaran: buktiPembayaran || null,
      createdAt: existingIuran?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(iuranKey, iuranData);

    return c.json({ 
      success: true,
      iuran: iuranData,
    });

  } catch (error) {
    console.error('Error in create/update iuran:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Update iuran status (for payment)
app.put("/make-server-784cdc32/iuran/:wargaId/:periode", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const wargaId = c.req.param('wargaId');
    const periode = c.req.param('periode');
    const body = await c.req.json();

    const iuranKey = `iuran:${wargaId}:${periode}`;
    const existingIuran = await kv.get(iuranKey);

    if (!existingIuran) {
      return c.json({ error: "Iuran tidak ditemukan" }, 404);
    }

    const updatedIuran = {
      ...existingIuran,
      ...body,
      updatedAt: new Date().toISOString(),
      paidAt: body.status === 'lunas' ? new Date().toISOString() : existingIuran.paidAt,
    };

    await kv.set(iuranKey, updatedIuran);

    return c.json({ 
      success: true,
      iuran: updatedIuran,
    });

  } catch (error) {
    console.error('Error in update iuran:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Get all iuran (Admin only)
app.get("/make-server-784cdc32/iuran", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const allIuran = await kv.getByPrefix('iuran:');
    const iuranList = allIuran.map(item => item.value);

    return c.json({ iuran: iuranList });

  } catch (error) {
    console.error('Error in get all iuran:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// BANK SAMPAH - HARGA SAMPAH ROUTES
// ============================================

// Get all harga sampah
app.get("/make-server-784cdc32/harga-sampah", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allHarga = await kv.getByPrefix('harga_sampah:');
    const hargaList = allHarga.map(item => item.value);

    return c.json({ hargaSampah: hargaList });

  } catch (error) {
    console.error('Error in get harga sampah:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Create harga sampah (Admin only)
app.post("/make-server-784cdc32/harga-sampah", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const body = await c.req.json();
    const { jenisSampah, kategori, hargaPerKg, satuan } = body;

    if (!jenisSampah || !hargaPerKg) {
      return c.json({ error: "Jenis sampah dan harga wajib diisi" }, 400);
    }

    const id = generateId();
    const hargaData = {
      id,
      jenisSampah,
      kategori: kategori || 'Lainnya',
      hargaPerKg: parseFloat(hargaPerKg),
      satuan: satuan || 'kg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`harga_sampah:${id}`, hargaData);

    return c.json({ 
      success: true,
      hargaSampah: hargaData,
    });

  } catch (error) {
    console.error('Error in create harga sampah:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Update harga sampah (Admin only)
app.put("/make-server-784cdc32/harga-sampah/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await kv.get(`harga_sampah:${id}`);
    if (!existing) {
      return c.json({ error: "Harga sampah tidak ditemukan" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      hargaPerKg: body.hargaPerKg ? parseFloat(body.hargaPerKg) : existing.hargaPerKg,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`harga_sampah:${id}`, updated);

    return c.json({ 
      success: true,
      hargaSampah: updated,
    });

  } catch (error) {
    console.error('Error in update harga sampah:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Delete harga sampah (Admin only)
app.delete("/make-server-784cdc32/harga-sampah/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const existing = await kv.get(`harga_sampah:${id}`);

    if (!existing) {
      return c.json({ error: "Harga sampah tidak ditemukan" }, 404);
    }

    await kv.del(`harga_sampah:${id}`);

    return c.json({ 
      success: true,
      message: "Harga sampah berhasil dihapus",
    });

  } catch (error) {
    console.error('Error in delete harga sampah:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// BANK SAMPAH - SETORAN ROUTES
// ============================================

// Get all setoran
app.get("/make-server-784cdc32/setoran", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const wargaId = c.req.query('wargaId');
    
    let setoranList;
    if (wargaId) {
      // Get setoran for specific warga
      const allSetoran = await kv.getByPrefix(`setoran:`);
      setoranList = allSetoran
        .map(item => item.value)
        .filter(setoran => setoran.wargaId === wargaId);
    } else {
      // Get all setoran
      const allSetoran = await kv.getByPrefix('setoran:');
      setoranList = allSetoran.map(item => item.value);
    }

    return c.json({ setoran: setoranList });

  } catch (error) {
    console.error('Error in get setoran:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Create setoran (Petugas only)
app.post("/make-server-784cdc32/setoran", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (!['admin', 'petugas'].includes(userData.role)) {
      return c.json({ error: "Forbidden: Admin atau Petugas only" }, 403);
    }

    const body = await c.req.json();
    const { wargaId, items } = body;

    if (!wargaId || !items || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "wargaId dan items wajib diisi" }, 400);
    }

    // Calculate total
    let totalBerat = 0;
    let totalHarga = 0;
    
    for (const item of items) {
      totalBerat += parseFloat(item.berat);
      totalHarga += parseFloat(item.totalHarga);
    }

    const id = generateId();
    const setoranData = {
      id,
      wargaId,
      petugasId: user.id,
      items,
      totalBerat,
      totalHarga,
      tanggal: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await kv.set(`setoran:${id}`, setoranData);

    // Update saldo bank sampah
    const saldoKey = `saldo_bank_sampah:${wargaId}`;
    const currentSaldo = await kv.get(saldoKey) || { wargaId, saldo: 0 };
    const newSaldo = {
      ...currentSaldo,
      saldo: (currentSaldo.saldo || 0) + totalHarga,
      lastUpdated: new Date().toISOString(),
    };
    await kv.set(saldoKey, newSaldo);

    return c.json({ 
      success: true,
      setoran: setoranData,
      saldoBaru: newSaldo.saldo,
    });

  } catch (error) {
    console.error('Error in create setoran:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Get saldo bank sampah
app.get("/make-server-784cdc32/saldo/:wargaId", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const wargaId = c.req.param('wargaId');
    const saldo = await kv.get(`saldo_bank_sampah:${wargaId}`) || { 
      wargaId, 
      saldo: 0,
      lastUpdated: new Date().toISOString(),
    };

    return c.json({ saldo });

  } catch (error) {
    console.error('Error in get saldo:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// JADWAL PENGANGKUTAN ROUTES
// ============================================

// Get all jadwal
app.get("/make-server-784cdc32/jadwal", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allJadwal = await kv.getByPrefix('jadwal:');
    const jadwalList = allJadwal.map(item => item.value);

    return c.json({ jadwal: jadwalList });

  } catch (error) {
    console.error('Error in get jadwal:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Create jadwal (Admin only)
app.post("/make-server-784cdc32/jadwal", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const body = await c.req.json();
    const { hari, waktu, jenisSampah, blok } = body;

    if (!hari || !waktu || !jenisSampah) {
      return c.json({ error: "Hari, waktu, dan jenis sampah wajib diisi" }, 400);
    }

    const id = generateId();
    const jadwalData = {
      id,
      hari,
      waktu,
      jenisSampah,
      blok: blok || 'Semua',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`jadwal:${id}`, jadwalData);

    return c.json({ 
      success: true,
      jadwal: jadwalData,
    });

  } catch (error) {
    console.error('Error in create jadwal:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Update jadwal (Admin only)
app.put("/make-server-784cdc32/jadwal/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await kv.get(`jadwal:${id}`);
    if (!existing) {
      return c.json({ error: "Jadwal tidak ditemukan" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`jadwal:${id}`, updated);

    return c.json({ 
      success: true,
      jadwal: updated,
    });

  } catch (error) {
    console.error('Error in update jadwal:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Delete jadwal (Admin only)
app.delete("/make-server-784cdc32/jadwal/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const existing = await kv.get(`jadwal:${id}`);

    if (!existing) {
      return c.json({ error: "Jadwal tidak ditemukan" }, 404);
    }

    await kv.del(`jadwal:${id}`);

    return c.json({ 
      success: true,
      message: "Jadwal berhasil dihapus",
    });

  } catch (error) {
    console.error('Error in delete jadwal:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// INFORMASI RT ROUTES
// ============================================

// Get all informasi
app.get("/make-server-784cdc32/informasi", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allInfo = await kv.getByPrefix('informasi:');
    const infoList = allInfo.map(item => item.value);

    return c.json({ informasi: infoList });

  } catch (error) {
    console.error('Error in get informasi:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Create informasi (Admin only)
app.post("/make-server-784cdc32/informasi", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const body = await c.req.json();
    const { judul, konten, kategori, prioritas } = body;

    if (!judul || !konten) {
      return c.json({ error: "Judul dan konten wajib diisi" }, 400);
    }

    const id = generateId();
    const infoData = {
      id,
      judul,
      konten,
      kategori: kategori || 'Pengumuman',
      prioritas: prioritas || 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`informasi:${id}`, infoData);

    return c.json({ 
      success: true,
      informasi: infoData,
    });

  } catch (error) {
    console.error('Error in create informasi:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Update informasi (Admin only)
app.put("/make-server-784cdc32/informasi/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await kv.get(`informasi:${id}`);
    if (!existing) {
      return c.json({ error: "Informasi tidak ditemukan" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`informasi:${id}`, updated);

    return c.json({ 
      success: true,
      informasi: updated,
    });

  } catch (error) {
    console.error('Error in update informasi:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Delete informasi (Admin only)
app.delete("/make-server-784cdc32/informasi/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const existing = await kv.get(`informasi:${id}`);

    if (!existing) {
      return c.json({ error: "Informasi tidak ditemukan" }, 404);
    }

    await kv.del(`informasi:${id}`);

    return c.json({ 
      success: true,
      message: "Informasi berhasil dihapus",
    });

  } catch (error) {
    console.error('Error in delete informasi:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// PETUGAS MANAGEMENT ROUTES (Admin only)
// ============================================

// Get all petugas
app.get("/make-server-784cdc32/petugas", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const allPetugas = await kv.getByPrefix('petugas:');
    const petugasList = allPetugas.map(item => item.value);

    return c.json({ petugas: petugasList });

  } catch (error) {
    console.error('Error in get petugas:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Create petugas (Admin only)
app.post("/make-server-784cdc32/petugas", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const body = await c.req.json();
    const { namaLengkap, email, username, password, noTelepon } = body;

    if (!namaLengkap || !email || !username || !password) {
      return c.json({ error: "Semua field wajib diisi" }, 400);
    }

    // Check if email or username already exists
    const existingEmail = await kv.get(`user:email:${email}`);
    if (existingEmail) {
      return c.json({ error: "Email sudah terdaftar" }, 400);
    }

    const existingUsername = await kv.get(`user:username:${username}`);
    if (existingUsername) {
      return c.json({ error: "Username sudah digunakan" }, 400);
    }

    // Create user with Supabase Auth
    const supabase = getSupabaseAdmin();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'petugas',
        username,
        namaLengkap,
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating petugas auth:', authError);
      return c.json({ error: "Gagal membuat akun petugas: " + authError?.message }, 500);
    }

    const userId = authData.user.id;

    // Store user data
    const userDataToStore = {
      id: userId,
      role: 'petugas',
      username,
      email,
      namaLengkap,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, userDataToStore);
    await kv.set(`user:email:${email}`, userId);
    await kv.set(`user:username:${username}`, userId);

    // Store petugas data
    const petugasData = {
      id: userId,
      userId,
      namaLengkap,
      email,
      username,
      noTelepon: noTelepon || '',
      statusAktif: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`petugas:${userId}`, petugasData);

    return c.json({ 
      success: true,
      petugas: petugasData,
    });

  } catch (error) {
    console.error('Error in create petugas:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Update petugas (Admin only)
app.put("/make-server-784cdc32/petugas/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const body = await c.req.json();

    const existingPetugas = await kv.get(`petugas:${id}`);
    if (!existingPetugas) {
      return c.json({ error: "Petugas tidak ditemukan" }, 404);
    }

    const updatedPetugas = {
      ...existingPetugas,
      ...body,
      id,
      userId: existingPetugas.userId,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`petugas:${id}`, updatedPetugas);

    return c.json({ 
      success: true,
      petugas: updatedPetugas,
    });

  } catch (error) {
    console.error('Error in update petugas:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// Delete petugas (Admin only)
app.delete("/make-server-784cdc32/petugas/:id", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData.role !== 'admin') {
      return c.json({ error: "Forbidden: Admin only" }, 403);
    }

    const id = c.req.param('id');
    const petugas = await kv.get(`petugas:${id}`);

    if (!petugas) {
      return c.json({ error: "Petugas tidak ditemukan" }, 404);
    }

    await kv.del(`petugas:${id}`);
    
    const supabase = getSupabaseAdmin();
    await supabase.auth.admin.deleteUser(id);

    return c.json({ 
      success: true,
      message: "Petugas berhasil dihapus",
    });

  } catch (error) {
    console.error('Error in delete petugas:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

// ============================================
// DASHBOARD STATISTICS
// ============================================

// Get dashboard stats
app.get("/make-server-784cdc32/dashboard/stats", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const user = await verifyAuth(authHeader);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);

    if (userData.role === 'admin') {
      // Admin stats
      const allWarga = await kv.getByPrefix('warga:');
      const allIuran = await kv.getByPrefix('iuran:');
      const allSetoran = await kv.getByPrefix('setoran:');

      const totalWarga = allWarga.length;
      
      const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
      const iuranBulanIni = allIuran
        .map(i => i.value)
        .filter(i => i.periode === currentMonth);
      
      const totalIuranLunas = iuranBulanIni.filter(i => i.status === 'lunas').length;
      const totalIuranBelumBayar = iuranBulanIni.filter(i => i.status === 'belum_bayar').length;
      
      const totalPendapatanIuran = iuranBulanIni
        .filter(i => i.status === 'lunas')
        .reduce((sum, i) => sum + (i.jumlah || 0), 0);

      const totalSetoranBulanIni = allSetoran
        .map(s => s.value)
        .filter(s => s.tanggal?.startsWith(currentMonth))
        .reduce((sum, s) => sum + (s.totalHarga || 0), 0);

      return c.json({
        stats: {
          totalWarga,
          totalIuranLunas,
          totalIuranBelumBayar,
          totalPendapatanIuran,
          totalSetoranBulanIni,
          periode: currentMonth,
        },
      });

    } else if (userData.role === 'warga') {
      // Warga stats
      const wargaId = user.id;
      const saldo = await kv.get(`saldo_bank_sampah:${wargaId}`) || { saldo: 0 };
      
      const currentMonth = new Date().toISOString().substring(0, 7);
      const iuranBulanIni = await kv.get(`iuran:${wargaId}:${currentMonth}`);
      
      const allSetoran = await kv.getByPrefix('setoran:');
      const mySetoran = allSetoran
        .map(s => s.value)
        .filter(s => s.wargaId === wargaId);

      return c.json({
        stats: {
          saldoBankSampah: saldo.saldo,
          statusIuranBulanIni: iuranBulanIni?.status || 'belum_bayar',
          jumlahIuranBulanIni: iuranBulanIni?.jumlah || 0,
          totalSetoran: mySetoran.length,
          periode: currentMonth,
        },
      });

    } else if (userData.role === 'petugas') {
      // Petugas stats
      const allSetoran = await kv.getByPrefix('setoran:');
      const mySetoran = allSetoran
        .map(s => s.value)
        .filter(s => s.petugasId === user.id);

      const currentMonth = new Date().toISOString().substring(0, 7);
      const setoranBulanIni = mySetoran.filter(s => s.tanggal?.startsWith(currentMonth));

      return c.json({
        stats: {
          totalSetoranDiproses: mySetoran.length,
          totalSetoranBulanIni: setoranBulanIni.length,
          totalBeratBulanIni: setoranBulanIni.reduce((sum, s) => sum + (s.totalBerat || 0), 0),
          totalNilaiBulanIni: setoranBulanIni.reduce((sum, s) => sum + (s.totalHarga || 0), 0),
          periode: currentMonth,
        },
      });
    }

    return c.json({ stats: {} });

  } catch (error) {
    console.error('Error in get dashboard stats:', error);
    return c.json({ error: "Terjadi kesalahan server: " + error.message }, 500);
  }
});

Deno.serve(app.fetch);
