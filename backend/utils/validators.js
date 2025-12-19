const Joi = require('joi');

/**
 * Validação de registro
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória',
  }),
  codigo_doador: Joi.string().required().messages({
    'any.required': 'Código do doador é obrigatório',
  }),
});

/**
 * Validação de login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Senha é obrigatória',
  }),
});

/**
 * Middleware de validação genérico
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  validate,
};



