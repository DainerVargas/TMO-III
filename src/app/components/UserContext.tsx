import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { apiFetch } from "../utils/api";

interface UserProfile {
  id?: number;
  name: string;
  lastName?: string;
  email: string;
  phone?: string;
  documentType?: "DNI" | "RUC";
  documentNumber?: string;
  companyName?: string;
  shippingAddress?: string;
  shippingDistrict?: string;
  shippingReference?: string;
  role?: string;
  permissions?: string[];
}

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (newData: Partial<UserProfile>) => Promise<void>;
  updatePassword: (oldPass: string, newPass: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("tmo_user_data");
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = !!user;

  const login = async (email: string, pass: string) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });
      
      localStorage.setItem('tmo_token', data.token);
      localStorage.setItem('tmo_user_data', JSON.stringify(data.user));
      
      if (data.user.role === 'ADMIN' || data.user.role === 'MANAGER') {
        localStorage.setItem('tmo_admin_logged', 'true');
      }

      setUser(data.user);
      toast.success(`Bienvenido, ${data.user.name}`);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      localStorage.setItem('tmo_token', data.token);
      localStorage.setItem('tmo_user_data', JSON.stringify(data.user));

      if (data.user.role === 'ADMIN' || data.user.role === 'MANAGER') {
        localStorage.setItem('tmo_admin_logged', 'true');
      }

      setUser(data.user);
      toast.success("Cuenta creada exitosamente");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    // Clear all possible session keys
    localStorage.removeItem("tmo_token");
    localStorage.removeItem("tmo_user_data");
    localStorage.removeItem("tmo_admin_logged");
    
    // Reset state - this will trigger redirects in protected pages
    setUser(null);
    toast.info("Sesión cerrada correctamente");
  };

  const updateProfile = async (newData: Partial<UserProfile>) => {
    try {
      const data = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(newData),
      });
      
      const updatedUser = data.user;
      setUser(updatedUser);
      localStorage.setItem("tmo_user_data", JSON.stringify(updatedUser));
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updatePassword = async (oldPass: string, newPass: string) => {
    try {
      await apiFetch('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: oldPass, newPassword: newPass }),
      });
      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (error: any) {
      toast.error(error.message);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
