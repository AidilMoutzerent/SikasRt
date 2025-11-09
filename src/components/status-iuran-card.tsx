import { CheckCircle2, XCircle, CreditCard, QrCode, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function StatusIuranCard() {
  const [isLunas, setIsLunas] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"method" | "qris" | "transfer" | "success">("method");
  const nominal = 25000;
  
  const handleBayar = () => {
    setShowPaymentModal(true);
    setPaymentStep("method");
  };

  const handleQRISPayment = () => {
    setPaymentStep("qris");
  };

  const handleTransferPayment = () => {
    setPaymentStep("transfer");
  };

  const handleConfirmPayment = () => {
    setPaymentStep("success");
    setTimeout(() => {
      setIsLunas(true);
      setShowPaymentModal(false);
      setPaymentStep("method");
    }, 2000);
  };
  
  return (
    <>
      <Card className={`border-2 ${isLunas ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-gray-900">Iuran Bulan Ini</h3>
                {isLunas ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">November 2025</p>
              
              <Badge 
                className={`${
                  isLunas 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLunas ? "LUNAS" : "BELUM LUNAS"}
              </Badge>
              
              {!isLunas && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-1">Jumlah yang harus dibayar:</p>
                  <p className="text-2xl text-gray-900">
                    Rp {nominal.toLocaleString("id-ID")}
                  </p>
                </div>
              )}
              
              {isLunas && (
                <div className="mt-4">
                  <p className="text-sm text-green-700">
                    Terima kasih! Iuran bulan ini sudah dibayar pada 1 November 2025
                  </p>
                </div>
              )}
            </div>
            
            {!isLunas && (
              <div className="flex flex-col gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleBayar}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bayar Sekarang
                </Button>
                <p className="text-xs text-center text-gray-600">Via QRIS / Transfer Bank</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentStep === "method" && "Pilih Metode Pembayaran"}
              {paymentStep === "qris" && "Scan QRIS untuk Membayar"}
              {paymentStep === "transfer" && "Transfer Bank"}
              {paymentStep === "success" && "Pembayaran Berhasil!"}
            </DialogTitle>
          </DialogHeader>

          {paymentStep === "method" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-2">Detail Pembayaran</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Iuran November 2025</span>
                  <span className="text-gray-900">Rp {nominal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-auto py-4 justify-start bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-900"
                  onClick={handleQRISPayment}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">QRIS</p>
                      <p className="text-sm text-gray-600">Semua e-wallet & mobile banking</p>
                    </div>
                  </div>
                </Button>

                <Button
                  className="w-full h-auto py-4 justify-start bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-900"
                  onClick={handleTransferPayment}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Transfer Bank</p>
                      <p className="text-sm text-gray-600">Manual via rekening RT</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {paymentStep === "qris" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {/* QR Code placeholder */}
                    <div className="w-full h-full bg-white p-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <rect width="100" height="100" fill="white"/>
                        {/* QR pattern */}
                        <rect x="0" y="0" width="8" height="8" fill="black"/>
                        <rect x="10" y="0" width="8" height="8" fill="black"/>
                        <rect x="20" y="0" width="8" height="8" fill="black"/>
                        <rect x="0" y="10" width="8" height="8" fill="black"/>
                        <rect x="20" y="10" width="8" height="8" fill="black"/>
                        <rect x="0" y="20" width="8" height="8" fill="black"/>
                        <rect x="10" y="20" width="8" height="8" fill="black"/>
                        <rect x="20" y="20" width="8" height="8" fill="black"/>
                        {/* More QR pattern elements */}
                        <rect x="70" y="0" width="8" height="8" fill="black"/>
                        <rect x="80" y="0" width="8" height="8" fill="black"/>
                        <rect x="90" y="0" width="8" height="8" fill="black"/>
                        <rect x="70" y="10" width="8" height="8" fill="black"/>
                        <rect x="90" y="10" width="8" height="8" fill="black"/>
                        <rect x="70" y="20" width="8" height="8" fill="black"/>
                        <rect x="80" y="20" width="8" height="8" fill="black"/>
                        <rect x="90" y="20" width="8" height="8" fill="black"/>
                        {/* Bottom left corner */}
                        <rect x="0" y="70" width="8" height="8" fill="black"/>
                        <rect x="10" y="70" width="8" height="8" fill="black"/>
                        <rect x="20" y="70" width="8" height="8" fill="black"/>
                        <rect x="0" y="80" width="8" height="8" fill="black"/>
                        <rect x="20" y="80" width="8" height="8" fill="black"/>
                        <rect x="0" y="90" width="8" height="8" fill="black"/>
                        <rect x="10" y="90" width="8" height="8" fill="black"/>
                        <rect x="20" y="90" width="8" height="8" fill="black"/>
                        {/* Random pattern in middle */}
                        <rect x="40" y="40" width="8" height="8" fill="black"/>
                        <rect x="50" y="45" width="8" height="8" fill="black"/>
                        <rect x="45" y="50" width="8" height="8" fill="black"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                    <p className="text-2xl text-gray-900">Rp {nominal.toLocaleString("id-ID")}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <p>📱 Scan dengan aplikasi:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded px-2 py-1">• GoPay</div>
                    <div className="bg-white rounded px-2 py-1">• OVO</div>
                    <div className="bg-white rounded px-2 py-1">• Dana</div>
                    <div className="bg-white rounded px-2 py-1">• ShopeePay</div>
                    <div className="bg-white rounded px-2 py-1">• Mobile Banking</div>
                    <div className="bg-white rounded px-2 py-1">• LinkAja</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPaymentStep("method")}
                >
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleConfirmPayment}
                >
                  Sudah Bayar
                </Button>
              </div>

              <p className="text-xs text-center text-gray-600">
                Kode QR berlaku selama 15 menit
              </p>
            </div>
          )}

          {paymentStep === "transfer" && (
            <div className="space-y-4">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                    <p className="text-2xl text-gray-900">Rp {nominal.toLocaleString("id-ID")}</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Bank</p>
                      <p className="text-gray-900">BCA</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 mb-1">No. Rekening</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900">1234567890</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-1 px-2 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText("1234567890");
                            alert("Nomor rekening berhasil disalin!");
                          }}
                        >
                          Salin
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 mb-1">Atas Nama</p>
                      <p className="text-gray-900">Kas RT 05 RW 03</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700 bg-white rounded-lg p-4">
                  <p className="font-medium">📝 Instruksi Transfer:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Transfer ke rekening di atas</li>
                    <li>Gunakan nominal yang tepat</li>
                    <li>Simpan bukti transfer</li>
                    <li>Konfirmasi ke bendahara RT</li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPaymentStep("method")}
                >
                  Kembali
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleConfirmPayment}
                >
                  Sudah Transfer
                </Button>
              </div>

              <p className="text-xs text-center text-gray-600">
                Pembayaran akan diverifikasi oleh bendahara dalam 1x24 jam
              </p>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-gray-600 mb-4">
                Iuran November 2025 telah dibayar
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  Rp {nominal.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
