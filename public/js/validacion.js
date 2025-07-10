// Validación del lado del cliente
class ValidadorFormulario {
    constructor() {
        this.formulario = document.getElementById('formularioRegistro');
        this.campos = {
            nombreUsuario: document.getElementById('nombreUsuario'),
            email: document.getElementById('email'),
            contraseña: document.getElementById('contraseña'),
            confirmarContraseña: document.getElementById('confirmarContraseña'),
            edad: document.getElementById('edad'),
            biografia: document.getElementById('biografia'),
            categoria: document.getElementById('categoria'),
            calificacion: document.getElementById('calificacion')
        };
        
        this.inicializar();
    }

    inicializar() {
        // Event listeners para validación en tiempo real
        Object.keys(this.campos).forEach(campo => {
            if (this.campos[campo]) {
                this.campos[campo].addEventListener('blur', () => this.validarCampo(campo));
                this.campos[campo].addEventListener('input', () => this.validarCampoTiempoReal(campo));
            }
        });

        // Event listener para el envío del formulario
        this.formulario.addEventListener('submit', (e) => this.manejarEnvio(e));
        
        // Event listener para el botón reset
        document.getElementById('btnReset').addEventListener('click', () => this.limpiarFormulario());

        // Contador de caracteres para biografía
        this.campos.biografia.addEventListener('input', () => this.actualizarContadorCaracteres());

        // Actualizador de valor del range
        this.campos.calificacion.addEventListener('input', () => this.actualizarValorCalificacion());

        // Verificación de disponibilidad de usuario y email
        this.campos.nombreUsuario.addEventListener('blur', () => this.verificarDisponibilidadUsuario());
        this.campos.email.addEventListener('blur', () => this.verificarDisponibilidadEmail());
    }

    validarCampoTiempoReal(campo) {
        // Validación ligera en tiempo real para mejorar UX
        const elemento = this.campos[campo];
        const valor = elemento.value.trim();

        switch (campo) {
            case 'contraseña':
                this.validarFortalezaContraseña(valor);
                break;
            case 'confirmarContraseña':
                if (valor.length > 0) {
                    this.validarConfirmacionContraseña();
                }
                break;
        }
    }

    validarCampo(campo) {
        const elemento = this.campos[campo];
        const valor = elemento.value.trim();
        let esValido = true;
        let mensaje = '';

        // Limpiar mensajes anteriores
        this.limpiarMensajesError(campo);

        switch (campo) {
            case 'nombreUsuario':
                const resultadoUsuario = this.validarNombreUsuario(valor);
                esValido = resultadoUsuario.valido;
                mensaje = resultadoUsuario.mensaje;
                break;

            case 'email':
                const resultadoEmail = this.validarEmail(valor);
                esValido = resultadoEmail.valido;
                mensaje = resultadoEmail.mensaje;
                break;

            case 'contraseña':
                const resultadoContraseña = this.validarContraseña(valor);
                esValido = resultadoContraseña.valido;
                mensaje = resultadoContraseña.mensaje;
                break;

            case 'confirmarContraseña':
                const resultadoConfirmacion = this.validarConfirmacionContraseña();
                esValido = resultadoConfirmacion.valido;
                mensaje = resultadoConfirmacion.mensaje;
                break;

            case 'edad':
                const resultadoEdad = this.validarEdad(valor);
                esValido = resultadoEdad.valido;
                mensaje = resultadoEdad.mensaje;
                break;

            case 'biografia':
                const resultadoBiografia = this.validarBiografia(valor);
                esValido = resultadoBiografia.valido;
                mensaje = resultadoBiografia.mensaje;
                break;

            case 'categoria':
                const resultadoCategoria = this.validarCategoria(valor);
                esValido = resultadoCategoria.valido;
                mensaje = resultadoCategoria.mensaje;
                break;

            case 'calificacion':
                const resultadoCalificacion = this.validarCalificacion(valor);
                esValido = resultadoCalificacion.valido;
                mensaje = resultadoCalificacion.mensaje;
                break;
        }

        this.mostrarResultadoValidacion(campo, esValido, mensaje);
        return esValido;
    }

    validarNombreUsuario(valor) {
        if (!valor) {
            return { valido: false, mensaje: 'El nombre de usuario es obligatorio' };
        }
        if (valor.length < 3) {
            return { valido: false, mensaje: 'El nombre de usuario debe tener al menos 3 caracteres' };
        }
        if (valor.length > 20) {
            return { valido: false, mensaje: 'El nombre de usuario no puede exceder 20 caracteres' };
        }
        if (!/^[a-zA-Z0-9_]+$/.test(valor)) {
            return { valido: false, mensaje: 'Solo se permiten letras, números y guiones bajos' };
        }
        return { valido: true, mensaje: '' };
    }

