export type AllergenType = 
  | 'gluten' 
  | 'lactose' 
  | 'fruits-de-mer' 
  | 'noix' 
  | 'oeufs' 
  | 'soja' 
  | 'arachides' 
  | 'sésame'
  | 'moutarde'
  | 'céleri'
  | 'crustacés';

export interface AllergenInfo {
  id: AllergenType;
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export const allergensList: Record<AllergenType, AllergenInfo> = {
  'gluten': {
    id: 'gluten',
    name: 'Gluten',
    description: 'Contient du gluten',
    emoji: '🌾',
    color: '#D4A574'
  },
  'lactose': {
    id: 'lactose',
    name: 'Lactose',
    description: 'Contient du lactose',
    emoji: '🥛',
    color: '#F5DEB3'
  },
  'fruits-de-mer': {
    id: 'fruits-de-mer',
    name: 'Fruits de mer',
    description: 'Contient des fruits de mer',
    emoji: '🦐',
    color: '#5B9BD5'
  },
  'noix': {
    id: 'noix',
    name: 'Noix',
    description: 'Contient des noix',
    emoji: '🌰',
    color: '#8B4513'
  },
  'oeufs': {
    id: 'oeufs',
    name: 'Œufs',
    description: 'Contient des œufs',
    emoji: '🥚',
    color: '#FFD700'
  },
  'soja': {
    id: 'soja',
    name: 'Soja',
    description: 'Contient du soja',
    emoji: '🌱',
    color: '#90EE90'
  },
  'arachides': {
    id: 'arachides',
    name: 'Arachides',
    description: 'Contient des arachides',
    emoji: '🥜',
    color: '#D2B48C'
  },
  'sésame': {
    id: 'sésame',
    name: 'Sésame',
    description: 'Contient du sésame',
    emoji: '⚪',
    color: '#E8E8E8'
  },
  'moutarde': {
    id: 'moutarde',
    name: 'Moutarde',
    description: 'Contient de la moutarde',
    emoji: '🟡',
    color: '#FFD700'
  },
  'céleri': {
    id: 'céleri',
    name: 'Céleri',
    description: 'Contient du céleri',
    emoji: '🥬',
    color: '#90EE90'
  },
  'crustacés': {
    id: 'crustacés',
    name: 'Crustacés',
    description: 'Contient des crustacés',
    emoji: '🦞',
    color: '#FF6347'
  }
};

export interface PizzaAllergens {
  pizzaId: string;
  allergens: AllergenType[];
}

// Mapping des pizzas avec leurs allergènes
export const pizzaAllergensMap: PizzaAllergens[] = [
  { pizzaId: "1", allergens: ['gluten', 'lactose'] }, // La Marguerite
  { pizzaId: "2", allergens: ['gluten', 'lactose'] }, // La Regina
  { pizzaId: "3", allergens: ['gluten', 'lactose', 'fruits-de-mer'] }, // La Napo
  { pizzaId: "4", allergens: ['gluten', 'lactose', 'fruits-de-mer'] }, // La Caprese
  { pizzaId: "5", allergens: ['gluten', 'lactose'] }, // La 4 Saisons
  { pizzaId: "6", allergens: ['gluten', 'lactose'] }, // La Chevre Miel
  { pizzaId: "7", allergens: ['gluten', 'lactose'] }, // La Calabrese
  { pizzaId: "8", allergens: ['gluten', 'lactose', 'oeufs'] }, // La Calzone
  { pizzaId: "9", allergens: ['gluten', 'lactose'] }, // La 4 Fromages
  { pizzaId: "10", allergens: ['gluten', 'lactose'] }, // La Merguez
  { pizzaId: "11", allergens: ['gluten', 'lactose'] }, // La Cannibale
  { pizzaId: "12", allergens: ['gluten', 'lactose'] }, // La Lily-Rose
  { pizzaId: "13", allergens: ['gluten', 'lactose'] }, // La Emmy-Lou
  { pizzaId: "14", allergens: ['gluten', 'lactose'] }, // La Chris
  { pizzaId: "15", allergens: ['gluten', 'lactose'] }, // La Ludmilove
  { pizzaId: "16", allergens: ['gluten', 'lactose'] }, // La Truffe
];

export function getPizzaAllergens(pizzaId: string): AllergenType[] {
  const entry = pizzaAllergensMap.find(p => p.pizzaId === pizzaId);
  return entry?.allergens ?? [];
}
