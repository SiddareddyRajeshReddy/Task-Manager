import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './auth/auth.routes.js';
import tasksRoutes from './tasks/tasks.routes.js';
const app  = express();
const PORT = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', tasksRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));