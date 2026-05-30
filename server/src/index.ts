import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';
import jdRoutes from './routes/jd.routes';
import { generalLimiter, aiLimiter, authLimiter } from './middleware/rateLimit.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet({
  crossOriginResourcePolicy: false,
}))
app.use(morgan('dev'))
app.use(cookieParser())

// CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://hireguru-theta.vercel.app',
    'https://hireguru.vercel.app',
    process.env.FRONTEND_URL || '',
    process.env.CLIENT_URL || '',
  ],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Passport
app.use(passport.initialize())

// Rate limiting
app.use('/api/', generalLimiter)
app.use('/api/auth', authLimiter)
app.use('/api/ai', aiLimiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/user', userRoutes)
app.use('/api/jd', jdRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
  })
})