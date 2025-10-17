import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { AdminCRUDPanel } from "./AdminCRUDPanel";

import {
  Building2,
  TrendingUp,
  Euro,
  Calendar,
  FileText,
  Activity,
  BarChart3,
  // Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Users,
  PieChart,
  Target
} from "lucide-react";
import {
  useProjectsData,
  useNewsData,
  useEventsData,
  useStatsData,
  useProjectsManagement,
  useNewsManagement,
  useEventsManagement,
  useAnalytics,
} from "../hooks/useApiData";
// import type { Project } from "./ProjectCard";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // États pour les modales
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  
  // États pour les formulaires
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    sector: 'DeepTech',
    maturity: 'Idea',
    address: '',
    email: '',
    phone: '',
    websiteUrl: '',
    needs: ''
  });
  
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '14:00',
    location: '',
    type: 'conference'
  });
  
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    category: 'Innovation',
    author: 'JEB Admin'
  });
  
  const { projects } = useProjectsData();
  const { news } = useNewsData();
  const { events } = useEventsData();
  const stats = useStatsData();
  
  // Hooks de gestion CRUD
  const projectsManagement = useProjectsManagement();
  const newsManagement = useNewsManagement();
  const eventsManagement = useEventsManagement();
  const analytics = useAnalytics();

  const totalProjects = projects.length;
  
  // Handlers pour les actions CRUD
  const handleCreateProject = async () => {
    try {
      await projectsManagement.createProject(projectForm);
      setIsProjectDialogOpen(false);
      setProjectForm({
        name: '',
        description: '',
        sector: 'DeepTech',
        maturity: 'Idea',
        address: '',
        email: '',
        phone: '',
        websiteUrl: '',
        needs: ''
      });
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Erreur lors de la création du projet');
    }
  };

  const handleCreateEvent = async () => {
    try {
      await eventsManagement.createEvent(eventForm);
      setIsEventDialogOpen(false);
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '14:00',
        location: '',
        type: 'conference'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Erreur lors de la création de l\'événement');
    }
  };

  const handleCreateNews = async () => {
    try {
      await newsManagement.createNews(newsForm);
      setIsNewsDialogOpen(false);
      setNewsForm({
        title: '',
        content: '',
        category: 'Innovation',
        author: 'JEB Admin'
      });
    } catch (error) {
      console.error('Error creating news:', error);
      alert('Erreur lors de la création de la news');
    }
  };

  // Utiliser les vraies valeurs de maturité de l'API
  const ideaProjects = projects.filter((p: any) => p.maturity === "Idea").length;
  const prototypeProjects = projects.filter((p: any) => p.maturity === "Prototype").length;
  const mvpProjects = projects.filter((p: any) => p.maturity === "MVP").length;
  const pmfProjects = projects.filter((p: any) => p.maturity === "Product-Market Fit").length;

  const getSectorLabel = (sector: string) => {
    const labels: Record<string, string> = {
      "DeepTech": "Deep Tech",
      "EdTech": "Éducation",
      "FinTech": "Finance",
      "HealthTech": "Santé",
      "Logistics": "Logistique",
      "SaaS": "SaaS",
      "Sustainability": "Durabilité"
    };
    return labels[sector] || sector;
  };

  // Répartition par secteur
  const sectorStats = projects.reduce((acc: any, project: any) => {
    acc[project.sector] = (acc[project.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);



  const getMaturityLabel = (maturity: string) => {
    const labels: Record<string, string> = {
      idea: "Ideation",
      seed: "Seed",
      series: "Series A+"
    };
    return labels[maturity] || maturity;
  };

  const filteredProjects = projects.filter((project: any) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.baseline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <h1 className="font-bold text-xl">Admin Dashboard</h1>
              </div>
            </div>
            <Button variant="outline" onClick={() => onNavigate("home")}>
              Back to Site
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    Projets accompagnés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    En croissance active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Funding</CardTitle>
                  <Euro className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.fundsRaised}</div>
                  <p className="text-xs text-muted-foreground">
                    Financement estimé total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.successRate}</div>
                  <p className="text-xs text-muted-foreground">
                    Taux de projets actifs
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scale-Up Projects</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.scaleUpProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    En phase d'expansion
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Age</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageAge}</div>
                  <p className="text-xs text-muted-foreground">
                    Âge moyen des projets
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">News Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.newsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Articles publiés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.eventsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Événements organisés
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Maturity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects by Maturity Stage</CardTitle>
                  <CardDescription>Distribution of projects by development stage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm">Ideation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(ideaProjects / totalProjects) * 100} className="w-20" />
                        <span className="text-sm font-medium">{ideaProjects}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-sm">Prototype</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(prototypeProjects / totalProjects) * 100} className="w-20" />
                        <span className="text-sm font-medium">{prototypeProjects}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm">MVP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(mvpProjects / totalProjects) * 100} className="w-20" />
                        <span className="text-sm font-medium">{mvpProjects}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-sm">Product-Market Fit</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(pmfProjects / totalProjects) * 100} className="w-20" />
                        <span className="text-sm font-medium">{pmfProjects}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sector Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects by Sector</CardTitle>
                  <CardDescription>Distribution of projects by industry sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(sectorStats).map(([sector, count]) => {
                      const percentage = (((count as number) / totalProjects) * 100).toFixed(1);
                      return (
                        <div key={sector} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full sector-${sector}`}></div>
                              <span className="text-sm font-medium">{getSectorLabel(sector)}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {String(count)} projects ({String(percentage)}%)
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full sector-${sector}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Latest Projects */}
                  {projects.slice(-2).reverse().map((project: any) => (
                    <div key={`project-${project.id}`} className="flex items-center space-x-4 p-2 border-l-4 border-blue-500 bg-blue-50/50">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm">New project: <span className="font-medium">{project.name}</span></p>
                        <p className="text-xs text-muted-foreground">{project.sector} • {project.maturity}</p>
                      </div>
                    </div>
                  ))}

                  {/* Latest Events */}
                  {events.slice(-2).reverse().map((event: any) => (
                    <div key={`event-${event.id}`} className="flex items-center space-x-4 p-2 border-l-4 border-purple-500 bg-purple-50/50">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm">Event scheduled: <span className="font-medium">{event.title}</span></p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Latest News */}
                  {news.slice(-2).reverse().map((article: any) => (
                    <div key={`news-${article.id}`} className="flex items-center space-x-4 p-2 border-l-4 border-green-500 bg-green-50/50">
                      <FileText className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm">Article published: <span className="font-medium">{article.title}</span></p>
                        <p className="text-xs text-muted-foreground">
                          by {article.author} • {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Fallback if no data */}
                  {projects.length === 0 && events.length === 0 && news.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-center">
                      <div className="text-muted-foreground">
                        <Activity className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No recent activity available</p>
                        <p className="text-xs">Add some projects, events, or news to see activity here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab - CRUD Panel */}
          <TabsContent value="manage" className="space-y-6">
            <AdminCRUDPanel onNavigate={onNavigate} />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Projects Management</h2>
              <Button onClick={() => setIsProjectDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Projects Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Maturity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Founded</TableHead>
                      <TableHead>MRR</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {project.baseline}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`sector-${project.sector}`}>
                            {getSectorLabel(project.sector)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`maturity-${project.maturity}`}>
                            {getMaturityLabel(project.maturity)}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.location}</TableCell>
                        <TableCell>{project.founded}</TableCell>
                        <TableCell>{project.metrics?.mrr || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => onNavigate(`project-detail-${project.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => projectsManagement.deleteProject(project.id)}
                              disabled={projectsManagement.isDeleting === project.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Events Management</h2>
              <Button onClick={() => setIsEventDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{event.type}</Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => eventsManagement.deleteEvent(event.id)}
                          disabled={eventsManagement.isDeleting === event.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="text-sm">
                      <strong>Location:</strong> {event.location}
                    </div>
                    {event.maxAttendees && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Registrations:</span>
                          <span>{event.currentAttendees}/{event.maxAttendees}</span>
                        </div>
                        <Progress 
                          value={(event.currentAttendees! / event.maxAttendees) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">News Management</h2>
              <Button onClick={() => setIsNewsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Write Article
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news.map((article: any) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{article.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{new Date(article.publishedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => newsManagement.deleteNews(article.id)}
                              disabled={newsManagement.isDeleting === article.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Analytics & Reports</h2>
                <p className="text-muted-foreground">Overview of incubator performance</p>
              </div>
            </div>
            
            {/* Stats Overview - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalStats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">Incubated startups</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalStats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">Events organized</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalStats.totalNews}</div>
                  <p className="text-xs text-muted-foreground">News published</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.totalStats.totalAdmins} admin(s), {analytics.totalStats.totalRegularUsers} user(s)
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Analytics - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par secteur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Distribution by Sector
                  </CardTitle>
                  <CardDescription>Project distribution by business domain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.sectorStats).map(([sector, count]) => (
                      <div key={sector} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium">{sector}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(count as number / analytics.totalStats.totalProjects) * 100} 
                            className="w-16 h-2"
                          />
                          <span className="text-sm text-muted-foreground min-w-[2rem]">{count}</span>
                        </div>
                      </div>
                    ))}
                    {Object.keys(analytics.sectorStats).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No sector data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Statut des projets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Project Maturity
                  </CardTitle>
                  <CardDescription>Distribution by maturity level (Idea, Prototype, MVP, PMF)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.statusStats).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">{status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(count as number / analytics.totalStats.totalProjects) * 100} 
                            className="w-16 h-2"
                          />
                          <span className="text-sm text-muted-foreground min-w-[2rem]">{count}</span>
                        </div>
                      </div>
                    ))}
                    {Object.keys(analytics.statusStats).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No status data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activité par mois */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Events by Month
                  </CardTitle>
                  <CardDescription>Temporal distribution of events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.monthlyStats).slice(0, 6).map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="text-sm font-medium">{month}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(count as number / analytics.totalStats.totalEvents) * 100} 
                            className="w-16 h-2"
                          />
                          <span className="text-sm text-muted-foreground min-w-[2rem]">{count}</span>
                        </div>
                      </div>
                    ))}
                    {Object.keys(analytics.monthlyStats).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No temporal data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Activity Summary
                  </CardTitle>
                  <CardDescription>Ecosystem overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analytics.totalStats.totalProjects}</div>
                      <div className="text-xs text-muted-foreground">Active Projects</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{analytics.totalStats.totalEvents}</div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{analytics.totalStats.totalNews}</div>
                      <div className="text-xs text-muted-foreground">Articles</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analytics.recentActivity.totalActivity}</div>
                      <div className="text-xs text-muted-foreground">Total Items</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Creation Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Fill in the details to add a new startup project.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectForm.name}
                onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectEmail">Email</Label>
              <Input
                id="projectEmail"
                type="email"
                value={projectForm.email}
                onChange={(e) => setProjectForm({...projectForm, email: e.target.value})}
                placeholder="contact@startup.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectPhone">Phone</Label>
              <Input
                id="projectPhone"
                value={projectForm.phone}
                onChange={(e) => setProjectForm({...projectForm, phone: e.target.value})}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectSector">Sector</Label>
              <Select value={projectForm.sector} onValueChange={(value) => setProjectForm({...projectForm, sector: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DeepTech">Deep Tech</SelectItem>
                  <SelectItem value="EdTech">EdTech</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="HealthTech">HealthTech</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Sustainability">Sustainability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectMaturity">Maturity</Label>
              <Select value={projectForm.maturity} onValueChange={(value) => setProjectForm({...projectForm, maturity: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Idea">Idea</SelectItem>
                  <SelectItem value="Prototype">Prototype</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="Product-Market Fit">Product-Market Fit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectAddress">Address</Label>
              <Input
                id="projectAddress"
                value={projectForm.address}
                onChange={(e) => setProjectForm({...projectForm, address: e.target.value})}
                placeholder="City, Country"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                placeholder="Describe the project..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={projectsManagement.isCreating}>
              {projectsManagement.isCreating ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Creation Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill in the details to create a new event.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Title</Label>
              <Input
                id="eventTitle"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                placeholder="Event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Type</Label>
              <Select value={eventForm.type} onValueChange={(value) => setEventForm({...eventForm, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="pitch">Pitch Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="eventLocation">Location</Label>
              <Input
                id="eventLocation"
                value={eventForm.location}
                onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                placeholder="Event location"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                placeholder="Describe the event..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} disabled={eventsManagement.isCreating}>
              {eventsManagement.isCreating ? 'Creating...' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* News Creation Dialog */}
      <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write New Article</DialogTitle>
            <DialogDescription>Fill in the details to publish a new article.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsTitle">Title</Label>
              <Input
                id="newsTitle"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                placeholder="Article title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newsCategory">Category</Label>
                <Select value={newsForm.category} onValueChange={(value) => setNewsForm({...newsForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                    <SelectItem value="Funding">Funding</SelectItem>
                    <SelectItem value="Success">Success Story</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Industry">Industry News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsAuthor">Author</Label>
                <Input
                  id="newsAuthor"
                  value={newsForm.author}
                  onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                  placeholder="Author name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsContent">Content</Label>
              <Textarea
                id="newsContent"
                value={newsForm.content}
                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                placeholder="Write your article content..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateNews} disabled={newsManagement.isCreating}>
              {newsManagement.isCreating ? 'Publishing...' : 'Publish Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}