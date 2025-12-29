const express = require('express');
const router = express.Router();
const DonorController = require('../controllers/donorController');

/**
 * @swagger
 * tags:
 *   name: Doadores
 *   description: Endpoints relacionados a dados de doadores
 */

/**
 * @swagger
 * /api/donors/{codigo}:
 *   get:
 *     summary: Buscar doador pelo código
 *     tags: [Doadores]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do doador
 *     responses:
 *       200:
 *         description: Dados do doador encontrados
 *       404:
 *         description: Doador não encontrado
 */
router.get('/:codigo', DonorController.getByCodigo);

module.exports = router;


