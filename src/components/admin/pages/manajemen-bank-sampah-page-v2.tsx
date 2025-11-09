import { useState } from "react";
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Weight, Recycle, Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

interface HargaSampah {
  id: number;
  jenis: string;
  kategori: string;
  harga: number;
  satuan: string;
  status: string;
}

interface Setoran {
  id: number;
  warga: string;
  avatar: string;
  tanggal: string;
  items: Array<{ jenis: string; berat: number; harga: number }>;
  total: number;
  petugas: string;
}

export function ManajemenBankSampahPage() {
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [showSetoranDetail, setShowSetoranDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedHarga, setSelectedHarga] = useState<HargaSampah | null>(null);
  const [selectedSetoran, setSelectedSetoran] = useState<Setoran | null>(null);

  // Form state
  const [formHarga, setFormHarga] = useState({
    jenis: "",
    kategori: "",
    harga: "",
    satuan: "kg"
  });

  // Data harga sampah
  const [hargaSampah, setHargaSampah] = useState<HargaSampah[]>([
    { id: 1, jenis: "Plastik", kategori: "PET", harga: 3000, satuan: "kg", status: "Aktif" },
    { id: 2, jenis: "Plastik", kategori: "HDPE", harga: 2500, satuan: "kg", status: "Aktif" },
    { id: 3, jenis: "Kertas", kategori: "HVS", harga: 1500, satuan: "kg", status: "Aktif" },
    { id: 4, jenis: "Kertas", kategori: "Koran", harga: 1000, satuan: "kg", status: "Aktif" },
    { id: 5, jenis: "Logam", kategori: "Aluminium", harga: 15000, satuan: "kg", status: "Aktif" },
    { id: 6, jenis: "Logam", kategori: "Besi", harga: 5000, satuan: "kg", status: "Aktif" },
    { id: 7, jenis: "Kaca", kategori: "Botol", harga: 500, satuan: "kg", status: "Aktif" },
  ]);

  // Data setoran
  const setoranData: Setoran[] = [
    {
      id: 1,
      warga: "Budi Santoso",
      avatar: "Budi",
      tanggal: "2024-11-08",
      items: [
        { jenis: "Plastik PET", berat: 2.5, harga: 3000 },
        { jenis: "Kertas HVS", berat: 1.0, harga: 1500 }
      ],
      total: 9000,
      petugas: "Joko Susanto"
    },
    {
      id: 2,
      warga: "Siti Nurhaliza",
      avatar: "Siti",
      tanggal: "2024-11-07",
      items: [
        { jenis: "Aluminium", berat: 0.5, harga: 15000 }
      ],
      total: 7500,
      petugas: "Rina Kusuma"
    },
    {
      id: 3,
      warga: "Dewi Lestari",
      avatar: "Dewi",
      tanggal: "2024-11-07",
      items: [
        { jenis: "Plastik PET", berat: 3.0, harga: 3000 },
        { jenis: "Koran", berat: 2.5, harga: 1000 }
      ],
      total: 11500,
      petugas: "Joko Susanto"
    },
  ];

  // Data untuk chart
  const chartData = [
    { bulan: "Mei", total: 1200000, berat: 450 },
    { bulan: "Jun", total: 1350000, berat: 520 },
    { bulan: "Jul", total: 1180000, berat: 480 },
    { bulan: "Agu", total: 1450000, berat: 580 },
    { bulan: "Sep", total: 1520000, berat: 610 },
    { bulan: "Oct", total: 1380000, berat: 550 },
  ];

  // Handlers
  const handleViewSetoran = (setoran: Setoran) => {
    setSelectedSetoran(setoran);
    setShowSetoranDetail(true);
  };

  const handleAddHarga = () => {
    if (!formHarga.jenis || !formHarga.kategori || !formHarga.harga) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const newHarga: HargaSampah = {
      id: hargaSampah.length + 1,
      jenis: formHarga.jenis,
      kategori: formHarga.kategori,
      harga: parseInt(formHarga.harga),
      satuan: formHarga.satuan,
      status: "Aktif"
    };

    setHargaSampah([...hargaSampah, newHarga]);
    toast.success(`Harga ${formHarga.kategori} berhasil ditambahkan!`);
    setShowPriceModal(false);
    resetFormHarga();
  };

  const handleEditHarga = (harga: HargaSampah) => {
    setSelectedHarga(harga);
    setFormHarga({
      jenis: harga.jenis,
      kategori: harga.kategori,
      harga: harga.harga.toString(),
      satuan: harga.satuan
    });
    setShowEditPriceModal(true);
  };

  const handleUpdateHarga = () => {
    if (!selectedHarga) return;

    const updatedData = hargaSampah.map(h =>
      h.id === selectedHarga.id
        ? {
            ...h,
            jenis: formHarga.jenis,
            kategori: formHarga.kategori,
            harga: parseInt(formHarga.harga),
            satuan: formHarga.satuan
          }
        : h
    );

    setHargaSampah(updatedData);
    toast.success("Harga berhasil diperbarui!");
    setShowEditPriceModal(false);
    resetFormHarga();
  };

  const handleDeleteClick = (harga: HargaSampah) => {
    setSelectedHarga(harga);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedHarga) return;

    const updatedData = hargaSampah.filter(h => h.id !== selectedHarga.id);
    setHargaSampah(updatedData);
    toast.success(`Harga ${selectedHarga.kategori} berhasil dihapus!`);
    setShowDeleteDialog(false);
    setSelectedHarga(null);
  };

  const resetFormHarga = () => {
    setFormHarga({
      jenis: "",
      kategori: "",
      harga: "",
      satuan: "kg"
    });
    setSelectedHarga(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Bank Sampah</h1>
            <p className="text-gray-600">Kelola harga sampah dan setoran warga</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowPriceModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jenis Sampah
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Setoran Bulan Ini</p>
                  <h3 className="text-gray-900">Rp 1,38 Jt</h3>
                  <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>+8% dari bulan lalu</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Berat Bulan Ini</p>
                  <h3 className="text-gray-900">550 Kg</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <span>143 transaksi</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Weight className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jenis Sampah</p>
                  <h3 className="text-gray-900">{hargaSampah.length} Jenis</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <span>4 kategori</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Warga Aktif</p>
                  <h3 className="text-gray-900">87 Warga</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <span>58% dari total</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Setoran (6 Bulan Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="total" stroke="#10b981" name="Total Nilai (Rp)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="berat" stroke="#3b82f6" name="Total Berat (Kg)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="harga">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="harga">Daftar Harga Sampah</TabsTrigger>
                <TabsTrigger value="setoran">Riwayat Setoran</TabsTrigger>
              </TabsList>

              <TabsContent value="harga" className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis Sampah</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hargaSampah.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-gray-900">{item.jenis}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                              {item.kategori}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-900">Rp {item.harga.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-600">per {item.satuan}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700 border-green-300" variant="outline">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditHarga(item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteClick(item)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="setoran" className="mt-4 space-y-3">
                {setoranData.map((setoran) => (
                  <div key={setoran.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${setoran.avatar}`} />
                        <AvatarFallback>{setoran.warga.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-gray-900">{setoran.warga}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{setoran.tanggal}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">Petugas: {setoran.petugas}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-gray-900">Rp {setoran.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{setoran.items.length} jenis sampah</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewSetoran(setoran)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Price Modal */}
      <Dialog open={showPriceModal} onOpenChange={setShowPriceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Jenis Sampah</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Jenis Sampah</Label>
              <Input 
                placeholder="Contoh: Plastik, Kertas, Logam" 
                value={formHarga.jenis}
                onChange={(e) => setFormHarga({...formHarga, jenis: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input 
                placeholder="Contoh: PET, HDPE, HVS" 
                value={formHarga.kategori}
                onChange={(e) => setFormHarga({...formHarga, kategori: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Harga per Kilogram</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formHarga.harga}
                onChange={(e) => setFormHarga({...formHarga, harga: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Satuan</Label>
              <Input value={formHarga.satuan} disabled />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Harga yang diinput akan langsung berlaku untuk semua transaksi
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowPriceModal(false);
                  resetFormHarga();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAddHarga}
              >
                <Plus className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Price Modal */}
      {selectedHarga && (
        <Dialog open={showEditPriceModal} onOpenChange={setShowEditPriceModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Harga Sampah</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Sampah</Label>
                <Input 
                  placeholder="Contoh: Plastik, Kertas, Logam" 
                  value={formHarga.jenis}
                  onChange={(e) => setFormHarga({...formHarga, jenis: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Input 
                  placeholder="Contoh: PET, HDPE, HVS" 
                  value={formHarga.kategori}
                  onChange={(e) => setFormHarga({...formHarga, kategori: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Harga per Kilogram</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={formHarga.harga}
                  onChange={(e) => setFormHarga({...formHarga, harga: e.target.value})}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowEditPriceModal(false);
                    resetFormHarga();
                  }}
                >
                  Batal
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleUpdateHarga}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Setoran Modal */}
      {selectedSetoran && (
        <Dialog open={showSetoranDetail} onOpenChange={setShowSetoranDetail}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detail Setoran</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Warga Info */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSetoran.avatar}`} />
                  <AvatarFallback>{selectedSetoran.warga.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">{selectedSetoran.warga}</p>
                  <p className="text-sm text-gray-600">{selectedSetoran.tanggal}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Rincian Sampah</p>
                <div className="space-y-2">
                  {selectedSetoran.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900">{item.jenis}</p>
                        <p className="text-sm text-gray-600">{item.berat} kg × Rp {item.harga.toLocaleString()}</p>
                      </div>
                      <p className="text-gray-900">Rp {(item.berat * item.harga).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-gray-900">Total Nilai</p>
                <h3 className="text-green-700">Rp {selectedSetoran.total.toLocaleString()}</h3>
              </div>

              {/* Petugas */}
              <div className="text-sm text-gray-600">
                Dicatat oleh: <span className="text-gray-900">{selectedSetoran.petugas}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Harga Sampah</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus harga <strong>{selectedHarga?.kategori}</strong>? 
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