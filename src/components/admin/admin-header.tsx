import { useState } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import logoSikas from "figma:asset/b7558ce2490bcde3a0e06dac40727e86e2d7742c.png";

interface AdminHeaderProps {
  onLogout?: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logoSikas} alt="SIKAS RT" className="w-10 h-10 object-contain" />
          <div className="hidden sm:block">
            <h2 className="text-gray-900">Admin SIKAS RT 05</h2>
            <p className="text-sm text-gray-600">Sistem Manajemen</p>
          </div>
        </div>
        
        {/* Search Bar - Hidden on small screens */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Cari warga, NIK, alamat..."
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-white">
              5
            </Badge>
          </Button>
          
          {/* Admin Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <div className="hidden md:block text-right">
                  <p className="text-sm text-gray-900">Admin RT</p>
                  <p className="text-xs text-gray-600">Pengurus</p>
                </div>
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                  <AvatarFallback className="bg-green-600 text-white">A</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-2">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                  <AvatarFallback className="bg-green-600 text-white">A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-900">Admin RT 05</p>
                  <p className="text-xs text-gray-600">Pengurus</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {onLogout && (
                <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar dari Akun
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Cari warga..."
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari panel admin dan kembali ke halaman login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}