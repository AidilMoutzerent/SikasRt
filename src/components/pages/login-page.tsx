import { useState } from "react";
import { User, Shield, Recycle, LogIn, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import logoSikas from "figma:asset/b7558ce2490bcde3a0e06dac40727e86e2d7742c.png";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { UserPlus } from "lucide-react";

export type UserRole = "admin" | "warga" | "petugas" | null;

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    namaLengkap: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    nomorRumah: "",
    blok: "",
    noTelepon: "",
    // Admin specific
    jabatan: "",
    nomorRekeningBRI: "",
    namaPemilikRekening: "",
  });

  const roles = [
    {
      id: "warga" as UserRole,
      title: "Warga",
      description: "Login sebagai warga RT",
      icon: User,
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-500",
      hoverBg: "hover:bg-blue-50",
    },
    {
      id: "admin" as UserRole,
      title: "Admin",
      description: "Login sebagai admin RT",
      icon: Shield,
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      borderColor: "border-green-500",
      hoverBg: "hover:bg-green-50",
    },
    {
      id: "petugas" as UserRole,
      title: "Petugas Bank Sampah",
      description: "Login sebagai petugas",
      icon: Recycle,
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-500",
      hoverBg: "hover:bg-purple-50",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && formData.username && formData.password) {
      // Simulate login success
      onLogin(selectedRole);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak cocok!");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    if (selectedRole === "warga" && (!registerData.nomorRumah || !registerData.blok)) {
      toast.error("Nomor rumah dan blok wajib diisi untuk warga!");
      return;
    }

    // Simulate registration success
    toast.success(`Registrasi berhasil! Silakan login dengan akun ${registerData.username}`);
    
    // Reset and switch to login mode
    setIsRegisterMode(false);
    setFormData({
      username: registerData.username,
      password: "",
    });
    setRegisterData({
      namaLengkap: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      nomorRumah: "",
      blok: "",
      noTelepon: "",
      // Admin specific
      jabatan: "",
      nomorRekeningBRI: "",
      namaPemilikRekening: "",
    });
  };

  const handleBack = () => {
    setSelectedRole(null);
    setIsRegisterMode(false);
    setFormData({ username: "", password: "" });
    setRegisterData({
      namaLengkap: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      nomorRumah: "",
      blok: "",
      noTelepon: "",
      // Admin specific
      jabatan: "",
      nomorRekeningBRI: "",
      namaPemilikRekening: "",
    });
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white rounded-3xl shadow-lg mb-4 border border-gray-200">
              <img 
                src={logoSikas} 
                alt="SIKAS RT" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-gray-900 mb-2">Sistem Informasi RT</h1>
            <p className="text-gray-600">Selamat datang! Silakan login untuk melanjutkan</p>
          </div>

          {/* Role Selection */}
          {!selectedRole && (
            <div className="space-y-4">
              <h2 className="text-center text-white drop-shadow-md mb-6">Pilih Role Login</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Card
                      key={role.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-transparent ${role.hoverBg}`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 ${role.bgColor} rounded-xl mb-4`}>
                          <Icon className={`w-8 h-8 ${role.iconColor}`} />
                        </div>
                        <h3 className="text-gray-900 mb-2">{role.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                        <Button 
                          className={
                            role.id === "warga" 
                              ? "w-full bg-blue-600 hover:bg-blue-700" 
                              : role.id === "admin"
                              ? "w-full bg-green-600 hover:bg-green-700"
                              : "w-full bg-purple-600 hover:bg-purple-700"
                          }
                        >
                          Pilih
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Login Form */}
          {selectedRole && (
            <Card className="max-w-md mx-auto border-2">
              <CardContent className="p-8">
                {/* Selected Role Badge */}
                <div className="text-center mb-6">
                  {roles.map((role) => {
                    if (role.id === selectedRole) {
                      const Icon = role.icon;
                      return (
                        <div key={role.id}>
                          <div className={`inline-flex items-center justify-center w-16 h-16 ${role.bgColor} rounded-xl mb-3`}>
                            <Icon className={`w-8 h-8 ${role.iconColor}`} />
                          </div>
                          <h3 className="text-gray-900 mb-1">
                            {isRegisterMode ? "Daftar" : "Login"} sebagai {role.title}
                          </h3>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Login Form */}
                {!isRegisterMode && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username / Email</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Masukkan username atau email"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="h-12 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-gray-600">Ingat saya</span>
                      </label>
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        Lupa password?
                      </a>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Login
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12"
                        onClick={handleBack}
                      >
                        Kembali
                      </Button>
                    </div>

                    {/* Register Link - Only for Warga and Admin */}
                    {(selectedRole === "warga" || selectedRole === "admin") && (
                      <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Belum punya akun?{" "}
                          <button
                            type="button"
                            onClick={toggleMode}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Daftar sekarang
                          </button>
                        </p>
                      </div>
                    )}
                  </form>
                )}

                {/* Register Form */}
                {isRegisterMode && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="namaLengkap">Nama Lengkap</Label>
                      <Input
                        id="namaLengkap"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={registerData.namaLengkap}
                        onChange={(e) => setRegisterData({ ...registerData, namaLengkap: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contoh@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    {/* Warga specific fields */}
                    {selectedRole === "warga" && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="blok">Blok</Label>
                            <Select
                              value={registerData.blok}
                              onValueChange={(value) => setRegisterData({ ...registerData, blok: value })}
                              required
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Pilih blok" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">Blok A</SelectItem>
                                <SelectItem value="B">Blok B</SelectItem>
                                <SelectItem value="C">Blok C</SelectItem>
                                <SelectItem value="D">Blok D</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nomorRumah">No. Rumah</Label>
                            <Input
                              id="nomorRumah"
                              type="text"
                              placeholder="01"
                              value={registerData.nomorRumah}
                              onChange={(e) => setRegisterData({ ...registerData, nomorRumah: e.target.value })}
                              required
                              className="h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="noTelepon">No. Telepon</Label>
                          <Input
                            id="noTelepon"
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            value={registerData.noTelepon}
                            onChange={(e) => setRegisterData({ ...registerData, noTelepon: e.target.value })}
                            required
                            className="h-12"
                          />
                        </div>
                      </>
                    )}

                    {/* Admin specific fields */}
                    {selectedRole === "admin" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="jabatan">Jabatan</Label>
                          <Input
                            id="jabatan"
                            type="text"
                            placeholder="Masukkan jabatan"
                            value={registerData.jabatan}
                            onChange={(e) => setRegisterData({ ...registerData, jabatan: e.target.value })}
                            required
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nomorRekeningBRI">Nomor Rekening BRI</Label>
                          <Input
                            id="nomorRekeningBRI"
                            type="text"
                            placeholder="Masukkan nomor rekening BRI"
                            value={registerData.nomorRekeningBRI}
                            onChange={(e) => setRegisterData({ ...registerData, nomorRekeningBRI: e.target.value })}
                            required
                            className="h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="namaPemilikRekening">Nama Pemilik Rekening</Label>
                          <Input
                            id="namaPemilikRekening"
                            type="text"
                            placeholder="Masukkan nama pemilik rekening"
                            value={registerData.namaPemilikRekening}
                            onChange={(e) => setRegisterData({ ...registerData, namaPemilikRekening: e.target.value })}
                            required
                            className="h-12"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        type="text"
                        placeholder="Pilih username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                          className="h-12 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Ulangi password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          required
                          className="h-12 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button
                        type="submit"
                        className="w-full h-12 bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Daftar
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12"
                        onClick={handleBack}
                      >
                        Kembali
                      </Button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Sudah punya akun?{" "}
                        <button
                          type="button"
                          onClick={toggleMode}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Login sekarang
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-white/80 drop-shadow">
            <p>© 2025 Sistem Informasi RT. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}