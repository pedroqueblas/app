const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validate } = require('../utils/validators');
const { registerSchema, loginSchema } = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de autenticação e registro
 */

router.post(
  '/register',
  validate(registerSchema),
  AuthController.register
);

router.post(
  '/login',
  validate(loginSchema),
  AuthController.login
);

module.exports = router;



