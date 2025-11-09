import { useState } from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { BottomNav } from "./components/bottom-nav";
import { DashboardPage } from "./components/pages/dashboard-page";
import { RiwayatIuranPage } from "./components/pages/riwayat-iuran-page";
import { BankSampahPage } from "./components/pages/bank-sampah-page";
import { JadwalPage } from "./components/pages/jadwal-page";
import { InformasiRTPage } from "./components/pages/informasi-rt-page";
import { ProfilPage } from "./components/pages/profil-page";
import { LoginPage, UserRole } from "./components/pages/login-page";

// Admin Components
import { AdminHeader } from "./components/admin/admin-header";
import { AdminSidebar, AdminPageType } from "./components/admin/admin-sidebar";
import { AdminDashboardPage } from "./components/admin/pages/admin-dashboard-page";
import { ManajemenWargaPage } from "./components/admin/pages/manajemen-warga-page";
import { ManajemenIuranPage } from "./components/admin/pages/manajemen-iuran-page";
import { PlaceholderPage } from "./components/admin/pages/placeholder-page";

export type PageType = "dashboard" | "riwayat" | "bank" | "jadwal" | "informasi" | "profil";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPageType>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage("dashboard");
    setCurrentAdminPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "riwayat":
        return <RiwayatIuranPage />;
      case "bank":
        return <BankSampahPage />;
      case "jadwal":
        return <JadwalPage />;
      case "informasi":
        return <InformasiRTPage />;
      case "profil":
        return <ProfilPage onLogout={handleLogout} />;
      default:
        return <DashboardPage />;
    }
  };

  const renderAdminPage = () => {
    switch (currentAdminPage) {
      case "dashboard":
        return <AdminDashboardPage />;
      case "warga":
        return <ManajemenWargaPage />;
      case "petugas":
        return <PlaceholderPage title="Manajemen Petugas" description="Kelola data petugas bank sampah" />;
      case "iuran":
        return <ManajemenIuranPage />;
      case "bank-sampah":
        return <PlaceholderPage title="Manajemen Bank Sampah" description="Atur harga sampah dan kelola transaksi" />;
      case "jadwal":
        return <PlaceholderPage title="Manajemen Jadwal" description="Kelola jadwal kegiatan dan pengangkutan sampah" />;
      case "informasi":
        return <PlaceholderPage title="Manajemen Informasi" description="Kelola pengumuman dan informasi RT" />;
      case "laporan-keuangan":
        return <PlaceholderPage title="Laporan Keuangan" description="Lihat dan export laporan keuangan RT" />;
      case "laporan-sampah":
        return <PlaceholderPage title="Laporan Bank Sampah" description="Lihat dan export laporan bank sampah" />;
      default:
        return <AdminDashboardPage />;
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Admin Panel
  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader onLogout={handleLogout} />
        
        <div className="flex">
          <AdminSidebar currentPage={currentAdminPage} onPageChange={setCurrentAdminPage} />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderAdminPage()}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Warga/Petugas Panel
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onLogout={handleLogout} />
      
      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
