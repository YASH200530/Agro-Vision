// Routes/analysis.js
const express = require("express");
const multer = require("multer");
const FormData = require("form-data");

// node-fetch v3 ESM + CommonJS workaround
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();
const upload = multer(); // in-memory storage

// Health check: GET /api/analysis
router.get("/", (req, res) => {
  res.json({ msg: "Analysis route working" });
});

/**
 * 1) Multipart → FastAPI /predict-file
 * POST /api/analysis/analyze-image-file
 */
router.post("/analyze-image-file", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    const formData = new FormData();
    // FastAPI expects "file" as the field name
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const resp = await fetch("http://localhost:8000/predict-file", {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("FastAPI /predict-file error:", errorText);
      return res.status(500).json({
        ok: false,
        message: "Python backend error (predict-file)",
        detail: errorText,
      });
    }

    // FastAPI returns: { prediction, confidence, extra }
    const data = await resp.json();
    const extra = data.extra || {};

    return res.json({
      ok: true,
      analysis: {
        diagnosis: data.prediction,     // e.g. "Tomato___Tomato_mosaic_virus"
        confidence: data.confidence,    // 0–1 from Python
        cause: extra.cause,             // "Virus transmitted..."
        cure: extra.cure,               // "Remove infected plants..."
        raw_probs: extra.raw_probs,     // full probs if you ever need them
      },
    });
  } catch (err) {
    console.error("Error in /analyze-image-file:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});

/**
 * 2) Base64 JSON → FastAPI /predict
 * POST /api/analysis/analyze-image-base64
 */
router.post("/analyze-image-base64", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    const base64 = file.buffer.toString("base64");

    const resp = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("FastAPI /predict error:", errorText);
      return res.status(500).json({
        ok: false,
        message: "Python backend error (predict)",
        detail: errorText,
      });
    }

    const data = await resp.json();
    const extra = data.extra || {};

    return res.json({
      ok: true,
      analysis: {
        diagnosis: data.prediction,
        confidence: data.confidence,
        cause: extra.cause,
        cure: extra.cure,
        raw_probs: extra.raw_probs,
      },
    });
  } catch (err) {
    console.error("Error in /analyze-image-base64:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
