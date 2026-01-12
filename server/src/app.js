import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import surveyRoutes from './routes/survey.routes.js';
import responseRoutes from './routes/response.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

export default app;

