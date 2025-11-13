import { CheckCircle2, AlertCircle, Inbox } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function StatusIuranCard() {
  // Data akan diambil dari API - saat ini kosong
  const hasIuran = false;
  const iuranData = null;
  
  if (!hasIuran) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center py-6">
            <Inbox className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-gray-900 mb-2">Belum Ada Iuran</h3>
            <p className="text-gray-600 text-sm max-w-md">
              Saat ini belum ada tagihan iuran untuk Anda. Tagihan iuran akan dibuat oleh admin RT dan akan muncul di sini.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Jika ada data iuran, tampilkan kartu iuran
  const isLunas = iuranData?.status === "lunas";
  
  return (
    <Card className={`border-2 ${isLunas ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-gray-900">Iuran Bulan Ini</h3>
              {isLunas ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{iuranData?.periode}</p>
            
            <Badge 
              className={`${
                isLunas 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isLunas ? "LUNAS" : "BELUM LUNAS"}
            </Badge>
            
            {!isLunas && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">Jumlah yang harus dibayar:</p>
                <p className="text-2xl text-gray-900">
                  Rp {iuranData?.jumlah?.toLocaleString("id-ID") || 0}
                </p>
              </div>
            )}
            
            {isLunas && (
              <div className="mt-4">
                <p className="text-sm text-green-700">
                  Terima kasih! Iuran bulan ini sudah dibayar
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
