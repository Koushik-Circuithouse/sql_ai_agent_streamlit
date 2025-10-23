from src.db.db_utils import get_connection

def get_table_schema() -> str:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    schema_description = ""
    for (table,) in tables:
        schema_description += f"\nTable: {table}\n"
        cursor.execute(f"DESCRIBE {table}")
        for row in cursor.fetchall():
            schema_description += f" - {row[0]} ({row[1]})\n"

    cursor.close()
    conn.close()
    return schema_description
