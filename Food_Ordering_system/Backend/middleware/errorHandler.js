export const errorHandler = (err, req, res, next) => {
  console.error('=== ERROR HANDLER ===');
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  console.error('Request URL:', req.originalUrl);
  console.error('Request method:', req.method);
  
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};
