import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent } from "./ui/tabs";
import { SectorTag } from "./SectorTag";
import { generatePitchDeckPDF } from "./PitchDeckGenerator";
import { 
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Mail,
  Linkedin,
  Globe,
  FileText,
  Download
} from "lucide-react";
import { useProjectsData } from "../hooks/useApiData";
import { useFounders } from "../services/api";

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (page: string, id?: string) => void;
}

export function ProjectDetailPage({ projectId, onNavigate }: ProjectDetailPageProps) {
  const [activeTab, setActiveTab] = useState("presentation");
  const { projects } = useProjectsData();
  const { founders } = useFounders(); // 👈 récupération des fondateurs
  const project = projects.find((p: any) => p.id === projectId) || (projects.length > 0 ? projects[0] : null);

  // Si pas de projet trouvé, afficher un message
  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Projet non trouvé</h2>
          <Button onClick={() => onNavigate("projects")}>
            Retour aux projets
          </Button>
        </div>
      </div>
    );
  }

  // Extended mock data for detailed view
  const extendedProject = {
    ...project,
    image: null,
    logo: null,
    fullDescription: "ecrire la description a la place",
    email: project.email,
    detailedNeeds: {
      funding: {
        amount: "€1.5M",
        purpose: "Accelerate product development and expand to European markets",
        timeline: "Series A - Q2 2024"
      },
      partnerships: {
        type: "Technology and Distribution Partners",
        description: "Seeking strategic partnerships with major technology vendors and distribution channels to accelerate market penetration"
      },
      recruitment: {
        roles: ["Senior Full-Stack Developer", "Product Manager", "Sales Director"],
        description: "Building world-class team to support rapid growth and market expansion"
      }
    },
    timeline: [
      { date: "Mar 2024", event: "€500K Seed funding closed", type: "funding" },
      { date: "Jan 2024", event: "French Tech Award Winner", type: "award" },
      { date: "Oct 2023", event: "Beta product launch", type: "product" },
      { date: "Jun 2023", event: "Company founded", type: "milestone" }
    ],
    metrics: {
      mrr: project.metrics?.mrr || "€25K",
      growth: "180%",
      users: project.metrics?.users || "2.5K",
      retention: "94%",
      nps: "68"
    },
    awards: [
      "French Tech Award 2024 - Innovation Category",
      "Startup Europe Summit Finalist", 
      "JEB Incubator Best Pitch Award"
    ]
  };

  // Récupérer les fondateurs liés à cette startup
  const projectFounders = founders.filter(f => f.startupId.toString() === project.id);


  // Function to handle PDF download
  const handleDownloadPitchDeck = () => {
    const pdfData = {
      ...extendedProject,
      baseline: extendedProject.baseline || project.description,
      email: extendedProject.email || "contact@startup.com",
      location: extendedProject.location || "France",
      founded: extendedProject.founded ? parseInt(extendedProject.founded) : 2023,
      needs: extendedProject.needs ? extendedProject.needs.split(",").map(n => n.trim()) : [],
      founders: projectFounders.map(f => f.name),
    };
    generatePitchDeckPDF(pdfData);
  };

  // Function to handle contact startup
  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate("projects")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to projects
        </Button>
      </div>

      {/* Project header */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex items-start gap-6 flex-1">
              <div className="space-y-4 flex-1">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {extendedProject.name}
                  </h1>
                  {projectFounders.length > 0 && (
                    <p className="text-muted-foreground">
                      by {projectFounders.map(f => f.name).join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <SectorTag sector={extendedProject.sector} />
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {extendedProject.location}
                  </Badge>
                  {extendedProject.founded && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Founded in {extendedProject.founded}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
              <Button
                size="lg"
                className="min-w-[200px]"
                onClick={() => window.location.href = `mailto:${extendedProject.email}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact startup
              </Button>

              <Button 
                variant="secondary" 
                size="lg" 
                className="min-w-[200px]"
                onClick={handleDownloadPitchDeck}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Pitch Deck
              </Button>
              {extendedProject.website && (
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => window.open(extendedProject.website, "_blank")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Visit website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>

              {/* Overview */}
              <TabsContent value="presentation" className="space-y-6">
                {/* MAIN PROJECT IMAGE */}
                {/* <div className="aspect-video rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">PROJECT IMAGE</span>
                </div> */}

                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{extendedProject.baseline}</p>
                  </CardContent>
                </Card>

              {/* Needs & resources */}
                <div className="space-y-6">
                  {extendedProject.needs && extendedProject.needs.includes("funding") && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          Funding
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Amount</label>
                            <p className="text-lg font-semibold">{extendedProject.detailedNeeds.funding.amount}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Timeline</label>
                            <p className="text-lg font-semibold">{extendedProject.detailedNeeds.funding.timeline}</p>
                          </div>
                        </div>
                        <p>{extendedProject.detailedNeeds.funding.purpose}</p>
                      </CardContent>
                    </Card>
                  )}

                  {extendedProject.needs && extendedProject.needs.includes("partnerships") && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          Partnerships
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium mb-2">{extendedProject.detailedNeeds.partnerships.type}</p>
                        <p>{extendedProject.detailedNeeds.partnerships.description}</p>
                      </CardContent>
                    </Card>
                  )}

                  {extendedProject.needs && extendedProject.needs.includes("recruitment") && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-500" />
                          Recruitment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3">{extendedProject.detailedNeeds.recruitment.description}</p>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">Open positions:</label>
                          <div className="flex flex-wrap gap-2">
                            {extendedProject.detailedNeeds.recruitment.roles.map((role: string, index: number) => (
                              <Badge key={index} variant="secondary">{role}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

              {/* Links */}
              <hr className="mb-10 mt-10" />
                <div className="grid sm:grid-cols-2 gap-8">
                  {extendedProject.website && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <Globe className="w-8 h-8 text-blue-500" />
                          <div>
                            <h3 className="font-medium">Website</h3>
                            <p className="text-sm text-muted-foreground">Official startup website</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => window.open(extendedProject.website, "_blank")}
                        >
                          Visit
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="font-medium">Pitch Deck</h3>
                          <p className="text-sm text-muted-foreground">Company presentation</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={handleDownloadPitchDeck}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-8 h-8 text-blue-700" />
                        <div>
                          <h3 className="font-medium">LinkedIn</h3>
                          <p className="text-sm text-muted-foreground">Company page</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => window.open(extendedProject.social, "_blank")}
                      >
                        Follow
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <Mail className="w-8 h-8 text-red-500" />
                        <div>
                          <h3 className="font-medium">Direct contact</h3>
                          <p className="text-sm text-muted-foreground">Contact the team</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => window.location.href = `mailto:${extendedProject.email || "contact@startup.com"}`}
                      >
                        Send email
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact incubator */}
            <Card>
              <CardHeader>
                <CardTitle>Contact JEB Incubator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Want to know more about this project? Contact our team.
                </p>
                <Button 
                  className="w-full"
                  onClick={() => {
                    window.location.href = "mailto:contact@jeb-incubator.com";
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}