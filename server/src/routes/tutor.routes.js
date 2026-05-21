import { Router } from 'express';
import { getAllTutors, getTutorById, getMyTutors, createTutor, updateTutor, deleteTutor } from '../controllers/tutor.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
const tutorRouter = verifySession => {
  const router = Router();
  router.get('/', asyncHandler(getAllTutors));
  router.get('/my-tutors', verifySession, asyncHandler(getMyTutors));
  router.get('/:id', asyncHandler(getTutorById));
  router.post('/', verifySession, asyncHandler(createTutor));
  router.put('/:id', verifySession, asyncHandler(updateTutor));
  router.delete('/:id', verifySession, asyncHandler(deleteTutor));
  return router;
};
export default tutorRouter;