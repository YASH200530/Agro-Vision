import React from "react";
import { Upload as UploadIcon, Brain, Stethoscope, TrendingUp, Users, Shield } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) navigate("/upload");
    else navigate("/signup");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-agri-gradient bg-field-texture transition-all duration-500">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 font-display">
            {t("home.title")}
          </h1>
          <p className="text-2xl md:text-3xl text-soil-700 mb-12 max-w-4xl mx-auto font-medium">
            {t("home.subtitle")}
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-10 py-5 text-xl font-bold rounded-2xl text-white bg-agri-600 hover:bg-agri-700 focus:outline-none focus:ring-4 focus:ring-agri-300"
          >
            <UploadIcon className="w-6 h-6 mr-3" />
            {t("home.get_started")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white/95 backdrop-blur-sm py-20 border-y-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
              {t("home.stat.title")}
            </h2>
            <div className="bg-gradient-to-r from-agri-600 via-crop-500 to-agri-700 text-white rounded-3xl p-10 max-w-3xl mx-auto">
              <div className="text-7xl md:text-8xl font-bold mb-6">20-40%</div>
              <p className="text-2xl font-medium">{t("home.stat.description")}</p>
              <p className="text-base mt-6 opacity-90 font-medium">{t("home.stat.source")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
              {t("home.howit.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="w-20 h-20 bg-agri-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <UploadIcon className="w-10 h-10 text-agri-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                {t("home.howit.step1.title")}
              </h3>
              <p className="text-lg text-soil-700">{t("home.howit.step1.desc")}</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="w-20 h-20 bg-crop-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Brain className="w-10 h-10 text-crop-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                {t("home.howit.step2.title")}
              </h3>
              <p className="text-lg text-soil-700">{t("home.howit.step2.desc")}</p>
            </div>

            <div className="text-center bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="w-20 h-20 bg-agri-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Stethoscope className="w-10 h-10 text-agri-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                {t("home.howit.step3.title")}
              </h3>
              <p className="text-lg text-soil-700">{t("home.howit.step3.desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-20 border-y-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 border-2 border-gray-100">
              <div className="w-16 h-16 bg-agri-100 rounded-2xl flex items-center justify-center mb-8">
                <TrendingUp className="w-8 h-8 text-agri-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">Accurate Detection</h3>
              <p className="text-lg text-soil-700">90%+ accuracy in detecting plant diseases</p>
            </div>

            <div className="bg-white rounded-3xl p-10 border-2 border-gray-100">
              <div className="w-16 h-16 bg-crop-100 rounded-2xl flex items-center justify-center mb-8">
                <Users className="w-8 h-8 text-crop-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">Farmer-Friendly</h3>
              <p className="text-lg text-soil-700">Simple multilingual interface</p>
            </div>

            <div className="bg-white rounded-3xl p-10 border-2 border-gray-100">
              <div className="w-16 h-16 bg-agri-100 rounded-2xl flex items-center justify-center mb-8">
                <Shield className="w-8 h-8 text-agri-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">Real-time Results</h3>
              <p className="text-lg text-soil-700">Instant diagnosis and treatment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
