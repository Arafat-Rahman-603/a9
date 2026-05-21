import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { createAuth } from './lib/auth.js';
import { makeVerifySession } from './middlewares/verifySession.js';
import registerRoutes from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
const createApp = () => {
  const app = express();
  const auth = createAuth();
  const verifySession = makeVerifySession(auth);
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  }));
  app.all('/api/auth/{*splat}', toNodeHandler(auth));
  app.use(express.json());
  app.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      message: 'Server is running'
    });
  });
  app.use('/api', registerRoutes(verifySession));
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
export default createApp;