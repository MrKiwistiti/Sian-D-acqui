# API Pizzeria - Documentation

## Entités

### Pizza
- **id**: Identifiant unique
- **name**: Nom de la pizza (unique)
- **description**: Description de la pizza
- **price**: Prix de la pizza
- **size**: Taille (par défaut: "medium")
- **available**: Disponibilité (true/false)
- **imageUrl**: URL de l'image
- **preparationTime**: Temps de préparation en minutes
- **ingredients**: Liste des ingrédients (relation many-to-many)

### Ingredient
- **id**: Identifiant unique
- **name**: Nom de l'ingrédient (unique)
- **description**: Description de l'ingrédient
- **price**: Prix supplémentaire de l'ingrédient
- **available**: Disponibilité (true/false)
- **imageUrl**: URL de l'image

## Endpoints API

### Pizzas

#### GET /api/pizzas
Récupérer toutes les pizzas avec leurs ingrédients.

#### GET /api/pizzas/available
Récupérer uniquement les pizzas disponibles.

#### GET /api/pizzas/:id
Récupérer une pizza spécifique par son ID.

#### POST /api/pizzas
Créer une nouvelle pizza.

**Body:**
```json
{
  "name": "Margherita",
  "description": "Pizza classique italienne",
  "price": 12.50,
  "size": "medium",
  "available": true,
  "imageUrl": "https://example.com/margherita.jpg",
  "preparationTime": 15,
  "ingredientIds": [1, 2, 3]
}
```

#### PATCH /api/pizzas/:id
Mettre à jour une pizza existante.

**Body:** (tous les champs sont optionnels)
```json
{
  "name": "Margherita Supreme",
  "price": 14.50,
  "ingredientIds": [1, 2, 3, 4]
}
```

#### DELETE /api/pizzas/:id
Supprimer une pizza.

#### POST /api/pizzas/:pizzaId/ingredients/:ingredientId
Ajouter un ingrédient à une pizza.

#### DELETE /api/pizzas/:pizzaId/ingredients/:ingredientId
Retirer un ingrédient d'une pizza.

---

### Ingrédients

#### GET /api/ingredients
Récupérer tous les ingrédients.

#### GET /api/ingredients/available
Récupérer uniquement les ingrédients disponibles.

#### GET /api/ingredients/:id
Récupérer un ingrédient spécifique par son ID.

#### POST /api/ingredients
Créer un nouvel ingrédient.

**Body:**
```json
{
  "name": "Mozzarella",
  "description": "Fromage italien traditionnel",
  "price": 1.50,
  "available": true,
  "imageUrl": "https://example.com/mozzarella.jpg"
}
```

#### PATCH /api/ingredients/:id
Mettre à jour un ingrédient existant.

**Body:** (tous les champs sont optionnels)
```json
{
  "name": "Mozzarella di Bufala",
  "price": 2.50
}
```

#### DELETE /api/ingredients/:id
Supprimer un ingrédient.

---

## Exemples d'utilisation

### Créer des ingrédients
```bash
curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tomate",
    "description": "Sauce tomate maison",
    "price": 0,
    "available": true
  }'

curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mozzarella",
    "description": "Fromage mozzarella",
    "price": 1.5,
    "available": true
  }'

curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basilic",
    "description": "Basilic frais",
    "price": 0.5,
    "available": true
  }'
```

### Créer une pizza avec ingrédients
```bash
curl -X POST http://localhost:3000/api/pizzas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita",
    "description": "La pizza classique italienne",
    "price": 12.50,
    "size": "medium",
    "preparationTime": 15,
    "ingredientIds": [1, 2, 3]
  }'
```

### Récupérer toutes les pizzas disponibles
```bash
curl http://localhost:3000/api/pizzas/available
```

### Ajouter un ingrédient à une pizza existante
```bash
curl -X POST http://localhost:3000/api/pizzas/1/ingredients/4
```

## Configuration

Le backend utilise PostgreSQL pour stocker les données. Assurez-vous que les variables d'environnement suivantes sont configurées dans votre fichier `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=pizzeria_db
DB_SYNCHRONIZE=false
```

## Démarrage

```bash
# Installation des dépendances
npm install

# Exécuter les migrations
npm run migration:run

# Démarrer le serveur en mode développement
npm run start:dev

# Démarrer le serveur en mode production
npm run start:prod
```

Le serveur démarre par défaut sur `http://localhost:3000`.
Tous les endpoints sont préfixés par `/api`.
