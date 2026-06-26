# Déploiement sur Render - Guide Rapide

## 🎯 Résumé du Processus

```
1. Créer une BD PostgreSQL sur Render
   ↓
2. Déployer le Backend (Node.js + Express)
   ↓
3. Configurer les variables d'environnement
   ↓
4. Déployer le Frontend (React + Vite)
   ↓
5. Tester l'application complète
```

## 🚀 Lancement Rapide Local

```bash
# Cloner le dépôt
git clone https://github.com/Delkatonne/Delka-Medias-Gestion.git
cd Delka-Medias-Gestion

# Copier les fichiers .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Remplir les variables d'environnement
# backend/.env et frontend/.env

# Lancer avec Docker Compose
docker-compose up -d

# Accédez à :
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api
# DB Admin: postgresql://localhost:5432
```

## 📋 Variables d'Environnement Essentielles

### Backend
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/delka_medias
JWT_SECRET=<clé-secrète-très-longue>
GMAIL_USER=votre-email@gmail.com
GMAIL_PASSWORD=<app-password-de-gmail>
FRONTEND_URL=https://votre-frontend.onrender.com
```

### Frontend
```env
VITE_API_URL=https://votre-backend.onrender.com/api
```

## 🔗 URLs Après Déploiement

- **Frontend**: `https://delka-medias-frontend.onrender.com`
- **Backend API**: `https://delka-medias-backend.onrender.com/api`
- **Health Check**: `https://delka-medias-backend.onrender.com/api/health`

## ✅ Checklist de Déploiement

- [ ] Créer la base de données PostgreSQL
- [ ] Récupérer l'URL DATABASE_URL
- [ ] Configurer Gmail App Password
- [ ] Déployer le backend
- [ ] Vérifier la connexion à la BD
- [ ] Exécuter le script SQL
- [ ] Déployer le frontend
- [ ] Tester l'inscription/connexion
- [ ] Tester l'upload de médias
- [ ] Vérifier les emails

Pour le guide complet, consultez `DEPLOY_RENDER.md`
