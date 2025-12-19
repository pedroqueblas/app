const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar diretório de uploads se não existir
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `xls-${uniqueSuffix}${ext}`);
  },
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
  ];

  const allowedExtensions = ['.xls', '.xlsx'];

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidMime = allowedMimes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);

  if (isValidMime || isValidExt) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Formato de arquivo inválido. Apenas arquivos .xls e .xlsx são permitidos'
      ),
      false
    );
  }
};

// Configuração do upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB padrão
  },
});

// Middleware para tratar erros do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo permitido: 10MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erro no upload: ${err.message}`,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Erro ao processar arquivo',
    });
  }
  next();
};

module.exports = { upload, handleMulterError };

