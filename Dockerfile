# Utilisez l'image officielle Node.js avec la version spécifique
FROM node:18.18.2

# Définissez le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel votre application Node.js écoute
EXPOSE 8080

# Commande pour démarrer votre application
CMD ["npm", "start"]
