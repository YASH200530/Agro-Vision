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

# Initialize model runner
# The runner expects the model to be in: 
# AgroVision-Backend-Python/model/plant_disease_recog_model_pwp.keras (as a directory)
runner = ModelRunner()

class ImagePayload(BaseModel):
    image: str  # base64-encoded image string

@app.post("/predict", summary="Predict from base64 JSON")
async def predict_from_base64(payload: ImagePayload):
    """
    Accepts JSON: { "image": "<base64 string>" }
    """
    try:
        # Decode base64 string to bytes
        img_bytes = base64.b64decode(payload.image)
        # Open image from bytes and convert to RGB
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        
        result: PredictionResult = runner.predict(img)
        print(result)
        return {"prediction": result.label, "confidence": result.confidence, "extra": result.extra}
    except Exception as e:
        traceback.print_exc()
        # Raise 500 status code for internal server errors
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-file", summary="Predict from multipart/form-data")
async def predict_from_file(file: UploadFile = File(...)):
    """
    Accepts multipart/form-data field 'file' (image file).
    """
    try:
        # Read file contents asynchronously
        contents = await file.read()
        # Open image from bytes and convert to RGB
        img = Image.open(BytesIO(contents)).convert("RGB")
        
        result: PredictionResult = runner.predict(img)
        print(result)
        return {"prediction": result.label, "confidence": result.confidence, "extra": result.extra}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "ok", "message": "AgroVision Python ML backend running"}

if __name__ == "__main__":
    # Runs the application on port 8000 with hot-reloading
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)