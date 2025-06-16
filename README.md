# 🔐 Authentication System – Full Stack

A secure, full-stack authentication system built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **React**. This project includes secure JWT-based authentication, refresh tokens, cookie handling, and a modern React frontend.

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT & Refresh Tokens
- Bcrypt
- Cookie Parser
- CORS
- Dotenv

### Frontend
- React
- TypeScript
- React Hook Form
- Tailwind CSS
- Fetch API
- Protected Routes

---



## ⚙️ Setup Instructions

### Backend

1. Clone the repository  
2. Navigate to the backend folder:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```
5. Run the dev server:
   ```bash
   nodemon src/index.ts
   ```

---

## 🔐 Features

- Register and login with secure hashed passwords
- JWT-based authentication with refresh tokens
- Authenticated routes and middleware
- Cookies for secure token storage
- Fully typed with TypeScript
- Modular and clean folder structure

---

## 🚀 Deployment

- MongoDB hosted on **MongoDB Atlas**
  
