# Fashion-MNIST ANN — FastAPI Deployment

Deploys the ANN from your Colab notebook as a REST API. See the note at the
bottom about a bug found in the original Optuna search before you rely on
`learning_rate`/`optimizer`/`weight_decay` from `study.best_params`.

## Project layout
```
fmnist_deploy/
├── model.py           # MyNN architecture (shared by training + serving)
├── train_final.py     # Trains ONE final model on best params, saves it
├── app/
│   └── main.py         # FastAPI app: /health, /predict, /predict-image (CORS enabled)
├── frontend/          # Next.js 14 Animated Interactive AI Studio Frontend
│   ├── src/
│   │   ├── app/       # Layouts & Dashboard page
│   │   ├── components/# Canvas, Image Uploader, Sample Picker, Prediction Card, Settings
│   │   └── lib/        # API client, fallback inference, sample presets
│   └── package.json
├── models/              # fmnist_model.pt + model_config.json land here
├── requirements.txt
└── Dockerfile
```

## 1. Train and save the final model

You need `fashion-mnist_train.csv` locally (or in Colab — just download the
file afterward). Run:

```bash
pip install -r requirements.txt
python train_final.py --csv fashion-mnist_train.csv --out models
```

This produces:
- `models/fmnist_model.pt` — the trained weights
- `models/model_config.json` — architecture + preprocessing info the API needs to rebuild the model

If you already have a `.pt` file from your own training run instead, just make
sure `model_config.json` matches the architecture you actually trained
(`num_hidden_layers`, `neurons_per_layer`, `dropout_rate`), and drop both
files into `models/`.

## 2. Run the API locally

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Test it:
```bash
curl http://localhost:8000/health

# JSON prediction (784 raw pixel values, 0-255, row-major 28x28)
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"pixels": [0, 0, ... 784 values total]}'

# Image upload (any image; auto-converted to 28x28 grayscale)
curl -X POST http://localhost:8000/predict-image -F "file=@shirt.jpg"
```

## 3. Run the Next.js Frontend Studio

Navigate to the `frontend` folder and launch the dev server:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Frontend Features:
- 🎨 **Interactive 28×28 Drawing Pad**: Draw custom fashion items with brush controls and instant downscaled tensor extraction.
- 🖼️ **Drag & Drop Image Uploader**: Upload real fashion photos with auto 28×28 grayscale conversion preview.
- 📦 **Benchmark Sample Presets**: Instant one-click classification of 10 canonical Fashion-MNIST category presets.
- 📊 **Animated Probabilities Chart**: Framer Motion animated bars displaying all 10 softmax class probabilities with celebratory micro-interactions.
- ⚡ **Offline Demo Fallback**: Built-in fallback prediction engine so the UI works seamlessly even when the backend is offline during portfolio demos.

## 4. Deploy with Docker

```bash
docker build -t fmnist-api .
docker run -p 8000:8000 fmnist-api
```

Push that image to any container host — Render, Railway, Fly.io, AWS
ECS/App Runner, GCP Cloud Run, Azure Container Apps — all take a Dockerfile
directly. Cloud Run / Render's free tiers are the least fuss for a portfolio
deployment.

## Bug fixed from the original notebook

In the Optuna `objective()` function, the tuned optimizer was built but never
assigned back to the `optimizer` variable used in training:

```python
optimizer = optim.SGD(model.parameters(), lr=0.1, weight_decay=1e-4)  # always this

if optimizer_name == 'Adam':
    optim.Adam(...)   # created, but discarded
```

So every trial actually trained with a hardcoded `SGD(lr=0.1, weight_decay=1e-4)`,
regardless of what Optuna suggested. That means:
- `num_hidden_layers`, `neurons_per_layer`, `dropout_rate`, `epochs`, `batch_size` in `study.best_params` **are trustworthy** — they were genuinely varied and their effect on accuracy is real.
- `optimizer`, `learning_rate`, `weight_decay` in `study.best_params` **are not** — they were logged but never applied.

`train_final.py` fixes the assignment bug and uses the validated architecture
params, with sensible (untuned) defaults for optimizer/lr/weight_decay. If you
want those genuinely tuned too, rerun the Optuna search with the fix applied
(swap `epochs` in `range(epochs)`, and cap it — 50 epochs × up to 5 hidden
layers × 50 trials will take a while even on a GPU) before locking in
`BEST_PARAMS`.
