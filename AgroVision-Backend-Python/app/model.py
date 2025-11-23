import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from typing import NamedTuple, Dict, Any

class PredictionResult(NamedTuple):
    label: str
    confidence: float
    extra: Dict[str, Any]

class ModelRunner:
    def __init__(self, model_path=None):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(BASE_DIR, "..", "model", "plant_disease_recog_model_pwp")
        self.model_path = os.path.abspath(self.model_path)

        print("🔍 Looking for model at:", self.model_path)

        if os.path.exists(self.model_path):
            try:
                print("✅ Loading Keras model...")
                self.model = tf.keras.models.load_model(self.model_path)
                print("✅ Model loaded successfully!")
            except Exception as e:
                print(f"❌ Error loading model: {e}")
                self.model = None
        else:
            print("❌ Model directory not found, using dummy predictor.")
            self.model = None

        # Load disease info from your JSON file
        json_path = os.path.join(BASE_DIR, "disease_info.json")
        with open(json_path, "r") as f:
            self.disease_info = json.load(f)

        # Extract labels for model output
        self.labels = list(self.disease_info.keys())

    def preprocess(self, img: Image.Image):
        # Resize to match model input
        img = img.resize((160, 160))
        img = np.array(img) / 255.0
        img = np.expand_dims(img, axis=0)  # (1, H, W, C)
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
        label = self.labels[idx] if idx < len(self.labels) else str(idx)
        confidence = float(preds[idx])

        disease_info = self.disease_info.get(label, {"cause": "Unknown", "cure": "Unknown"})

        return PredictionResult(
            label=label,
            confidence=confidence,
            extra={
                "raw_probs": preds.tolist(),
                "cause": disease_info["cause"],
                "cure": disease_info["cure"]
            }
        )
