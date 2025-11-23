import React from "react";
import { AlertTriangle, TrendingDown, Users, Microscope, Brain, Smartphone } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProblemStatement() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div {...fadeIn}>
            <h1 className="text-4xl md:text-5xl font-bold">{t("problem.title")}</h1>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("problem.subtitle")}
            </p>
          </motion.div>
        </div>

        <motion.div {...fadeIn} transition={{ delay: 0.4 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 mb-10 border">
          <div className="flex items-start mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 mr-4" />
            <div>
              <h2 className="text-2xl font-bold mb-2">The Global Challenge</h2>
              <p className="text-lg">
                Crop diseases cause billions of dollars in losses annually and threaten food security worldwide.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <TrendingDown className="w-10 h-10 text-yellow-600 mr-4" />
            <div>
              <h2 className="text-2xl font-bold mb-2">The Impact</h2>
              <p className="text-lg">
                Poor crop health results in financial instability for farmers and puts strain on the food supply chain.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Solution: AgroVision</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { Icon: Brain, title: "AI Diagnosis", desc: "Fast and accurate identification" },
              { Icon: Microscope, title: "Treatment Advice", desc: "Immediate, practical steps" },
              { Icon: Users, title: "Accessibility", desc: "Multilingual, simple UI" },
              { Icon: Smartphone, title: "Mobile-First", desc: "Lightweight and responsive" },
              { Icon: AlertTriangle, title: "Real-Time", desc: "Instant results from images" },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeIn} transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl text-center border">
                <div className="w-16 h-16 bg-agri-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-agri-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{desc}</p>
              </motion.div>
            ))}
            <motion.div {...fadeIn} transition={{ delay: 1.1 }}
              className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 shadow-xl text-center border flex items-center justify-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">Helping farmers, one leaf at a time.</p>
            </motion.div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/")}
            className="px-10 py-5 text-xl font-bold rounded-2xl text-white bg-agri-600 hover:bg-agri-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
