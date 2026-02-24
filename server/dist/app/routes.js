import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/pages/HomePage";
import { EmpresaPage } from "./components/pages/EmpresaPage";
import { ProductosPage } from "./components/pages/ProductosPage";
import { ContactanosPage } from "./components/pages/ContactanosPage";
import { MiCuentaPage } from "./components/pages/MiCuentaPage";
import { AuthPage } from "./components/pages/AuthPage";
// Admin Imports
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboardPage } from "./components/admin/pages/AdminDashboardPage";
import { AdminProductsPage } from "./components/admin/pages/AdminProductsPage";
import { AdminOrdersPage } from "./components/admin/pages/AdminOrdersPage";
import { AdminProfilePage } from "./components/admin/pages/AdminProfilePage";
import { AdminCategoriesPage } from "./components/admin/pages/AdminCategoriesPage";
import { AdminUsersPage } from "./components/admin/pages/AdminUsersPage";
import { AdminInventoryPage } from "./components/admin/pages/AdminInventoryPage";
import { AdminAuditPage } from "./components/admin/pages/AdminAuditPage";
import { AdminSettingsPage } from "./components/admin/pages/AdminSettingsPage";
export const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(Layout, {}),
        children: [
            { index: true, element: _jsx(HomePage, {}) },
            { path: "empresa", element: _jsx(EmpresaPage, {}) },
            { path: "productos", element: _jsx(ProductosPage, {}) },
            { path: "contactanos", element: _jsx(ContactanosPage, {}) },
            { path: "login", element: _jsx(AuthPage, {}) },
            { path: "register", element: _jsx(AuthPage, {}) },
            { path: "mi-cuenta", element: _jsx(MiCuentaPage, {}) },
            {
                path: "*",
                element: _jsx(HomePage, {}), // Fallback to home
            },
        ],
    },
    {
        path: "/admin",
        children: [
            { index: true, element: _jsx(Navigate, { to: "/admin/dashboard", replace: true }) },
            {
                element: _jsx(AdminLayout, {}),
                children: [
                    { path: "dashboard", element: _jsx(AdminDashboardPage, {}) },
                    { path: "categories", element: _jsx(AdminCategoriesPage, {}) },
                    { path: "products", element: _jsx(AdminProductsPage, {}) },
                    { path: "orders", element: _jsx(AdminOrdersPage, {}) },
                    { path: "users", element: _jsx(AdminUsersPage, {}) },
                    { path: "inventory", element: _jsx(AdminInventoryPage, {}) },
                    { path: "audit", element: _jsx(AdminAuditPage, {}) },
                    { path: "settings", element: _jsx(AdminSettingsPage, {}) },
                    { path: "profile", element: _jsx(AdminProfilePage, {}) },
                ]
            }
        ]
    },
]);
