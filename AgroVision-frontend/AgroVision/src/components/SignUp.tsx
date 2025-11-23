import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Leaf, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import type { SupportedLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { t, language, setLanguage } = useLanguage();
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    language: language as SupportedLanguage,
  });

  // Local states
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear old errors immediately on submit

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    // Call Signup
    const result = await signup(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.language
    );

    if (result.success) {
      setLanguage(formData.language);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1000);
    } else {
      // 1. We removed the alert() so the UI can update instantly.
      // 2. We use the message from the backend.
      alert(result.message || "Signup failed. Please try again.");
      setErrorMessage(result.message || "Signup failed. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    // Optional: Uncomment the line below if you want errors to disappear when user fixes typos
    // setErrorMessage(""); 
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex justify-center items-center text-agri-600 dark:text-agri-400">
          <Leaf className="w-10 h-10 mr-2" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {t("auth.signup.title")}
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("auth.signup.subtitle")}
        </p>

        {/* ERROR MESSAGE DISPLAY */}
        {/* Using AnimatePresence makes it pop in smoothly, ensuring user notices it */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-sm font-medium text-red-700 dark:text-red-200">
                {errorMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <input
              type="text"
              placeholder={t("auth.name")}
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-agri-500 outline-none transition-all"
            />
            <input
              type="email"
              placeholder={t("auth.email")}
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-agri-500 outline-none transition-all"
            />
            <input
              type="tel"
              placeholder={t("auth.phone")}
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-agri-500 outline-none transition-all"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.password")}
                required
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-agri-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-agri-500 outline-none transition-all"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="ru">Русский</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          {showSuccess && (
            <div className="text-agri-600 dark:text-agri-400 text-center font-bold flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{t("common.success")}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-white bg-agri-600 hover:bg-agri-700 font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t("auth.signup.button")}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400 inline">{t("auth.signup.already_account")} </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-lg font-bold text-agri-600 dark:text-agri-400 underline hover:text-agri-700 transition-colors"
          >
            {t("nav.login")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}