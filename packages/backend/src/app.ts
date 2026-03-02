import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler.js';
import { routes } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
  app.use(express.json());

  app.use('/api/v1', routes);

  app.use(errorHandler);

  return app;
}
