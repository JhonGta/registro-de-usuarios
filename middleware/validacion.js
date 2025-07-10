const { body, validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');

// Reglas de validación para registro de usuario
const validacionRegistro = [
    body('nombreUsuario')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos')
        .custom(async (value) => {
            const usuario = await Usuario.findOne({ nombreUsuario: value });
            if (usuario) {
                throw new Error('El nombre de usuario ya está en uso');
            }
            return true;
        }),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe proporcionar un email válido')
        .normalizeEmail()
        .custom(async (value) => {
            const usuario = await Usuario.findOne({ email: value });
            if (usuario) {
                throw new Error('El email ya está registrado');
            }
            return true;
        }),

    body('contraseña')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),

    body('confirmarContraseña')
        .custom((value, { req }) => {
            if (value !== req.body.contraseña) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),

    body('edad')
        .isInt({ min: 18, max: 99 })
        .withMessage('La edad debe ser un número entre 18 y 99'),

    body('biografia')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La biografía no puede exceder 500 caracteres'),

    body('categoria')
        .isIn(['estudiante', 'profesional', 'empresario', 'freelancer', 'otro'])
        .withMessage('Debe seleccionar una categoría válida'),

    body('calificacion')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('La calificación debe ser un número entre 1 y 10')
];

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
    const errores = validationResult(req);
    
    if (!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            mensaje: 'Errores de validación',
            errores: errores.array().map(error => ({
                campo: error.path,
                mensaje: error.msg,
                valor: error.value
            }))
        });
    }
    
    next();
};

module.exports = {
    validacionRegistro,
    manejarErroresValidacion
};
