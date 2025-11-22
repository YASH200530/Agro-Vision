# app/model.py
import os
import numpy as np
from PIL import Image
import tensorflow as tf
from typing import NamedTuple, Dict, Any

class PredictionResult(NamedTuple):
    label: str
    confidence: float
    extra: Dict[str, Any]

class ModelRunner:
    def __init__(self, model_path="../model/plant_disease_recog_model_pwp.keras"):
        self.model_path = model_path

        if os.path.exists(self.model_path):
            print("✅ Loading Keras model...")
            self.model = tf.keras.models.load_model(self.model_path)
            print("✅ Model loaded successfully!")
        else:
            print("❌ Model not found, using dummy predictor.")
            self.model = None

        # 👇 UPDATE these labels based on your dataset
        self.labels = [
            "Apple Scab",
            "Apple Black Rot",
            "Apple Cedar Rust",
            "Healthy"
        ]

    def preprocess(self, img: Image.Image):
        img = img.resize((224, 224))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)
        return img

    def predict(self, img: Image.Image) -> PredictionResult:
        if self.model is None:
            return PredictionResult(
                label="Unknown",
                confidence=1.0,
                extra={"note": "model not loaded"}
            )

        x = self.preprocess(img)
        preds = self.model.predict(x)[0]

        idx = int(np.argmax(preds))
        confidence = float(preds[idx])
        label = self.labels[idx] if idx < len(self.labels) else str(idx)

        return PredictionResult(
            label=label,
            confidence=confidence,
            extra={"raw_probs": preds.tolist()}
        )
