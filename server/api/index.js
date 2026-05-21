import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import createApp from '../src/app.js';

let appReady = null;

const getApp = async () => {
  if (!appReady) {
    await connectDB();
    appReady = createApp();
  }
  return appReady;
};

export default async function handler(req, res) {
  const app = await getApp();
  return app(req, res);
}
