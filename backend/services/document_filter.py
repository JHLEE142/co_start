# ✅ backend/services/document_filler.py

import os
from docxtpl import DocxTemplate
from datetime import datetime
from services.parser import extract_lease_data

TEMPLATE_PATH = "backend/templates/lease_agreement.docx"
OUTPUT_DIR = "backend/generated_docs/"

def fill_lease_contract_from_prompt(user_input: str) -> str:
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 사용자 입력 → 데이터 추출
    data = extract_lease_data(user_input)
    if not data or any(v is None for v in data.values()):
        raise ValueError("❌ 필요한 필드가 충분하지 않음")

    # 템플릿 채움
    doc = DocxTemplate(TEMPLATE_PATH)
    doc.render(data)

    filename = f"lease_agreement_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
    output_path = os.path.join(OUTPUT_DIR, filename)
    doc.save(output_path)

    return output_path
