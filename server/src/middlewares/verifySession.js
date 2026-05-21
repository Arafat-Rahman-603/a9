import ApiError from '../utils/ApiError.js';
export const makeVerifySession = auth => async (req, _res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return next(new ApiError(401, 'Unauthorized — no active session'));
    }
    req.user = session.user;
    next();
  } catch {
    next(new ApiError(401, 'Unauthorized'));
  }
};