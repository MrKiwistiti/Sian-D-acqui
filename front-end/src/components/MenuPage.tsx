import { useState } from "react";
import { Button } from "./ui/button";
import { VegetarianFilter } from "./VegetarianFilter";
import { usePizzas } from "../services/api";
import { Leaf } from "lucide-react";

interface MenuPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function MenuPage({ onNavigate }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState<'pizzas' | 'desserts' | 'boissons'>('pizzas');
  const [isVegetarianOnly, setIsVegetarianOnly] = useState(false);
  const { pizzas, loading, error } = usePizzas(isVegetarianOnly);

  const menuData = {
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
        {/* Filtre végétarien - visible uniquement pour pizzas */}
        {activeCategory === 'pizzas' && (
          <VegetarianFilter
            isVegetarianOnly={isVegetarianOnly}
            onToggle={setIsVegetarianOnly}
          />
        )}

        {/* État de chargement */}
        {activeCategory === 'pizzas' && loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Chargement des pizzas...</p>
          </div>
        )}

        {/* Message d'erreur */}
        {activeCategory === 'pizzas' && error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-600 mb-4">Erreur: {error}</p>
          </div>
        )}

        {/* Affichage des items */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeCategory === 'pizzas' ? pizzas : menuData[activeCategory]).map((item) => {
              const isPizza = activeCategory === 'pizzas';
              const pizza = isPizza && item ? item : null;
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    if (isPizza) {
                      onNavigate('pizza-detail', String(item.id));
                    }
                  }}
                >
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                    {isPizza && pizza && 'imageUrl' in pizza && pizza.imageUrl && (
                      <img src={pizza.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className="text-lg font-bold text-primary ml-2">
                        {isPizza && pizza && 'price' in pizza ? `${pizza.price}€` : item.price}
                      </span>
                    </div>
                    
                    {/* Description de la pizza */}
                    {isPizza && pizza && 'description' in pizza && pizza.description && (
                      <p className="text-sm text-gray-600 mb-3">{pizza.description}</p>
                    )}
                    
                    {/* Badge végétarien */}
                    {isPizza && pizza && 'vegetarian' in pizza && pizza.vegetarian && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">Végétarien</span>
                      </div>
                    )}
                    
                    {/* Temps de préparation */}
                    {isPizza && pizza && 'preparationTime' in pizza && pizza.preparationTime > 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        Préparation: {pizza.preparationTime} min
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Message si aucune pizza disponible */}
        {activeCategory === 'pizzas' && !loading && !error && pizzas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">
              {isVegetarianOnly 
                ? "Aucune pizza végétarienne disponible pour le moment."
                : "Aucune pizza disponible pour le moment."}
            </p>
            {isVegetarianOnly && (
              <button
                onClick={() => setIsVegetarianOnly(false)}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Voir toutes les pizzas
              </button>
            )}
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
