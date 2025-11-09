import { User, MapPin, Phone, Mail, Home, Edit, LogOut, Bell, Shield, ChevronRight, Camera, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

interface ProfilPageProps {
  onLogout?: () => void;
}

export function ProfilPage({ onLogout }: ProfilPageProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 mb-1">Profil Saya</h1>
          <p className="text-gray-600">Kelola informasi pribadi dan pengaturan akun Anda</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-gray-900 mb-1">Budi Santoso</h2>
                <p className="text-gray-600 mb-3">Kepala Keluarga</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge className="bg-blue-600">Warga Aktif</Badge>
                  <Badge variant="outline">Member sejak 2020</Badge>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                  <p className="text-gray-900">Budi Santoso</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nomor Telepon</p>
                  <p className="text-gray-900">0812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">budi.santoso@email.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">NIK</p>
                  <p className="text-gray-900">3201234567891234</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Info */}
          <Card>
            <CardHeader>
              <CardTitle>Alamat Tempat Tinggal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat Lengkap</p>
                  <p className="text-gray-900">Jl. Melati No. 15</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">RT</p>
                  <p className="text-gray-900">05</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">RW</p>
                  <p className="text-gray-900">02</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Kelurahan</p>
                <p className="text-gray-900">Mekar Sari</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Kecamatan</p>
                <p className="text-gray-900">Cisarua</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kota</p>
                  <p className="text-gray-900">Bandung</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kode Pos</p>
                  <p className="text-gray-900">40123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Anggota Keluarga</CardTitle>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Siti" />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">Siti Nurhaliza</p>
                  <p className="text-sm text-gray-600">Istri</p>
                </div>
              </div>
              <Badge variant="outline">Anggota</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Andi" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">Andi Santoso</p>
                  <p className="text-sm text-gray-600">Anak (12 tahun)</p>
                </div>
              </div>
              <Badge variant="outline">Anggota</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi" />
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">Dewi Santoso</p>
                  <p className="text-sm text-gray-600">Anak (8 tahun)</p>
                </div>
              </div>
              <Badge variant="outline">Anggota</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">Pengumuman RT</p>
                  <p className="text-sm text-gray-600">Terima notifikasi pengumuman penting</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">Reminder Iuran</p>
                  <p className="text-sm text-gray-600">Pengingat pembayaran iuran bulanan</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">Jadwal Kegiatan</p>
                  <p className="text-sm text-gray-600">Notifikasi kegiatan RT mendatang</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">Bank Sampah</p>
                  <p className="text-sm text-gray-600">Update saldo dan transaksi bank sampah</p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Lainnya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Keamanan & Privasi</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Preferensi Notifikasi</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button 
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowPasswordModal(true)}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Ubah Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar dari Akun
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input defaultValue="Budi Santoso" />
            </div>

            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input defaultValue="0812-3456-7890" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue="budi.santoso@email.com" />
            </div>

            <div className="space-y-2">
              <Label>NIK</Label>
              <Input defaultValue="3201234567891234" disabled />
              <p className="text-xs text-gray-600">NIK tidak dapat diubah</p>
            </div>

            <div className="space-y-2">
              <Label>Alamat</Label>
              <Input defaultValue="Jl. Melati No. 15" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>RT</Label>
                <Input defaultValue="05" disabled />
              </div>
              <div className="space-y-2">
                <Label>RW</Label>
                <Input defaultValue="02" disabled />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  alert("Profil berhasil diperbarui!");
                  setShowEditModal(false);
                }}
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Password Lama</Label>
              <Input type="password" placeholder="Masukkan password lama" />
            </div>

            <div className="space-y-2">
              <Label>Password Baru</Label>
              <Input type="password" placeholder="Masukkan password baru" />
            </div>

            <div className="space-y-2">
              <Label>Konfirmasi Password Baru</Label>
              <Input type="password" placeholder="Konfirmasi password baru" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Password harus minimal 8 karakter dan mengandung huruf, angka, dan simbol
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowPasswordModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  alert("Password berhasil diubah!");
                  setShowPasswordModal(false);
                }}
              >
                Ubah Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Keluar dari Akun?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-gray-600">
              Apakah Anda yakin ingin keluar dari akun? Anda perlu login kembali untuk mengakses aplikasi.
            </p>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
