import { getAuth, clerkClient } from '@clerk/express';
import ApiError from '../utils/ApiError.js';

export const makeVerifySession = () => async (req, _res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return next(new ApiError(401, 'Unauthorized — no active session'));
    }
    const user = await clerkClient.users.getUser(auth.userId);
    req.user = {
      id: auth.userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User'
    };
    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized'));
  }
};