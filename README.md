# Delka Médias Gestion - README

## 🎬 À Propos

**Delka Médias Gestion** est une application web complète pour gérer, stocker et organiser vos photos, vidéos et documents.

### ✨ Fonctionnalités

✅ **Authentification Sécurisée**
- Inscription et connexion
- Oubli de mot de passe avec email
- Réinitialisation de mot de passe
- JWT Token

✅ **Gestion des Médias**
- Upload d'images, vidéos et documents
- Galerie responsive
- Recherche et filtrage
- Édition des métadonnées
- Suppression sécurisée

✅ **Gestion du Profil**
- Modification du profil
- Changement de mot de passe
- Suppression de compte

✅ **Stockage Cloud**
- Cloudinary pour les fichiers
- CDN global
- Auto-optimisation

✅ **Design Moderne**
- Interface responsive
- TailwindCSS
- Mobile-friendly

---

## 🛠️ Stack Technique

### Backend
- **Node.js** 18+ avec Express
- **TypeScript** pour la typage
- **PostgreSQL** pour les données
- **JWT** pour l'authentification
- **Cloudinary** pour le stockage
- **Nodemailer** pour les emails

### Frontend
- **React** 18 avec Vite
- **TypeScript**
- **TailwindCSS** pour le style
- **Zustand** pour l'état
- **Axios** pour l'API
- **React Router** pour la navigation

---

## 📥 Installation en Local

### Prérequis
- Node.js 18+
- Docker & Docker Compose (recommandé)
- PostgreSQL 15+ (si pas Docker)
- Compte Cloudinary (optionnel)

### Avec Docker Compose (Recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/Delkatonne/Delka-Medias-Gestion.git
cd Delka-Medias-Gestion

# 2. Copier les fichiers .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Configurer les variables
# Éditez backend/.env et frontend/.env

# 4. Démarrer les services
docker-compose up -d

# 5. Vérifier les logs
docker-compose logs -f backend
```

### Sans Docker

#### Backend
```bash
cd backend

# 1. Installer les dépendances
npm install

# 2. Créer la BD PostgreSQL
psql -U postgres
CREATE DATABASE delka_medias;

# 3. Copier et configurer .env
cp .env.example .env

# 4. Lancer les migrations
psql -U postgres -d delka_medias -f src/database/schema.sql

# 5. Démarrer le serveur
npm run dev
```

#### Frontend
```bash
cd frontend

# 1. Installer les dépendances
npm install

# 2. Copier et configurer .env
cp .env.example .env

# 3. Démarrer le serveur dev
npm run dev
```

---

## 🚀 Déploiement

### Plan Free (Gratuit)
Voir le guide: **`DEPLOY_FREE_TIER.md`**

#### Services utilisés:
- **Frontend**: Vercel (gratuit)
- **Backend**: Render (gratuit)
- **BD**: Railway (gratuit + crédit)
- **Stockage**: Cloudinary (gratuit)

### Plan Payant (Production)
Voir le guide: **`DEPLOY_RENDER.md`**

#### Services utilisés:
- **Frontend**: Vercel Pro ou similaire
- **Backend**: Render Paid ou AWS
- **BD**: AWS RDS ou Railway Payant
- **Stockage**: AWS S3 ou Cloudinary Payant

---

## 📖 Documentation

- **Architecture**: [`ARCHITECTURE_FREE_TIER.md`](./ARCHITECTURE_FREE_TIER.md)
- **Déploiement Free**: [`DEPLOY_FREE_TIER.md`](./DEPLOY_FREE_TIER.md)
- **Déploiement Production**: [`DEPLOY_RENDER.md`](./DEPLOY_RENDER.md)
- **Démarrage Rapide**: [`QUICK_START.md`](./QUICK_START.md)

---

## 📝 Variables d'Environnement

### Backend (`.env`)
```env
NODE_ENV=production
PORT=5000

# Base de Données
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=<clé très longue de 32+ caractères>
JWT_EXPIRE=7d

# Gmail (optionnel)
GMAIL_USER=email@gmail.com
GMAIL_PASSWORD=<app-password>

# Frontend
FRONTEND_URL=https://votre-frontend.com

# Cloudinary (recommandé pour production)
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

### Frontend (`.env`)
```env
VITE_API_URL=https://votre-api.com/api
```

---

## 🧪 Tests

### API Health Check
```bash
curl http://localhost:5000/api/health
```

### Test d'Inscription
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test de Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

---

## 🐛 Troubleshooting

### Erreur: Cannot connect to database
1. Vérifiez que PostgreSQL/Railway est en cours d'exécution
2. Vérifiez `DATABASE_URL`
3. Vérifiez les credentials

### Erreur: CORS error
1. Vérifiez que `FRONTEND_URL` est correct
2. Redéployez le backend
3. Attendez 2-3 minutes

### Erreur: Cloudinary not configured
1. Laissez vide pour utiliser le stockage local
2. Ou configurez les variables Cloudinary

---

## 📱 URLs en Production

```
Frontend:  https://delka-medias.vercel.app
Backend:   https://delka-medias-backend.onrender.com
API:       https://delka-medias-backend.onrender.com/api
```

---

## 👥 Support

- Issues: https://github.com/Delkatonne/Delka-Medias-Gestion/issues
- Discussions: https://github.com/Delkatonne/Delka-Medias-Gestion/discussions

---

## 📄 Licence

MIT License - Voir `LICENSE` pour plus de détails

---

**Créé avec ❤️ pour la gestion sécurisée des médias**

⭐ Si le projet vous plaît, n'oubliez pas de mettre une star !
