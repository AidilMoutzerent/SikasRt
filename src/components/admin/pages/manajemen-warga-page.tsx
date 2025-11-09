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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

export function ManajemenWargaPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<any>(null);

  const wargaData = [
    {
      id: 1,
      nama: "Budi Santoso",
      nik: "3201234567891234",
      alamat: "Jl. Melati No. 15",
      telp: "0812-3456-7890",
      email: "budi@email.com",
      status: "Aktif",
      iuran: "Lunas",
      avatar: "Budi"
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
      avatar: "Siti"
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
      avatar: "Andi"
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
      avatar: "Dewi"
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
      avatar: "Rudi"
    },
  ];

  const handleViewDetail = (warga: any) => {
    setSelectedWarga(warga);
    setShowDetailModal(true);
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
            onClick={() => setShowAddModal(true)}
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
                  <h3 className="text-gray-900">150</h3>
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
                  <h3 className="text-gray-900">148</h3>
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
                  <p className="text-sm text-gray-600">Warga Baru (Bulan Ini)</p>
                  <h3 className="text-gray-900">5</h3>
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
            <CardTitle>Daftar Warga</CardTitle>
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
                  {wargaData.map((warga) => (
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
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Kirim Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Warga Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input placeholder="Masukkan NIK" />
              </div>

              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input placeholder="Masukkan nama lengkap" />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>

              <div className="space-y-2">
                <Label>Nomor Telepon</Label>
                <Input placeholder="08xx-xxxx-xxxx" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Alamat Lengkap</Label>
                <Input placeholder="Jl. Nama Jalan No. XX" />
              </div>

              <div className="space-y-2">
                <Label>RT</Label>
                <Input defaultValue="05" disabled />
              </div>

              <div className="space-y-2">
                <Label>RW</Label>
                <Input defaultValue="02" disabled />
              </div>

              <div className="space-y-2">
                <Label>Status Kepemilikan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pemilik">Pemilik Rumah</SelectItem>
                    <SelectItem value="kontrak">Kontrak</SelectItem>
                    <SelectItem value="kost">Kost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status Warga</Label>
                <Select defaultValue="aktif">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  alert("Warga berhasil ditambahkan!");
                  setShowAddModal(false);
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Warga
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Warga Modal */}
      {selectedWarga && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
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
                  <Badge className="bg-green-100 text-green-700">Warga Aktif</Badge>
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
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Data
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
