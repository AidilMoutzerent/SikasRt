import { StatusIuranCard } from "../status-iuran-card";
import { BankSampahCard } from "../bank-sampah-card";
import { QuickInfoSection } from "../quick-info-section";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Kelola iuran dan bank sampah Anda dengan mudah</p>
      </div>
      
      {/* Status Iuran Card (Hero) */}
      <StatusIuranCard />
      
      {/* Bank Sampah Card */}
      <BankSampahCard />
      
      {/* Quick Info Section */}
      <QuickInfoSection />
    </div>
  );
}
