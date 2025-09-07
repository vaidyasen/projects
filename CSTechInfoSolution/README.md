# Agent Management System - Setup Guide

**Web app for managing agents and distributing CSV tasks. Built with React + Node.js.**

## 🎯 What it does

- Admin can login and manage agents
- Upload CSV files to distribute tasks
- Automatically splits work between 5 agents
- Track what was assigned to who

## 🚀 QUICK SETUP (5 minutes)

### Prerequisites ✅

- [ ] **Node.js installed** - Download from https://nodejs.org/ (choose LTS version)
- [ ] **Terminal/Command Prompt** access

## 🚀 Setup Steps

### Option 1: Automated Setup (Recommended)

1. **Extract the ZIP file** to your desktop or any folder

2. **Open Terminal** (on Mac) or Command Prompt (on Windows)

3. **Navigate to the project folder**:

   ```bash
   cd path/to/CSTechInfoSolution
   ```

4. **Run the setup script** (one-time only):

   ```bash
   ./setup.sh
   ```

   This will install MongoDB and all dependencies automatically.

5. **Start the application**:
   ```bash
   ./start.sh
   ```

### Option 2: Manual Setup (if scripts don't work)

- Browser should open automatically to http://localhost:3000
- If not, manually go to: http://localhost:3000

7. **Login**:
   - Email: `admin@example.com`
   - Password: `password123`

## What to Test ✅

- [ ] Login with the provided credentials
- [ ] Navigate to "Agents" page and view/add agents
- [ ] Go to "Upload" page and try uploading a CSV file
- [ ] Check "Distributions" to see how tasks are assigned

## If Something Goes Wrong 🔧

### Quick Fixes:

1. **"Command not found"**: Make sure Node.js is installed
2. **"Port in use"**: Restart your computer and try again
3. **"MongoDB error"**: Run `brew services start mongodb-community`
4. **Browser doesn't open**: Manually go to http://localhost:3000

### Alternative Method:

If scripts don't work, you can run manually:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

## 🌐 Access the Application

- Browser should open automatically to http://localhost:3000
- If not, manually go to: http://localhost:3000
- **Login**: admin@example.com / password123

## 📊 Demo Features to Test

1. **User Authentication** - Secure login system
2. **Agent Management** - CRUD operations for agents
3. **File Upload** - CSV processing capability
4. **Data Distribution** - Automatic task assignment
5. **Responsive Design** - Works on different screen sizes

## Expected Results ✅

- ✅ Login page loads successfully
- ✅ Can create/edit/delete agents
- ✅ Can upload CSV files
- ✅ Data is automatically distributed among agents
- ✅ Clean, professional interface

---

**Contact**: If you need assistance, please let me know and I can provide additional support or a recorded demo.
