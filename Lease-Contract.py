#!/usr/bin/env python
import os
import sys
import time
import logging
import argparse
import json
from typing import Dict, Any, List, Optional
from pathlib import Path
from dataclasses import dataclass
import openai
from fpdf import FPDF, Align, XPos, YPos
from dotenv import load_dotenv
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# region Constants and Configuration
DEFAULT_CONFIG = {
    "api_settings": {
        "base_url": "https://openrouter.ai/api/v1",
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "retries": 3,
        "timeout": 30,
    },
    "pdf_settings": {
        "font_family": "Arial",
        "title_size": 16,
        "header_size": 12,
        "body_size": 10,
        "margin": 15,
        "line_height": 8
    },
    "logging_settings": {
        "level": "INFO",
        "max_files": 7,
        "file_size": 1048576
    }
}

CONFIG_PATH = Path.home() / ".config" / "contract_gen" / "config.json"
ENV_PATH = Path(__file__).parent / ".env"
# endregion

# region Data Classes
@dataclass
class ContractDetails:
    tenant: str
    owner: str
    property_address: str
    duration_months: int
    clauses: List[str]
    jurisdiction: str = "Chennai"

@dataclass
class DocumentSettings:
    output_format: str = "pdf"
    output_dir: Path = Path.cwd() / "contracts"
    anonymize: bool = False
# endregion

class ContractGenerator:
    """Core class handling contract generation workflow"""
    
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
        self.config = self._load_config()
        self._setup_environment()
        
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from file or create default"""
        try:
            if CONFIG_PATH.exists():
                with open(CONFIG_PATH) as f:
                    return json.load(f)
            CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(CONFIG_PATH, "w") as f:
                json.dump(DEFAULT_CONFIG, f, indent=4)
            return DEFAULT_CONFIG
        except Exception as e:
            self.logger.critical("Config initialization failed: %s", e)
            sys.exit(1)

    def _setup_environment(self) -> None:
        """Initialize environment variables"""
        load_dotenv(ENV_PATH)
        if not os.getenv("OPENROUTER_API_KEY"):
            self.logger.error("Missing API key in environment")
            sys.exit(1)

    def _create_api_client(self) -> openai.OpenAI:
        """Configure API client with retry logic"""
        retry_strategy = Retry(
            total=self.config["api_settings"]["retries"],
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session = requests.Session()
        session.mount("https://", adapter)

        return openai.OpenAI(
            base_url=self.config["api_settings"]["base_url"],
            api_key=os.getenv("OPENROUTER_API_KEY"),
            http_client=session
        )

    def generate_contract(self, details: ContractDetails) -> str:
        """Generate contract text using LLM API"""
        client = self._create_api_client()
        prompt = self._build_prompt(details)
        
        try:
            response = client.chat.completions.create(
                model=self.config["api_settings"]["model"],
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except openai.APIError as e:
            self.logger.error("API request failed: %s", e)
            sys.exit(1)

    def _build_prompt(self, details: ContractDetails) -> str:
        """Construct detailed prompt for contract generation"""
        return f"""Generate a comprehensive {details.duration_months}-month lease agreement between:
- Tenant: {details.tenant}
- Owner: {details.owner}
- Property: {details.property_address}
Jurisdiction: {details.jurisdiction}

Include these key clauses:
{'\n'.join(f'• {c}' for c in details.clauses)}

Structure the document with:
1. Title page
2. Definitions section
3. Detailed clauses
4. Signatures block
5. Jurisdiction-specific legal boilerplate

