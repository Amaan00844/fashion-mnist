"""
Trains ONE final model on the best hyperparameters and saves it for deployment.

This fixes the bug from the Optuna notebook: the original `objective()` built
an Adam/SGD/RMSprop optimizer based on the trial's suggestion but never
assigned it back to the `optimizer` variable, so every trial silently trained
with a hardcoded SGD(lr=0.1, weight_decay=1e-4). That means the tuned
`learning_rate`, `optimizer`, and `weight_decay` values Optuna reported were
never actually used during training — only num_hidden_layers, neurons_per_layer,
dropout_rate, epochs, and batch_size were real.

Run this in Colab (or anywhere with the CSV) after your Optuna search, or adjust
BEST_PARAMS below to whatever architecture you want to lock in. Since the tuned
optimizer/lr/weight_decay were never validated, sensible untuned defaults are
used for those (Adam, lr=1e-3) unless you override them.

Usage:
    python train_final.py --csv fashion-mnist_train.csv --out models/
"""
import argparse
import json
import os

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, Dataset

from model import MyNN

# From study.best_params in your notebook (architecture params only —
# these WERE actually tuned and are trustworthy).
BEST_PARAMS = {
    "num_hidden_layers": 3,
    "neurons_per_layer": 88,
    "epochs": 30,
    "dropout_rate": 0.3,
    "batch_size": 16,
    # NOT trustworthy from the notebook (bug meant these were never applied
    # during search) — using reasonable defaults instead:
    "optimizer": "Adam",
    "learning_rate": 1e-3,
    "weight_decay": 1e-4,
}


class CustomDataset(Dataset):
    def __init__(self, features, labels):
        self.features = torch.tensor(features, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.features)

    def __getitem__(self, index):
        return self.features[index], self.labels[index]


def make_optimizer(name, params, lr, weight_decay):
    if name == "Adam":
        return optim.Adam(params, lr=lr, weight_decay=weight_decay)
    if name == "SGD":
        return optim.SGD(params, lr=lr, weight_decay=weight_decay)
    if name == "RMSprop":
        return optim.RMSprop(params, lr=lr, weight_decay=weight_decay)
    raise ValueError(f"Unknown optimizer: {name}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", default="fashion-mnist_train.csv")
    parser.add_argument("--out", default="models")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    torch.manual_seed(args.seed)
    os.makedirs(args.out, exist_ok=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    df = pd.read_csv(args.csv)
    X = df.iloc[:, 1:].values.astype(np.float32)
    y = df.iloc[:, 0].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=args.seed, stratify=y
    )
    X_train = X_train / 255.0
    X_test = X_test / 255.0

    train_dataset = CustomDataset(X_train, y_train)
    test_dataset = CustomDataset(X_test, y_test)

    p = BEST_PARAMS
    train_loader = DataLoader(train_dataset, batch_size=p["batch_size"], shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=p["batch_size"], shuffle=False)

    input_dim, output_dim = 784, 10
    model = MyNN(input_dim, output_dim, p["num_hidden_layers"], p["neurons_per_layer"], p["dropout_rate"])
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = make_optimizer(p["optimizer"], model.parameters(), p["learning_rate"], p["weight_decay"])

    for epoch in range(p["epochs"]):
        model.train()
        running_loss = 0.0
        for batch_features, batch_labels in train_loader:
            batch_features, batch_labels = batch_features.to(device), batch_labels.to(device)

            outputs = model(batch_features)
            loss = criterion(outputs, batch_labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

        # quick eval each epoch
        model.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for batch_features, batch_labels in test_loader:
                batch_features, batch_labels = batch_features.to(device), batch_labels.to(device)
                outputs = model(batch_features)
                _, predicted = torch.max(outputs, 1)
                total += batch_labels.shape[0]
                correct += (predicted == batch_labels).sum().item()
        acc = correct / total
        print(f"Epoch {epoch+1}/{p['epochs']} - loss: {running_loss/len(train_loader):.4f} - test_acc: {acc:.4f}")

    # Save weights
    model_path = os.path.join(args.out, "fmnist_model.pt")
    torch.save(model.state_dict(), model_path)

    # Save architecture + preprocessing config so the API can rebuild the model
    # without guessing. This is the piece the original notebook was missing entirely.
    config = {
        "input_dim": input_dim,
        "output_dim": output_dim,
        "num_hidden_layers": p["num_hidden_layers"],
        "neurons_per_layer": p["neurons_per_layer"],
        "dropout_rate": p["dropout_rate"],
        "normalization": "divide_by_255",
        "final_test_accuracy": acc,
    }
    config_path = os.path.join(args.out, "model_config.json")
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)

    print(f"\nSaved weights to {model_path}")
    print(f"Saved config to {config_path}")
    print(f"Final test accuracy: {acc:.4f}")


if __name__ == "__main__":
    main()
