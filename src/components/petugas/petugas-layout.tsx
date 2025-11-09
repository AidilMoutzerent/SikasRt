import { ReactNode } from "react";
import { ClipboardList, Clock, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PetugasLayoutProps {
  children: ReactNode;
  currentPage: "input" | "riwayat";
  onNavigate: (page: "input" | "riwayat") => void;
  onLogout: () => void;
}

export function PetugasLayout({ children, currentPage, onNavigate, onLogout }: PetugasLayoutProps) {
  const petugasData = {
    nama: "Joko Susanto",
    jabatan: "Petugas Bank Sampah",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-gray-900">Bank Sampah RT 05</h1>
                <p className="text-sm text-gray-600">Operator Input</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${petugasData.nama}`} />
                    <AvatarFallback>{petugasData.nama.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-gray-900">{petugasData.nama}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="text-gray-900">{petugasData.nama}</p>
                    <p className="text-sm text-gray-600">{petugasData.jabatan}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 lg:pb-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-2 gap-1 p-2">
          <Button
            variant={currentPage === "input" ? "default" : "ghost"}
            className={`flex flex-col gap-1 h-auto py-3 ${
              currentPage === "input" 
                ? "bg-green-600 hover:bg-green-700" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onNavigate("input")}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs">Input Setoran</span>
          </Button>

          <Button
            variant={currentPage === "riwayat" ? "default" : "ghost"}
            className={`flex flex-col gap-1 h-auto py-3 ${
              currentPage === "riwayat" 
                ? "bg-green-600 hover:bg-green-700" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onNavigate("riwayat")}
          >
            <Clock className="w-5 h-5" />
            <span className="text-xs">Riwayat Hari Ini</span>
          </Button>
        </div>
      </nav>

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed left-4 top-20 w-64">
        <div className="bg-white rounded-lg border border-gray-200 p-2 space-y-1">
          <Button
            variant={currentPage === "input" ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentPage === "input" 
                ? "bg-green-600 hover:bg-green-700" 
                : ""
            }`}
            onClick={() => onNavigate("input")}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Input Setoran Baru
          </Button>

          <Button
            variant={currentPage === "riwayat" ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentPage === "riwayat" 
                ? "bg-green-600 hover:bg-green-700" 
                : ""
            }`}
            onClick={() => onNavigate("riwayat")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Riwayat Transaksi
          </Button>
        </div>
      </div>
    </div>
  );
}
