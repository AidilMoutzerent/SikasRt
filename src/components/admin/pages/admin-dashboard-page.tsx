import { Users, Wallet, AlertCircle, Coins, TrendingUp, Clock, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AdminDashboardPage() {
  // Data akan diambil dari API (saat ini kosong)
  const chartData: any[] = [];
  const recentActivities: any[] = [];
  
  // Stats data (kosong)
  const totalWarga = 0;
  const totalIuranBulanIni = 0;
  const wargaBelumBayar = 0;
  const saldoBankSampah = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Dashboard Admin</h1>
        <p className="text-gray-600">Ringkasan data dan aktivitas RT 05 / RW 02</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Warga */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Warga</p>
                <h3 className="text-gray-900 mb-1">{totalWarga}</h3>
                <p className="text-sm text-gray-500">Belum ada data warga</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Iuran Bulan Ini */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Iuran Bulan Ini</p>
                <h3 className="text-gray-900 mb-1">Rp {totalIuranBulanIni.toLocaleString()}</h3>
                <p className="text-sm text-gray-500">Belum ada iuran</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warga Belum Bayar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Belum Bayar</p>
                <h3 className="text-gray-900 mb-1">{wargaBelumBayar} Warga</h3>
                <p className="text-sm text-gray-500">Tidak ada tagihan</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Saldo Bank Sampah */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Saldo Bank Sampah</p>
                <h3 className="text-gray-900 mb-1">Rp {saldoBankSampah.toLocaleString()}</h3>
                <p className="text-sm text-gray-500">Belum ada setoran</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Status Pembayaran Iuran (6 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lunas" fill="#10b981" name="Lunas" />
                  <Bar dataKey="belum" fill="#f59e0b" name="Belum Bayar" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-500">
              <Inbox className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center">Belum ada data pembayaran iuran</p>
              <p className="text-sm text-center mt-1">Data akan muncul setelah ada pembayaran iuran</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.avatar}`} />
                    <AvatarFallback>{activity.avatar.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{activity.time}</span>
                    </div>
                  </div>
                  {activity.amount && (
                    <Badge 
                      variant="outline"
                      className={
                        activity.type === "payment" || activity.type === "bank-sampah"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }
                    >
                      {activity.amount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <Inbox className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-center">Belum ada aktivitas</p>
              <p className="text-sm text-center mt-1">Aktivitas akan muncul di sini</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
