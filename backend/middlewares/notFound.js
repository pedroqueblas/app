/**
 * Middleware para rotas não encontradas (404)
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`,
  });
};

module.exports = { notFound };




