# 🎬 Delka Médias Gestion

Une plateforme complète de gestion et de stockage des médias (photos, vidéos, documents) avec authentification Gmail, sécurisée et scalable.

## ✨ Fonctionnalités

- 🔐 **Authentification Gmail** - Inscription et connexion sécurisées avec Gmail OAuth
- 🔑 **Gestion de comptes** - Créer un compte, gérer le profil
- 📧 **Réinitialisation de mot de passe** - Récupération par email en cas d'oubli
- 📁 **Stockage de médias** - Photos, vidéos, documents
- 🔍 **Recherche intelligente** - Retrouver vos médias par date, type, tags
- 📅 **Conservation longue durée** - Conservez vos médias pendant des années
- 🎨 **Interface moderne** - Dashboard intuitif et responsive
- ⚡ **Performance optimale** - Compression, indexation, recherche rapide

## 🚀 Stack Technologique

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** pour la base de données
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **Nodemailer** pour les emails
- **dotenv** pour les variables d'environnement

### Frontend
- **React 18** + **TypeScript**
- **Vite** pour le bundling
- **TailwindCSS** pour le styling
- **React Router** pour la navigation
- **Axios** pour les appels API

### DevOps
- **Docker** et **Docker Compose**
- **Render** pour le déploiement

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 14+
- Compte Gmail avec App Password
- Git

## ⚙️ Installation locale

### 1. Cloner le dépôt
```bash
git clone https://github.com/Delkatonne/Delka-Medias-Gestion.git
cd Delka-Medias-Gestion
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Remplissez les variables d'environnement
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

## 🌐 Variables d'environnement

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/delka_medias
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🐳 Docker Compose

```bash
docker-compose up -d
```

## 📚 Documentation API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/forgot-password` - Demande de réinitialisation
- `POST /api/auth/reset-password` - Réinitialiser le mot de passe
- `POST /api/auth/logout` - Déconnexion

### Médias
- `GET /api/media` - Lister tous les médias de l'utilisateur
- `POST /api/media/upload` - Uploader un média
- `GET /api/media/:id` - Récupérer les détails d'un média
- `DELETE /api/media/:id` - Supprimer un média
- `PUT /api/media/:id` - Mettre à jour les métadonnées

### Utilisateur
- `GET /api/user/profile` - Récupérer le profil
- `PUT /api/user/profile` - Mettre à jour le profil
- `DELETE /api/user/account` - Supprimer le compte

## 🚀 Déploiement sur Render

### 1. Créer les services Render
- **PostgreSQL Database** - Pour la base de données
- **Backend Web Service** - Pour l'API
- **Frontend Static Site** - Pour React

### 2. Variables d'environnement Render
Configurez les variables dans les paramètres de chaque service.

### 3. Déployer
```bash
git push origin main
```

Render déploiera automatiquement via les webhooks GitHub.

## 📁 Structure du projet

```
Delka-Medias-Gestion/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── main.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
└── README.md
```

## 🔒 Sécurité

- ✅ Hachage des mots de passe avec bcrypt
- ✅ JWT pour l'authentification stateless
- ✅ CORS configuré correctement
- ✅ Validation des entrées côté serveur
- ✅ Protection CSRF
- ✅ Secrets stockés en variables d'environnement

## 📝 Licence

MIT

## 👨‍💻 Auteur

Créé par **Delkatonne**

## 📧 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Made with ❤️ for your media storage needs**
