const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        trim: true,
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
        maxlength: [20, 'El nombre de usuario no puede exceder 20 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de email inválido']
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [18, 'Debe ser mayor de 18 años'],
        max: [99, 'La edad máxima es 99 años']
    },
    biografia: {
        type: String,
        maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
        default: ''
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['estudiante', 'profesional', 'empresario', 'freelancer', 'otro']
    },
    calificacion: {
        type: Number,
        min: [1, 'La calificación mínima es 1'],
        max: [10, 'La calificación máxima es 10'],
        default: 5
    }
}, {
    timestamps: true
});

// Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('contraseña')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.contraseña = await bcrypt.hash(this.contraseña, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContraseña = async function(contraseñaIngresada) {
    return await bcrypt.compare(contraseñaIngresada, this.contraseña);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
