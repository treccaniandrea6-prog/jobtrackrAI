import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { testConnection } from './config/database';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://jobtrackrai.netlify.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorMiddleware);

const start = async () => {
  await testConnection();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
};

start();

export default app;