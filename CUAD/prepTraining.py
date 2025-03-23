import json
import pandas as pd

# Load cleaned clauses JSON
with open("cleaned_clauses.json", "r", encoding="utf-8") as f:
    clause_data = json.load(f)

# Convert to Pandas DataFrame
df = pd.DataFrame(clause_data)

# Convert to a format suitable for model training (prompt → response)
training_data = []
for _, row in df.iterrows():
    for clause, value in row.items():
        prompt = f"Generate a contract clause for: {clause}"
        response = value
        training_data.append({"prompt": prompt, "response": response})

# Save as JSONL (for LLM fine-tuning)
output_file = "contract_training_data.jsonl"
with open(output_file, "w", encoding="utf-8") as f:
    for entry in training_data:
        f.write(json.dumps(entry) + "\n")

print(f"✅ Training data saved to {output_file}")
