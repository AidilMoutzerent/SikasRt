import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Wallet, 
  Recycle, 
  Calendar, 
  Megaphone, 
  TrendingUp,
  FileBarChart
} from "lucide-react";

export type AdminPageType = 
  | "dashboard" 
  | "warga" 
  | "petugas" 
  | "iuran" 
  | "bank-sampah" 
  | "jadwal" 
  | "informasi"
  | "laporan-keuangan"
  | "laporan-sampah";

interface AdminSidebarProps {
  currentPage: AdminPageType;
  onPageChange: (page: AdminPageType) => void;
}

export function AdminSidebar({ currentPage, onPageChange }: AdminSidebarProps) {
  const menuSections = [
    {
      title: null,
      items: [
        { id: "dashboard" as AdminPageType, label: "Dashboard", icon: LayoutDashboard },
      ]
    },
    {
      title: "MANAJEMEN PENGGUNA",
      items: [
        { id: "warga" as AdminPageType, label: "Manajemen Warga", icon: Users },
        { id: "petugas" as AdminPageType, label: "Manajemen Petugas", icon: UserCog },
      ]
    },
    {
      title: "MANAJEMEN KEUANGAN",
      items: [
        { id: "iuran" as AdminPageType, label: "Manajemen Iuran", icon: Wallet },
        { id: "bank-sampah" as AdminPageType, label: "Manajemen Bank Sampah", icon: Recycle },
      ]
    },
    {
      title: "MANAJEMEN OPERASIONAL",
      items: [
        { id: "jadwal" as AdminPageType, label: "Manajemen Jadwal", icon: Calendar },
        { id: "informasi" as AdminPageType, label: "Manajemen Informasi", icon: Megaphone },
      ]
    },
    {
      title: "LAPORAN",
      items: [
        { id: "laporan-keuangan" as AdminPageType, label: "Laporan Keuangan", icon: TrendingUp },
        { id: "laporan-sampah" as AdminPageType, label: "Laporan Bank Sampah", icon: FileBarChart },
      ]
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-gray-200 flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {section.title && (
              <h3 className="text-xs text-gray-500 mb-2 px-3">
                {section.title}
              </h3>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className={isActive ? '' : ''}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
