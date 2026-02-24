import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "../utils/api";
const UserContext = createContext(undefined);
export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("tmo_user_data");
        return saved ? JSON.parse(saved) : null;
    });
    const isLoggedIn = !!user;
    const login = async (email, pass) => {
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
        }
        catch (error) {
            toast.error(error.message);
            throw error;
        }
    };
    const register = async (userData) => {
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
        }
        catch (error) {
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
    const updateProfile = async (newData) => {
        try {
            const data = await apiFetch('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(newData),
            });
            const updatedUser = data.user;
            setUser(updatedUser);
            localStorage.setItem("tmo_user_data", JSON.stringify(updatedUser));
            toast.success("Perfil actualizado correctamente");
        }
        catch (error) {
            toast.error(error.message);
        }
    };
    const updatePassword = async (oldPass, newPass) => {
        try {
            await apiFetch('/auth/password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword: oldPass, newPassword: newPass }),
            });
            toast.success("Contraseña actualizada correctamente");
            return true;
        }
        catch (error) {
            toast.error(error.message);
            return false;
        }
    };
    return (_jsx(UserContext.Provider, { value: { user, isLoggedIn, login, register, logout, updateProfile, updatePassword }, children: children }));
}
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
