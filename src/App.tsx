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
import { Toaster } from "./components/ui/sonner";

// Admin Components
import { AdminHeader } from "./components/admin/admin-header";
import { AdminSidebar, AdminPageType } from "./components/admin/admin-sidebar";
import { AdminDashboardPage } from "./components/admin/pages/admin-dashboard-page";
import { ManajemenWargaPage } from "./components/admin/pages/manajemen-warga-page";
import { ManajemenPetugasPage } from "./components/admin/pages/manajemen-petugas-page";
import { ManajemenIuranPage } from "./components/admin/pages/manajemen-iuran-page";
import { ManajemenBankSampahPage } from "./components/admin/pages/manajemen-bank-sampah-page";
import { ManajemenJadwalPage } from "./components/admin/pages/manajemen-jadwal-page";
import { ManajemenInformasiPage } from "./components/admin/pages/manajemen-informasi-page";
import { LaporanKeuanganPage } from "./components/admin/pages/laporan-keuangan-page";
import { LaporanBankSampahPage } from "./components/admin/pages/laporan-bank-sampah-page";

// Petugas Components
import { PetugasLayout } from "./components/petugas/petugas-layout";
import { InputSetoranPage } from "./components/petugas/pages/input-setoran-page";
import { RiwayatTransaksiPage } from "./components/petugas/pages/riwayat-transaksi-page";

export type PageType = "dashboard" | "riwayat" | "bank" | "jadwal" | "informasi" | "profil";
export type PetugasPageType = "input" | "riwayat";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPageType>("dashboard");
  const [currentPetugasPage, setCurrentPetugasPage] = useState<PetugasPageType>("input");
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
    setCurrentPetugasPage("input");
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
        return <ManajemenPetugasPage />;
      case "iuran":
        return <ManajemenIuranPage />;
      case "bank-sampah":
        return <ManajemenBankSampahPage />;
      case "jadwal":
        return <ManajemenJadwalPage />;
      case "informasi":
        return <ManajemenInformasiPage />;
      case "laporan-keuangan":
        return <LaporanKeuanganPage />;
      case "laporan-sampah":
        return <LaporanBankSampahPage />;
      default:
        return <AdminDashboardPage />;
    }
  };

  const renderPetugasPage = () => {
    switch (currentPetugasPage) {
      case "input":
        return <InputSetoranPage />;
      case "riwayat":
        return <RiwayatTransaksiPage />;
      default:
        return <InputSetoranPage />;
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  // Admin Panel
  if (userRole === "admin") {
    return (
      <>
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
        <Toaster />
      </>
    );
  }

  // Petugas Panel
  if (userRole === "petugas") {
    return (
      <>
        <PetugasLayout
          currentPage={currentPetugasPage}
          onNavigate={setCurrentPetugasPage}
          onLogout={handleLogout}
        >
          {renderPetugasPage()}
        </PetugasLayout>
        <Toaster />
      </>
    );
  }

  // Warga Panel
  return (
    <>
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
      <Toaster />
    </>
  );
}