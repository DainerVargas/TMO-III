import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AdminProvider } from "./components/admin/AdminContext";
import { UserProvider } from "./components/UserContext";
import { Toaster } from "sonner";
import { ConfirmModal } from "./components/admin/ConfirmModal";
export default function App() {
    return (_jsx(UserProvider, { children: _jsxs(AdminProvider, { children: [_jsx(Toaster, { position: "top-right", richColors: true, closeButton: true }), _jsx(ConfirmModal, {}), _jsx(RouterProvider, { router: router })] }) }));
}
