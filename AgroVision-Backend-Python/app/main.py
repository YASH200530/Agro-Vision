# app/main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import base64
from io import BytesIO
from PIL import Image
import traceback
import uvicorn

from .model import ModelRunner, PredictionResult

app = FastAPI(title="AgroVision ML Inference")

# Allow requests from your Node backend (adjust origin for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model runner (loads model if available)
runner = ModelRunner(model_path="../model/model.pt")  # relative to app folder

class ImagePayload(BaseModel):
    image: str  # base64-encoded image string

@app.post("/predict", summary="Predict from base64 JSON")
async def predict_from_base64(payload: ImagePayload):
    """
    Accepts JSON: { "image": "<base64 string>" }
    """
    try:
        img_bytes = base64.b64decode(payload.image)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        result: PredictionResult = runner.predict(img)
        return {"prediction": result.label, "confidence": result.confidence, "extra": result.extra}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-file", summary="Predict from multipart/form-data")
async def predict_from_file(file: UploadFile = File(...)):
    """
    Accepts multipart/form-data field 'file' (image file).
    """
    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert("RGB")
        result: PredictionResult = runner.predict(img)
        return {"prediction": result.label, "confidence": result.confidence, "extra": result.extra}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "ok", "message": "AgroVision Python ML backend running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
