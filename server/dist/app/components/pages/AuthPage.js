import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthForms } from "../auth/AuthForms";
import { Footer } from "../Footer";
import { useUser } from "../UserContext";
export function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();
    const searchParams = new URLSearchParams(location.search);
    // Decide mode based on path or query
    const isRegister = location.pathname === "/register" || searchParams.get("mode") === "register";
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [location.pathname]);
    return (_jsxs("div", { className: "flex-1 flex flex-col bg-white", children: [_jsx("div", { className: "flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fb]", children: _jsx("div", { className: "w-full max-w-md", children: _jsx(AuthForms, { initialMode: isRegister ? "register" : "login" }) }) }), _jsx(Footer, {})] }));
}
