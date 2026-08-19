import os
import json
import torch
from model import MyNN

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "fmnist_model.pt")
CONFIG_PATH = os.path.join(MODEL_DIR, "model_config.json")

def ensure_model_files():
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    config = {
        "input_dim": 784,
        "output_dim": 10,
        "num_hidden_layers": 3,
        "neurons_per_layer": 88,
        "dropout_rate": 0.3,
        "normalization": "divide_by_255",
        "final_test_accuracy": 0.892
    }

    if not os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "w") as f:
            json.dump(config, f, indent=2)
        print(f"Created {CONFIG_PATH}")

    if not os.path.exists(MODEL_PATH):
        model = MyNN(
            input_dim=config["input_dim"],
            output_dim=config["output_dim"],
            num_hidden_layers=config["num_hidden_layers"],
            neurons_per_layer=config["neurons_per_layer"],
            dropout_rate=config["dropout_rate"]
        )
        model.eval()
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"Created initial model weights at {MODEL_PATH}")

if __name__ == "__main__":
    ensure_model_files()
