# 📌 Techify

# 📝 MERN Fullstack Blog Platform

A modern, scalable **fullstack blog application** built using the **MERN stack (MongoDB, Express, React, Node.js)**.  
The platform supports **role-based authentication**, **secure post management**, and **separate dashboards for Admin, Author, and Reader**.

🔗 Live Demo: https://blog-client-gpiv.onrender.com  

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure login & registration
- Role-based access control (Admin, Author, Reader)
- Protected routes on both frontend & backend

### ✍️ Blog Management
- Create, edit, delete posts (Author/Admin)
- Publish workflow
- SEO-friendly slug-based URLs
- Rich text editor for writing posts

### 📊 Dashboards
- **Admin Dashboard**
  - Manage users
  - Manage all posts
- **Author Dashboard**
  - Create and manage own posts
- **Reader View**
  - Browse and read published posts

### ⚡ Performance & UX
- Responsive UI (mobile-first)
- Loading states & toast notifications
- Clean UI with reusable components

---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- shadcn/ui
- JWT-based auth handling

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Role-based middleware
- RESTful APIs

### Deployment
- **Frontend**: Render
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 📁 Project Structure


---

## 🔑 Environment Variables

### Backend (`.env`)

NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET_KEY=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
VITE_FRONTEND_URL=http://localhost:5173


🛠️ Installation & Setup
1️⃣ Clone the Repository

git clone https://github.com/codingwalebhaiya/fullstack-blog-webapp.git
cd fullstack-blog-webapp


2️⃣ Backend Setup
cd server
npm install
npm run dev


3️⃣ Frontend Setup
cd client
npm install
npm run dev


🔐 User Roles

| Role   | Permissions               |
| ------ | ------------------------- |
| Admin  | Manage users & all posts  |
| Author | Create & manage own posts |
| Reader | Read published posts      |


🔒 Security Measures

JWT stored securely (HTTP-only cookies supported)

CORS configuration for production

Input validation on frontend & backend

Protected API routes


🧪 API Endpoints (Sample)
POST   /api/v1/auth/login
GET    /api/v1/users/me
POST   /api/v1/posts
GET    /api/v1/posts/author/me


📸 Screenshots


📈 Future Improvements

Comment system

Likes & bookmarks

Search & filter posts

Pagination & infinite scroll

Image optimization

Email notifications


👨‍💻 Author

Satyam Pandey
Fullstack Developer | MERN | GenAI

LinkedIn: https://www.linkedin.com/in/satyam-pandey-85629b210

GitHub: https://github.com/codingwalebhaiya


⭐ Support

If you like this project, please give it a ⭐ on GitHub.
Contributions and suggestions are always welcome!