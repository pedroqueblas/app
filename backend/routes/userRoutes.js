const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints relacionados a usuários
 */

router.get('/me', authenticate, UserController.getMe);

module.exports = router;



