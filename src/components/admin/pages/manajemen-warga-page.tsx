import { useState } from "react";
import { Search, UserPlus, Edit, Trash2, Eye, Filter, Download, Mail, Phone, MapPin, MoreVertical } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
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
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { toast } from "sonner@2.0.3";

interface Warga {
  id: number;
  nama: string;
  nik: string;
  alamat: string;
  telp: string;
  email: string;
  status: string;
  iuran: string;
  avatar: string;
  rt: string;
  rw: string;
  statusKepemilikan: string;
}

export function ManajemenWargaPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [wargaData, setWargaData] = useState<Warga[]>([
    {
      id: 1,
      nama: "Budi Santoso",
      nik: "3201234567891234",
      alamat: "Jl. Melati No. 15",
      telp: "0812-3456-7890",
      email: "budi@email.com",
      status: "Aktif",
      iuran: "Lunas",
      avatar: "Budi",
      rt: "05",
      rw: "02",
      statusKepemilikan: "Pemilik Rumah"
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      nik: "3201234567891235",
      alamat: "Jl. Mawar No. 20",
      telp: "0813-4567-8901",
      email: "siti@email.com",
      status: "Aktif",
      iuran: "Belum Bayar",
      avatar: "Siti",
      rt: "05",
      rw: "02",
      statusKepemilikan: "Pemilik Rumah"
    },
    {
      id: 3,
      nama: "Andi Wijaya",
      nik: "3201234567891236",
      alamat: "Jl. Anggrek No. 8",
      telp: "0814-5678-9012",
      email: "andi@email.com",
      status: "Aktif",
      iuran: "Lunas",
      avatar: "Andi",
      rt: "05",
      rw: "02",
      statusKepemilikan: "Kontrak"
    },
    {
      id: 4,
      nama: "Dewi Lestari",
      nik: "3201234567891237",
      alamat: "Jl. Dahlia No. 12",
      telp: "0815-6789-0123",
      email: "dewi@email.com",
      status: "Aktif",
      iuran: "Lunas",
      avatar: "Dewi",
      rt: "05",
      rw: "02",
      statusKepemilikan: "Pemilik Rumah"
    },
    {
      id: 5,
      nama: "Rudi Hermawan",
      nik: "3201234567891238",
      alamat: "Jl. Kenanga No. 5",
      telp: "0816-7890-1234",
      email: "rudi@email.com",
      status: "Aktif",
      iuran: "Belum Bayar",
      avatar: "Rudi",
      rt: "05",
      rw: "02",
      statusKepemilikan: "Kost"
    },
  ]);

  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    email: "",
    telp: "",
    alamat: "",
    rt: "05",
    rw: "02",
    statusKepemilikan: "",
    status: "Aktif"
  });

  // Filter warga based on search
  const filteredWarga = wargaData.filter(warga => 
    warga.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warga.nik.includes(searchQuery) ||
    warga.alamat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetail = (warga: Warga) => {
    setSelectedWarga(warga);
    setShowDetailModal(true);
  };

  const handleEdit = (warga: Warga) => {
    setSelectedWarga(warga);
    setFormData({
      nama: warga.nama,
      nik: warga.nik,
      email: warga.email,
      telp: warga.telp,
      alamat: warga.alamat,
      rt: warga.rt,
      rw: warga.rw,
      statusKepemilikan: warga.statusKepemilikan,
      status: warga.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (warga: Warga) => {
    setSelectedWarga(warga);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedWarga) {
      setWargaData(wargaData.filter(w => w.id !== selectedWarga.id));
      toast.success(`Data ${selectedWarga.nama} berhasil dihapus`);
      setShowDeleteDialog(false);
      setSelectedWarga(null);
    }
  };

  const handleAddWarga = () => {
    if (!formData.nama || !formData.nik || !formData.email || !formData.telp || !formData.alamat || !formData.statusKepemilikan) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const newWarga: Warga = {
      id: Math.max(...wargaData.map(w => w.id)) + 1,
      nama: formData.nama,
      nik: formData.nik,
      email: formData.email,
      telp: formData.telp,
      alamat: formData.alamat,
      rt: formData.rt,
      rw: formData.rw,
      statusKepemilikan: formData.statusKepemilikan,
      status: formData.status,
      iuran: "Belum Bayar",
      avatar: formData.nama
    };

    setWargaData([...wargaData, newWarga]);
    toast.success("Warga berhasil ditambahkan!");
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateWarga = () => {
    if (!selectedWarga) return;
    
    if (!formData.nama || !formData.nik || !formData.email || !formData.telp || !formData.alamat || !formData.statusKepemilikan) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const updatedWarga = wargaData.map(w => 
      w.id === selectedWarga.id 
        ? {
            ...w,
            nama: formData.nama,
            nik: formData.nik,
            email: formData.email,
            telp: formData.telp,
            alamat: formData.alamat,
            statusKepemilikan: formData.statusKepemilikan,
            status: formData.status,
            avatar: formData.nama
          }
        : w
    );

    setWargaData(updatedWarga);
    toast.success("Data warga berhasil diupdate!");
    setShowEditModal(false);
    setSelectedWarga(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      nik: "",
      email: "",
      telp: "",
      alamat: "",
      rt: "05",
      rw: "02",
      statusKepemilikan: "",
      status: "Aktif"
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Warga</h1>
            <p className="text-gray-600">Kelola data warga RT 05 / RW 02</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Warga
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Warga</p>
                  <h3 className="text-gray-900">{wargaData.length}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Warga Aktif</p>
                  <h3 className="text-gray-900">{wargaData.filter(w => w.status === "Aktif").length}</h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Badge className="w-5 h-5 bg-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Iuran Lunas</p>
                  <h3 className="text-gray-900">{wargaData.filter(w => w.iuran === "Lunas").length}</h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-600" />
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
                  placeholder="Cari nama, NIK, atau alamat..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Warga ({filteredWarga.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warga</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Status Iuran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarga.map((warga) => (
                    <TableRow key={warga.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${warga.avatar}`} />
                            <AvatarFallback>{warga.nama.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-gray-900">{warga.nama}</p>
                            <p className="text-sm text-gray-600">{warga.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{warga.nik}</TableCell>
                      <TableCell className="text-gray-600">{warga.alamat}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-600">{warga.telp}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            warga.iuran === "Lunas" 
                              ? "bg-green-100 text-green-700 border-green-300" 
                              : "bg-orange-100 text-orange-700 border-orange-300"
                          }
                          variant="outline"
                        >
                          {warga.iuran}
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
                            <DropdownMenuItem onClick={() => handleViewDetail(warga)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(warga)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(warga)} className="text-red-600">
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

      {/* Add Warga Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Tambah Warga Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIK *</Label>
                <Input 
                  placeholder="Masukkan NIK" 
                  value={formData.nik}
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                />
              </div>

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

              <div className="space-y-2 md:col-span-2">
                <Label>Alamat Lengkap *</Label>
                <Input 
                  placeholder="Jl. Nama Jalan No. XX" 
                  value={formData.alamat}
                  onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>RT</Label>
                <Input value={formData.rt} disabled />
              </div>

              <div className="space-y-2">
                <Label>RW</Label>
                <Input value={formData.rw} disabled />
              </div>

              <div className="space-y-2">
                <Label>Status Kepemilikan *</Label>
                <Select value={formData.statusKepemilikan} onValueChange={(value) => setFormData({...formData, statusKepemilikan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pemilik Rumah">Pemilik Rumah</SelectItem>
                    <SelectItem value="Kontrak">Kontrak</SelectItem>
                    <SelectItem value="Kost">Kost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status Warga</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
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
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAddWarga}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Warga
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Warga Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Data Warga</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIK *</Label>
                <Input 
                  placeholder="Masukkan NIK" 
                  value={formData.nik}
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                />
              </div>

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

              <div className="space-y-2 md:col-span-2">
                <Label>Alamat Lengkap *</Label>
                <Input 
                  placeholder="Jl. Nama Jalan No. XX" 
                  value={formData.alamat}
                  onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Status Kepemilikan *</Label>
                <Select value={formData.statusKepemilikan} onValueChange={(value) => setFormData({...formData, statusKepemilikan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pemilik Rumah">Pemilik Rumah</SelectItem>
                    <SelectItem value="Kontrak">Kontrak</SelectItem>
                    <SelectItem value="Kost">Kost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status Warga</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
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
                onClick={handleUpdateWarga}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Warga Modal */}
      {selectedWarga && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Detail Warga</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedWarga.avatar}`} />
                  <AvatarFallback>{selectedWarga.nama.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-gray-900 mb-1">{selectedWarga.nama}</h3>
                  <Badge className={selectedWarga.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {selectedWarga.status}
                  </Badge>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">NIK</p>
                  <p className="text-gray-900">{selectedWarga.nik}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Alamat</p>
                  <p className="text-gray-900">{selectedWarga.alamat}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Nomor Telepon</p>
                  <p className="text-gray-900">{selectedWarga.telp}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{selectedWarga.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status Kepemilikan</p>
                  <p className="text-gray-900">{selectedWarga.statusKepemilikan}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status Iuran Bulan Ini</p>
                  <Badge 
                    className={
                      selectedWarga.iuran === "Lunas" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {selectedWarga.iuran}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedWarga);
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
                    handleDelete(selectedWarga);
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Warga</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data warga <strong>{selectedWarga?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
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
