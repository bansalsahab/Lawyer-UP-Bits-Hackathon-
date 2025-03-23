import os
import torch
from datasets import load_dataset
from transformers import (AutoModelForCausalLM, AutoTokenizer, TrainingArguments, 
                          Trainer, DataCollatorForLanguageModeling)
from peft import get_peft_model, LoraConfig, TaskType

# Hardcoded Hugging Face Access Token and Model Name
HF_TOKEN = "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"  # Replace with your token
MODEL_NAME = "meta-llama/Llama-2-7b-hf"

os.environ["HF_TOKEN"] = HF_TOKEN

# ✅ Fix: Force Model to Load on CPU first, then move to GPU if possible
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=HF_TOKEN)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # ✅ Fix: Set PAD token

# ✅ Fix: Use `max_memory` to avoid meta tensor issues
max_memory = {i: "10GiB" for i in range(torch.cuda.device_count())}  # Adjust memory limits per GPU

# ✅ Fix: Load Model Efficiently
# Load model with `max_memory`
# Load model with `max_memory`
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16,
    device_map="auto"
)

# ✅ Fix: Properly initialize model to avoid meta tensor errors
model.to_empty(device=device)  # Clears meta tensors
model.to(device)  # Moves model to GPU/CPU
 # Move model to GPU/CPU



print("✅ Model and Tokenizer loaded successfully!")

# ✅ Enable gradient checkpointing for memory efficiency
model.gradient_checkpointing_enable()

# Step 1: Load dataset
dataset = load_dataset("json", data_files={"train": "contract_train.jsonl", "validation": "contract_val.jsonl"})

# Step 2: Apply LoRA for fine-tuning
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,
    lora_alpha=16,
    lora_dropout=0.05
)
model = get_peft_model(model, lora_config)

# ✅ Fix: Don't move entire model at once (keep some parts on CPU if needed)
model.to_empty(device=device)  # ✅ Correct
  # ✅ Move model to GPU/CPU after emptying


# Step 3: Preprocess Dataset
def preprocess_function(examples):
    inputs = tokenizer(examples["prompt"], padding="max_length", truncation=True, max_length=512)
    outputs = tokenizer(examples["response"], padding="max_length", truncation=True, max_length=512)
    inputs["labels"] = outputs["input_ids"]
    return inputs

tokenized_datasets = dataset.map(preprocess_function, batched=True, remove_columns=["prompt", "response"])

# Step 4: Data Collator
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# Step 5: Define Training Arguments
training_args = TrainingArguments(
    output_dir="./llama_finetuned_contracts",
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=4,
    evaluation_strategy="steps",
    save_strategy="steps",
    save_steps=500,
    eval_steps=500,
    logging_dir="./logs",
    learning_rate=2e-4,
    weight_decay=0.01,
    warmup_steps=100,
    bf16=torch.cuda.is_bf16_supported(),
    fp16=not torch.cuda.is_bf16_supported(),
    num_train_epochs=3,
    remove_unused_columns=False,
    report_to="none",
    push_to_hub=False
)

# Step 6: Train Model
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator
)

trainer.train()

# Step 7: Save fine-tuned model
os.makedirs("./llama_finetuned_contracts", exist_ok=True)
model.save_pretrained("./llama_finetuned_contracts")
tokenizer.save_pretrained("./llama_finetuned_contracts")

print("✅ LLaMA fine-tuning complete! Model saved successfully.")
