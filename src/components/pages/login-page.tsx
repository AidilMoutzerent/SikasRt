import { useState } from "react";
import { User, Shield, Recycle, LogIn, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type UserRole = "admin" | "warga" | "petugas" | null;

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

  const handleBack = () => {
    setSelectedRole(null);
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-gray-900 mb-2">Sistem Informasi RT</h1>
          <p className="text-gray-600">Selamat datang! Silakan login untuk melanjutkan</p>
        </div>

        {/* Role Selection */}
        {!selectedRole && (
          <div className="space-y-4">
            <h2 className="text-center text-gray-900 mb-6">Pilih Role Login</h2>
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
                      <Button className={`w-full bg-${role.color}-600 hover:bg-${role.color}-700`}>
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
                        <h3 className="text-gray-900 mb-1">Login sebagai {role.title}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Form */}
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
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-gray-700">
                  {selectedRole === "warga" && (
                    <>
                      <p>Username: <span className="font-medium">warga123</span></p>
                      <p>Password: <span className="font-medium">password</span></p>
                    </>
                  )}
                  {selectedRole === "admin" && (
                    <>
                      <p>Username: <span className="font-medium">admin</span></p>
                      <p>Password: <span className="font-medium">admin123</span></p>
                    </>
                  )}
                  {selectedRole === "petugas" && (
                    <>
                      <p>Username: <span className="font-medium">petugas</span></p>
                      <p>Password: <span className="font-medium">petugas123</span></p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2025 Sistem Informasi RT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
