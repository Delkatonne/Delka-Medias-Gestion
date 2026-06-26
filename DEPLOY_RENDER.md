# Delka Médias Gestion - Guide de Déploiement sur Render

## 📋 Prérequis

- Compte Render (https://render.com)
- Compte GitHub avec le dépôt pushé
- Gmail avec App Password configuré

## 🚀 Étapes de Déploiement

### 1. Créer la Base de Données PostgreSQL

1. Accédez à https://render.com/dashboard
2. Cliquez sur "New +" → "PostgreSQL"
3. Configurez :
   - **Name**: `delka-medias-db`
   - **Database**: `delka_medias`
   - **User**: `postgres`
   - **Region**: Choisissez votre région (ex: Frankfurt)
   - **Version**: 15
4. Cliquez "Create Database"
5. Copiez la **External Database URL** (format: `postgresql://...`)

### 2. Déployer le Backend

1. Depuis le dashboard Render, cliquez "New +" → "Web Service"
2. Connectez votre GitHub à Render si nécessaire
3. Sélectionnez le dépôt `Delka-Medias-Gestion`
4. Configurez :
   - **Name**: `delka-medias-backend`
   - **Environment**: `Docker`
   - **Build Command**: (vide, utilisera Dockerfile)
   - **Start Command**: (vide)
   - **Region**: Même région que la BD
   - **Plan**: Free (ou payant selon vos besoins)

5. Allez à l'onglet **Environment**
6. Ajoutez les variables d'environnement :
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://... (copié de l'étape 1)
   JWT_SECRET=<choisissez-une-clé-secrète-forte>
   JWT_EXPIRE=7d
   GMAIL_USER=<votre-email@gmail.com>
   GMAIL_PASSWORD=<votre-app-password>
   FRONTEND_URL=https://<votre-frontend-url>.onrender.com
   UPLOAD_DIR=/var/data/uploads
   MAX_FILE_SIZE=104857600
   ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
   ```

7. Modifiez le Dockerfile du backend pour Render :
   - Changez le working directory
   - Utilisez `npm run build` avant le démarrage

8. Cliquez "Create Web Service"
9. Attendez le déploiement (environ 5-10 minutes)
10. Copiez l'URL générée (ex: `https://delka-medias-backend.onrender.com`)

### 3. Configurer la Base de Données

1. Depuis votre service backend, allez aux logs
2. Vérifiez que la connexion à la BD est établie
3. Exécutez le script SQL manuellement si nécessaire :
   - Utilisez psql ou un client PostgreSQL
   - Connectez-vous avec l'URL DATABASE_URL
   - Exécutez le contenu de `backend/src/database/schema.sql`

### 4. Déployer le Frontend

1. Depuis le dashboard Render, cliquez "New +" → "Web Service"
2. Sélectionnez le même dépôt
3. Configurez :
   - **Name**: `delka-medias-frontend`
   - **Environment**: `Docker`
   - **Build Command**: (vide)
   - **Start Command**: (vide)
   - **Region**: Même région

4. Allez à l'onglet **Environment**
5. Ajoutez les variables :
   ```
   VITE_API_URL=https://<votre-backend-url>.onrender.com/api
   ```

6. Cliquez "Create Web Service"
7. Attendez le déploiement

## 🔧 Configuration du Backend pour Render

Modifiez `backend/Dockerfile` pour la production :

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/main.js"]
```

## 🔧 Configuration du Frontend pour Render

Créez un `frontend/render.yaml` :

```yaml
services:
  - type: web
    name: delka-medias-frontend
    env: docker
    dockerfilePath: ./frontend/Dockerfile
    envVars:
      - key: VITE_API_URL
        value: https://delka-medias-backend.onrender.com/api
```

## 📝 Gmail App Password

1. Accédez à https://myaccount.google.com/security
2. Activez l'authentification à 2 facteurs
3. Allez à "App passwords"
4. Sélectionnez "Mail" et "Windows Computer"
5. Copiez le mot de passe généré
6. Utilisez ce mot de passe comme `GMAIL_PASSWORD`

## ✅ Tests Après Déploiement

1. **Testez l'API** :
   ```bash
   curl https://<backend-url>.onrender.com/api/health
   ```

2. **Testez le Frontend** :
   - Ouvrez https://<frontend-url>.onrender.com
   - Essayez de vous inscrire
   - Uploadez un média

3. **Vérifiez les Logs** :
   - Backend: Render → Service → Logs
   - Frontend: Render → Service → Logs

## 🐛 Troubleshooting

### Erreur de Base de Données
- Vérifiez que `DATABASE_URL` est correct
- Vérifiez les logs du backend
- Assurez-vous que le script SQL a été exécuté

### Erreur 502 Bad Gateway
- Le service n'a pas démarré correctement
- Consultez les logs
- Vérifiez les variables d'environnement

### Erreur de Connexion API
- Vérifiez que `FRONTEND_URL` est correct dans le backend
- Vérifiez que `VITE_API_URL` est correct dans le frontend
- Vérifiez les CORS dans le backend

## 📞 Support

Pour toute assistance, consultez :
- [Render Documentation](https://render.com/docs)
- [GitHub Issues](https://github.com/Delkatonne/Delka-Medias-Gestion/issues)

---

**Created with ❤️ for secure media storage**
