# **AI-Generated Legal Drafts and Contracts**

**Problem 6: AI-generated Legal Drafts and Contracts**  
A **Generative AI** system that helps businesses and lawyers quickly draft customized contracts and legal documents based on user-defined clauses and inputs.

---

## **Table of Contents**
1. [**Overview**](#overview)  
2. [**Key Features**](#key-features)  
3. [**Tech Stack**](#tech-stack)  
4. [**Challenges Faced**](#challenges-faced)  
5. [**Future Improvements**](#future-improvements)  
6. [**How It Works**](#how-it-works)  
7. [**Project Structure**](#project-structure)  
8. [**Usage Instructions**](#usage-instructions)  
9. [**License**](#license)  

---

## **Overview**
This project is a **Generative AI-based contract generator** that creates legally structured contracts dynamically based on user inputs. Unlike traditional template-based approaches, the system leverages **Large Language Models (LLMs)** to generate customized contracts tailored to specific needs, such as:
- **Employment agreements**  
- **Business contracts**  
- **Non-Disclosure Agreements (NDAs)**  
- **Rental agreements**  
- **And more...**

Users can enter key details such as party names, contract terms, responsibilities, compensation, and conditions. The AI then generates a legally formatted contract containing essential clauses like **confidentiality**, **dispute resolution**, and **termination policies**.

The system runs on **GPU-accelerated environments** (e.g., Google Colab or other GPU backends) to ensure **efficient text generation** and handles the computationally intensive tasks involved in large-scale language modeling.

---

## **Key Features**
- **Dynamic Contract Generation**: No reliance on rigid templates; each contract is generated uniquely based on user input.  
- **Clause Customization**: Users can specify particular clauses (e.g., confidentiality, termination, dispute resolution).  
- **Scalable & Efficient**: Runs on GPU-accelerated setups to handle large model computations.  
- **Extensible**: Designed to easily add new contract types or domain-specific clauses.

---

## **Tech Stack**
### **Frontend**
- **Next.js**: React framework for building the ChatGPT-like interface.  
- **Prisma ORM**: Database toolkit for seamless interaction with the PostgreSQL database.  
- **PostgreSQL**: Relational database for storing user inputs, contract data, or usage logs.  
- **tRPC Routing**: Type-safe APIs and client-server communication.  
- **TypeScript**: Strongly typed language for improved developer experience and reliability.

### **Generative AI**
- **Hugging Face Transformers / Large Language Models (LLMs)**: The core text-generation functionality.  
- **GPU Accelerators**: (e.g., Google Colab, AWS, etc.) for model inference.  
- **LangChain**: (Optional) For chaining multiple LLM calls, vector databases, and advanced prompt engineering.  

---

## **Challenges Faced**
1. **Limitation of Available GPU Processing Power**  
   Running large models can be computationally expensive and time-consuming without robust GPU resources.

2. **Lack of Legal Accuracy**  
   LLMs may generate legally plausible but not always accurate or jurisdiction-specific clauses.

3. **No Labeled Dataset**  
   Without a specialized, labeled legal dataset, the system relies on pre-trained models and prompt engineering to guide contract generation.

---

## **Future Improvements**
1. **Multilingual Support**  
   Enable contract generation in multiple languages for international or regional legal needs.

2. **Automated Legal Compliance Checks**  
   Integrate with legal databases or compliance checkers to ensure the generated contracts adhere to specific local regulations.

---

## **How It Works**
1. **User Inputs**: The user provides contract details (e.g., party names, scope of work, compensation, timelines).  
2. **LLM Processing**: The model processes the input using prompt templates designed for legal language.  
3. **Contract Generation**: The system outputs a fully drafted contract, including standard clauses and user-specific details.  
4. **User Review & Edit**: The generated contract can be reviewed, edited, or further customized before finalization.
![1c76cf6e-a30c-4d74-8047-6dcfac0b5073](https://github.com/user-attachments/assets/141d3340-d020-415d-ad0d-3a9266503844)

---

![dbf4dde1-830c-4dfc-8460-8c8539b05f67](https://github.com/user-attachments/assets/01f04b6a-21ae-44de-a2eb-6b69cbc025be)


![6d804890-74ef-44c7-9f6a-aa0aa99c43e3](https://github.com/user-attachments/assets/5bb15474-ae6e-481d-b098-9ac6870625a2)
![501a603e-7cb0-4703-acd8-15409b5f4ba2](https://github.com/user-attachments/assets/1893c51d-b79f-4898-9009-2b5b9c1cd5ad)
![1fd3dfae-6525-4eca-a98d-b8683bcad178](https://github.com/user-attachments/assets/f0295620-81d2-45f0-940c-776892ad00c8)
