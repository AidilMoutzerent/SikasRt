import { useState } from "react";
import { Search, UserPlus, Edit, Trash2, Eye, Filter, Download, Phone, MoreVertical, Shield, Recycle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { toast } from "sonner@2.0.3";
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

interface Petugas {
  id: number;
  nama: string;
  nik: string;
  jabatan: string;
  telp: string;
  email: string;
  status: string;
  mulaiTugas: string;
  avatar: string;
}

export function ManajemenPetugasPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState<Petugas | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJabatan, setFilterJabatan] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    jabatan: "",
    telp: "",
    email: "",
    alamat: "",
    mulaiTugas: "",
    gaji: "",
    status: "aktif"
  });

  const [petugasData, setPetugasData] = useState<Petugas[]>([
    {
      id: 1,
      nama: "Joko Susanto",
      nik: "3201234567891240",
      jabatan: "Petugas Bank Sampah",
      telp: "0812-1111-2222",
      email: "joko@email.com",
      status: "Aktif",
      mulaiTugas: "2023-01-15",
      avatar: "Joko"
    },
    {
      id: 2,
      nama: "Rina Kusuma",
      nik: "3201234567891241",
      jabatan: "Petugas Bank Sampah",
      telp: "0813-2222-3333",
      email: "rina@email.com",
      status: "Aktif",
      mulaiTugas: "2023-03-20",
      avatar: "Rina"
    },
    {
      id: 3,
      nama: "Budi Hartono",
      nik: "3201234567891242",
      jabatan: "Keamanan",
      telp: "0814-3333-4444",
      email: "budi.h@email.com",
      status: "Aktif",
      mulaiTugas: "2022-06-10",
      avatar: "BudiH"
    },
    {
      id: 4,
      nama: "Taufik Rahman",
      nik: "3201234567891243",
      jabatan: "Keamanan",
      telp: "0815-4444-5555",
      email: "taufik@email.com",
      status: "Aktif",
      mulaiTugas: "2022-08-05",
      avatar: "Taufik"
    },
    {
      id: 5,
      nama: "Sari Dewi",
      nik: "3201234567891244",
      jabatan: "Kebersihan",
      telp: "0816-5555-6666",
      email: "sari@email.com",
      status: "Cuti",
      mulaiTugas: "2023-02-15",
      avatar: "Sari"
    },
  ]);

  const handleViewDetail = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setShowDetailModal(true);
  };

  const handleEdit = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setFormData({
      nama: petugas.nama,
      nik: petugas.nik,
      jabatan: petugas.jabatan,
      telp: petugas.telp,
      email: petugas.email,
      alamat: "",
      mulaiTugas: petugas.mulaiTugas,
      gaji: "",
      status: petugas.status.toLowerCase()
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (petugas: Petugas) => {
    setSelectedPetugas(petugas);
    setShowDeleteDialog(true);
  };

  const handleAddPetugas = () => {
    if (!formData.nama || !formData.nik || !formData.jabatan) {
      toast.error("Mohon lengkapi data yang diperlukan!");
      return;
    }

    const newPetugas: Petugas = {
      id: petugasData.length + 1,
      nama: formData.nama,
      nik: formData.nik,
      jabatan: formData.jabatan,
      telp: formData.telp,
      email: formData.email,
      status: formData.status === "aktif" ? "Aktif" : "Cuti",
      mulaiTugas: formData.mulaiTugas,
      avatar: formData.nama
    };

    setPetugasData([...petugasData, newPetugas]);
    toast.success(`Petugas ${formData.nama} berhasil ditambahkan!`);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdatePetugas = () => {
    if (!selectedPetugas) return;

    const updatedData = petugasData.map(p =>
      p.id === selectedPetugas.id
        ? {
            ...p,
            nama: formData.nama,
            nik: formData.nik,
            jabatan: formData.jabatan,
            telp: formData.telp,
            email: formData.email,
            status: formData.status === "aktif" ? "Aktif" : "Cuti",
            mulaiTugas: formData.mulaiTugas
          }
        : p
    );

    setPetugasData(updatedData);
    toast.success(`Data ${formData.nama} berhasil diperbarui!`);
    setShowEditModal(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedPetugas) return;

    const updatedData = petugasData.filter(p => p.id !== selectedPetugas.id);
    setPetugasData(updatedData);
    toast.success(`Petugas ${selectedPetugas.nama} berhasil dihapus!`);
    setShowDeleteDialog(false);
    setSelectedPetugas(null);
  };

  const handleHubungi = (petugas: Petugas) => {
    window.open(`https://wa.me/${petugas.telp.replace(/[^0-9]/g, '')}`, '_blank');
    toast.success(`Membuka WhatsApp untuk ${petugas.nama}`);
  };

  const handleExport = () => {
    toast.success("Data petugas berhasil diexport!");
    // Implement actual export logic here
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      nik: "",
      jabatan: "",
      telp: "",
      email: "",
      alamat: "",
      mulaiTugas: "",
      gaji: "",
      status: "aktif"
    });
    setSelectedPetugas(null);
  };

  // Filter data
  const filteredData = petugasData.filter(petugas => {
    const matchSearch = petugas.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       petugas.nik.includes(searchQuery) ||
                       petugas.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterJabatan === "all" || petugas.jabatan === filterJabatan;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Petugas</h1>
            <p className="text-gray-600">Kelola data petugas RT 05 / RW 02</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowAddModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Petugas
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Petugas</p>
                  <h3 className="text-gray-900">5</h3>
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
                  <p className="text-sm text-gray-600">Petugas Bank Sampah</p>
                  <h3 className="text-gray-900">2</h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Keamanan</p>
                  <h3 className="text-gray-900">2</h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kebersihan</p>
                  <h3 className="text-gray-900">1</h3>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari nama, NIK, atau jabatan..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterJabatan} onValueChange={setFilterJabatan}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jabatan</SelectItem>
                  <SelectItem value="Petugas Bank Sampah">Petugas Bank Sampah</SelectItem>
                  <SelectItem value="Keamanan">Keamanan</SelectItem>
                  <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Petugas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Petugas</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Mulai Tugas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((petugas) => (
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
                      <TableCell className="text-gray-600">{petugas.nik}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            petugas.jabatan === "Petugas Bank Sampah"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : petugas.jabatan === "Keamanan"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "bg-orange-50 text-orange-700 border-orange-300"
                          }
                        >
                          {petugas.jabatan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{petugas.telp}</TableCell>
                      <TableCell className="text-gray-600">{petugas.mulaiTugas}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            petugas.status === "Aktif" 
                              ? "bg-green-100 text-green-700 border-green-300" 
                              : "bg-orange-100 text-orange-700 border-orange-300"
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
                            <DropdownMenuItem onClick={() => handleHubungi(petugas)}>
                              <Phone className="w-4 h-4 mr-2" />
                              Hubungi
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(petugas)}>
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

      {/* Add Petugas Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Petugas Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input 
                  placeholder="Masukkan NIK" 
                  value={formData.nik}
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input 
                  placeholder="Masukkan nama lengkap" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Nomor Telepon</Label>
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
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petugas Bank Sampah">Petugas Bank Sampah</SelectItem>
                    <SelectItem value="Keamanan">Keamanan</SelectItem>
                    <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mulai Tugas</Label>
                <Input 
                  type="date" 
                  value={formData.mulaiTugas}
                  onChange={(e) => setFormData({...formData, mulaiTugas: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Alamat Lengkap</Label>
                <Input 
                  placeholder="Jl. Nama Jalan No. XX" 
                  value={formData.alamat}
                  onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="cuti">Cuti</SelectItem>
                    <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gaji/Honorarium</Label>
                <Input 
                  type="number" 
                  placeholder="Masukkan nominal" 
                  value={formData.gaji}
                  onChange={(e) => setFormData({...formData, gaji: e.target.value})}
                />
              </div>
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

      {/* Detail Petugas Modal */}
      {selectedPetugas && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
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
                  <Badge 
                    variant="outline"
                    className={
                      selectedPetugas.jabatan === "Petugas Bank Sampah"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : selectedPetugas.jabatan === "Keamanan"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-orange-50 text-orange-700 border-orange-300"
                    }
                  >
                    {selectedPetugas.jabatan}
                  </Badge>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">NIK</p>
                  <p className="text-gray-900">{selectedPetugas.nik}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                  <p className="text-gray-900">{selectedPetugas.telp}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{selectedPetugas.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Mulai Tugas</p>
                  <p className="text-gray-900">{selectedPetugas.mulaiTugas}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge 
                    className={
                      selectedPetugas.status === "Aktif" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {selectedPetugas.status}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setShowDetailModal(false);
                  handleEdit(selectedPetugas);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Data
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleHubungi(selectedPetugas)}>
                  <Phone className="w-4 h-4 mr-2" />
                  Hubungi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Petugas Modal */}
      {selectedPetugas && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Data Petugas</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input 
                    placeholder="Masukkan NIK" 
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input 
                    placeholder="Masukkan nama lengkap" 
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nomor Telepon</Label>
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
                      <SelectValue placeholder="Pilih jabatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petugas Bank Sampah">Petugas Bank Sampah</SelectItem>
                      <SelectItem value="Keamanan">Keamanan</SelectItem>
                      <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mulai Tugas</Label>
                  <Input 
                    type="date" 
                    value={formData.mulaiTugas}
                    onChange={(e) => setFormData({...formData, mulaiTugas: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="cuti">Cuti</SelectItem>
                      <SelectItem value="nonaktif">Non-Aktif</SelectItem>
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
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleUpdatePetugas}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Petugas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus petugas <strong>{selectedPetugas?.nama}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}