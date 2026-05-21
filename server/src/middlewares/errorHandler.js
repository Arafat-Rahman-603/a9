import ApiError from '../utils/ApiError.js';
const errorHandler = (err, req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  } else if (!(err instanceof ApiError)) {
    console.error('Unexpected error:', err);
  }
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again later.';
  res.status(statusCode).json({
    error: true,
    message
  });
};
export default errorHandler;