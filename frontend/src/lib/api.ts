export interface PredictionResponse {
  predicted_class: number;
  predicted_label: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
}

export const CLASS_NAMES = [
  "T-shirt/top",
  "Trouser",
  "Pullover",
  "Dress",
  "Coat",
  "Sandal",
  "Shirt",
  "Sneaker",
  "Bag",
  "Ankle boot",
];

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("fmnist_api_url") || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  }
  return DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("fmnist_api_url", url);
  }
}

export async function checkHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: HealthResponse = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    // Retry with 127.0.0.1 if localhost failed
    try {
      const fallbackUrl = "http://127.0.0.1:8000";
      const res = await fetch(`${fallbackUrl}/health`, { method: "GET" });
      if (res.ok) {
        const data: HealthResponse = await res.json();
        setApiBaseUrl(fallbackUrl);
        return { ok: true, data };
      }
    } catch (_) {}
    return { ok: false, error: err.message || "Failed to connect to FastAPI backend" };
  }
}

/**
 * Sends 784 float pixel vector (0-255) to PyTorch FastAPI backend for real inference.
 */
export async function predictPixels(pixels: number[]): Promise<PredictionResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ pixels }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PyTorch API error (${res.status}): ${errText}`);
  }

  return await res.json();
}

/**
 * Sends image file to FastAPI /predict-image endpoint for real backend preprocessing & inference.
 */
export async function predictImageFile(file: File): Promise<PredictionResponse> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${baseUrl}/predict-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PyTorch Image API error (${res.status}): ${errText}`);
  }

  return await res.json();
}
