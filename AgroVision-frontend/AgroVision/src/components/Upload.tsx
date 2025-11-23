import React, { useState, useRef } from "react";
import {
  Upload as UploadIcon,
  Camera,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface PredictionResult {
  disease: string;      // nicely formatted label
  confidence: number;   // percentage 0–100
  treatment: string;    // cure text
  cause?: string;       // cause text
}

// Toggle which backend route you want to use:
const USE_BASE64_ENDPOINT = false;
// false -> /api/analysis/analyze-image-file
// true  -> /api/analysis/analyze-image-base64

// Helper to prettify "Tomato___Tomato_mosaic_virus"
const formatDiseaseLabel = (label: string | undefined | null): string => {
  if (!label) return "";
  const [plant, rawDisease] = label.split("___");
  const diseasePart = (rawDisease || plant || "").replace(/_/g, " ");
  return rawDisease ? `${plant} - ${diseasePart}` : diseasePart;
};

export default function Upload() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    // field name must be "image" to match upload.single("image")
    formData.append("image", selectedImage);

    try {
      const base =
        (import.meta.env.VITE_API_URL as string) || "http://localhost:5001";

      const endpoint = USE_BASE64_ENDPOINT
        ? "/api/analysis/analyze-image-base64"
        : "/api/analysis/analyze-image-file";

      const res = await fetch(`${base}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.ok && data.analysis) {
        const rawConf = typeof data.analysis.confidence === "number"
          ? data.analysis.confidence
          : 0;

        setResult({
          disease: formatDiseaseLabel(data.analysis.diagnosis),
          confidence: Math.round(rawConf * 100), // 0.99 -> 99
          treatment: data.analysis.cure || "No treatment information available.",
          cause: data.analysis.cause,
        });
      } else {
        alert(data.message || "AI analysis failed.");
        setResult({
          disease: "Analysis Failed",
          confidence: 0,
          treatment: "Try a clearer image.",
        });
      }
    } catch (e) {
      alert("Network/server error.");
      setResult({
        disease: "Connection Error",
        confidence: 0,
        treatment: "Server unreachable.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 85) return "text-agri-600 dark:text-agri-400";
    if (confidence > 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const StatusIcon = result?.disease === "Healthy" ? CheckCircle : AlertCircle;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-500 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          {t("upload.title")}
        </h1>

        {!result ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-4 border-dashed border-gray-200 dark:border-gray-700 transition-all duration-300">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected Leaf"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg mb-6"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setResult(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex items-center px-8 py-4 rounded-2xl text-white bg-agri-600 hover:bg-agri-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        {t("upload.analyzing")}
                      </>
                    ) : (
                      t("upload.analyze_button")
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files[0])
                    handleFileSelect(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-16 text-center rounded-2xl border-4 border-dashed cursor-pointer transition-all duration-300 
                  ${
                    dragOver
                      ? "border-agri-500 bg-agri-50/50"
                      : "border-gray-300 dark:border-gray-600 hover:border-agri-400 dark:hover:border-agri-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <UploadIcon className="w-12 h-12 text-agri-600 mb-4" />
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("upload.drag_drop")}
                </p>
                <p className="text-lg text-gray-500 mb-4">
                  {t("upload.click_to_browse")}
                </p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center px-5 py-3 border-2 border-agri-500 rounded-xl text-agri-600 bg-white hover:bg-agri-50"
                  >
                    <UploadIcon className="w-4 h-4 mr-2" />
                    {t("upload.browse_file")}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="inline-flex items-center px-5 py-3 border-2 border-agri-500 rounded-xl text-agri-600 bg-white hover:bg-agri-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t("upload.use_camera")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-2xl border-4 border-agri-200 dark:border-agri-700">
            <h2 className="text-3xl font-bold text-center mb-6">
              {t("upload.results.title")}
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <img
                  src={imagePreview!}
                  alt="Selected Leaf"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <StatusIcon
                      className={`w-8 h-8 ${
                        result.disease === "Healthy"
                          ? "text-agri-600"
                          : "text-red-600"
                      }`}
                    />
                    <h3 className="text-3xl font-bold">{result.disease}</h3>
                  </div>
                  <p
                    className={`text-2xl font-bold ${getConfidenceColor(
                      result.confidence
                    )}`}
                  >
                    {result.confidence}%
                  </p>
                </div>

                {/* Cause */}
                {result.cause && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-xl font-bold text-agri-600 mb-2">
                      Cause
                    </h4>
                    <p className="text-lg">{result.cause}</p>
                  </div>
                )}

                {/* Treatment / Cure */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-xl font-bold text-agri-600 mb-2">
                    {t("upload.results.treatment")}
                  </h4>
                  <p className="text-lg">{result.treatment}</p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: "AgroVision Diagnosis",
                            text: `Diagnosis: ${result.disease} (${result.confidence}%)`,
                            url: window.location.href,
                          })
                          .catch(() => void 0);
                      } else {
                        alert("Web Share API not supported.");
                      }
                    }}
                    className="inline-flex items-center px-8 py-4 border-2 border-agri-600 rounded-xl text-white bg-agri-600 hover:bg-agri-700"
                  >
                    <Share2 className="w-5 h-5 mr-3" />{" "}
                    {t("upload.results.share")}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setResult(null);
                      setIsAnalyzing(false);
                    }}
                    className="inline-flex items-center px-8 py-4 border-2 rounded-xl"
                  >
                    <UploadIcon className="w-5 h-5 mr-3" />{" "}
                    {t("upload.results.retry")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0])
          }
        />
      </div>
    </div>
  );
}
