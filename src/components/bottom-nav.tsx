import { Home, CreditCard, Building2, Calendar, User } from "lucide-react";
import { PageType } from "../App";

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const menuItems = [
    { icon: Home, label: "Dashboard", page: "dashboard" as PageType },
    { icon: CreditCard, label: "Iuran", page: "riwayat" as PageType },
    { icon: Building2, label: "Bank", page: "bank" as PageType },
    { icon: Calendar, label: "Jadwal", page: "jadwal" as PageType },
    { icon: User, label: "Profil", page: "profil" as PageType },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-5 gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              className={`flex flex-col items-center py-3 px-2 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
