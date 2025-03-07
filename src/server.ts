import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { environment } from './config/environment';
import { connectDatabase } from './config/database';
import routes from './routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import logger from './utils/logger';
import path from 'path';

// Create Express app
const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (environment.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static folder for uploads (temp storage)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Church Management API',
    version: '1.0.0',
    status: 'healthy',
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = environment.port;
app.listen(PORT, () => {
  logger.info(`Server running in ${environment.nodeEnv} mode on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

export default app;