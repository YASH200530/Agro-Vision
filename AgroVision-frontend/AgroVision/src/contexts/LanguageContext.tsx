import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type SupportedLanguage = "en" | "hi" | "es" | "fr" | "zh" | "ko" | "ru" | "pa";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // nav
    "nav.home": "Home",
    "nav.upload": "Upload Image",
    "nav.problem": "Problem Statement",
    "nav.logout": "Logout",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.profile": "Profile",
    "nav.profile_settings": "Profile Settings",

    // auth
    "auth.signup.title": "Create Account",
    "auth.signup.subtitle": "Join thousands of farmers using AI for crop health",
    "auth.login.title": "Welcome Back",
    "auth.login.subtitle": "Sign in to continue monitoring your crops",
    "auth.name": "Full Name",
    "auth.email": "Email Address",
    "auth.phone": "Phone Number",
    "auth.password": "Password",
    "auth.language": "Preferred Language",
    "auth.english": "English",
    "auth.hindi": "हिंदी",
    "auth.signup.button": "Create Account",
    "auth.login.button": "Sign In",
    "auth.signup.already_account": "Already have an account?",
    "auth.login.no_account": "Don't have an account?",

    // home
    "home.title": "AI-Powered Crop Health Diagnosis",
    "home.subtitle": "Instant disease detection and expert treatment plans for a healthier harvest.",
    "home.get_started": "Get Started",
    "home.learn_more": "Learn more about the problem we solve",

    "home.stat.title": "Crop Loss Reduction Stats",
    "home.stat.description": "Farmers lose 20–40% yield annually due to diseases.",
    "home.stat.source": "Source: FAO Global Report",

    "home.howit.title": "How It Works",
    "home.howit.step1.title": "Upload Image",
    "home.howit.step1.desc": "Take or upload a leaf image.",
    "home.howit.step2.title": "AI Analysis",
    "home.howit.step2.desc": "AI model diagnoses the disease.",
    "home.howit.step3.title": "Treatment Advice",
    "home.howit.step3.desc": "Get instant treatment suggestions.",

    // problem
    "problem.title": "Crop Disease is a Global Crisis",
    "problem.subtitle": "A simple, fast, and accessible solution is urgently needed to mitigate global food loss.",

    // upload
    "upload.title": "Diagnose Your Crop",
    "upload.drag_drop": "Drag and drop your leaf image here",
    "upload.click_to_browse": "or click to select file",
    "upload.browse_file": "Browse File",
    "upload.use_camera": "Use Camera",
    "upload.analyze_button": "Analyze Image",
    "upload.analyzing": "Analyzing...",
    "upload.results.title": "Prediction Result",
    "upload.results.treatment": "Treatment Plan",
    "upload.results.retry": "Upload New Image",
    "upload.results.share": "Share Result",

    // common
    "common.loading": "Loading...",
    "common.success": "Success",
  },
  hi: {
    "nav.home": "घर",
    "nav.upload": "चित्र अपलोड करें",
    "nav.problem": "समस्या कथन",
    "nav.logout": "लॉग आउट",
    "nav.login": "लॉग इन",
    "nav.signup": "साइन अप",
    "nav.profile": "प्रोफ़ाइल",
    "nav.profile_settings": "प्रोफ़ाइल सेटिंग्स",

    "auth.signup.title": "खाता बनाएं",
    "auth.signup.subtitle": "फसल स्वास्थ्य के लिए एआई का उपयोग करने वाले हजारों किसानों से जुड़ें",
    "auth.login.title": "वापस स्वागत है",
    "auth.login.subtitle": "अपनी फसलों की निगरानी जारी रखने के लिए साइन इन करें",
    "auth.name": "पूरा नाम",
    "auth.email": "ईमेल पता",
    "auth.phone": "फ़ोन नंबर",
    "auth.password": "पासवर्ड",
    "auth.language": "पसंदीदा भाषा",
    "auth.english": "English",
    "auth.hindi": "हिंदी",
    "auth.signup.button": "खाता बनाएं",
    "auth.login.button": "साइन इन",
    "auth.signup.already_account": "पहले से ही खाता है?",
    "auth.login.no_account": "खाता नहीं है?",

    "home.title": "एआई-संचालित फसल स्वास्थ्य निदान",
    "home.subtitle": "स्वस्थ फसल के लिए तत्काल रोग पहचान और विशेषज्ञ उपचार योजनाएँ।",
    "home.get_started": "शुरू करें",
    "home.learn_more": "हम जिस समस्या का समाधान करते हैं, उसके बारे में और जानें",

    "problem.title": "फसल रोग एक वैश्विक संकट है",
    "problem.subtitle": "वैश्विक खाद्य हानि को कम करने के लिए एक सरल, तेज और सुलभ समाधान की आवश्यकता है।",

    "upload.title": "अपनी फसल का निदान करें",
    "upload.drag_drop": "अपनी पत्ती की छवि यहाँ खींचें और छोड़ें",
    "upload.click_to_browse": "या फ़ाइल चुनने के लिए क्लिक करें",
    "upload.browse_file": "फ़ाइल ब्राउज़ करें",
    "upload.use_camera": "कैमरा उपयोग करें",
    "upload.analyze_button": "छवि का विश्लेषण करें",
    "upload.analyzing": "विश्लेषण कर रहा है...",
    "upload.results.title": "भविष्यवाणी परिणाम",
    "upload.results.treatment": "उपचार योजना",
    "upload.results.retry": "नई छवि अपलोड करें",
    "upload.results.share": "परिणाम साझा करें",

    "common.loading": "लोड किया जा रहा है...",
    "common.success": "सफलता",
  },
  es: {
    "nav.home": "Inicio",
    "nav.upload": "Subir Imagen",
    "nav.problem": "Planteamiento del Problema",
    "nav.logout": "Cerrar Sesión",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "nav.profile": "Perfil",
    "nav.profile_settings": "Ajustes del Perfil",
    "auth.hindi": "Hindi",
    "upload.analyzing": "Analizando...",
    "upload.results.title": "Resultado de la Predicción",
    "upload.results.treatment": "Plan de Tratamiento",
    "upload.results.retry": "Subir Nueva Imagen",
    "upload.results.share": "Compartir Resultado",
    "common.loading": "Cargando...",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.upload": "Télécharger une Image",
    "nav.problem": "Problématique",
    "nav.logout": "Déconnexion",
    "nav.login": "Connexion",
    "nav.signup": "Inscription",
    "nav.profile": "Profil",
    "nav.profile_settings": "Paramètres du Profil",
    "auth.hindi": "Hindi",
    "upload.analyzing": "Analyse en cours...",
    "upload.results.title": "Résultat de la Prédiction",
    "upload.results.treatment": "Plan de Traitement",
    "upload.results.retry": "Télécharger une Nouvelle Image",
    "upload.results.share": "Partager le Résultat",
    "common.loading": "Chargement...",
  },
  zh: {
    "nav.home": "首页",
    "nav.upload": "上传图片",
    "nav.problem": "问题陈述",
    "nav.logout": "登出",
    "nav.login": "登录",
    "nav.signup": "注册",
    "nav.profile": "个人资料",
    "nav.profile_settings": "个人资料设置",
    "auth.hindi": "印地语",
    "upload.analyzing": "正在分析...",
    "upload.results.title": "预测结果",
    "upload.results.treatment": "治疗方案",
    "upload.results.retry": "上传新图片",
    "upload.results.share": "分享结果",
    "common.loading": "载入中...",
  },
  ko: {
    "nav.home": "홈",
    "nav.upload": "이미지 업로드",
    "nav.problem": "문제 설명",
    "nav.logout": "로그아웃",
    "nav.login": "로그인",
    "nav.signup": "회원가입",
    "nav.profile": "프로필",
    "nav.profile_settings": "프로필 설정",
    "auth.hindi": "힌디어",
    "upload.analyzing": "분석 중...",
    "upload.results.title": "예측 결과",
    "upload.results.treatment": "치료 계획",
    "upload.results.retry": "새 이미지 업로드",
    "upload.results.share": "결과 공유",
    "common.loading": "로드 중...",
  },
  ru: {
    "nav.home": "Главная",
    "nav.upload": "Загрузить Изображение",
    "nav.problem": "Постановка Задачи",
    "nav.logout": "Выход",
    "nav.login": "Вход",
    "nav.signup": "Регистрация",
    "nav.profile": "Профиль",
    "nav.profile_settings": "Настройки Профиля",
    "auth.hindi": "Хинди",
    "upload.analyzing": "Анализирую...",
    "upload.results.title": "Результат Прогноза",
    "upload.results.treatment": "План Лечения",
    "upload.results.retry": "Загрузить Новое Изображение",
    "upload.results.share": "Поделиться Результатом",
    "common.loading": "Загрузка...",
  },
  pa: {
    "nav.home": "ਘਰ",
    "nav.upload": "ਚਿੱਤਰ ਅਪਲੋਡ ਕਰੋ",
    "nav.problem": "ਸਮੱਸਿਆ ਦਾ ਬਿਆਨ",
    "nav.logout": "ਲਾਗਆਉਟ",
    "nav.login": "ਲੌਗਿਨ",
    "nav.signup": "ਸਾਈਨ ਅਪ",
    "nav.profile": "ਪ੍ਰੋਫਾਈਲ",
    "nav.profile_settings": "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਜ਼",
    "auth.hindi": "ਹਿੰਦੀ",
    "upload.analyzing": "ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    "upload.results.title": "ਭਵਿੱਖਬਾਣੀ ਦਾ ਨਤੀਜਾ",
    "upload.results.treatment": "ਇਲਾਜ ਦੀ ਯੋਜਨਾ",
    "upload.results.retry": "ਨਵੀਂ ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ",
    "upload.results.share": "ਨਤੀਜਾ ਸਾਂਝਾ ਕਰੋ",
    "common.loading": "ਲੋਡ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem("language");
      const legacy: Record<string, SupportedLanguage> = {
        english: "en", hindi: "hi", spanish: "es", franch: "fr", chines: "zh", korean: "ko", russian: "ru", punjabi: "pa",
      };
      if (saved) {
        if (["en","hi","es","fr","zh","ko","ru","pa"].includes(saved)) return saved as SupportedLanguage;
        if (legacy[saved]) return legacy[saved];
      }
    } catch {}
    return "en";
  });

  useEffect(() => {
    try { localStorage.setItem("language", language); } catch {}
  }, [language]);

  const t = (key: string) => translations[language]?.[key] || translations["en"]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
