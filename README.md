# Full-Stack Social Media Platform

A full-stack social media web application built with React and Node.js.
Users can register, share posts with text and images, use #tags, like and comment, chat privately, receive notifications, search for people and posts, and customize their profile.

## Live Demo

- **Frontend:** YOUR-FRONTEND-LINK
- **Backend API:** YOUR-BACKEND-LINK

> Note: images uploaded on the hosted version may not persist, because the hosting platform has no permanent disk. All other data is stored in MongoDB Atlas. On the first visit the app may take a few seconds to wake up.

## Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit (global state)
- React Router DOM (routing and protected routes)
- Axios (API requests with a JWT interceptor)
- Bootstrap 5 (responsive UI and dark mode)
- LocalStorage (session and theme persistence)

**Backend**
- Node.js and Express.js (REST API)
- MongoDB and Mongoose
- JWT (authentication) and bcryptjs (password hashing)
- Multer (image uploads)
- Nodemailer (welcome emails)
- dotenv and CORS

## Features

- **Authentication:** register, login, logout, JWT-protected routes, automatic redirect for unauthorized users, session saved in LocalStorage
- **Posts and Feed:** create (text, image, or both), edit, delete, like/unlike with optimistic UI, comments, pagination
- **Tags:** write `#hashtags` in a post; they become clickable links that open a tag search
- **Image uploads:** profile photo and post images (JPEG, PNG, WebP, GIF)
- **Profiles:** view any user, edit name and bio, change photo, see the user's posts, owner-only controls
- **Search:** find users by name or username, and posts by keyword or `#tag`
- **Notifications:** likes, comments and messages, unread badge, auto-refresh every 15 seconds
- **Messaging:** one-to-one conversations with message bubbles, auto-refresh every 5 seconds
- **Emails:** a welcome email is sent on registration (Nodemailer, optional)
- **Dark / Light mode:** saved in LocalStorage
- **Responsive design:** works on desktop and mobile

## Project Structure

```
client/
  src/
    api/            Axios instance
    app/            Redux store
    components/     Navbar, PostCard, NotificationBell
    features/       auth, posts, theme, notifications slices
    pages/          Home, Login, Register, Profile, Search, Chat
    routes/         ProtectedRoute
server/
  config/           Database connection
  controllers/      Business logic
  middleware/       Auth and upload middleware
  models/           User, Post, Comment, Notification, Conversation, Message
  routes/           API routes
  utils/            Token and email helpers
```

## Getting Started (Local)

### Prerequisites
- Node.js (LTS)
- A MongoDB database (local installation or a free MongoDB Atlas cluster)

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
Create `server/.env` (see `server/.env.example`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=
EMAIL_PASS=
```
`EMAIL_USER` and `EMAIL_PASS` are optional. To enable welcome emails, use a Gmail address and a Google App Password. If they are empty, registration works normally and the email is skipped.

Run the server:
```bash
npm run dev
```

### 3. Frontend
In a second terminal:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

Optional: create `client/.env` with `VITE_API_URL=http://localhost:5000` (this is the default).

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create an account |
| POST | /api/auth/login | Log in |
| GET | /api/auth/me | Current user (protected) |
| GET / POST | /api/posts | List (`page`, `q`, `user`) / create post (text and/or image) |
| PUT / DELETE | /api/posts/:id | Edit / delete own post |
| PUT | /api/posts/:id/like | Like or unlike |
| GET / POST | /api/posts/:id/comments | List / add comments |
| GET | /api/users/search?q= | Search users |
| GET | /api/users/:username | User profile |
| PUT | /api/users/profile | Update own profile |
| POST | /api/users/avatar | Upload profile photo |
| GET | /api/notifications | List notifications |
| PUT | /api/notifications/read-all | Mark all as read |
| GET / POST | /api/messages/conversations | List / start conversations |
| GET / POST | /api/messages/conversations/:id/messages | Read / send messages |

All endpoints except register and login require the header `Authorization: Bearer <token>`.
Searching posts with `q=#tag` filters by tag.

## Security Notes

- Passwords are hashed with bcrypt and never returned by the API.
- Secrets live in `.env` files, which are excluded from Git.
- Users can only edit or delete their own posts.
- Uploads are restricted to image types and limited in size.

## Future Improvements

Real-time updates with Socket.IO, role-based access control, and persistent cloud image storage (for example Cloudinary).

## Author

Shahd Emad