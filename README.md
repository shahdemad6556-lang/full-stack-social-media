# Full-Stack Social Media Platform

A full-stack social media web application built with React and Node.js.
Users can register, log in, create posts, like and comment, search for people and posts, edit their profile, and switch between light and dark mode.

## Tech Stack

**Frontend:** React (Vite), Redux Toolkit, React Router, Axios, Bootstrap
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Features

- Authentication: register, login, logout, JWT-protected routes
- Posts: create, delete, like/unlike (optimistic UI), comments, pagination
- Profiles: view any user, edit your own name and bio
- Search: find users and posts by keyword
- Light/Dark mode saved in LocalStorage

## Project Structure

```
client/   React app (pages, components, Redux features)
server/   Express API (models, controllers, routes, middleware)
```

## Getting Started

### Prerequisites
- Node.js (LTS)
- MongoDB (local installation or a MongoDB Atlas account)

### 1. Clone the repository
```bash
git clone https://github.com/shahdemad6556-lang/full-stack-social-media.git
cd full-stack-social-media
```

### 2. Backend
```bash
cd server
npm install
```
Create a file named `.env` inside `server/` (see `.env.example`):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/socialdb
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```
Start the server:
```bash
npm run dev
```

### 3. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in |
| GET | /api/auth/me | Current user (protected) |
| GET/POST | /api/posts | List / create posts |
| PUT/DELETE | /api/posts/:id | Update / delete own post |
| PUT | /api/posts/:id/like | Like / unlike |
| GET/POST | /api/posts/:id/comments | List / add comments |
| GET | /api/users/search?q= | Search users |
| GET | /api/users/:username | User profile |
| PUT | /api/users/profile | Update own profile |

## Future Improvements

Notifications, messaging, image uploads, Socket.IO real-time updates, and deployment.

## Author

Shahd Emad