# Todo Application - AltSchool Assignment

A full-stack todo application built with Node.js, Express, MongoDB, and EJS. Features user authentication with JWT, task management with three states (pending, completed, deleted), and a clean, responsive UI.

## Features

- User registration and authentication with JWT
- Secure password hashing with bcrypt
- Create, read, update, and delete todos
- Three task states: pending, completed, deleted
- Filter todos by status
- Sort todos by date or status
- Session management with MongoDB store
- Global error handling and logging
- Responsive design
- RESTful API

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Template Engine**: EJS
- **Session Management**: express-session with connect-mongo
- **Validation**: express-validator
- **Testing**: Jest, Supertest
- **Development**: Nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd altschool-s02-a03
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here
NODE_ENV=development
```

5. Start MongoDB (if running locally)
```bash
mongod
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Running Tests
```bash
npm test
```

## Project Structure

```
altschool-s02-a03/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
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
├── .gitignore
├── ER-DIAGRAM.md
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `GET /auth/register` - Registration page
- `POST /auth/register` - Register new user
- `GET /auth/login` - Login page
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user

### Todos (Protected Routes)
- `GET /todos` - Get all todos for logged-in user
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Update todo status
- `DELETE /todos/:id` - Soft delete todo

## Database Schema

See [ER-DIAGRAM.md](./ER-DIAGRAM.md) for detailed entity relationship diagram.

### User Model
- username (String, unique, min 3 chars)
- password (String, hashed, min 6 chars)
- createdAt (Date)

### Todo Model
- title (String, required)
- description (String, optional)
- status (Enum: pending, completed, deleted)
- userId (ObjectId, reference to User)
- createdAt (Date)
- updatedAt (Date)

## Features Implementation

### User Authentication
- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Session storage in MongoDB
- Protected routes with authentication middleware

### Todo Management
- Users can only see their own tasks
- Soft delete (status changed to 'deleted')
- Filter by status (all, pending, completed)
- Sort by date (newest/oldest) or status
- Real-time UI updates

### Error Handling
- Global error handler middleware
- Validation errors with express-validator
- Proper HTTP status codes
- User-friendly error messages

### Logging
- Custom logger utility
- Timestamp-based logs
- Different log levels (info, error, warn, debug)
- Console output formatting

## Testing

The application includes comprehensive tests for:
- User registration and validation
- User login and authentication
- Todo creation, update, and deletion
- Authorization (users can only modify their own todos)

## Deployment

The application is ready for deployment on platforms like:
- Render
- Heroku
- Railway
- Vercel (with server setup)
- AWS/GCP/Azure

### Deployment Notes
1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB database (MongoDB Atlas recommended)
3. Generate strong JWT_SECRET and SESSION_SECRET values
4. Enable secure cookies in production
5. Configure CORS if needed for API access

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only session cookies
- Input validation and sanitization
- XSS protection through EJS auto-escaping
- Session expiration (7 days)
- Protected routes with authentication middleware

## License

ISC

## Author

AltSchool Student - Second Semester Assignment 3
