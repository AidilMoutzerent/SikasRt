import { Home, CreditCard, Building2, Calendar, Megaphone, User } from "lucide-react";
import { PageType } from "../App";

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard", page: "dashboard" as PageType },
    { icon: CreditCard, label: "Riwayat Iuran", page: "riwayat" as PageType },
    { icon: Building2, label: "Bank Sampah Saya", page: "bank" as PageType },
    { icon: Calendar, label: "Jadwal", page: "jadwal" as PageType },
    { icon: Megaphone, label: "Informasi RT", page: "informasi" as PageType },
    { icon: User, label: "Profil Saya", page: "profil" as PageType },
  ];
  
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => onPageChange(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
