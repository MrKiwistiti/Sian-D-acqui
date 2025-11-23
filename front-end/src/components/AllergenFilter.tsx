import { useState } from "react";
import type { AllergenType } from "../types/allergens";
import { allergensList } from "../types/allergens";

interface AllergenFilterProps {
  selectedAllergens: AllergenType[];
  onAllergenChange: (allergen: AllergenType, isSelected: boolean) => void;
  filterMode: 'exclude' | 'only'; // exclude: masquer pizzas avec allergènes | only: afficher que pizzas sans allergènes sélectionnés
  onFilterModeChange: (mode: 'exclude' | 'only') => void;
}

export function AllergenFilter({ 
  selectedAllergens, 
  onAllergenChange, 
  filterMode, 
  onFilterModeChange 
}: AllergenFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const allergenArray = Object.values(allergensList);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Allergènes & Intolérances</h3>
          <p className="text-sm text-gray-600">Sélectionnez vos allergènes pour filtrer les pizzas</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Mode de filtre */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Mode de filtrage:</p>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="filter-mode"
                  value="exclude"
                  checked={filterMode === 'exclude'}
                  onChange={() => onFilterModeChange('exclude')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Exclure les pizzas avec ces allergènes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="filter-mode"
                  value="only"
                  checked={filterMode === 'only'}
                  onChange={() => onFilterModeChange('only')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Afficher uniquement ces allergènes</span>
              </label>
            </div>
          </div>

          {/* Sélection des allergènes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allergenArray.map((allergen) => (
              <label
                key={allergen.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedAllergens.includes(allergen.id)
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAllergens.includes(allergen.id)}
                  onChange={(e) => onAllergenChange(allergen.id, e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: allergen.color }}>
                  <img 
                    src={`/images/allergens/${allergen.id}.svg`}
                    alt={allergen.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-center text-gray-700">{allergen.name}</span>
              </label>
            ))}
          </div>

          {selectedAllergens.length > 0 && (
            <button
              onClick={() => {
                onAllergenChange('gluten' as AllergenType, false); // Réinitialiser
                selectedAllergens.forEach(allergen => {
                  onAllergenChange(allergen, false);
                });
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              ✕ Réinitialiser les filtres
            </button>
          )}
        </>
      )}

      {/* Affichage résumé des sélections */}
      {selectedAllergens.length > 0 && (
        <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
          {selectedAllergens.map(allergen => (
            <button
              key={allergen}
              onClick={() => onAllergenChange(allergen, false)}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              {allergensList[allergen].name}
              <span className="font-bold">✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
