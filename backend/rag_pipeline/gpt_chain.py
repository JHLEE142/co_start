from langchain.llms import OpenAI
from langchain.chains import LLMChain
from rag_pipeline.prompt_template import rag_prompt

def get_rag_chain():
    llm = OpenAI(temperature=0.3)
    return LLMChain(llm=llm, prompt=rag_prompt)