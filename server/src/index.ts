import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';
import jdRoutes from './routes/jd.routes';
import { generalLimiter, aiLimiter, authLimiter } from './middleware/rateLimit.middleware';

import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jd', jdRoutes);
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/ai', aiLimiter);

app.use(helmet())
app.use(morgan('dev'))
app.use(cookieParser());
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'https://hireguru-theta.vercel.app',
      'https://hireguru.vercel.app',
      process.env.CLIENT_URL || '',
    ]
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});