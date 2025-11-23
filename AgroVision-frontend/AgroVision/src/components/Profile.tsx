import React, { useState } from "react";
import type { SupportedLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Loader2, CheckCircle, X } from "lucide-react";

export default function Profile({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const { setLanguage, t } = useLanguage();
  const [form, setForm] = useState<{ name: string; phone?: string; language: SupportedLanguage }>({
    name: user?.name || "",
    phone: user?.phone || "",
    language: (user?.preferredLanguage || "en") as SupportedLanguage,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile({ name: form.name, phone: form.phone, preferredLanguage: form.language });
    setSaving(false);
    if (success) {
      setLanguage(form.language);
      setMsg("Profile updated successfully!");
      setTimeout(() => { setMsg(""); onClose(); }, 1200);
    } else {
      setMsg("Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full border">
        <h2 className="text-2xl font-bold mb-6">{t("nav.profile_settings")}</h2>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email (Read Only)</label>
            <input
              value={user?.email || ""}
              readOnly
              disabled
              className="w-full px-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-600 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value as SupportedLanguage })}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <op
