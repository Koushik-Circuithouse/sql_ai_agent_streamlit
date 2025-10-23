from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def clean_sql(sql: str) -> str:
    """
    Remove backticks and code block markers from the AI-generated SQL.
    """
    sql = sql.strip()  # remove leading/trailing whitespace
    # Remove ```sql ... ``` if present
    if sql.startswith("```") and sql.endswith("```"):
        sql = "\n".join(sql.split("\n")[1:-1])
    return sql.strip()

def generate_sql_query(user_question: str, schema: str) -> str:
    """
    Generates SQL query from a natural language question.
    """
    prompt = f"""
    You are a MySQL expert. 
    Convert the following user question into a valid MySQL SELECT query.
    Only return the SQL query (no explanation).
    
    SCHEMA:
    {schema}

    USER QUESTION:
    {user_question}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    return response.choices[0].message.content.strip()
