import express from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicle.js';
import transactionRoutes from './routes/transaction.js';
import connectDB from './config/db.js';
import { getMpesaAccessToken } from './services/mpesa.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/transaction', transactionRoutes);

// Connect to MongoDB
connectDB();

// Fetch M-Pesa access token on startup
getMpesaAccessToken();

export default app;