# Configuration d'environnement

## Variables d'environnement

Le frontend utilise des variables d'environnement pour configurer l'URL de l'API. Cela permet de basculer facilement entre un backend local et un backend distant.

### Configuration

Créez un fichier `.env` dans le répertoire `front-end/` avec le contenu suivant :

```env
# URL de base de l'API
VITE_API_BASE_URL=http://localhost:3000/api

# Exemples d'autres configurations :
# Pour une API locale sur un autre port :
# VITE_API_BASE_URL=http://localhost:4000/api

# Pour une API distante (exemple avec l'API de votre ami) :
# VITE_API_BASE_URL=http://192.168.1.100:3000/api
# ou
# VITE_API_BASE_URL=https://your-friend-api.com/api
```

### Utilisation

1. **Pour le développement local** (par défaut) :
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

2. **Pour utiliser l'API d'un ami sur le réseau local** :
   ```env
   VITE_API_BASE_URL=http://[IP_DE_VOTRE_AMI]:3000/api
   ```
   Remplacez `[IP_DE_VOTRE_AMI]` par l'adresse IP réelle.

3. **Pour une API déployée en ligne** :
   ```env
   VITE_API_BASE_URL=https://api.example.com/api
   ```

### Redémarrage requis

Après avoir modifié le fichier `.env`, vous devez redémarrer le serveur de développement Vite :

```bash
npm run dev
```

### Fallback

Si aucune variable d'environnement n'est définie, le frontend utilisera par défaut `http://localhost:3000/api`.
