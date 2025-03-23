import pandas as pd

# Load CSV file
df = pd.read_csv("F:\LawyerUP\CUAD_v1\master_clauses.csv")  # Ensure correct path


# Extract columns that are clause types (excluding '-Answer' columns)
clause_types = [col for col in df.columns if "-Answer" not in col and col not in ["Filename", "Document Name"]]

print("Extracted Clause Types:", clause_types)

clause_data = {}

for clause in clause_types:
    answer_col = clause + "-Answer"  # Corresponding answer column
    if answer_col in df.columns:
        clause_data[clause] = df[[clause, answer_col]].dropna().to_dict(orient="records")

# Print a sample
import json
print(json.dumps(clause_data["Non-Compete"][:3], indent=2))  # First 3 entries
