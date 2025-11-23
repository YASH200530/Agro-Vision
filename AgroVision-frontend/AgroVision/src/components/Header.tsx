import { Menu, X, LogOut, User, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const LanguageDropdown = () => {
    const { language, setLanguage } = useLanguage();
    const options: Record<string, string> = {
      en: "English", hi: "हिन्दी", es: "Español", fr: "Français",
      zh: "中文", ko: "한국어", ru: "Русский", pa: "ਪੰਜਾਬੀ",
    };
    return (
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="rounded-lg border px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
        aria-label="Select language"
      >
        {Object.entries(options).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    );
  };

  const navItems = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.upload"), to: "/upload" },
    { label: t("nav.problem"), to: "/problem" },
  ];

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <button
          onClick={() => navigate("/")}
          className="font-bold text-2xl text-agri-600 dark:text-agri-400"
        >
          AgroVision
        </button>

        {/* Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? "border-b-2 border-agri-600 text-agri-600 dark:text-agri-400"
                    : "hover:text-agri-600 dark:hover:text-agri-400"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <LanguageDropdown />

          <button onClick={toggleTheme} className="p-2" title="Toggle Theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm rounded-md border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Logout"
              >
                <LogOut />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 border border-agri-500 rounded-md hover:bg-agri-50 text-agri-600"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-agri-600 text-white rounded-md hover:bg-agri-700"
              >
                {t("nav.signup")}
              </button>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-4 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-gray-700 dark:text-gray-300"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <LanguageDropdown />
          </div>
          <div className="flex items-center space-x-4 pt-2">
            <button onClick={toggleTheme} className="p-2 rounded-md border dark:border-gray-700">
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-md border dark:border-gray-700"
              >
                <LogOut />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 border rounded-md"
                >
                  {t("nav.login")}
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-agri-600 text-white rounded-md"
                >
                  {t("nav.signup")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
