import json
from sklearn.model_selection import train_test_split

# Load the dataset
file_path = "contract_training_data.jsonl"

with open(file_path, "r", encoding="utf-8") as file:
    dataset = [json.loads(line) for line in file]

# Check sample data
print("Sample Data:", dataset[0])


# Define train-test split ratio (80-20)
train_data, val_data = train_test_split(dataset, test_size=0.2, random_state=42)

# Save train set
with open("contract_train.jsonl", "w", encoding="utf-8") as file:
    for entry in train_data:
        file.write(json.dumps(entry) + "\n")

# Save validation set
with open("contract_val.jsonl", "w", encoding="utf-8") as file:
    for entry in val_data:
        file.write(json.dumps(entry) + "\n")

# Display summary
print(f"✅ Training Set: {len(train_data)} samples")
print(f"✅ Validation Set: {len(val_data)} samples")
