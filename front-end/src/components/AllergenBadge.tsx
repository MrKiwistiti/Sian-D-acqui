import type { AllergenType } from "../types/allergens";
import { allergensList } from "../types/allergens";

interface AllergenBadgeProps {
  allergen: AllergenType;
  size?: 'sm' | 'md' | 'lg';
}

export function AllergenBadge({ allergen, size = 'md' }: AllergenBadgeProps) {
  const info = allergensList[allergen];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
        style={{ backgroundColor: info.color }}
        title={info.description}
      >
        <img 
          src={`/images/allergens/${allergen}.svg`}
          alt={info.name}
          className="w-full h-full object-contain"
        />
      </div>
      {size !== 'sm' && (
        <span className={`${textSizes[size]} font-semibold text-gray-700 text-center`}>
          {info.name}
        </span>
      )}
    </div>
  );
}

interface AllergenListProps {
  allergens: AllergenType[];
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

export function AllergenList({ allergens, size = 'md', layout = 'horizontal' }: AllergenListProps) {
  if (allergens.length === 0) {
    return null;
  }

  const containerClass = layout === 'horizontal' 
    ? 'flex flex-wrap gap-3 items-center' 
    : 'flex flex-col gap-3';

  return (
    <div className={containerClass}>
      {allergens.map(allergen => (
        <AllergenBadge key={allergen} allergen={allergen} size={size} />
      ))}
    </div>
  );
}
