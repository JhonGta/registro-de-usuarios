const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const { validacionRegistro, manejarErroresValidacion } = require('../middleware/validacion');

// Ruta POST para registrar usuario
router.post('/registro', validacionRegistro, manejarErroresValidacion, async (req, res) => {
    try {
        const { nombreUsuario, email, contraseña, edad, biografia, categoria, calificacion } = req.body;

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombreUsuario,
            email,
            contraseña,
            edad,
            biografia,
            categoria,
            calificacion: calificacion || 5
        });

        // Guardar en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();

        // Respuesta exitosa (sin enviar la contraseña)
        res.status(201).json({
            success: true,
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: usuarioGuardado._id,
                nombreUsuario: usuarioGuardado.nombreUsuario,
                email: usuarioGuardado.email,
                edad: usuarioGuardado.edad,
                biografia: usuarioGuardado.biografia,
                categoria: usuarioGuardado.categoria,
                calificacion: usuarioGuardado.calificacion,
                fechaCreacion: usuarioGuardado.createdAt
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);

        // Manejar errores de MongoDB (duplicados, etc.)
        if (error.code === 11000) {
            const campo = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                mensaje: `${campo} ya está en uso`,
                errores: [{
                    campo: campo,
                    mensaje: `Este ${campo} ya está registrado`
                }]
            });
        }

        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => ({
                campo: err.path,
                mensaje: err.message
            }));

            return res.status(400).json({
                success: false,
                mensaje: 'Errores de validación',
                errores: errores
            });
        }

        // Error genérico del servidor
        res.status(500).json({
            success: false,
            mensaje: 'Error interno del servidor'
        });
    }
});

// Ruta GET para obtener todos los usuarios (opcional, para pruebas)
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, '-contraseña'); // Excluir contraseñas
        res.json({
            success: true,
            usuarios: usuarios
        });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo usuarios'
        });
    }
});

// Ruta GET para verificar disponibilidad de nombre de usuario
router.get('/verificar-usuario/:nombreUsuario', async (req, res) => {
    try {
        const { nombreUsuario } = req.params;
        const usuario = await Usuario.findOne({ nombreUsuario });
        
        res.json({
            disponible: !usuario,
            mensaje: usuario ? 'Nombre de usuario no disponible' : 'Nombre de usuario disponible'
        });
    } catch (error) {
        res.status(500).json({
            disponible: false,
            mensaje: 'Error verificando disponibilidad'
        });
    }
});

// Ruta GET para verificar disponibilidad de email
router.get('/verificar-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await Usuario.findOne({ email });
        
        res.json({
            disponible: !usuario,
            mensaje: usuario ? 'Email no disponible' : 'Email disponible'
        });
    } catch (error) {
        res.status(500).json({
            disponible: false,
            mensaje: 'Error verificando disponibilidad'
        });
    }
});

// Ruta para inicializar la base de datos con datos de prueba
router.post('/inicializar-datos', async (req, res) => {
    try {
        // Verificar si ya existen datos
        const usuariosExistentes = await Usuario.countDocuments();
        
        if (usuariosExistentes > 0) {
            return res.json({
                success: true,
                mensaje: `La base de datos ya tiene ${usuariosExistentes} usuario(s)`,
                usuarios: usuariosExistentes
            });
        }

        // Crear usuarios de ejemplo
        const usuariosPrueba = [
            {
                nombreUsuario: 'admin_test',
                email: 'admin@test.com',
                contraseña: 'Admin123456',
                edad: 30,
                biografia: 'Usuario administrador de prueba para el sistema de validación',
                categoria: 'profesional',
                calificacion: 10
            },
            {
                nombreUsuario: 'estudiante_demo',
                email: 'estudiante@demo.com',
                contraseña: 'Estudiante123',
                edad: 22,
                biografia: 'Estudiante de ingeniería en sistemas, apasionado por la tecnología',
                categoria: 'estudiante',
                calificacion: 8
            },
            {
                nombreUsuario: 'freelancer_test',
                email: 'freelancer@example.com',
                contraseña: 'Freelancer123',
                edad: 28,
                biografia: 'Desarrollador freelancer especializado en aplicaciones web modernas',
                categoria: 'freelancer',
                calificacion: 9
            }
        ];

        // Insertar usuarios de prueba
        const usuariosCreados = await Usuario.insertMany(usuariosPrueba);

        res.status(201).json({
            success: true,
            mensaje: `Base de datos inicializada correctamente con ${usuariosCreados.length} usuarios de prueba`,
            usuarios: usuariosCreados.map(user => ({
                id: user._id,
                nombreUsuario: user.nombreUsuario,
                email: user.email,
                categoria: user.categoria,
                fechaCreacion: user.createdAt
            }))
        });

    } catch (error) {
        console.error('Error inicializando datos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error inicializando la base de datos',
            error: error.message
        });
    }
});

// Ruta para limpiar todos los datos (solo para desarrollo)
router.delete('/limpiar-datos', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                mensaje: 'Esta operación no está permitida en producción'
            });
        }

        const resultado = await Usuario.deleteMany({});
        
        res.json({
            success: true,
            mensaje: `Se eliminaron ${resultado.deletedCount} usuarios de la base de datos`,
            eliminados: resultado.deletedCount
        });

    } catch (error) {
        console.error('Error limpiando datos:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error limpiando la base de datos'
        });
    }
});

module.exports = router;
