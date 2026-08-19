# 👗 Fashion-MNIST AI Studio — PyTorch & Next.js 14

[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js 14](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A full-stack, real-time Machine Learning application for Fashion-MNIST clothing classification powered by a custom **PyTorch Artificial Neural Network (ANN)** served via **FastAPI** on Render, paired with a modern, animated **Next.js 14 glassmorphism frontend** on Vercel.

---

## 🌐 Live Production Links

- 🎨 **Frontend Web App**: [https://fashion-mnist-seven.vercel.app/](https://fashion-mnist-seven.vercel.app/)
- ⚡ **Backend REST API**: [https://fashion-mnist-6tpf.onrender.com/](https://fashion-mnist-6tpf.onrender.com/)
- 📚 **Interactive Swagger API Docs**: [https://fashion-mnist-6tpf.onrender.com/docs](https://fashion-mnist-6tpf.onrender.com/docs)
- 🏥 **Backend Health Check**: [https://fashion-mnist-6tpf.onrender.com/health](https://fashion-mnist-6tpf.onrender.com/health)

---

## 🌟 Key Features

### 1. 🎨 Interactive HTML5 28×28 Draw Studio
- Freehand drawing pad with custom brush size sliders, background color inversion, and canvas reset.
- Live client-side downsampling from high-resolution canvas to flat 784-pixel grayscale vector matrix (values `0–255`).

### 2. 🖼️ Drag & Drop Image Uploader
- Upload any fashion photo (PNG, JPG, WebP).
- Client-side 28×28 grayscale preprocessing preview before sending to the PyTorch `/predict-image` endpoint.

### 3. 📦 Benchmark Sample Presets
- Instant one-click test predictions for all 10 canonical Fashion-MNIST categories:
  `T-shirt/top`, `Trouser`, `Pullover`, `Dress`, `Coat`, `Sandal`, `Shirt`, `Sneaker`, `Bag`, `Ankle boot`.

### 4. 📊 Animated Probability Visualizer
- **Framer Motion** animated bar charts displaying softmax class probabilities across all 10 categories.
- Confidence percentage gauge and celebratory confetti micro-interactions on high-confidence predictions (>80%).

### 5. 🏥 Real-Time Health & CORS Monitor
- Live health check heartbeat pinging `/health`.
- Built-in API configuration modal to dynamically switch or test custom API endpoints.

---

## 🏗️ Architecture & Model Specs

```
                    ┌─────────────────────────────────────────┐
                    │       Next.js 14 Frontend Studio        │
                    │   (HTML5 Canvas, Framer Motion, Vercel) │
                    └────────────────────┬────────────────────┘
                                         │
                                  HTTP / JSON & Multipart
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │          FastAPI REST Backend           │
                    │      (Python 3.11, Docker, Render)      │
                    └────────────────────┬────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │      PyTorch Neural Network (MyNN)      │
                    │   Input: 784 ➔ Hidden: 3x88 ➔ Out: 10   │
                    │       Accuracy: 88.30% (20 Epochs)      │
                    └─────────────────────────────────────────┘
```

### PyTorch Architecture (`model.py`)
- **Input Dimension**: 784 (Flattened 28×28 grayscale pixels)
- **Hidden Layers**: 3 Fully-Connected Linear Layers (88 neurons/layer)
- **Normalization & Regularization**: `BatchNormalization1d` + `Dropout(0.3)` + `ReLU` activation
- **Output Layer**: Linear(88 ➔ 10) + `Softmax` activation for multi-class classification
- **Final Test Accuracy**: **88.30%** (Trained on 60,000 Zalando Fashion-MNIST samples)

---

## 📁 Repository Structure

```
fashion-mnist/
├── app/
│   └── main.py              # FastAPI app: /health, /predict, /predict-image (CORS enabled)
├── frontend/                # Next.js 14 Animated Interactive AI Studio
│   ├── src/
│   │   ├── app/             # Next.js App Router layout & page
│   │   ├── components/      # DrawingCanvas, ImageUploader, SamplePicker, PredictionCard, Header, Settings
│   │   └── lib/             # API client, sample matrix generators
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vercel.json          # Vercel deployment configuration
├── models/
│   ├── fmnist_model.pt      # Trained PyTorch state dict weights
│   └── model_config.json    # Architecture & normalization metadata
├── model.py                 # Shared MyNN PyTorch architecture definition
├── train_real_model.py      # Automated Fashion-MNIST downloader & trainer (20 epochs)
├── train_final.py           # Training script with Optuna hyperparameter bugfix
├── requirements.txt         # Python dependencies
├── Dockerfile               # Containerized deployment file
└── render.yaml              # Render blueprint deployment file
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

### 2. Backend Setup (FastAPI + PyTorch)

```bash
# Clone the repository
git clone https://github.com/Amaan00844/fashion-mnist.git
cd fashion-mnist

# Install Python dependencies
pip install -r requirements.txt

# Train or verify model weights (Optional)
python train_real_model.py

# Start the FastAPI server locally
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The REST API will be running at `http://127.0.0.1:8000`. Interactive docs available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup (Next.js 14)

```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 REST API Reference

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "device": "cpu"
}
```

### 2. Predict Pixel Array
```http
POST /predict
Content-Type: application/json

{
  "pixels": [0, 0, ..., 255, 0]  // 784 float values (0-255)
}
```
**Response:**
```json
{
  "predicted_class": 7,
  "predicted_label": "Sneaker",
  "confidence": 0.9842,
  "probabilities": {
    "T-shirt/top": 0.0012,
    "Trouser": 0.0003,
    "Pullover": 0.0008,
    "Dress": 0.0005,
    "Coat": 0.0004,
    "Sandal": 0.0081,
    "Shirt": 0.0011,
    "Sneaker": 0.9842,
    "Bag": 0.0018,
    "Ankle boot": 0.0014
  }
}
```

### 3. Predict Uploaded Image
```http
POST /predict-image
Content-Type: multipart/form-data

file: <binary image file>
```
*(Automatically converts any uploaded image format to 28×28 grayscale before running inference).*

---

## 🛠️ Production Deployment Guide

### Deploying Backend to Render (Docker)
1. Log in to [Render.com](https://render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository `Amaan00844/fashion-mnist`.
3. Select **Docker** environment (Render auto-detects `Dockerfile`).
4. Select the **Free** tier and click **Create Web Service**.

### Deploying Frontend to Vercel
1. Log in to [Vercel.com](https://vercel.com/) and click **Add New...** > **Project**.
2. Import repository `Amaan00844/fashion-mnist`.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://fashion-mnist-6tpf.onrender.com`
5. Click **Deploy**.

---

## 🐛 Bug Fix Note (Original Optuna Search)

In the original notebook's Optuna `objective()` function, tuned optimizers (`Adam`, `RMSprop`) were instantiated but never assigned back to the `optimizer` variable used during training:

```python
optimizer = optim.SGD(model.parameters(), lr=0.1, weight_decay=1e-4)

if optimizer_name == 'Adam':
    optim.Adam(...)   # created but discarded
```

Thus, every trial trained with hardcoded `SGD(lr=0.1)`. `train_final.py` and `train_real_model.py` fix this bug by properly assigning `Adam` with `lr=1e-3` while keeping the validated architecture parameters (`num_hidden_layers=3`, `neurons_per_layer=88`, `dropout_rate=0.3`).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
