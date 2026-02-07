# Employee Leave Management System

A full-stack **Employee Leave Management System** built using the **MERN stack**.  
This project helps organizations manage employee leave requests efficiently with role-based access for **Admin/Manager** and **Employees**.
<img width="1919" height="1034" alt="Screenshot 2026-02-07 140553" src="https://github.com/user-attachments/assets/5fb7195b-5641-4c53-9094-c2fc03079849" />
<img width="1919" height="1079" alt="Screenshot 2026-02-07 140608" src="https://github.com/user-attachments/assets/5c462a55-b05f-43f2-8c46-2bb98593b6f5" />

---

## 🚀 Features

### 👨‍💼 Employee
- Login & Logout
- Apply for leave
- View leave status (Pending / Approved / Rejected)
- View leave history
- <img width="1909" height="926" alt="Screenshot 2026-02-06 113526" src="https://github.com/user-attachments/assets/07fb5acc-71ba-441e-9eb5-37ade326336b" />


### 🧑‍💼 Admin / Manager
- Secure admin login
- View all employee leave requests
- Approve or reject leave requests
- Manage employees
- Dashboard with leave statistics
<img width="1919" height="914" alt="Screenshot 2026-02-06 113601" src="https://github.com/user-attachments/assets/ba3d0fb3-c735-4de6-a919-eb30261134a9" />

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 📂 Project Structure

Employee_Leave_Management_System
│
├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── config
│ ├── middleware
│ ├── package.json
│ └── server.js
│
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ ├── vite.config.js
│ └── package.json
│
├── .gitignore
└── README.md




---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/riyazsharif/employee_leave_managment_system.git
2️⃣ Backend Setup
cd backend
npm install
npm start
Create a .env file in backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🔐 Authentication

JWT-based authentication

Role-based access control (Admin & Employee)
