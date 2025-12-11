# SQL AI Agent

A natural language to SQL query generator using OpenAI GPT-4o-mini with Flask backend and Angular frontend.

## Project Structure

```
sql_ai_agent/
├── app.py                    # Original Streamlit app (deprecated)
├── backend/                  # Flask API backend
│   ├── app.py               # Flask application with REST endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI components
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── services/    # API services
│   │   │   └── app.component.ts
│   │   ├── environments/    # Environment configs
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── src/                      # Shared Python modules
│   ├── ai/
│   │   └── sql_generator.py # OpenAI SQL generation
│   └── db/
│       ├── db_utils.py      # Database connection
│       └── tables.py        # Table/database listing
└── .env                      # Environment variables
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn
- MySQL database
- OpenAI API key

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_default_database
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend will start at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start at `http://localhost:4200`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/databases` | GET | List all databases |
| `/api/databases/{db}/tables` | GET | List tables in database |
| `/api/databases/{db}/tables/{table}/schema` | GET | Get table schema |
| `/api/generate-sql` | POST | Generate SQL from question |
| `/api/execute-sql` | POST | Execute SQL query |
| `/api/health` | GET | Health check |

## Usage

1. Open the frontend at `http://localhost:4200`
2. Select a database from the dropdown
3. Select a table from the dropdown
4. View the table schema
5. Enter a natural language question (e.g., "Show all products with price > 100")
6. Click "Generate SQL" to get the SQL query
7. Click "Execute Query" to run and see results

## Architecture

```
┌─────────────────────┐      HTTP/JSON       ┌─────────────────────┐
│   Angular Frontend  │  ←─────────────────→ │   Flask Backend     │
│   (Port 4200)       │                      │   (Port 5000)       │
└─────────────────────┘                      └──────────┬──────────┘
                                                        │
                                        ┌───────────────┼───────────────┐
                                        ↓               ↓               ↓
                                   OpenAI API      MySQL DB        Schema Utils
                                   (GPT-4o-mini)
```

## Development

### Adding New Components

```bash
cd frontend
ng generate component components/new-component
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# The output will be in frontend/dist/sql-ai-agent
```
