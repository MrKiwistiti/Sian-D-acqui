import { Badge } from "./ui/badge";
import { Microscope, BookOpen, DollarSign, Heart, Truck, Cloud, Sprout } from "lucide-react";
import type { Sector } from "../types/frontend";
import { SECTOR_CONFIG } from "../types/frontend";

interface SectorTagProps {
  sector: Sector;
  showIcon?: boolean;
  className?: string;
}

const sectorIcons: Record<Sector, React.ComponentType<{ className?: string }>> = {
  "DeepTech": Microscope,
  "EdTech": BookOpen,
  "FinTech": DollarSign,
  "HealthTech": Heart,
  "Logistics": Truck,
  "SaaS": Cloud,
  "Sustainability": Sprout
};

export function SectorTag({ sector, showIcon = true, className }: SectorTagProps) {
  const Icon = sectorIcons[sector];
  const config = SECTOR_CONFIG[sector];
  
  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${className || ""} ${showIcon ? "flex items-center gap-1" : ""}`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
}