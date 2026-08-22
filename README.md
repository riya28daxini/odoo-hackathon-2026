🌍 GlobeTrotter --- Full-Stack Travel Planner

GlobeTrotter is a full-stack travel planning web application that helps users discover destinations, create trips, build itineraries, explore activities, manage travel plans, and view trips shared by the community.

The project includes a React frontend and a Node.js/Express backend with JWT-based authentication and JSON-based data storage.

✨ Features
-> User registration and login
-> JWT-based authentication
-> Browse and search travel destinations
-> Explore activities for different cities
-> Create, update, and delete trips
-> Build detailed trip itineraries
-> Add and remove itinerary sections and activities
-> View saved trips in My Trips
-> Calendar-based trip overview
-> User profile management
-> City wishlist support
-> Community trip feed
-> Admin dashboard and statistics
-> Responsive interface built with Tailwind CSS
-> Backend REST API with health-check endpoint

🛠️ Tech Stack

Frontend
  React 18
  Vite
  Tailwind CSS
  Lucide React
  JavaScript
  HTML5 / CSS3

Backend
  Node.js
  Express.js
  JSON Web Token (JWT)
  bcryptjs
  CORS
  dotenv
  JSON-based database

📁 Project Structure

globetrotter-workspace/
├── globetrotter-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── services/
│   │   ├── views/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── globetrotter-backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── package.json
└── README.md

🚀 Getting Started

1. Clone the repository
  git clone <your-repository-url>
  cd <repository-folder>

2. Install workspace dependencies
  npm install

3. Install frontend and backend dependencies
  The root project already provides a helper command:
  npm run install:all
  Alternatively, install them manually:
  cd globetrotter-backend
  npm install
  cd ../globetrotter-frontend
  npm install

4. Configure the backend environment

Go to the backend folder and create a .env file using .env.example as the template.
cd globetrotter-backend

Example configuration:

PORT=5000
NODE_ENV=development
JWT_SECRET=replace_with_your_own_secure_secret

5. Seed the database

From the project root:

npm run seed

This initializes the application with seed data used by the travel planner.

6. Start the application

From the project root:
  npm run dev

This starts both the frontend and backend.
  Frontend: http://localhost:5173
  Backend: http://localhost:5000
  API health check: http://localhost:5000/api/health

If port 5000 is unavailable, the backend may use another available port such as 5001. The frontend API service includes health-check logic for ports 5000 and 5001.

📜 Available Scripts

From the root workspace:

Command                  Description

npm run dev            Run frontend and backend together
npm run dev:frontend   Start only the React/Vite frontend
npm run dev:backend    Start only the Express backend
npm run seed           Seed the backend database
npm run install:all    Install frontend and backend dependencies
npm start              Start the backend and frontend preview

Frontend commands:

cd globetrotter-frontend
npm run dev
npm run build
npm run preview

Backend commands:

cd globetrotter-backend
npm run dev
npm start
npm run seed

🔌 REST API

The backend exposes REST endpoints under /api.

Module           Endpoint

Health           /api/health
Authentication   /api/auth/*
Users            /api/users/*
Cities           /api/cities
Activities       /api/activities
Trips            /api/trips
Community        /api/community/trips
Admin            /api/admin/*

Authentication-protected requests use a JWT token in the Authorization header.
Authorization: Bearer <token>

🖥️ Main Application Screens
The frontend contains views for:
  Landing Page
  Login & Registration
  Search & Browse
  Create Trip
  My Trips
  Itinerary Builder
  Itinerary Details
  Calendar
  Community
  User Profile
  Admin Dashboard

🔐 Authentication

GlobeTrotter uses JWT authentication.

After successful login or registration, the frontend stores the authentication token in browser local storage and includes it in authenticated API requests.

Passwords are hashed on the backend using bcryptjs.

💾 Data Storage

The current version uses a lightweight JSON-based database stored in the backend project. This makes the application easy to run locally without installing a separate database server.
For a production deployment, the storage layer can be replaced with a database such as MongoDB, PostgreSQL, or MySQL.

🌐 Production Build

Build the frontend with:

cd globetrotter-frontend
npm run build

Vite generates the production files in the dist directory.
Before production deployment, configure the frontend API URL and backend environment variables for your hosting environment.

🔒 Security Notes

-> Never upload .env files containing real secrets.
-> Use a strong, unique JWT_SECRET in production.
-> Use HTTPS in production.
-> Validate and sanitize user input before production deployment.
-> Configure CORS for trusted production origins.
-> Use a production-grade database for a public deployment.

🔮 Future Improvements

Possible improvements include:

-> Interactive maps
-> Real-time weather information
-> Flight and hotel integrations
-> Travel expense tracking
-> Collaborative trip planning
-> Email notifications
-> Advanced destination recommendations
-> Cloud database integration
-> Image uploads for trips and profiles
-> Deployment with CI/CD

🤝 Contributing

Contributions are welcome.
-> Fork the repository.
-> Create a new branch.
-> Make your changes.
-> Commit your changes.
-> Push the branch.
-> Open a pull request.

📄 License

This project is intended for educational and development purposes. Add an appropriate open-source license if you plan to distribute or accept external contributions.

GlobeTrotter --- Plan your journey, organize your itinerary, and explore the world. ✈️🌍
