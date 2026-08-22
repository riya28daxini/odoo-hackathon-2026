import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { JsonDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
let PORT = Number(process.env.PORT) || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Ensure DB is initialized
JsonDB.read();

// Root Welcome Route with Rich HTML Dashboard for Browser Requests & JSON for API clients
app.get('/', (req, res) => {
  const acceptsHtml = req.accepts('html');

  if (acceptsHtml && !req.xhr) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GlobeTrotter API Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f8fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .card {
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            border-radius: 24px;
            max-width: 680px;
            width: 100%;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(52, 211, 153, 0.3);
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 20px;
          }
          .pulse {
            width: 8 hpx;
            height: 8px;
            background-color: #34d399;
            border-radius: 50%;
            box-shadow: 0 0 10px #34d399;
          }
          h1 {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(to right, #2dd4bf, #38bdf8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
          .actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 30px; }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .btn-primary {
            background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
            color: white;
            box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.4);
          }
          .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(13, 148, 136, 0.5); }
          .btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
          }
          .endpoint-card {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 13px;
          }
          .endpoint-card strong { color: #38bdf8; display: block; margin-bottom: 4px; }
          .endpoint-card span { color: #cbd5e1; font-family: monospace; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="pulse"></span> REST API Online (v1.0.0)</div>
          <h1>🌐 GlobeTrotter Backend API</h1>
          <p>Express REST API server active. Use the button below to launch the main GlobeTrotter Web Application or test endpoints.</p>
          
          <div class="actions">
            <a href="http://localhost:5173" class="btn btn-primary" target="_blank">🚀 Open GlobeTrotter Frontend (Port 5173)</a>
            <a href="/api/health" class="btn btn-secondary">⚡ Health Check API</a>
            <a href="/api/cities" class="btn btn-secondary">🏙️ Cities API</a>
            <a href="/api/trips" class="btn btn-secondary">✈️ Trips API</a>
          </div>

          <h3 style="font-size: 14px; font-weight: 700; color: #cbd5e1; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">API Route Registry</h3>
          <div class="grid">
            <div class="endpoint-card"><strong>Auth APIs</strong><span>/api/auth/*</span></div>
            <div class="endpoint-card"><strong>Cities & Search</strong><span>/api/cities</span></div>
            <div class="endpoint-card"><strong>Activities Catalog</strong><span>/api/activities</span></div>
            <div class="endpoint-card"><strong>Trip Planner</strong><span>/api/trips</span></div>
            <div class="endpoint-card"><strong>Community Feed</strong><span>/api/community/trips</span></div>
            <div class="endpoint-card"><strong>Admin Analytics</strong><span>/api/admin/stats</span></div>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    success: true,
    name: 'GlobeTrotter REST API Server',
    status: 'online',
    version: '1.0.0',
    documentation: 'See README.md for endpoint specifications',
    healthCheck: '/api/health',
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register', '/api/auth/me'],
      users: ['/api/users/profile', '/api/users/wishlist/:cityId'],
      cities: ['/api/cities', '/api/cities/:id'],
      activities: ['/api/activities'],
      trips: ['/api/trips', '/api/trips/:id'],
      community: ['/api/community/trips'],
      admin: ['/api/admin/stats']
    }
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'GlobeTrotter Backend API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`
=====================================================
🚀 GlobeTrotter Backend API Server Running!
📍 Root URL: http://localhost:${portToTry}
⚡ Health Check: http://localhost:${portToTry}/api/health
=====================================================
    `);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is already in use. Retrying on port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server startup error:', err);
    }
  });
};

startServer(PORT);
