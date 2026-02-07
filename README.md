🏢 Employee Leave Management System – Detailed Explanation (MERN Stack)
📌 Project Overview

The Employee Leave Management System is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React.js, Node.js).
The main goal of this project is to digitize and simplify the leave management process within an organization.

This system allows:

Employees to apply for leave and track their leave status

Admins/Managers to review, approve, or reject leave requests efficiently

It replaces traditional paper-based systems with a secure, fast, and transparent digital solution.

🎯 Problem Statement

In traditional leave management systems:

Leave requests are handled manually

Approval takes more time

Employees are not informed clearly about their leave status

Managing records becomes difficult and error-prone

✔ Solution Provided by This Project

Online leave application system

Real-time leave status updates

Secure authentication system

Centralized database for all records

👥 User Roles

The system is designed with role-based access control, supporting two main user roles:

👨‍💼 Employee Module

After logging in, an employee can access the following features:

🔐 1. Login & Logout

Secure login using email and password

Authentication handled using JWT tokens

Unauthorized users cannot access protected routes
<img width="1906" height="907" alt="Screenshot 2026-02-07 140420" src="https://github.com/user-attachments/assets/198d577e-c6ad-4b9a-9d3e-84060c96c70c" />
<img width="1908" height="911" alt="Screenshot 2026-02-07 140432" src="https://github.com/user-attachments/assets/a83f4e5c-5270-4f8d-8a5d-b297017f1b01" />

📝 2. Apply for Leave

Employees can apply for leave by providing:

Leave type (Casual, Sick, etc.)

Start date and end date

Reason for leave

Once submitted, the leave request status is set to Pending.

📊 3. View Leave Status

Employees can track the status of their leave requests:

Pending

Approved

Rejected

Any decision made by the admin is reflected immediately on the employee dashboard.

📜 4. Leave History

Employees can view their previous leave records

Ensures transparency and proper record keeping

🧑‍💼 Admin / Manager Module

Admins and managers have higher-level permissions:

🔐 1. Secure Admin Login

Only authorized admins can log in

Role-based authorization ensures restricted access
<img width="1909" height="926" alt="Screenshot 2026-02-06 113526" src="https://github.com/user-attachments/assets/0722eb3a-0512-4122-a845-54895f9fcfc7" />

📋 2. View All Leave Requests

Admin can view all leave requests from employees

Displays employee details, leave duration, reason, and status

✅ ❌ 3. Approve or Reject Leave

Admin can approve or reject requests with a single action

Status updates are instantly visible to the employee

👥 4. Manage Employees

Admin can view and manage employee data

Centralized employee information management
<img width="1919" height="914" alt="Screenshot 2026-02-06 113601" src="https://github.com/user-attachments/assets/d4e77d72-d179-4c67-9a99-6061964f8299" />

📈 5. Dashboard & Statistics

Total leave requests

Approved, rejected, and pending leaves

Provides quick insights for better decision-making

🛠 Technology Stack Explanation
🌐 Frontend

React.js – Component-based user interface

Vite – Fast development and build tool

CSS – Styling and layout

Axios – API communication with the backend

The frontend is responsive and designed for a smooth user experience.

🖥 Backend

Node.js – Server-side runtime environment

Express.js – RESTful API development

JWT (JSON Web Token) – Secure authentication

Middleware – Route protection and role verification

🗄 Database

MongoDB – NoSQL database for flexible data storage

Mongoose – Schema-based modeling for MongoDB

Stores:

User details

Employee information

Leave requests and statuses

🔐 Authentication & Security

Security is a key focus of this project:

JWT-based authentication

Secure password handling

Protected API routes

Role-based access control (Admin / Employee)

Prevention of unauthorized access

📂 Project Structure Explanation
backend/
 ├── controllers   → Business logic
 ├── models        → Database schemas
 ├── routes        → API endpoints
 ├── middleware    → Authentication & authorization
 ├── config        → Database configuration
 └── server.js     → Server entry point

frontend/
 ├── components    → Reusable UI components
 ├── pages         → Login, Dashboard, Leave pages
 ├── App.jsx       → Main application component
 └── main.jsx      → Application entry point

⚙️ Installation Flow (Summary)

Clone the repository

Install backend dependencies

Configure environment variables

Start the backend server

Install frontend dependencies

Run the frontend application
