import express from 'express';
import cors from 'cors';
import { makeVerifySession } from './middlewares/verifySession.js';
import registerRoutes from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const createApp = () => {
  const app = express();
  const verifySession = makeVerifySession();

  const allowedOrigins = new Set(['http://localhost:3000']);
  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach(url => allowedOrigins.add(url.trim()));
  }

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'X-Requested-With',
      'Accept',
      'Origin'
    ]
  };

  app.use(cors(corsOptions));
  app.options('/*splat', cors(corsOptions));

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