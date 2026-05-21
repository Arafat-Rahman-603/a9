import { Router } from 'express';
import tutorRouter from './tutor.routes.js';
import bookingRouter from './booking.routes.js';
const registerRoutes = verifySession => {
  const router = Router();
  router.use('/tutors', tutorRouter(verifySession));
  router.use('/bookings', bookingRouter(verifySession));
  return router;
};
export default registerRoutes;