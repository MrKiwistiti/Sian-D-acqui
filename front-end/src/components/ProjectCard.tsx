import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { SectorTag } from "./SectorTag";
import { MaturityTag } from "./MaturityTag";
import { MapPin } from "lucide-react";
import type { Project } from "../types/frontend";

interface ProjectCardProps {
  project: Project;
  variant?: "grid" | "list";
  onContact?: (project: Project) => void;
  onViewDetails?: (project: Project) => void;
}

export function ProjectCard({ 
  project, 
  onViewDetails 
}: ProjectCardProps) {
  // Générer initiales pour remplacer le logo
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
      <CardContent className="p-6 flex-1">
        <div className="flex items-start gap-3 mb-4">
          {/* Initiales à la place du logo */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-coral-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold" role="img" aria-label={`${project.name} logo`}>
            {getInitials(project.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <SectorTag sector={project.sector} />
          <MaturityTag maturity={project.maturity} />
        </div>

        {project.address && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span aria-label={`Located in ${project.address}`}>{project.address}</span>
          </div>
        )}

        {project.needs && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Current Needs
            </p>
            <p className="text-sm">
              {project.needs}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 focus-outline"
          onClick={() => onViewDetails?.(project)}
          aria-label={`View details for ${project.name}`}
        >
          View details
        </Button>
        <Button 
          size="sm" 
          className="flex-1 focus-outline"
          onClick={() => {
            if (project.email) {
              window.location.href = `mailto:${project.email}`;
            }
          }}
          aria-label={`Contact ${project.name} startup`}
        >
          Contact startup
        </Button>
      </CardFooter>
    </Card>
  );
}