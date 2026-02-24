import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CuentaContent } from "../AboutModal";
import { Footer } from "../Footer";
import { useUser } from "../UserContext";
export function MiCuentaPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoggedIn, navigate]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 bg-white", children: [_jsx("div", { className: "bg-[#f5f7fa] border-b border-[#e5e7eb]", children: _jsx("div", { className: "px-3 sm:px-4 py-2.5 sm:py-3", children: _jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-[#0a4d8c] hover:text-[#083d6f] transition-colors group", style: {
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontSize: "0.88rem",
                                }, children: [_jsx(ArrowLeft, { className: "w-4 h-4 group-hover:-translate-x-0.5 transition-transform" }), "Volver Atr\u00E1s"] }) }) }), _jsx(CuentaContent, {})] }), _jsx(Footer, {})] }));
}
