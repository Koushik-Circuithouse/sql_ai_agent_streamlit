import streamlit as st
import pandas as pd
from src.db.db_utils import get_connection
from src.db.tables import get_tables,get_databases
from src.ai.sql_generator import generate_sql_query, clean_sql

st.set_page_config(page_title="SQL AI Agent", layout="wide")
st.title("🤖 AI SQL Query Agent")

databases = get_databases()
selected_db = st.selectbox("Select database", databases)

# 1️⃣ Fetch all tables
tables = get_tables(selected_db)
selected_table = st.selectbox("Select a table", tables)

# 2️⃣ Fetch schema for the selected table
conn = get_connection(selected_db)
cursor = conn.cursor()
cursor.execute(f"USE {selected_db};") 
cursor.execute(f"DESCRIBE {selected_table};")
table_schema = cursor.fetchall()
conn.close()

# Convert schema to string for AI prompt
schema_str = f"Table: {selected_table}\nColumns:\n" + "\n".join([f"{col[0]} ({col[1]})" for col in table_schema])

# Show schema in Streamlit (optional)
st.subheader(f"Schema for {selected_table}")
st.table(pd.DataFrame(table_schema, columns=["Field","Type","Null","Key","Default","Extra"]))

# 3️⃣ User input for question
user_question = st.text_input("Ask your question about this table:")

# 4️⃣ Generate SQL
if st.button("Generate SQL"):
    if user_question:
        try:
            sql_query = generate_sql_query(user_question, schema_str)
            sql_query = clean_sql(sql_query)

            st.subheader("Generated SQL")
            st.code(sql_query, language="sql")

            # Execute SQL
            conn = get_connection(selected_db)
            cursor = conn.cursor()
            cursor.execute(sql_query)
            data = cursor.fetchall()
            cols = [desc[0] for desc in cursor.description]
            st.subheader("Query Results")
            st.dataframe(pd.DataFrame(data, columns=cols))

        except Exception as e:
            st.error(f"SQL execution error: {e}")

        finally:
            if 'conn' in locals():
                conn.close()
