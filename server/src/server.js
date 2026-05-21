import 'dotenv/config';
import { connectDB, closeDB } from './config/db.js';
import createApp from './app.js';
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`Server running...`);
  });
  const shutdown = async signal => {
    console.log(`\n${signal} received`);
    server.close(async () => {
      await closeDB();
      console.log('Server closed.');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};
start();