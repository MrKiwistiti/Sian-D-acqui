# JEB Incubator - Full Stack Application

Application complète avec frontend React et backend NestJS pour afficher les données de l'incubateur JEB.

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite 7.1.4  
- **Port**: http://localhost:5173
- **Node.js**: Version 20.19.5 requise

### Backend (NestJS + PostgreSQL)
- **Framework**: NestJS 11.0.1 avec TypeORM
- **Base de données**: PostgreSQL 16 (Docker)
- **Port**: http://localhost:3000
- **API externe**: Synchronisation avec JEB API

## 📦 Installation

### Prérequis
- Node.js 20.19.5+ (utilisez nvm pour la version exacte)
- Docker et Docker Compose
- Git

### Configuration Node.js
```bash
# Installation de nvm (si pas déjà installé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

# Installation et utilisation de Node.js 20.19.5
nvm install 20.19.5
nvm use 20.19.5
nvm alias default 20.19.5
```

### Configuration du Backend
1. **Cloner et accéder au backend**
```bash
cd jeb-backend
```

2. **Configuration des variables d'environnement**
```bash
cp .env.example .env
# Éditer .env.production avec vos vraies valeurs
```

3. **Installation et démarrage (locale/LAN)**
```bash
npm install
npm run start:dev     # Lancer le back en locale
docker-compose up -d  # Lancer le back en LAN
curl -X POST http://localhost:3000/api/sync/all -H "x-sync-secret: changeme" # Syncroniser son back avec l'ancienne API
npm run migration:generate  # Adapte table user pour aceuillir des mot de passe
npm run migration:run       # Lance la migration
```

### Configuration du Frontend
1. **Accéder au frontend**
```bash
cd front-end
```

2. **Installation et démarrage**
```bash
npm install
npm run dev
```

## 🚀 Utilisation

### Synchronisation des données
Le backend synchronise automatiquement les données depuis l'API JEB :
- **Startups**: 32 projets d'entreprises
- **News**: 15 actualités récentes  
- **Events**: 10 événements à venir
- **Users**: 52 users
- **Partners**: 17 partenaires

### API Endpoints
- `GET /api/startups` - Liste des startups
- `GET /api/startups/:id` - Lire une startup en particulier
- `GET /api/news` - Actualités
- `GET /api/news/:id` - Actualités précises
- `GET /api/events` - Événements
- `GET /api/events/:id` - Événements précis
- `GET /api/partners` - Partenaires
- `GET /api/partners/:id` - Partenaires précis
- `GET /api/investors` - Investisseurs
- `GET /api/investors/:id` - Investisseurs précis
- `GET /api/users` - Utilisateurs
- `GET /api/users/:id` - Utilisateurs précis
- `POST /api/sync/` - Synchronisation manuelle

## 🔧 Développement

### Structure du projet
```
├── front-end/          # Application React
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── services/   # Services API
│   │   └── data/       # Types et utilitaires
│   └── package.json
├── jeb-backend/        # API NestJS
│   ├── src/
│   │   ├── modules/    # Modules métier
│   │   └── main.ts     # Point d'entrée avec CORS
│   ├── docker-compose.yml
│   └── package.json
└── README.md
```

### Technologies utilisées
- **Frontend**: React, TypeScript, Vite, CSS3
- **Backend**: NestJS, TypeORM, PostgreSQL, Docker
- **API**: REST avec authentification par headers
- **CORS**: Configuration pour développement local

### Commandes utiles
```bash
# Backend
npm run start:dev      # Mode développement
npm run build         # Build production
docker-compose up -d  # Base de données

# Frontend  
npm run dev           # Serveur développement
npm run build         # Build production
npm run preview       # Aperçu du build
```

## 🌐 Configuration CORS

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Tests locaux)

## 📁 Données

Les données affichées sont synchronisées en temps réel depuis l'API JEB officielle, remplaçant complètement les données de mock utilisées précédemment.

## 🔐 Sécurité

- Variables d'environnement sécurisées
- Headers d'authentification pour API externe
- Configuration CORS restrictive
- Fichiers sensibles exclus du git (.env, secrets)

---

**Note**: Ce projet utilise des données réelles de l'API JEB. Assurez-vous d'avoir les credentials appropriés dans votre fichier `.env.production`.
