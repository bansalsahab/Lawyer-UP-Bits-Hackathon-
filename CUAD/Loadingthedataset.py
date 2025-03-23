import json

# Load CUAD_v1 dataset
with open("CUAD_v1\CUAD_v1.json", "r", encoding="utf-8") as f:
    cuad_data = json.load(f)

# Check dataset structure
print(type(cuad_data))  # Should be a dictionary
print(cuad_data.keys())  # Expected: ['data']

# Extract the first contract
first_contract = cuad_data["data"][0]

# Print contract details
print("Contract Title:", first_contract["title"])
print("\nFirst Contract Keys:", first_contract.keys())  # Expected: ['title', 'paragraphs']

# Check paragraph structure
print("\nParagraph Keys:", first_contract["paragraphs"][0].keys())  # Expected: ['context', 'qas']

# Print first paragraph text (trimmed for readability)
print("\nContract Text (First 500 chars):", first_contract["paragraphs"][0]["context"][:500])

# Check annotations (questions & answers)
print("\nAnnotations Example:", first_contract["paragraphs"][0]["qas"][:2])  # Print first 2 annotations


import json
import pandas as pd

# Load CUAD JSON file
cuad_path = "CUAD_v1/CUAD_v1.json"
with open(cuad_path, "r", encoding="utf-8") as file:
    cuad_data = json.load(file)

# Extract data into a list
contract_list = []

for contract in cuad_data["data"]:
    contract_title = contract["title"]
    
    for paragraph in contract["paragraphs"]:
        paragraph_text = paragraph["context"]
        
        for qa in paragraph["qas"]:
            clause_type = qa["question"]  # Clause category
            for answer in qa["answers"]:
                extracted_text = answer["text"]
                contract_list.append([contract_title, paragraph_text, clause_type, extracted_text])

# Convert to DataFrame
df = pd.DataFrame(contract_list, columns=["Contract Title", "Paragraph Text", "Clause Type", "Extracted Clause"])

# Display first few rows
print(df.head())



