import { Badge } from "./ui/badge";
import type { Maturity } from "../types/frontend";
import { MATURITY_CONFIG } from "../types/frontend";

interface MaturityTagProps {
  maturity: Maturity;
  showDescription?: boolean;
  className?: string;
}

export function MaturityTag({ maturity, showDescription = false, className }: MaturityTagProps) {
  const config = MATURITY_CONFIG[maturity];
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${className || ""}`}
      title={showDescription ? config.description : undefined}
    >
      {config.label}
    </Badge>
  );
}
