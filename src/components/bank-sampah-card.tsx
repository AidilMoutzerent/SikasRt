import { Coins, Recycle, History, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function BankSampahCard() {
  // Data akan diambil dari API - saat ini kosong
  const saldo = 0;
  const totalSetoran = 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Recycle className="w-5 h-5 text-green-600" />
          </div>
          <CardTitle>Saldo Bank Sampah Anda</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Total Saldo</p>
          <p className="text-3xl mb-1">Rp {saldo.toLocaleString("id-ID")}</p>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Coins className="w-4 h-4" />
            <span>Dari {totalSetoran} kali setoran</span>
          </div>
        </div>
        
        {totalSetoran === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-blue-400" />
            <p className="text-sm text-blue-900 mb-2">
              <span className="font-medium">Belum Ada Setoran</span>
            </p>
            <p className="text-xs text-blue-700">
              Setor sampah Anda ke petugas bank sampah untuk mulai mengumpulkan saldo. Hubungi petugas untuk jadwal penjemputan.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            disabled
          >
            <Recycle className="w-4 h-4" />
            Setor Sampah
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            disabled
          >
            <History className="w-4 h-4" />
            Lihat Riwayat
          </Button>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            💡 <span className="font-medium">Info:</span> Setoran sampah diinput oleh petugas bank sampah setelah sampah Anda ditimbang dan dihitung.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
