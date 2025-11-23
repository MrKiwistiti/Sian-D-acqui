# Système d'Allergènes & Intolérances - Documentation

## 🎯 Vue d'ensemble

Un système complet de gestion des allergènes et intolérances a été implémenté pour la pizzeria Sian D'Acqui. Ce système permet aux clients de filtrer les pizzas en fonction de leurs allergies et intolérances.

## 📁 Fichiers créés/modifiés

### Types & Données
- **`src/types/allergens.ts`** - Définition des types et données pour les allergènes
  - `AllergenType` - Type énumération des allergènes
  - `AllergenInfo` - Interface d'information pour chaque allergène
  - `allergensList` - Dictionnaire de tous les allergènes avec détails
  - `pizzaAllergensMap` - Mapping des 16 pizzas avec leurs allergènes
  - `getPizzaAllergens()` - Fonction utilitaire

### Composants React
- **`src/components/AllergenBadge.tsx`** (Nouveau)
  - `AllergenBadge` - Affiche un allergène avec icône SVG
  - `AllergenList` - Affiche une liste d'allergènes (horizontal ou vertical)
  - Props: `size` (sm/md/lg), `layout` (horizontal/vertical)

- **`src/components/AllergenFilter.tsx`** (Nouveau)
  - Composant de filtrage avec sélection d'allergènes
  - 2 modes de filtrage:
    - `exclude`: Masquer les pizzas contenant les allergènes sélectionnés
    - `only`: Afficher uniquement les pizzas contenant les allergènes sélectionnés
  - Affiche les allergènes sélectionnés avec possibilité de les retirer

- **`src/components/MenuPage.tsx`** (Modifié)
  - Intègre le composant `AllergenFilter`
  - Affiche les allergènes sur chaque carte de pizza
  - Filtre les pizzas selon les critères sélectionnés
  - Message d'aucun résultat si aucune pizza ne correspond

- **`src/components/PizzaDetailPage.tsx`** (Modifié)
  - Affiche les allergènes de la pizza en section dédiée
  - Section jaune avec icône d'alerte pour les allergènes
  - Utilise le composant `AllergenList`

## 🎨 SVG Allergènes créés

11 icônes SVG flat design dans `/public/images/allergens/`:

1. **gluten.svg** - Gerbes de blé (couleur #D4A574)
2. **lactose.svg** - Verre de lait (couleur #F5DEB3)
3. **fruits-de-mer.svg** - Crevette (couleur #5B9BD5)
4. **noix.svg** - Noix cassée (couleur #8B4513)
5. **oeufs.svg** - Œuf blanc (couleur #FFD700)
6. **soja.svg** - Graine de soja (couleur #90EE90)
7. **arachides.svg** - Cacahuètes (couleur #D2B48C)
8. **sesame.svg** - Graines de sésame (couleur #E8E8E8)
9. **moutarde.svg** - Pot de moutarde (couleur #FFD700)
10. **celeri.svg** - Tiges de céleri (couleur #90EE90)
11. **crustaces.svg** - Homard (couleur #FF6347)

## 🍕 Allergènes par pizza

```
1. La Marguerite      → gluten, lactose
2. La Regina          → gluten, lactose
3. La Napo            → gluten, lactose, fruits-de-mer
4. La Caprese         → gluten, lactose, fruits-de-mer
5. La 4 Saisons       → gluten, lactose
6. La Chevre Miel     → gluten, lactose
7. La Calabrese       → gluten, lactose
8. La Calzone         → gluten, lactose, oeufs
9. La 4 Fromages      → gluten, lactose
10. La Merguez        → gluten, lactose
11. La Cannibale      → gluten, lactose
12. La Lily-Rose      → gluten, lactose
13. La Emmy-Lou       → gluten, lactose
14. La Chris          → gluten, lactose
15. La Ludmilove      → gluten, lactose
16. La Truffe         → gluten, lactose
```

## 🔧 Utilisation

### Dans MenuPage
```tsx
// Affichage des allergènes sur les cartes
<AllergenList allergens={pizzaAllergens} size="sm" layout="horizontal" />

// Filtre avec sélection
<AllergenFilter
  selectedAllergens={selectedAllergens}
  onAllergenChange={handleAllergenChange}
  filterMode={filterMode}
  onFilterModeChange={setFilterMode}
/>
```

### Dans PizzaDetailPage
```tsx
// Affichage des allergènes dans une section dédiée
{pizzaAllergens.length > 0 && (
  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
    <h2>Allergènes & Intolérances</h2>
    <AllergenList allergens={pizzaAllergens} size="md" layout="horizontal" />
  </div>
)}
```

## 📋 Allergènes disponibles

| ID | Nom | Description | Emoji |
|----|-----|-------------|-------|
| gluten | Gluten | Contient du gluten | 🌾 |
| lactose | Lactose | Contient du lactose | 🥛 |
| fruits-de-mer | Fruits de mer | Contient des fruits de mer | 🦐 |
| noix | Noix | Contient des noix | 🌰 |
| oeufs | Œufs | Contient des œufs | 🥚 |
| soja | Soja | Contient du soja | 🌱 |
| arachides | Arachides | Contient des arachides | 🥜 |
| sésame | Sésame | Contient du sésame | ⚪ |
| moutarde | Moutarde | Contient de la moutarde | 🟡 |
| céleri | Céleri | Contient du céleri | 🥬 |
| crustacés | Crustacés | Contient des crustacés | 🦞 |

## 🚀 Fonctionnalités

✅ **Filtrage dynamique** - Les pizzas se filtrent en temps réel
✅ **2 modes de filtrage** - Exclure ou montrer uniquement
✅ **Icônes visuelles** - SVG flat design avec couleurs thématiques
✅ **Responsive** - Grille adaptative sur tous les appareils
✅ **Affichage sur le menu** - Les allergènes s'affichent sur chaque carte
✅ **Détails sur page pizza** - Section dédiée avec alerte visuelle
✅ **Sélection facile** - Clic pour ajouter/retirer des allergènes
✅ **Résumé visible** - Tags avec les allergènes sélectionnés

## 🎨 Style et UX

- **Filtres**: Arrière-plan blanc, grille responsive
- **Allergènes sélectionnés**: Tags bleus avec croix pour retirer
- **Sur le menu**: Icônes petites (16x16) en bas des cartes
- **Sur la page pizza**: Section jaune avec icône d'alerte
- **Message vide**: "Aucune pizza ne correspond à vos critères"

## 📝 Notes

- Le système peut être facilement étendu avec de nouveaux allergènes
- Les mappings peuvent être modifiés dans `allergensList` et `pizzaAllergensMap`
- Les couleurs des allergènes sont définies dans `AllergenInfo.color`
- Les SVG peuvent être remplacés avec des images réelles si nécessaire

## 🔄 Modifications apportées aux fichiers existants

**Footer.tsx**: Nettoyage des avertissements de compilateur (imports et fonctions inutilisées)

---

**Système complètement fonctionnel et testé** ✓
