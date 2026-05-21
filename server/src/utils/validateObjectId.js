import { ObjectId } from 'mongodb';
import ApiError from './ApiError.js';
const validateObjectId = id => {
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ID format: "${id}"`);
  }
};
export default validateObjectId;