    validarEmail(valor) {
        if (!valor) {
            return { valido: false, mensaje: 'El email es obligatorio' };
        }
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor)) {
            return { valido: false, mensaje: 'Formato de email inválido' };
        }
        return { valido: true, mensaje: '' };
    }

    validarContraseña(valor) {
        if (!valor) {
            return { valido: false, mensaje: 'La contraseña es obligatoria' };
        }
        if (valor.length < 8) {
            return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
        }
        if (!/(?=.*[a-z])/.test(valor)) {
            return { valido: false, mensaje: 'La contraseña debe contener al menos una letra minúscula' };
        }
        if (!/(?=.*[A-Z])/.test(valor)) {
            return { valido: false, mensaje: 'La contraseña debe contener al menos una letra mayúscula' };
        }
        if (!/(?=.*\d)/.test(valor)) {
            return { valido: false, mensaje: 'La contraseña debe contener al menos un número' };
        }
        return { valido: true, mensaje: 'Contraseña válida' };
    }

    validarFortalezaContraseña(valor) {
        const requisitos = [
            { test: valor.length >= 8, texto: '8+ caracteres' },
            { test: /[a-z]/.test(valor), texto: 'Minúscula' },
            { test: /[A-Z]/.test(valor), texto: 'Mayúscula' },
            { test: /\d/.test(valor), texto: 'Número' }
        ];

        // Actualizar indicadores visuales (opcional)
        // Aquí podrías añadir indicadores visuales de fortaleza
    }

    validarConfirmacionContraseña() {
        const contraseña = this.campos.contraseña.value;
        const confirmacion = this.campos.confirmarContraseña.value;

        if (!confirmacion) {
            return { valido: false, mensaje: 'Debe confirmar la contraseña' };
        }
        if (contraseña !== confirmacion) {
            return { valido: false, mensaje: 'Las contraseñas no coinciden' };
        }
        return { valido: true, mensaje: 'Las contraseñas coinciden' };
    }

    validarEdad(valor) {
        if (!valor) {
            return { valido: false, mensaje: 'La edad es obligatoria' };
        }
        const edad = parseInt(valor);
        if (isNaN(edad)) {
            return { valido: false, mensaje: 'La edad debe ser un número' };
        }
        if (edad < 18) {
            return { valido: false, mensaje: 'Debe ser mayor de 18 años' };
        }
        if (edad > 99) {
            return { valido: false, mensaje: 'La edad máxima es 99 años' };
        }
        return { valido: true, mensaje: '' };
    }

    validarBiografia(valor) {
        if (valor.length > 500) {
            return { valido: false, mensaje: 'La biografía no puede exceder 500 caracteres' };
        }
        return { valido: true, mensaje: '' };
    }

    validarCategoria(valor) {
        if (!valor) {
            return { valido: false, mensaje: 'Debe seleccionar una categoría' };
        }
        const categoriasValidas = ['estudiante', 'profesional', 'empresario', 'freelancer', 'otro'];
        if (!categoriasValidas.includes(valor)) {
            return { valido: false, mensaje: 'Categoría inválida' };
        }
        return { valido: true, mensaje: '' };
    }

    validarCalificacion(valor) {
        const calificacion = parseInt(valor);
        if (isNaN(calificacion) || calificacion < 1 || calificacion > 10) {
            return { valido: false, mensaje: 'La calificación debe estar entre 1 y 10' };
        }
        return { valido: true, mensaje: '' };
    }

    async verificarDisponibilidadUsuario() {
        const nombreUsuario = this.campos.nombreUsuario.value.trim();
        if (nombreUsuario.length < 3) return;

        try {
            const response = await fetch(`/api/usuarios/verificar-usuario/${encodeURIComponent(nombreUsuario)}`);
            const data = await response.json();
            
            const elemento = document.getElementById('success-nombreUsuario');
            if (data.disponible) {
                elemento.textContent = '✓ Nombre de usuario disponible';
                elemento.classList.add('show');
            } else {
                this.mostrarError('nombreUsuario', 'Nombre de usuario no disponible');
                elemento.classList.remove('show');
            }
        } catch (error) {
            console.error('Error verificando disponibilidad del usuario:', error);
        }
    }

    async verificarDisponibilidadEmail() {
        const email = this.campos.email.value.trim();
        if (!this.validarEmail(email).valido) return;

        try {
            const response = await fetch(`/api/usuarios/verificar-email/${encodeURIComponent(email)}`);
            const data = await response.json();
            
            const elemento = document.getElementById('success-email');
            if (data.disponible) {
                elemento.textContent = '✓ Email disponible';
                elemento.classList.add('show');
            } else {
                this.mostrarError('email', 'Email ya registrado');
                elemento.classList.remove('show');
            }
        } catch (error) {
            console.error('Error verificando disponibilidad del email:', error);
        }
    }

    mostrarResultadoValidacion(campo, esValido, mensaje) {
        const elemento = this.campos[campo];
        
        if (esValido) {
            elemento.classList.remove('invalid');
            elemento.classList.add('valid');
            this.limpiarMensajesError(campo);
        } else {
            elemento.classList.remove('valid');
            elemento.classList.add('invalid');
            if (mensaje) {
                this.mostrarError(campo, mensaje);
            }
        }
    }

    mostrarError(campo, mensaje) {
        const errorElement = document.getElementById(`error-${campo}`);
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.classList.add('show');
        }
        
        // Añadir efecto de shake
        this.campos[campo].classList.add('shake');
        setTimeout(() => this.campos[campo].classList.remove('shake'), 500);
    }

    limpiarMensajesError(campo) {
        const errorElement = document.getElementById(`error-${campo}`);
        const successElement = document.getElementById(`success-${campo}`);
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        if (successElement) {
            successElement.classList.remove('show');
        }
    }

    validarFormularioCompleto() {
        let formularioValido = true;
        
        // Validar todos los campos obligatorios
        const camposObligatorios = ['nombreUsuario', 'email', 'contraseña', 'confirmarContraseña', 'edad', 'categoria'];
        
        camposObligatorios.forEach(campo => {
            if (!this.validarCampo(campo)) {
                formularioValido = false;
            }
        });

        // Validar campos opcionales que tienen valor
        if (this.campos.biografia.value.trim()) {
            if (!this.validarCampo('biografia')) {
                formularioValido = false;
            }
        }

        if (!this.validarCampo('calificacion')) {
            formularioValido = false;
        }

        return formularioValido;
    }

    async manejarEnvio(e) {
        e.preventDefault();
        
        // Validar formulario completo
        if (!this.validarFormularioCompleto()) {
            this.mostrarMensaje('Por favor, corrija los errores antes de continuar', 'error');
            return;
        }

        // Mostrar estado de carga
        this.mostrarEstadoCarga(true);

        try {
            // Recopilar datos del formulario
            const datosFormulario = new FormData(this.formulario);
            const datos = Object.fromEntries(datosFormulario);

            // Enviar datos al servidor
            const response = await fetch('/api/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (resultado.success) {
                this.mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = '/exito';
                }, 1500);
            } else {
                this.manejarErroresServidor(resultado.errores || []);
            }

        } catch (error) {
            console.error('Error enviando formulario:', error);
            this.mostrarMensaje('Error de conexión. Por favor, inténtelo de nuevo.', 'error');
        } finally {
            this.mostrarEstadoCarga(false);
        }
    }

    manejarErroresServidor(errores) {
        if (errores.length === 0) {
            this.mostrarMensaje('Error desconocido. Por favor, inténtelo de nuevo.', 'error');
            return;
        }

        // Mostrar errores específicos en sus campos correspondientes
        errores.forEach(error => {
            if (error.campo && this.campos[error.campo]) {
                this.mostrarError(error.campo, error.mensaje);
                this.campos[error.campo].classList.add('invalid');
            }
        });

        // Mostrar mensaje general
        const mensajesError = errores.map(e => e.mensaje).join(', ');
        this.mostrarMensaje(`Errores de validación: ${mensajesError}`, 'error');
    }

    mostrarMensaje(mensaje, tipo) {
        const contenedor = document.getElementById('mensajeResultado');
        const textoElemento = document.getElementById('mensajeTexto');
        
        textoElemento.textContent = mensaje;
        contenedor.className = `resultado-container ${tipo} fade-in`;
        contenedor.style.display = 'block';

        // Ocultar después de 5 segundos si es error
        if (tipo === 'error') {
            setTimeout(() => {
                contenedor.style.display = 'none';
            }, 5000);
        }
    }

    mostrarEstadoCarga(cargando) {
        const boton = document.getElementById('btnSubmit');
        
        if (cargando) {
            boton.disabled = true;
            boton.classList.add('loading');
        } else {
            boton.disabled = false;
            boton.classList.remove('loading');
        }
    }

    actualizarContadorCaracteres() {
        const biografia = this.campos.biografia.value;
        const contador = document.getElementById('biografiaCounter');
        contador.textContent = biografia.length;
        
        // Cambiar color si se acerca al límite
        if (biografia.length > 450) {
            contador.style.color = '#dc3545';
        } else if (biografia.length > 400) {
            contador.style.color = '#ffc107';
        } else {
            contador.style.color = '#666';
        }
    }

    actualizarValorCalificacion() {
        const valor = this.campos.calificacion.value;
        document.getElementById('calificacionValue').textContent = valor;
    }

    limpiarFormulario() {
        // Limpiar todos los mensajes de error y éxito
        Object.keys(this.campos).forEach(campo => {
            this.limpiarMensajesError(campo);
            this.campos[campo].classList.remove('valid', 'invalid');
        });

        // Resetear contadores
        document.getElementById('biografiaCounter').textContent = '0';
        document.getElementById('calificacionValue').textContent = '5';
        
        // Ocultar mensaje de resultado
        document.getElementById('mensajeResultado').style.display = 'none';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ValidadorFormulario();
});
