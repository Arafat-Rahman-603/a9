import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import validateObjectId from '../utils/validateObjectId.js';
const tutorsCollection = () => getDB().collection('tutors');
const bookingsCollection = () => getDB().collection('bookings');
export const getMyBookings = async (req, res) => {
  const result = await bookingsCollection().find({
    studentEmail: req.user.email
  }).toArray();
  res.json(result);
};
export const createBooking = async (req, res) => {
  const {
    tutorId,
    ...rest
  } = req.body;
  if (!tutorId) throw new ApiError(400, '"tutorId" is required');
  validateObjectId(tutorId);
  const tutorQuery = {
    _id: new ObjectId(tutorId)
  };
  const tutor = await tutorsCollection().findOne(tutorQuery);
  if (!tutor) throw new ApiError(404, 'Tutor not found');
  if (tutor.totalSlot <= 0) {
    throw new ApiError(400, "This session is fully booked.");
  }
  const duplicate = await bookingsCollection().findOne({
    tutorId,
    studentEmail: req.user.email,
    status: 'booked'
  });
  if (duplicate) {
    throw new ApiError(409, 'You have already booked this session');
  }
  const newBooking = {
    ...rest,
    tutorId,
    studentEmail: req.user.email,
    studentName: req.user.name,
    status: 'booked',
    bookingDate: new Date().toISOString()
  };
  const insertResult = await bookingsCollection().insertOne(newBooking);
  await tutorsCollection().updateOne(tutorQuery, {
    $inc: {
      totalSlot: -1
    }
  });
  res.status(201).json(insertResult);
};
export const cancelBooking = async (req, res) => {
  validateObjectId(req.params.id);
  const booking = await bookingsCollection().findOne({
    _id: new ObjectId(req.params.id)
  });
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.studentEmail !== req.user.email) {
    throw new ApiError(403, 'You can only cancel your own bookings');
  }
  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }
  const result = await bookingsCollection().updateOne({
    _id: new ObjectId(req.params.id)
  }, {
    $set: {
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    }
  });
  await tutorsCollection().updateOne({
    _id: new ObjectId(booking.tutorId)
  }, {
    $inc: {
      totalSlot: 1
    }
  });
  res.json(result);
};