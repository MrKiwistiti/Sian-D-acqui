import { useState } from "react";
import { Button } from "./ui/button";
import { AllergenFilter } from "./AllergenFilter";
import { AllergenList } from "./AllergenBadge";
import type { AllergenType } from "../types/allergens";
import { getPizzaAllergens } from "../types/allergens";

interface MenuPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function MenuPage({ onNavigate }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState<'pizzas' | 'desserts' | 'boissons'>('pizzas');
  const [selectedAllergens, setSelectedAllergens] = useState<AllergenType[]>([]);
  const [filterMode, setFilterMode] = useState<'exclude' | 'only'>('exclude');

  const menuData = {
    pizzas: [
      { id: "1", name: "La Marguerite", price: "10.00€" },
      { id: "2", name: "La Regina", price: "13.00€" },
      { id: "3", name: "La Napo", price: "14.00€" },
      { id: "4", name: "La Caprese", price: "14.00€" },
      { id: "5", name: "La 4 Saisons", price: "14.00€" },
      { id: "6", name: "La Chevre Miel", price: "14.00€" },
      { id: "7", name: "La Calabrese", price: "15.00€" },
      { id: "8", name: "La Calzone", price: "14.00€" },
      { id: "9", name: "La 4 Fromages", price: "14.00€" },
      { id: "10", name: "La Merguez", price: "14.00€" },
      { id: "11", name: "La Cannibale", price: "15.00€" },
      { id: "12", name: "La Lily-Rose", price: "15.00€" },
      { id: "13", name: "La Emmy-Lou", price: "15.00€" },
      { id: "14", name: "La Chris", price: "15.00€" },
      { id: "15", name: "La Ludmilove", price: "15.00€" },
      { id: "16", name: "La Truffe", price: "20.00€" }
    ],
    desserts: [
      { id: "d1", name: "Pizza Nutella", price: "7.00€" }
    ],
    boissons: [
      { id: "b1", name: "Eau minérale", description: "50cl", price: "2.50€" },
      { id: "b2", name: "Coca-Cola", description: "33cl", price: "3.00€" },
      { id: "b3", name: "Vin rouge", description: "Verre 12cl", price: "4.50€" },
      { id: "b4", name: "Bière artisanale", description: "33cl", price: "5.00€" }
    ]
  };

  const categories = [
    { id: 'pizzas' as const, label: 'Pizzas' },
    { id: 'desserts' as const, label: 'Desserts' },
    { id: 'boissons' as const, label: 'Boissons' }
  ];

  const handleAllergenChange = (allergen: AllergenType, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAllergens([...selectedAllergens, allergen]);
    } else {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    }
  };

  // Filtrer les pizzas selon les allergènes
  const filteredPizzas = menuData.pizzas.filter(pizza => {
    if (selectedAllergens.length === 0) return true;
    
    const pizzaAllergens = getPizzaAllergens(pizza.id);
    
    if (filterMode === 'exclude') {
      // Masquer les pizzas qui contiennent l'un des allergènes sélectionnés
      return !selectedAllergens.some(allergen => pizzaAllergens.includes(allergen));
    } else {
      // Afficher uniquement les pizzas qui contiennent TOUS les allergènes sélectionnés
      return selectedAllergens.every(allergen => pizzaAllergens.includes(allergen));
    }
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-heading">Notre Carte</h1>
          <div className="w-20"></div>
        </div>
      </div>
      <div className="sticky top-32 z-30 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 md:gap-4 py-4">
            {categories.map((category) => (
              <Button key={category.id} variant={activeCategory === category.id ? "default" : "outline"} onClick={() => setActiveCategory(category.id)} className="text-base md:text-lg px-6">
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Filtre allergènes - visible uniquement pour pizzas */}
        {activeCategory === 'pizzas' && (
          <AllergenFilter
            selectedAllergens={selectedAllergens}
            onAllergenChange={handleAllergenChange}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
          />
        )}

        {/* Affichage des pizzas filtrées ou toutes les items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'pizzas' ? filteredPizzas : menuData[activeCategory]).map((item) => {
            const pizzaAllergens = activeCategory === 'pizzas' ? getPizzaAllergens(item.id) : [];
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {
                  if (activeCategory === 'pizzas') {
                    onNavigate('pizza-detail', item.id);
                  }
                }}
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100"></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-primary ml-2">{item.price}</span>
                  </div>
                  
                  {/* Affichage des allergènes pour les pizzas */}
                  {activeCategory === 'pizzas' && pizzaAllergens.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Allergènes:</p>
                      <AllergenList allergens={pizzaAllergens} size="sm" layout="horizontal" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message si aucune pizza ne correspond */}
        {activeCategory === 'pizzas' && filteredPizzas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Aucune pizza ne correspond à vos critères d'allergènes.</p>
            <button
              onClick={() => {
                setSelectedAllergens([]);
                setFilterMode('exclude');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
      <div className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Envie de commander ?</h2>
          <p className="text-gray-600 mb-6">Passez votre commande dès maintenant</p>
          <Button size="lg" onClick={() => onNavigate('contact')} className="bg-red-600 hover:bg-red-700 text-white font-bold">
            Passer commande
          </Button>
        </div>
      </div>
    </div>
  );
}
