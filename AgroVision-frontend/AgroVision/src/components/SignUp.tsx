// components/SignUp.tsx
import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Leaf, CheckCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import type { SupportedLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { t, language, setLanguage } = useLanguage();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", language: language as SupportedLanguage,
  });
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    const ok = await signup(
      formData.name, formData.email, formData.phone, formData.password
    );
    if (ok) {
      setLanguage(formData.language);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1000);
    } else {
      setError("Signup failed. Email may already be in use.");
    }
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <input
              type="text" placeholder={t("auth.name")} required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
            />
            <input
              type="email" placeholder={t("auth.email")} required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
            />
            <input
              type="tel" placeholder={t("auth.phone")}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} placeholder={t("auth.password")} required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as SupportedLanguage })}
              className="w-full px-5 py-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
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

          {error && <div className="text-red-500 text-center font-medium">{error}</div>}
          {showSuccess && (
            <div className="text-agri-600 dark:text-agri-400 text-center font-bold flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{t("common.success")}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-white bg-agri-600 hover:bg-agri-700 font-bold"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t("auth.signup.button")}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400 inline">{t("auth.signup.already_account")} </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-lg font-bold text-agri-600 dark:text-agri-400 underline"
          >
            {t("nav.login")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
