import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProjectCard } from "./ProjectCard";
import { ProjectFiltersComponent, type ProjectFilters } from "./ProjectFilters";
import { 
  Search, 
  RotateCcw, 
  Grid3X3,
  List
} from "lucide-react";
import { useProjectsData } from "../hooks/useApiData";
import type { Sector, Maturity } from "../types/frontend";

interface ProjectsPageProps {
  onNavigate: (page: string, id?: string) => void;
}

type SortOption = "relevance" | "recent" | "alphabetical";

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [filters, setFilters] = useState<ProjectFilters>({
    sectors: [],
    maturities: [],
    needs: []
  });

  const { projects, loading, error } = useProjectsData();

  // Calculer les données disponibles pour les filtres
  const availableData = useMemo(() => {
    const sectorCounts = new Map<Sector, number>();
    const maturityCounts = new Map<Maturity, number>();
    const needsCounts = new Map<string, number>();

    projects.forEach(project => {
      // Compter les secteurs
      sectorCounts.set(project.sector, (sectorCounts.get(project.sector) || 0) + 1);
      
      // Compter les maturités
      maturityCounts.set(project.maturity, (maturityCounts.get(project.maturity) || 0) + 1);
      
      // Compter les besoins (needs est maintenant une string)
      if (project.needs) {
        needsCounts.set('needs', (needsCounts.get('needs') || 0) + 1);
      }
    });

    return {
      sectors: Array.from(sectorCounts.entries()).map(([sector, count]) => ({ sector, count })),
      maturities: Array.from(maturityCounts.entries()).map(([maturity, count]) => ({ maturity, count })),
      needs: Array.from(needsCounts.entries()).map(([need, count]) => ({ need, count }))
    };
  }, [projects]);

  // Filtrer les projets
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = project.name.toLowerCase().includes(query) ||
                             project.description.toLowerCase().includes(query) ||
                             (project.address && project.address.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Filtre par secteur
      if (filters.sectors.length > 0 && !filters.sectors.includes(project.sector)) {
        return false;
      }

      // Filtre par maturité
      if (filters.maturities.length > 0 && !filters.maturities.includes(project.maturity)) {
        return false;
      }

      // Filtre par besoins (needs est maintenant une string)
      if (filters.needs.length > 0) {
        const hasMatchingNeed = filters.needs.some(filterNeed => 
          project.needs && project.needs.toLowerCase().includes(filterNeed.toLowerCase())
        );
        if (!hasMatchingNeed) return false;
      }

      return true;
    });
  }, [projects, searchQuery, filters]);

  // Trier les projets
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];
    
    switch (sortBy) {
      case "alphabetical":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "recent":
        return sorted.sort((a, b) => a.id.localeCompare(b.id)); // Tri par ID comme proxy pour la date
      case "relevance":
      default:
        return sorted; // Garde l'ordre original pour la pertinence
    }
  }, [filteredProjects, sortBy]);

  const clearAllFilters = () => {
    setFilters({
      sectors: [],
      maturities: [],
      needs: []
    });
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Chargement des projets...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Erreur de chargement</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="bg-background py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Projets de l'écosystème
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Découvrez les {projects.length} startups accompagnées par JEB Incubator
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher des projets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8">
            <ProjectFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              availableData={availableData}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {sortedProjects.length} résultat{sortedProjects.length !== 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </span>
              
              {(filters.sectors.length > 0 || filters.maturities.length > 0 || filters.needs.length > 0 || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="relevance">Pertinence</option>
                <option value="alphabetical">Alphabétique</option>
                <option value="recent">Plus récent</option>
              </select>

              {/* View Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Projects Grid/List */}
          {sortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou filtres
              </p>
              <Button variant="outline" onClick={clearAllFilters}>
                Effacer les filtres
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant={viewMode}
                  onViewDetails={(project) => onNavigate("project", project.id)}
                  onContact={(project) => {
                    // TODO: Implement contact functionality
                    console.log("Contact project:", project.name);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
