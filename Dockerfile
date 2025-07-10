# Imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente para desarrollo
RUN npm install -g nodemon

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "start"]
