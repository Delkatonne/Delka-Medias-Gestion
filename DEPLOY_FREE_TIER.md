# Delka Médias Gestion - Guide Déploiement Free Tier (2026)

## 📦 Étape 1: Base de Données sur Railway.app

### 1. Créer un compte Railway
1. Allez sur https://railway.app
2. Connectez-vous avec GitHub
3. Créez un nouveau projet

### 2. Ajouter PostgreSQL
1. Cliquez "Add" → "Database" → "PostgreSQL"
2. Laissez les paramètres par défaut
3. Créez la base de données

### 3. Récupérer l'URL de connexion
1. Allez dans l'onglet "PostgreSQL"
2. Cliquez sur "Connect"
3. Copiez l'URL `DATABASE_URL` (format: `postgresql://...`)
4. **Sauvegardez cette URL**, vous en aurez besoin

### 4. Initialiser le schéma
```bash
# Installez psql si ce n'est pas fait
# Sur Mac: brew install postgresql
# Sur Windows: Téléchargez pgAdmin ou utilisez WSL

# Connectez-vous à votre BD Railway
psql "<votre-DATABASE_URL>"

# Exécutez le script
\i backend/src/database/schema.sql

# Vérifiez
\dt
\q
```

---

## 🎨 Étape 2: Frontend sur Vercel

### 1. Créer un compte Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub

### 2. Importer le projet
1. Cliquez "New Project"
2. Sélectionnez le repo `Delka-Medias-Gestion`
3. Configurez :
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Ajouter les variables d'environnement
Allez dans Settings → Environment Variables

```
VITE_API_URL=https://<votre-backend>.onrender.com/api
```

### 4. Déployer
1. Cliquez "Deploy"
2. Attendez ~2 minutes
3. Vous recevrez une URL: `https://<nom>.vercel.app`

**Gardez cette URL!** Vous l'utiliserez pour le backend.

---

## 🔧 Étape 3: Backend sur Render

### 1. Préparer le code

Modifiez `backend/Dockerfile` :

```dockerfile
FROM node:18-alpine as builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /build/dist ./dist

EXPOSE 5000

CMD ["node", "dist/main.js"]
```

### 2. Créer un compte Render
1. Allez sur https://render.com
2. Connectez-vous avec GitHub

### 3. Créer le Web Service
1. Dashboard → "New +" → "Web Service"
2. Sélectionnez le repo `Delka-Medias-Gestion`
3. Configurez :
   - **Name**: `delka-medias-backend`
   - **Environment**: Docker
   - **Region**: Frankfurt (ou votre région)
   - **Branch**: main
   - **Autodeploy**: Yes

### 4. Ajouter les variables d'environnement

Allez dans "Environment" et ajoutez :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://... (de Railway)
JWT_SECRET=GenerateARandomString_Min32Chars_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop123456
JWT_EXPIRE=7d
FRONTEND_URL=https://<votre-vercel>.vercel.app
GMAIL_USER=votre.email@gmail.com
GMAIL_PASSWORD=<votre-app-password>
CLOUDINARY_CLOUD_NAME=<votre-cloud-name>
CLOUDINARY_API_KEY=<votre-api-key>
CLOUDINARY_API_SECRET=<votre-api-secret>
```

### 5. Déployer
1. Cliquez "Create Web Service"
2. Attendez ~5 minutes pour le premier déploiement
3. L'URL sera: `https://<nom>.onrender.com`

---

## 📸 Étape 4: Cloudinary (Stockage des Fichiers)

### 1. Créer un compte Cloudinary
1. Allez sur https://cloudinary.com
2. Inscrivez-vous (Free tier inclus)
3. Confirmez votre email

### 2. Récupérer les credentials
1. Allez sur le Dashboard
2. Copiez :
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Mettre à jour le Backend

Modifiez `backend/src/services/uploadService.ts` :

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'delka-medias',
    resource_type: 'auto',
  } as any,
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 104857600 }, // 100MB
});

export const deleteFile = async (fileUrl: string) => {
  try {
    const publicId = fileUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`delka-medias/${publicId}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
```

### 4. Mettre à jour package.json du backend

```json
"dependencies": {
  "cloudinary": "^1.40.0",
  "multer-storage-cloudinary": "^4.0.0"
}
```

---

## 🧪 Étape 5: Tests

### 1. Vérifier la BD
```bash
# Test de connexion
curl https://<votre-backend>.onrender.com/api/health

# Réponse attendue:
{"status":"OK","timestamp":"2024-01-01T12:00:00Z"}
```

### 2. Test du Frontend
1. Ouvrez https://<votre-frontend>.vercel.app
2. La page d'accueil doit charger
3. Testez l'inscription

### 3. Test de l'Upload
1. Connectez-vous
2. Allez au Dashboard
3. Uploadez une image
4. L'image doit apparaître en galerie

---

## 🐛 Troubleshooting

### Erreur: "Cannot connect to database"
- ✅ Vérifiez que `DATABASE_URL` est correct
- ✅ Vérifiez que Railway BD est active
- ✅ Récupérez l'URL correcte de Railway

### Erreur: "CORS error"
- ✅ Vérifiez que `FRONTEND_URL` est correct dans le backend
- ✅ Redéployez le backend
- ✅ Attendez 2-3 minutes

### Erreur: "Cloudinary credentials missing"
- ✅ Vérifiez les variables Cloudinary dans Render
- ✅ Sauvegardez et redéployez

### Service s'arrête après 15 min
- ✅ C'est normal sur le plan Free
- ✅ Le premier appel après sera lent (5-10s)
- ✅ Passez à un plan payant pour éviter cela

---

## 💰 Coûts Estimés (2024)

| Service | Tier | Coût/mois | Notes |
|---------|------|-----------|-------|
| Vercel | Free | $0 | Frontend illimité |
| Render | Free | $0 | Backend avec limite |
| Railway | Free | $5 crédit | BD gratuite |
| Cloudinary | Free | $0 | 25 crédits/mois |
| Gmail | Free | $0 | App Password |
| **TOTAL** | | **~$0-5** | Complètement gratuit |

---

## 📱 URLs Finales

```
🌐 Frontend: https://delka-medias.vercel.app
⚙️ API Backend: https://delka-medias-backend.onrender.com
📊 Base de Données: Railway.app
📸 Stockage: Cloudinary CDN
```

---

## ✅ Checklist Finale

- [ ] Railway: BD créée et accessible
- [ ] Cloudinary: Credentials copiées
- [ ] Backend: Dockerfile mis à jour
- [ ] Backend: Env variables configurées
- [ ] Backend: Service créé sur Render
- [ ] Frontend: Vite configuré
- [ ] Frontend: Env variables configurées
- [ ] Frontend: Déployé sur Vercel
- [ ] Test API health: ✅
- [ ] Test Upload: ✅
- [ ] Test Inscription: ✅

---

**Voilà! Votre application est complètement déployée sur le plan Free! 🎉**

Pour des questions: https://github.com/Delkatonne/Delka-Medias-Gestion/issues
