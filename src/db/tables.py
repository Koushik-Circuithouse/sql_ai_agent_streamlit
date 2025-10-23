from src.db.db_utils import get_connection

def get_databases():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES;")
    dbs = [db[0] for db in cursor.fetchall()]
    conn.close()
    return dbs

def get_tables(database_name):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"USE {database_name};")
    cursor.execute("SHOW TABLES;")
    tables = [t[0] for t in cursor.fetchall()]
    conn.close()
    return tables
