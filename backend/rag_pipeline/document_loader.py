import os
from typing import List
from langchain.docstore.document import Document

DATA_PATH = "./backend/data/laws"  # 법령 등 텍스트 문서 경로

def load_text_documents() -> List[Document]:
    documents = []
    for filename in os.listdir(DATA_PATH):
        if filename.endswith(".txt"):
            filepath = os.path.join(DATA_PATH, filename)
            with open(filepath, "r", encoding="utf-8") as file:
                text = file.read()
                documents.append(Document(page_content=text, metadata={"source": filename}))
    return documents
