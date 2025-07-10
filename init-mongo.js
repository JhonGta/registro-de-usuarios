// Script de inicialización para MongoDB
// Este archivo se ejecuta automáticamente cuando se crea el contenedor de MongoDB

db = db.getSiblingDB('formulario_validacion');

// Crear colección de usuarios con validaciones
db.createCollection('usuarios', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["nombreUsuario", "email", "contraseña", "edad", "categoria"],
         properties: {
            nombreUsuario: {
               bsonType: "string",
               description: "Nombre de usuario debe ser string y es obligatorio"
            },
            email: {
               bsonType: "string",
               pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
               description: "Email debe tener formato válido y es obligatorio"
            },
            contraseña: {
               bsonType: "string",
               description: "Contraseña debe ser string y es obligatoria"
            },
            edad: {
               bsonType: "number",
               minimum: 18,
               maximum: 99,
               description: "Edad debe ser número entre 18 y 99"
            },
            categoria: {
               bsonType: "string",
               enum: ["estudiante", "profesional", "empresario", "freelancer", "otro"],
               description: "Categoría debe ser una de las opciones válidas"
            },
            biografia: {
               bsonType: "string",
               maxLength: 500,
               description: "Biografía no puede exceder 500 caracteres"
            },
            calificacion: {
               bsonType: "number",
               minimum: 1,
               maximum: 10,
               description: "Calificación debe estar entre 1 y 10"
            }
         }
      }
   }
});

// Crear índices únicos
db.usuarios.createIndex({ "nombreUsuario": 1 }, { unique: true });
db.usuarios.createIndex({ "email": 1 }, { unique: true });

// Insertar algunos datos de ejemplo (opcional)
db.usuarios.insertOne({
   nombreUsuario: "admin",
   email: "admin@ejemplo.com",
   contraseña: "$2a$10$rQq0QxZzP3qG5qG5qG5qG5qG5qG5qG5qG5qG5qG5qG5qG5qG5qG5q", // password: Admin123
   edad: 30,
   biografia: "Usuario administrador del sistema",
   categoria: "profesional",
   calificacion: 10,
   createdAt: new Date(),
   updatedAt: new Date()
});

print("Base de datos inicializada correctamente con colección usuarios y datos de ejemplo");
