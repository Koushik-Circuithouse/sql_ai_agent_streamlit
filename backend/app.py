from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
from datetime import datetime, date
from decimal import Decimal
from dotenv import load_dotenv

# Add parent directory to path to import existing modules
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

# Load .env from parent directory (where the original .env file is)
load_dotenv(os.path.join(parent_dir, '.env'))

from src.db.db_utils import get_connection
from src.db.tables import get_databases, get_tables
from src.ai.sql_generator import generate_sql_query, clean_sql

app = Flask(__name__)
CORS(app)  # Enable CORS for Angular frontend


@app.route('/api/databases', methods=['GET'])
def list_databases():
    """Get all available databases"""
    try:
        databases = get_databases()
        return jsonify({'success': True, 'databases': databases})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/databases/<db_name>/tables', methods=['GET'])
def list_tables(db_name):
    """Get all tables in a specific database"""
    try:
        tables = get_tables(db_name)
        return jsonify({'success': True, 'tables': tables})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/databases/<db_name>/tables/<table_name>/schema', methods=['GET'])
def get_table_schema(db_name, table_name):
    """Get schema for a specific table"""
    try:
        conn = get_connection(db_name)
        cursor = conn.cursor()
        cursor.execute(f"USE {db_name};")
        cursor.execute(f"DESCRIBE {table_name};")
        schema_data = cursor.fetchall()
        conn.close()

        # Convert to list of dictionaries for easier JSON handling
        schema = []
        for row in schema_data:
            schema.append({
                'field': row[0],
                'type': row[1],
                'null': row[2],
                'key': row[3],
                'default': row[4],
                'extra': row[5]
            })

        # Create schema string for AI prompt
        schema_str = f"Table: {table_name}\nColumns:\n" + "\n".join(
            [f"{col['field']} ({col['type']})" for col in schema]
        )

        return jsonify({
            'success': True,
            'schema': schema,
            'schema_str': schema_str
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/generate-sql', methods=['POST'])
def generate_sql():
    """Generate SQL query from natural language question"""
    try:
        data = request.get_json()
        question = data.get('question')
        schema_str = data.get('schema_str')

        if not question or not schema_str:
            return jsonify({
                'success': False,
                'error': 'Missing question or schema_str'
            }), 400

        sql_query = generate_sql_query(question, schema_str)
        sql_query = clean_sql(sql_query)

        return jsonify({'success': True, 'sql': sql_query})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def serialize_value(value):
    """Convert MySQL types to JSON-serializable types"""
    if value is None:
        return None
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, bytes):
        return value.decode('utf-8', errors='replace')
    if isinstance(value, (int, float, str, bool)):
        return value
    return str(value)


@app.route('/api/execute-sql', methods=['POST'])
def execute_sql():
    """Execute SQL query and return results"""
    try:
        data = request.get_json()
        db_name = data.get('database')
        sql_query = data.get('sql')

        if not db_name or not sql_query:
            return jsonify({
                'success': False,
                'error': 'Missing database or sql'
            }), 400

        conn = get_connection(db_name)
        cursor = conn.cursor()
        cursor.execute(sql_query)

        # Get column names
        columns = [desc[0] for desc in cursor.description]

        # Get all rows
        rows = cursor.fetchall()

        # Convert to list of dictionaries with JSON-safe values
        results = []
        for row in rows:
            row_dict = {}
            for col, val in zip(columns, row):
                row_dict[col] = serialize_value(val)
            results.append(row_dict)

        conn.close()

        return jsonify({
            'success': True,
            'columns': columns,
            'rows': results,
            'row_count': len(results)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'SQL AI Agent API is running'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
