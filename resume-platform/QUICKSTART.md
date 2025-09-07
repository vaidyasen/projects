# Resume Platform - Quick Start Guide

## 🚀 Fastest Way to Run

### Using Docker (Recommended)

```bash
# Clone the repository and navigate to it
cd resume-platform

# Start the application
./start.sh
```

Access the application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔐 Demo Login

- **Email**: hire-me@anshumat.org
- **Password**: HireMe@2025!

## 📋 What You Can Do

1. **Sign Up/Login**: Create a new account or use demo credentials
2. **Create Resume**: Use the comprehensive form to build your resume
3. **Manage Resumes**: View, edit, and delete multiple resume versions
4. **Download PDF**: Generate and download professional PDF resumes
5. **Dashboard**: Central hub for all your resume management

## 🛠️ Alternative Setup (Local Development)

If you prefer to run without Docker:

```bash
# Setup development environment
./setup-dev.sh

# Then start services manually:
# 1. Start Redis
redis-server

# 2. Start Backend
cd backend
source venv/bin/activate
python main.py

# 3. Start Frontend (in new terminal)
cd frontend
npm start
```

## 🧪 Testing the Setup

Run the test script to verify everything works:

```bash
./test.sh
```

## 📁 Project Structure

```
resume-platform/
├── frontend/          # React application
├── backend/           # FastAPI application
├── docker-compose.yml # Multi-container setup
├── README.md          # Full documentation
├── start.sh           # Quick start script
├── setup-dev.sh       # Development setup
└── test.sh            # Test script
```

## 🎯 Key Features Implemented

✅ **All MVP Requirements**:

- Secure authentication
- Resume builder form
- Multiple resume versions
- Dashboard management
- PDF download

✅ **Additional Features**:

- Professional PDF templates
- Responsive design
- Form validation
- Error handling
- Docker containerization

## 📚 Next Steps

After starting the application:

1. Visit http://localhost:3000
2. Create an account or use demo login
3. Build your first resume
4. Download as PDF
5. Explore the dashboard features

For detailed documentation, see `README.md`.
