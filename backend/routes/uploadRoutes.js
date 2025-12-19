const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/uploadController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { upload, handleMulterError } = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoints para upload de arquivos
 */

router.post(
  '/xls',
  authenticate,
  isAdmin,
  upload.single('file'),
  handleMulterError,
  UploadController.uploadXLS
);

module.exports = router;

