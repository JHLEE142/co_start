from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from rag_pipeline.vector_store import load_faiss_index

def get_relevant_documents(query: str, k: int = 5):
    """
    사용자 질문(query)에 대해 FAISS 인덱스에서 유사한 문서 k개를 검색
    """
    vectorstore = load_faiss_index()
    retriever = vectorstore.as_retriever(search_kwargs={"k": k})
    docs = retriever.get_relevant_documents(query)
    return docs
