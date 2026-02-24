import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AdminProvider } from "./components/admin/AdminContext";
import { UserProvider } from "./components/UserContext";
import { Toaster } from "sonner";
import { ConfirmModal } from "./components/admin/ConfirmModal";

export default function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <Toaster position="top-right" richColors closeButton />
        <ConfirmModal />
        <RouterProvider router={router} />
      </AdminProvider>
    </UserProvider>
  );
}