import { Router } from 'express';
import { getMyBookings, createBooking, cancelBooking } from '../controllers/booking.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
const bookingRouter = verifySession => {
  const router = Router();
  router.use(verifySession);
  router.get('/', asyncHandler(getMyBookings));
  router.post('/', asyncHandler(createBooking));
  router.patch('/:id', asyncHandler(cancelBooking));
  return router;
};
export default bookingRouter;