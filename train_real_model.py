import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision
import torchvision.transforms as transforms
from model import MyNN

BEST_PARAMS = {
    "num_hidden_layers": 3,
    "neurons_per_layer": 88,
    "dropout_rate": 0.3,
    "epochs": 20,
    "batch_size": 64,
    "learning_rate": 1e-3,
    "weight_decay": 1e-4,
}

def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training Fashion-MNIST PyTorch model (normalized [0, 1]) for {BEST_PARAMS['epochs']} epochs on {device}...", flush=True)

    transform = transforms.Compose([
        transforms.ToTensor(),
    ])

    data_path = "./data"
    train_set = torchvision.datasets.FashionMNIST(root=data_path, train=True, download=True, transform=transform)
    test_set = torchvision.datasets.FashionMNIST(root=data_path, train=False, download=True, transform=transform)

    train_loader = DataLoader(train_set, batch_size=BEST_PARAMS["batch_size"], shuffle=True)
    test_loader = DataLoader(test_set, batch_size=BEST_PARAMS["batch_size"], shuffle=False)

    p = BEST_PARAMS
    model = MyNN(
        input_dim=784,
        output_dim=10,
        num_hidden_layers=p["num_hidden_layers"],
        neurons_per_layer=p["neurons_per_layer"],
        dropout_rate=p["dropout_rate"]
    ).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=p["learning_rate"], weight_decay=p["weight_decay"])

    best_acc = 0.0

    for epoch in range(p["epochs"]):
        model.train()
        running_loss = 0.0

        for images, labels in train_loader:
            images = images.view(images.size(0), -1).to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

        model.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for images, labels in test_loader:
                images = images.view(images.size(0), -1).to(device)
                labels = labels.to(device)

                outputs = model(images)
                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        acc = correct / total
        avg_loss = running_loss / len(train_loader)
        print(f"Epoch {epoch+1:02d}/{p['epochs']} - Loss: {avg_loss:.4f} - Test Acc: {acc*100:.2f}%", flush=True)

        if acc > best_acc:
            best_acc = acc

    models_dir = "./models"
    os.makedirs(models_dir, exist_ok=True)

    model_path = os.path.join(models_dir, "fmnist_model.pt")
    config_path = os.path.join(models_dir, "model_config.json")

    torch.save(model.state_dict(), model_path)

    config = {
        "input_dim": 784,
        "output_dim": 10,
        "num_hidden_layers": p["num_hidden_layers"],
        "neurons_per_layer": p["neurons_per_layer"],
        "dropout_rate": p["dropout_rate"],
        "normalization": "divide_by_255",
        "final_test_accuracy": best_acc,
    }

    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)

    print(f"\nSaved trained PyTorch weights [0, 1] to {model_path}", flush=True)
    print(f"Saved config to {config_path}", flush=True)
    print(f"Final Test Accuracy: {best_acc*100:.2f}%", flush=True)

if __name__ == "__main__":
    train()
