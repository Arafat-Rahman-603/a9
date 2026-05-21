import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import ApiError from '../utils/ApiError.js';
import validateObjectId from '../utils/validateObjectId.js';
const tutorsCollection = () => getDB().collection('tutors');
export const getAllTutors = async (req, res) => {
  const {
    search,
    startDate,
    endDate,
    limit
  } = req.query;
  const query = {};
  if (search) {
    query.name = {
      $regex: search,
      $options: 'i'
    };
  }
  if (startDate && endDate) {
    query.sessionDate = {
      $gte: startDate,
      $lte: endDate
    };
  } else if (startDate) {
    query.sessionDate = {
      $gte: startDate
    };
  } else if (endDate) {
    query.sessionDate = {
      $lte: endDate
    };
  }
  let cursor = tutorsCollection().find(query);
  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new ApiError(400, 'Limit must be a number');
    }
    cursor = cursor.limit(parsedLimit);
  }
  const result = await cursor.toArray();
  res.json(result);
};
export const getTutorById = async (req, res) => {
  validateObjectId(req.params.id);
  const tutor = await tutorsCollection().findOne({
    _id: new ObjectId(req.params.id)
  });
  if (!tutor) throw new ApiError(404, 'Tutor not found');
  res.json(tutor);
};
export const getMyTutors = async (req, res) => {
  const result = await tutorsCollection().find({
    addedByEmail: req.user.email
  }).toArray();
  res.json(result);
};
export const createTutor = async (req, res) => {
  const tutor = {
    ...req.body,
    addedByEmail: req.user.email
  };
  const result = await tutorsCollection().insertOne(tutor);
  res.status(201).json(result);
};
export const updateTutor = async (req, res) => {
  validateObjectId(req.params.id);
  
  const updateData = { ...req.body };
  delete updateData._id;
  delete updateData.addedByEmail;

  const result = await tutorsCollection().updateOne({
    _id: new ObjectId(req.params.id),
    addedByEmail: req.user.email
  }, {
    $set: updateData
  });
  if (result.matchedCount === 0) throw new ApiError(404, 'Tutor not found');
  res.json(result);
};
export const deleteTutor = async (req, res) => {
  validateObjectId(req.params.id);
  const result = await tutorsCollection().deleteOne({
    _id: new ObjectId(req.params.id),
    addedByEmail: req.user.email
  });
  if (result.deletedCount === 0) throw new ApiError(404, 'Tutor not found');
  res.json(result);
};