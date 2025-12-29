const UserService = require('../services/userService');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *             role:
 *               type: string
 *             donor:
 *               type: object
 */

class UserController {
  /**
   * @swagger
   * /api/users/me:
   *   get:
   *     summary: Obter dados do usuário autenticado
   *     tags: [Usuários]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dados do usuário
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Não autenticado
   */
  static async getMe(req, res, next) {
    try {
      const userData = await UserService.getMe(req.user.id);

      res.json({
        success: true,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;




