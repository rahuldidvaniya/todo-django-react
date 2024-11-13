# Task Management System

A full-stack task management system built with Django and React, featuring PostgreSQL stored procedures for efficient data handling.

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- pip (Python package manager)
- npm (Node package manager)

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/rahuldidwaniya/todo-django-react.git
cd task-management
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create and Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/MacOS
python -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Variables Setup
1. Create a `.env` file in the root directory:
```bash
# Create .env file
touch .env  # For Linux/MacOS
# or
type nul > .env  # For Windows
```

2. Add the following variables to your `.env` file:
```plaintext
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=todo_app_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

#### Configure Database Settings
Update `backend/settings.py` to use environment variables:
```python
from dotenv import load_dotenv
import os

load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

### 3. Database Setup

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE todo_app_db;

# Exit psql
\q
```

#### Run Django Migrations
```bash
# Create migration files
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

#### Initialize Database Functions
```bash
# Run the SQL initialization script
psql -U postgres -d todo_app_db -f db/init.sql
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd todo-list

# Install dependencies
npm install





## Running the Application

### Start Backend and Frontend Servers
Open two separate terminal windows/tabs:

#### Terminal 1 (Backend):
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# For Windows:
venv\Scripts\activate
# For Linux/MacOS:
source venv/bin/activate

# Start backend server
python manage.py runserver
```

#### Terminal 2 (Frontend):
```bash
# Navigate to frontend directory
cd todo-list

# Start frontend development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## API Endpoints

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/create/` - Create new project
- `PATCH /api/projects/edit/:id/` - Edit project
- `DELETE /api/projects/:id/` - Delete project

### Tasks
- `GET /api/todos/` - List all tasks
- `POST /api/todos/create/` - Create new task
- `PATCH /api/todos/edit/:id/` - Edit task
- `PATCH /api/todos/toggle/:id/` - Toggle task completion status
- `DELETE /api/todos/:id/` - Delete task

## Database Management

### Backup Database
```bash
pg_dump -U postgres -d todo_app_db > backup.sql
```

### Restore Database
```bash
psql -U postgres -d todo_app_db < backup.sql
```

## Project Structure
```
task-management/
├── backend/
│   ├── core/           # Main Django app
│   │   ├── views.py    # API views
│   │   ├── models.py   # Models for seriliazation
│   │   └── urls.py     # URL routing
│   └── backend/        # Django settings
├── todo-list/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
└── db/
    └── init.sql        # Database initialization script
```

## Common Issues and Solutions

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in settings.py
   - Ensure database exists and is accessible

2. **Migration Issues**
   - If you get migration errors, try:
     ```bash
     python manage.py migrate --run-syncdb
     ```

3. **CORS Issues**
   - Verify CORS settings in backend/settings.py
   - Check if frontend URL is listed in ALLOWED_HOSTS



