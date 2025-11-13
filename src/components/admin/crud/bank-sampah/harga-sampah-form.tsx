import { Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";

interface HargaSampahFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    jenis: string;
    kategori: string;
    harga: string;
    satuan: string;
  };
  onChange: (field: string, value: string) => void;
  mode: "create" | "edit";
}

export function HargaSampahForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  mode,
}: HargaSampahFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Jenis Sampah" : "Edit Harga Sampah"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Jenis Sampah</Label>
            <Input
              placeholder="Contoh: Plastik, Kertas, Logam"
              value={formData.jenis}
              onChange={(e) => onChange("jenis", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Input
              placeholder="Contoh: PET, HDPE, HVS"
              value={formData.kategori}
              onChange={(e) => onChange("kategori", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Harga per Kilogram</Label>
            <Input
              type="number"
              placeholder="0"
              value={formData.harga}
              onChange={(e) => onChange("harga", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Satuan</Label>
            <Input value={formData.satuan} disabled />
          </div>

          {mode === "create" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Harga yang diinput akan langsung berlaku untuk semua transaksi
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={onSubmit}
            >
              {mode === "create" ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Simpan
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
