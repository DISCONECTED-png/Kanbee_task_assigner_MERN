# 🐝 Kanbee — Real-Time Task Management Board

**Kanbee** is a full-stack MERN Kanban board with real-time collaboration, smart task assignment, conflict resolution, and a sleek, themeable UI. Designed to boost productivity and keep teams on track!

[🔗 Live Frontend](https://kanbee.onrender.com)  
[🔗 Live Backend API](https://kanbee-task-assigner-mern.onrender.com)

---

## 🚀 Features

### ✅ Core Functionalities
- **User Authentication** (Register/Login using JWT)
- **Drag & Drop Kanban Board** (`Todo`, `In Progress`, `Done`)
- **Real-time Sync** via **Socket.IO**
- **Task CRUD Operations**
- **Smart Assign**: Assign task to least busy user
- **Conflict Handling**: Detects and resolves edit conflicts with a modal
- **Activity Feed**: Tracks 20 latest actions with live updates

### 🧠 UX & UI
- Fully **responsive** and **animated** UI
- Custom **theme picker** with 6+ dark themes
- **Typewriter animation** banner
- Motivational footer, dashboard chart, and task analytics

---

## 📂 Tech Stack

### 🖥️ Frontend
- React + Vite
- React Router DOM
- DnD Kit for Drag & Drop
- Recharts for Charting
- Socket.IO-client

### 🌐 Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT for Auth
- Socket.IO
- CORS with environment-specific config

---

## 🧪 Smart Assign Logic
When you click **Smart Assign**:
- The system checks all users
- It counts how many active (non-`Done`) tasks each user has
- It assigns the task to the **least busy user**
- Logs an action and emits a real-time update

---

## ⚔️ Conflict Handling Logic
If two users try to edit the same task:
- The server compares `updatedAt` timestamps
- If conflict is detected:
  - A **modal** is shown with:
    - Your changes (local)
    - Server version (latest)
    - Options to **merge** or **cancel**

---

## 📊 Chart & Dashboard
Displays:
- Total tasks
- Count of `Todo`, `In Progress`, `Done`
- Completion rate %
- Pie chart breakdown

---

## 🕘 Activity Feed
- Tracks **20 latest actions**
- Logs: Created, Updated, Deleted, Smart Assigned
- Real-time updates using `Socket.IO`
- Shows user name, task title, time, and description

---

## 📦 Installation

### 🧪 Clone Project
git clone https://github.com/yourusername/kanbee.git
cd kanbee

##🔧 Backend Setup
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

Run server:
npm run dev

🎨 Frontend Setup
cd frontend
npm install
npm run dev
