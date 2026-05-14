# altschool-s02-a03 - Todo App
AltSchool Second Semester Assignment 03

A full-stack todo application built with Node.js, Express, MongoDB, and EJS. Users can register, log in, and manage tasks with three states (pending, completed, deleted), with a clean, responsive interface.

## Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Create, update, and delete todos
- Three task states: pending, completed, deleted
- Filter and sort todos by status or date
- Session management with MongoDB store
- Global error handling and logging
- Responsive UI with EJS templating

## Prerequisites

Before running this project, make sure you have the following:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- A [MongoDB](https://www.mongodb.com/) account or local MongoDB installation

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/akcumeh/altschool-s02-a03.git
cd altschool-s02-a03
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Your `.env` should contain:
- `PORT`: Port to run on (default: `3000`)
- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/todo-app`)
- `JWT_SECRET`: A random string used for JWT generation
- `SESSION_SECRET`: A random string used for session signing
- `NODE_ENV`: Environment (e.g., `development` or `production`)

### 4. Run Tests (Optional)

```bash
npm test
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

Base URL (local): `http://localhost:3000`

### Auth
- `GET /auth/register` - Registration page
- `POST /auth/register` - Register a new user
- `GET /auth/login` - Login page
- `POST /auth/login` - Log in and receive a session
- `GET /auth/logout` - Log out

### Todos *(auth required)*
- `GET /todos` - View all todos for the logged-in user
- `POST /todos` - Create a new todo
- `PATCH /todos/:id` - Update a todo's status
- `DELETE /todos/:id` - Delete a todo

## Project Structure

```
altschool-s02-a03/
├── src/
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── todoController.js  # Todo CRUD logic
│   ├── middleware/
│   │   ├── auth.js            # JWT auth middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User db model
│   │   └── Todo.js            # Todo db model
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   └── todoRoutes.js      # Todo routes
│   ├── utils/
│   │   └── logger.js          # Logging utility
│   ├── app.js                 # Express app setup
│   └── server.js              # Application entry point
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── todos.ejs
│   └── error.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── tests/
│   ├── auth.test.js
│   └── todo.test.js
├── .env.example
└── package.json
```

## Database Schema

See [ER-DIAGRAM.md](./ER-DIAGRAM.md) for a full entity relationship diagram.

### User
- `username` (string, required, unique, min 3 chars)
- `password` (string, required, hashed, min 6 chars)
- `createdAt` (date, auto-generated)

### Todo
- `title` (string, required)
- `description` (string, optional)
- `status` (enum: `pending` | `completed` | `deleted`, default: `pending`)
- `userId` (ref: User, required)
- `createdAt` / `updatedAt` (dates, auto-generated)

## Stack Used

- **Node.js** (**Express.js**) - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **EJS** - Server-side templating
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-session** + **connect-mongo** - Session management
- **express-validator** - Request validation
- **Jest** + **Supertest** - Testing
- **dotenv** - Environment variable management

## Author

Thank you for reading this far! Connect with me on:

- GitHub - [Angel Umeh](https://github.com/akcumeh)
- Twitter - [@akcumeh](https://x.com/akcumeh)
