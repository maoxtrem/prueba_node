function errorMiddleware(error, request, response, next) {
  console.error(error);
  if (response.headersSent) return next(error);
  return response.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorMiddleware;
