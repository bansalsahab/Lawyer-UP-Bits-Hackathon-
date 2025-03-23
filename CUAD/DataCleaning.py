import pandas as pd


# Load your dataset
df = pd.read_csv("F:\LawyerUP\CUAD_v1\master_clauses.csv")  # Replace with your actual file


import pandas as pd
import json

# Load dataset

# Extract relevant clause columns (both clause and answer)
clause_columns = [col for col in df.columns if "-Answer" in col]
clauses_data = []

# Iterate through each row and extract structured clause information
for _, row in df.iterrows():
    contract_data = {}
    for clause in clause_columns:
        clause_name = clause.replace("-Answer", "").strip()
        clause_value = row[clause]

        # Standardize empty values
        if pd.isna(clause_value) or clause_value == "[]":
            clause_value = "Not Mentioned"
        
        contract_data[clause_name] = clause_value
    
    clauses_data.append(contract_data)

# Save extracted clauses to JSON
output_path = "cleaned_clauses.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(clauses_data, f, indent=4)

print(f"✅ Extracted clauses saved to {output_path}")

