import os
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from rag_pipeline.document_loader import load_text_documents

FAISS_INDEX_PATH = "./backend/.faiss_index"

def create_faiss_index():
    documents = load_text_documents()
    if not documents:
        raise ValueError("❌ No documents found in data/laws directory.")

    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(documents, embedding=embeddings)
    vectorstore.save_local(FAISS_INDEX_PATH)
    print(f"✅ FAISS index created and saved to {FAISS_INDEX_PATH}")

def load_faiss_index():
    embeddings = OpenAIEmbeddings()
    if not os.path.exists(FAISS_INDEX_PATH):
        raise FileNotFoundError("❌ FAISS index not found. Run create_faiss_index() first.")
    vectorstore = FAISS.load_local(FAISS_INDEX_PATH, embeddings)
    return vectorstore
