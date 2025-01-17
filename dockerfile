# Usa la imagen oficial de Node.js
FROM node:18

# Crea el directorio de la aplicación dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente de la aplicación
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
