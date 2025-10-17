import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Filter } from "lucide-react";
import type { Sector, Maturity } from "../types/frontend";
import { SECTOR_CONFIG, MATURITY_CONFIG } from "../types/frontend";

export interface ProjectFilters {
  sectors: Sector[];
  maturities: Maturity[];
  needs: string[];
}

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  availableData: {
    sectors: { sector: Sector; count: number }[];
    maturities: { maturity: Maturity; count: number }[];
    needs: { need: string; count: number }[];
  };
}

export function ProjectFiltersComponent({ filters, onFiltersChange, availableData }: ProjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSector = (sector: Sector) => {
    const newSectors = filters.sectors.includes(sector)
      ? filters.sectors.filter(s => s !== sector)
      : [...filters.sectors, sector];
    
    onFiltersChange({
      ...filters,
      sectors: newSectors
    });
  };

  const toggleMaturity = (maturity: Maturity) => {
    const newMaturities = filters.maturities.includes(maturity)
      ? filters.maturities.filter(m => m !== maturity)
      : [...filters.maturities, maturity];
    
    onFiltersChange({
      ...filters,
      maturities: newMaturities
    });
  };

  const toggleNeed = (need: string) => {
    const newNeeds = filters.needs.includes(need)
      ? filters.needs.filter(n => n !== need)
      : [...filters.needs, need];
    
    onFiltersChange({
      ...filters,
      needs: newNeeds
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sectors: [],
      maturities: [],
      needs: []
    });
  };

  const hasActiveFilters = filters.sectors.length > 0 || filters.maturities.length > 0 || filters.needs.length > 0;
  const activeFiltersCount = filters.sectors.length + filters.maturities.length + filters.needs.length;

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Effacer tout
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.sectors.map(sector => {
            const config = SECTOR_CONFIG[sector];
            return (
              <Badge
                key={sector}
                className={`${config.color} cursor-pointer`}
                onClick={() => toggleSector(sector)}
              >
                {config.icon} {config.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
          {filters.maturities.map(maturity => {
            const config = MATURITY_CONFIG[maturity];
            return (
              <Badge
                key={maturity}
                variant="outline"
                className={`${config.color} cursor-pointer`}
                onClick={() => toggleMaturity(maturity)}
              >
                {config.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
          {filters.needs.map(need => (
            <Badge
              key={need}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleNeed(need)}
            >
              {need}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtrer les projets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Secteurs */}
            <div>
              <h4 className="font-medium mb-3">Secteurs</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableData.sectors.map(({ sector, count }) => {
                  const config = SECTOR_CONFIG[sector];
                  const isSelected = filters.sectors.includes(sector);
                  
                  return (
                    <Button
                      key={sector}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSector(sector)}
                      className="justify-start"
                    >
                      <span className="mr-1">{config.icon}</span>
                      {config.label}
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Maturité */}
            <div>
              <h4 className="font-medium mb-3">Niveau de maturité</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableData.maturities.map(({ maturity, count }) => {
                  const config = MATURITY_CONFIG[maturity];
                  const isSelected = filters.maturities.includes(maturity);
                  
                  return (
                    <Button
                      key={maturity}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleMaturity(maturity)}
                      className="justify-start"
                      title={config.description}
                    >
                      {config.label}
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Besoins */}
            <div>
              <h4 className="font-medium mb-3">Besoins</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {availableData.needs.map(({ need, count }) => {
                  const isSelected = filters.needs.includes(need);
                  
                  return (
                    <Button
                      key={need}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleNeed(need)}
                      className="justify-start"
                    >
                      {need}
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
