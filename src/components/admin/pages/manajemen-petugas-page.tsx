import { useState } from "react";
import { Plus, Edit, Trash2, Eye, UserPlus, Phone, Mail, Shield, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { toast } from "sonner@2.0.3";

interface Petugas {
  id: number;
  nama: string;
  email: string;
  telp: string;
  jabatan: string;
  status: "Aktif" | "Non-Aktif";
  avatar: string;
  totalTransaksi?: number;
  bergabung: string;
}

export function ManajemenPetugasPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState<Petugas | null>(null);

  const [petugasData, setPetugasData] = useState<Petugas[]>([
    {
      id: 1,
      nama: "Joko Susanto",
      email: "joko@banksampah.rt05.id",
      telp: "0812-3456-7890",
      jabatan: "Petugas Bank Sampah",
      status: "Aktif",
      avatar: "Joko",
      totalTransaksi: 145,
      bergabung: "2023-01-15"
    },
    {
      id: 2,
      nama: "Rina Kusuma",
      email: "rina@banksampah.rt05.id",
      telp: "0813-4567-8901",
      jabatan: "Petugas Bank Sampah",
      status: "Aktif",
      avatar: "Rina",
      totalTransaksi: 132,
      bergabung: "2023-03-20"
    },
    {
      id: 3,
      nama: "Ahmad Rizki",
      email: "ahmad@banksampah.rt05.id",
      telp: "0814-5678-9012",
      jabatan: "Petugas Bank Sampah",
      status: "Aktif",
      avatar: "Ahmad",
      totalTransaksi: 98,
      bergabung: "2023-06-10"
    },
  ]);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telp: "",
    jabatan: "Petugas Bank Sampah",
    status: "Aktif" as const,
    password: ""
  });

  const petugasAktif = petugasData.filter(p => p.status === "Aktif");
  const totalTransaksi = petugasData.reduce((sum, p) => sum + (p.totalTransaksi || 0), 0);

  const handleViewDetail = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setShowDetailModal(true);
  };

  const handleEdit = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setFormData({
      nama: petugas.nama,
      email: petugas.email,
      telp: petugas.telp,
      jabatan: petugas.jabatan,
      status: petugas.status,
      password: ""
    });
    setShowEditModal(true);
  };

  const handleDelete = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedPetugas) {
      setPetugasData(petugasData.filter(p => p.id !== selectedPetugas.id));
      toast.success(`Petugas ${selectedPetugas.nama} berhasil dihapus!`);
      setShowDeleteDialog(false);
      setSelectedPetugas(null);
    }
  };

  const handleAddPetugas = () => {
    if (!formData.nama || !formData.email || !formData.telp || !formData.password) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const newPetugas: Petugas = {
      id: Math.max(...petugasData.map(p => p.id)) + 1,
      nama: formData.nama,
      email: formData.email,
      telp: formData.telp,
      jabatan: formData.jabatan,
      status: formData.status,
      avatar: formData.nama,
      totalTransaksi: 0,
      bergabung: new Date().toISOString().split('T')[0]
    };

    setPetugasData([...petugasData, newPetugas]);
    toast.success("Petugas berhasil ditambahkan!");
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdatePetugas = () => {
    if (!selectedPetugas) return;

    if (!formData.nama || !formData.email || !formData.telp) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const updatedData = petugasData.map(p =>
      p.id === selectedPetugas.id
        ? {
            ...p,
            nama: formData.nama,
            email: formData.email,
            telp: formData.telp,
            jabatan: formData.jabatan,
            status: formData.status,
            avatar: formData.nama
          }
        : p
    );

    setPetugasData(updatedData);
    toast.success("Data petugas berhasil diupdate!");
    setShowEditModal(false);
    setSelectedPetugas(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      email: "",
      telp: "",
      jabatan: "Petugas Bank Sampah",
      status: "Aktif",
      password: ""
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Petugas</h1>
            <p className="text-gray-600">Kelola data petugas bank sampah RT 05 / RW 02</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Petugas
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Petugas</p>
                  <h3 className="text-gray-900">{petugasData.length}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Petugas Aktif</p>
                  <h3 className="text-gray-900">{petugasAktif.length}</h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transaksi</p>
                  <h3 className="text-gray-900">{totalTransaksi}</h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Petugas ({petugasData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Petugas</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Total Transaksi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {petugasData.map((petugas) => (
                    <TableRow key={petugas.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${petugas.avatar}`} />
                            <AvatarFallback>{petugas.nama.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-gray-900">{petugas.nama}</p>
                            <p className="text-sm text-gray-600">{petugas.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          {petugas.jabatan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{petugas.telp}</TableCell>
                      <TableCell className="text-gray-900">{petugas.totalTransaksi || 0} transaksi</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            petugas.status === "Aktif"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          }
                          variant="outline"
                        >
                          {petugas.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(petugas)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(petugas)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(petugas)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Tambah Petugas Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Lengkap *</Label>
                <Input 
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Nomor Telepon *</Label>
                <Input 
                  placeholder="08xx-xxxx-xxxx"
                  value={formData.telp}
                  onChange={(e) => setFormData({...formData, telp: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Select value={formData.jabatan} onValueChange={(value) => setFormData({...formData, jabatan: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petugas Bank Sampah">Petugas Bank Sampah</SelectItem>
                    <SelectItem value="Koordinator Bank Sampah">Koordinator Bank Sampah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input 
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Petugas akan mendapatkan akses untuk mencatat transaksi bank sampah
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAddPetugas}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Petugas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Data Petugas</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Lengkap *</Label>
                <Input 
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Nomor Telepon *</Label>
                <Input 
                  placeholder="08xx-xxxx-xxxx"
                  value={formData.telp}
                  onChange={(e) => setFormData({...formData, telp: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Select value={formData.jabatan} onValueChange={(value) => setFormData({...formData, jabatan: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petugas Bank Sampah">Petugas Bank Sampah</SelectItem>
                    <SelectItem value="Koordinator Bank Sampah">Koordinator Bank Sampah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Password Baru (Kosongkan jika tidak ingin mengubah)</Label>
                <Input 
                  type="password"
                  placeholder="Masukkan password baru"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdatePetugas}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedPetugas && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Detail Petugas</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPetugas.avatar}`} />
                  <AvatarFallback>{selectedPetugas.nama.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-gray-900 mb-1">{selectedPetugas.nama}</h3>
                  <Badge className={
                    selectedPetugas.status === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }>
                    {selectedPetugas.status}
                  </Badge>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{selectedPetugas.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{selectedPetugas.telp}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Jabatan</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {selectedPetugas.jabatan}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
                  <p className="text-gray-900">{selectedPetugas.totalTransaksi || 0} transaksi</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Bergabung Sejak</p>
                  <p className="text-gray-900">{new Date(selectedPetugas.bergabung).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedPetugas);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Data
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDelete(selectedPetugas);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Petugas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus petugas <strong>{selectedPetugas?.nama}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
