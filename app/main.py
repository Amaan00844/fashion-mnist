"""
FastAPI inference server for the Fashion-MNIST ANN.

Run locally:
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Endpoints:
    GET  /health          - liveness check
    POST /predict         - JSON body: {"pixels": [784 ints/floats, 0-255]}
    POST /predict-image   - multipart file upload (any image; auto-resized to 28x28 grayscale)
"""
import io
import json
import os
import sys

import numpy as np
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel, Field

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model import MyNN, CLASS_NAMES  # noqa: E402

MODEL_DIR = os.environ.get("MODEL_DIR", os.path.join(os.path.dirname(__file__), "..", "models"))
MODEL_PATH = os.path.join(MODEL_DIR, "fmnist_model.pt")
CONFIG_PATH = os.path.join(MODEL_DIR, "model_config.json")

app = FastAPI(title="Fashion-MNIST Classifier", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://fashion-mnist-rust.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
config = None


@app.on_event("startup")
def load_model():
    global model, config

    if not os.path.exists(CONFIG_PATH) or not os.path.exists(MODEL_PATH):
        raise RuntimeError(
            f"Model files not found in {MODEL_DIR}. "
            f"Run train_final.py first to produce fmnist_model.pt and model_config.json."
        )

    with open(CONFIG_PATH) as f:
        config = json.load(f)

    model = MyNN(
        input_dim=config["input_dim"],
        output_dim=config["output_dim"],
        num_hidden_layers=config["num_hidden_layers"],
        neurons_per_layer=config["neurons_per_layer"],
        dropout_rate=config["dropout_rate"],
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()
    print(f"Model loaded on {device}. Config: {config}")


class PixelRequest(BaseModel):
    pixels: list[float] = Field(..., min_length=784, max_length=784, description="784 grayscale pixel values, 0-255")


class PredictionResponse(BaseModel):
    predicted_class: int
    predicted_label: str
    confidence: float
    probabilities: dict[str, float]


def run_inference(pixels: np.ndarray) -> PredictionResponse:
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    x = torch.tensor(pixels, dtype=torch.float32).unsqueeze(0).to(device)  # (1, 784)
    x = x / 255.0  # must match training normalization

    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    predicted_class = int(np.argmax(probs))
    return PredictionResponse(
        predicted_class=predicted_class,
        predicted_label=CLASS_NAMES[predicted_class],
        confidence=float(probs[predicted_class]),
        probabilities={CLASS_NAMES[i]: float(p) for i, p in enumerate(probs)},
    )


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None, "device": str(device)}


@app.post("/predict", response_model=PredictionResponse)
def predict(req: PixelRequest):
    """Accepts a flat list of 784 pixel values (0-255), row-major 28x28."""
    pixels = np.array(req.pixels, dtype=np.float32)
    if pixels.shape[0] != 784:
        raise HTTPException(status_code=400, detail="pixels must have exactly 784 values")
    return run_inference(pixels)


@app.post("/predict-image", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    """Accepts any image file; converts to grayscale and resizes to 28x28."""
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("L").resize((28, 28))
        pixels = np.array(img, dtype=np.float32).flatten()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not process image: {e}")

    return run_inference(pixels)
