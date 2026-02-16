const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Si l'erreur a un status, on le prend, sinon 500
  const status = err.status || 500;

  // Message simple
  const message = err.message || "Erreur serveur";

  res.status(status).json({ error: message });
};

module.exports = errorHandler;