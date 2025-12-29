const fs = require('fs');
const path = require('path');
const XLSService = require('../services/xlsService');

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             total_rows:
 *               type: integer
 *             successful_imports:
 *               type: integer
 *             failed_imports:
 *               type: integer
 *             errors:
 *               type: array
 */

class UploadController {
  /**
   * @swagger
   * /api/upload/xls:
   *   post:
   *     summary: Upload e importação de arquivo XLS/XLSX com doadores
   *     tags: [Upload]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Arquivo processado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UploadResponse'
   *       400:
   *         description: Erro ao processar arquivo
   *       401:
   *         description: Não autenticado
   *       403:
   *         description: Acesso negado (apenas admin)
   */
  static async uploadXLS(req, res, next) {
    let filePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado',
        });
      }

      filePath = req.file.path;
      const filename = req.file.originalname;
      const userId = req.user.id;

      // Processar arquivo
      const result = await XLSService.processFile(filePath, filename, userId);

      // Remover arquivo após processamento
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({
        success: true,
        message: 'Arquivo processado com sucesso',
        data: result,
      });
    } catch (error) {
      // Remover arquivo em caso de erro
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      next(error);
    }
  }
}

module.exports = UploadController;