Use formal legal language while maintaining readability."""

class DocumentFormatter:
    """Handle document formatting and output generation"""
    
    def __init__(self, settings: DocumentSettings):
        self.settings = settings
        self.logger = logging.getLogger(self.__class__.__name__)
        self._validate_output_dir()

    def _validate_output_dir(self) -> None:
        """Ensure output directory exists"""
        try:
            self.settings.output_dir.mkdir(parents=True, exist_ok=True)
        except OSError as e:
            self.logger.error("Output directory creation failed: %s", e)
            sys.exit(1)

    def save_contract(self, content: str, filename: str) -> Path:
        """Save contract in specified format"""
        if self.settings.anonymize:
            content = self._anonymize_content(content)

        output_path = self.settings.output_dir / f"{filename}.{self.settings.output_format}"
        
        if self.settings.output_format == "pdf":
            self._generate_pdf(content, output_path)
        else:
            with open(output_path, "w") as f:
                f.write(content)
        
        return output_path

    def _generate_pdf(self, content: str, path: Path) -> None:
        """Generate styled PDF document"""
        pdf = EnhancedPDF()
        pdf.add_page()
        pdf.add_contract_content(content)
        pdf.output(str(path))

    def _anonymize_content(self, text: str) -> str:
        """Remove personal information from content"""
        replacements = {
            "Parth Bansal": "[Tenant]",
            "Sarath": "[Owner]",
            "Aboard Valley": "[Property Address]"
        }
        for original, replacement in replacements.items():
            text = text.replace(original, replacement)
        return text

class EnhancedPDF(FPDF):
    """Extended PDF formatter with advanced features"""
    
    def __init__(self):
        super().__init__()
        self.config = self._load_pdf_settings()
        self.set_auto_page_break(auto=True, margin=self.config["margin"])
        self.set_margins(
            left=self.config["margin"],
            top=self.config["margin"],
            right=self.config["margin"]
        )
        self._setup_fonts()

    def _load_pdf_settings(self) -> Dict[str, Any]:
        """Load PDF formatting settings"""
        try:
            with open(CONFIG_PATH) as f:
                return json.load(f)["pdf_settings"]
        except Exception as e:
            logging.error("Failed to load PDF settings: %s", e)
            return DEFAULT_CONFIG["pdf_settings"]

    def _setup_fonts(self) -> None:
        """Configure document fonts"""
        self.add_font("Arial", style="", fname="arial.ttf", uni=True)
        self.add_font("Arial", style="B", fname="arialbd.ttf", uni=True)
        self.add_font("Arial", style="I", fname="ariali.ttf", uni=True)

    def header(self):
        self.set_font("Arial", "B", self.config["header_size"])
        self.cell(0, 10, "Lease Agreement", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align=Align.C)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align=Align.C)

    def add_contract_content(self, content: str) -> None:
        """Add structured content to PDF"""
        self.set_title("Lease Agreement")
        self._add_title_page()
        self._add_table_of_contents()
        self._add_main_content(content)

    def _add_title_page(self) -> None:
        self.set_font("Arial", "B", self.config["title_size"])
        self.cell(0, 50, "LEASE AGREEMENT", align=Align.C, new_y=YPos.NEXT)
        self.ln(20)

    def _add_table_of_contents(self) -> None:
        self.set_font("Arial", "B", self.config["header_size"])
        self.cell(0, 10, "Table of Contents", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_font("Arial", "", self.config["body_size"])
        # Add actual TOC items here

    def _add_main_content(self, content: str) -> None:
        self.set_font("Arial", "", self.config["body_size"])
        for paragraph in content.split("\n\n"):
            self.multi_cell(0, self.config["line_height"], paragraph)
            self.ln(3)

def configure_logging(level: str = "INFO") -> None:
    """Set up logging configuration"""
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler("contract_gen.log"),
            logging.StreamHandler()
        ]
    )

def parse_arguments() -> argparse.Namespace:
    """Parse command-line arguments"""
    parser = argparse.ArgumentParser(description="Automated Contract Generation System")
    parser.add_argument("-t", "--tenant", required=True, help="Tenant's full name")
    parser.add_argument("-o", "--owner", required=True, help="Property owner's name")
    parser.add_argument("-a", "--address", required=True, help="Property address")
    parser.add_argument("-d", "--duration", type=int, default=3, help="Lease duration in months")
    parser.add_argument("-f", "--format", choices=["pdf", "txt"], default="pdf", help="Output format")
    parser.add_argument("--anonymize", action="store_true", help="Remove personal information")
    return parser.parse_args()

def main():
    """Main execution flow"""
    start_time = time.time()
    args = parse_arguments()
    configure_logging()
    
    generator = ContractGenerator()
    formatter = DocumentFormatter(DocumentSettings(
        output_format=args.format,
        anonymize=args.anonymize
    ))
    
    contract_details = ContractDetails(
        tenant=args.tenant,
        owner=args.owner,
        property_address=args.address,
        duration_months=args.duration,
        clauses=[
            "Rent payment schedule and methods",
            "Security deposit terms",
            "Maintenance responsibilities",
            "Termination conditions",
            "Dispute resolution process"
        ]
    )
    
    try:
        contract_text = generator.generate_contract(contract_details)
        output_path = formatter.save_contract(contract_text, f"lease_{int(time.time())}")
        logging.info(f"Contract successfully generated at: {output_path}")
    except Exception as e:
        logging.critical(f"Critical failure: {str(e)}")
        sys.exit(1)
    
    logging.info(f"Process completed in {time.time() - start_time:.2f}s")

if __name__ == "__main__":
    main()
