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
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "empresa", element: <EmpresaPage /> },
      { path: "productos", element: <ProductosPage /> },
      { path: "contactanos", element: <ContactanosPage /> },
      { path: "login", element: <AuthPage /> },
      { path: "register", element: <AuthPage /> },
      { path: "mi-cuenta", element: <MiCuentaPage /> },
      {
        path: "*",
        element: <HomePage />, // Fallback to home
      },
    ],
  },
  {
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "inventory", element: <AdminInventoryPage /> },
          { path: "audit", element: <AdminAuditPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
          { path: "profile", element: <AdminProfilePage /> },
        ]
      }
    ]
  },
]);
