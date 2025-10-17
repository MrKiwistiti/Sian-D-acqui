import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { Input } from "./ui/input";
import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Separator } from "./ui/separator";
// import { Progress } from "./ui/progress";
import { ChatWidget } from "./ChatWidget";
import { ChatSystem } from "./ChatSystem";
import { NotificationBadge } from "./NotificationBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // LineChart,
  // Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Building2,
  Users,
  Mail,
  Calendar,
  FileText,
  // Settings,
  // Eye,
  MessageCircle,
  Download,
  // Upload,
  // Bell,
  Crown,
  Target,
  Award,
  // Globe,
  // Phone,
  MapPin,
  // Edit3,
  // Save,
  // ArrowRight,
  // MoreHorizontal,
  // Filter,
  // Search,
  // User
} from "lucide-react";

interface StartupDashboardProps {
  onNavigate: (page: string) => void;
}

// Mock data for charts
const monthlyData = [
  { month: 'Jan', users: 120, revenue: 2400 },
  { month: 'Feb', users: 195, revenue: 3200 },
  { month: 'Mar', users: 280, revenue: 4800 },
  { month: 'Apr', users: 420, revenue: 6200 },
  { month: 'May', users: 580, revenue: 8900 },
  { month: 'Jun', users: 720, revenue: 12400 }
];

const trafficSources = [
  { name: 'Direct', value: 35, color: '#1166FF' },
  { name: 'Search', value: 28, color: '#00C2A8' },
  { name: 'Social', value: 22, color: '#FFB020' },
  { name: 'Referral', value: 15, color: '#DC2626' }
];

const recentContacts = [
  { id: 1, name: 'Marie Dupont', company: 'TechCorp', type: 'Investor', date: '2024-12-20', status: 'new' },
  { id: 2, name: 'Thomas Martin', company: 'StartupHub', type: 'Partnership', date: '2024-12-19', status: 'responded' },
  { id: 3, name: 'Sophie Chen', company: 'VentureCapital', type: 'Investor', date: '2024-12-18', status: 'meeting_scheduled' },
  { id: 4, name: 'Pierre Durand', company: 'ScaleUp', type: 'Client', date: '2024-12-17', status: 'closed' }
];

const upcomingEvents = [
  { id: 1, title: 'Pitch Training Session', date: '2024-12-25', time: '14:00', type: 'workshop' },
  { id: 2, title: 'Investor Meetup', date: '2024-12-28', time: '18:30', type: 'networking' },
  { id: 3, title: 'Demo Day Preparation', date: '2025-01-05', time: '10:00', type: 'demo' }
];

// Mock investor data
const availableInvestors = [
  {
    id: "investor-1",
    name: "Emma Rodriguez",
    company: "Green Venture Partners",
    focus: "Climate Tech, Sustainability",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b-600x600",
    isOnline: true,
    description: "Spécialisée dans les technologies vertes et l'impact environnemental. Portfolio de 40+ startups climate tech.",
    sectors: ["climate", "ai"],
    stages: ["seed", "series"],
    location: "Paris, France"
  },
  {
    id: "investor-2",
    name: "Lucas Dubois",
    company: "Innovation Capital",
    focus: "AI, Deep Tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: "Expert en intelligence artificielle et technologies de pointe. 15 ans d'expérience en venture capital.",
    sectors: ["ai", "health"],
    stages: ["seed", "series"],
    location: "Lyon, France"
  },
  {
    id: "investor-3",
    name: "Sarah Chen",
    company: "HealthTech Ventures",
    focus: "HealthTech, Biotech",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    isOnline: true,
    description: "Investissements dans les technologies de santé et biotechnologies. Ancien médecin reconvertie.",
    sectors: ["health", "ai"],
    stages: ["seed", "series"],
    location: "Marseille, France"
  },
  {
    id: "investor-4",
    name: "Marc Leroy",
    company: "Fintech Fund",
    focus: "Fintech, Mobility",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: "Spécialiste fintech et mobilité. Co-fondateur de 3 startups fintech avant de passer à l'investissement.",
    sectors: ["fintech", "mobility"],
    stages: ["idea", "seed"],
    location: "Toulouse, France"
  }
];

export function StartupDashboard({  }: StartupDashboardProps) { //export function StartupDashboard({ onNavigate }: StartupDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  // const [isEditing, setIsEditing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [companyData] = useState({ // [companyData, setCompanyData] = useState({
    name: "EcoTrack Solutions",
    baseline: "Smart carbon tracking for sustainable businesses",
    description: "EcoTrack is a B2B SaaS platform that helps companies track, measure, and reduce their carbon footprint through advanced AI analytics and automated reporting.",
    sector: "climate",
    website: "https://ecotrack.com",
    location: "Paris, France",
    phone: "+33 1 23 45 67 89",
    email: "contact@ecotrack.com",
    founded: 2023,
    teamSize: 8,
    stage: "seed"
  });

  // Hardcoded metrics for demonstration (not currently used in UI)
  // const metrics = {
  //   mrr: "€25,400",
  //   users: "2,847", 
  //   growth: "+127%",
  //   retention: "94%",
  //   nps: "68",
  //   funding: "€800K"
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-yellow-100 text-yellow-800';
      case 'meeting_scheduled': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'New';
      case 'responded': return 'Responded';
      case 'meeting_scheduled': return 'Meeting Scheduled';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  // const handleSaveProfile = () => {
  //   setIsEditing(false);
  //   // In a real app, this would save to the backend
  // };

  const handleStartChatWithInvestor = (investor: any) => {
    // Create a conversation with the selected investor
    console.log("Starting chat with investor:", investor.name);
    setIsChatOpen(true);
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `Vu il y a ${hours}h`;
    return `Vu il y a ${days}j`;
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold">{companyData.name}</h1>
                    <Badge className="bg-accent text-accent-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{companyData.baseline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsChatOpen(true)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <NotificationBadge onOpenChat={() => setIsChatOpen(true)} />
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Dashboard</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="metrics">Analytics</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Contacts</CardTitle>
                    <CardDescription>Latest inquiries and connections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentContacts.slice(0, 4).map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.company} • {contact.type}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(contact.status)} variant="secondary">
                            {getStatusLabel(contact.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your scheduled events and meetings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.date} at {event.time}</p>
                          </div>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Widget */}
                <ChatWidget 
                  currentUser={{
                    id: "startup-ecotrack",
                    name: "EcoTrack Team",
                    role: "startup"
                  }}
                  onOpenFullChat={() => setIsChatOpen(true)}
                />
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Company Profile</h2>
                  <p className="text-muted-foreground">Manage your company information and visibility settings</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <p className="text-sm">{companyData.name}</p>
                    </div>
                    <div>
                      <Label>Website</Label>
                      <p className="text-sm">{companyData.website}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm">{companyData.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Sector</Label>
                      <Badge className="sector-climate">{companyData.sector}</Badge>
                    </div>
                    <div>
                      <Label>Stage</Label>
                      <Badge className="maturity-seed">{companyData.stage}</Badge>
                    </div>
                    <div>
                      <Label>Team Size</Label>
                      <p className="text-sm">{companyData.teamSize} people</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investors Tab */}
            <TabsContent value="investors" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Connect with Investors</h2>
                  <p className="text-muted-foreground">Découvrez et contactez des investisseurs alignés avec votre secteur</p>
                </div>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </div>

              <div className="grid gap-6">
                {availableInvestors.map((investor) => (
                  <Card key={investor.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={investor.avatar} />
                          <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          investor.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{investor.name}</h3>
                            <p className="text-primary font-medium">{investor.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {investor.isOnline ? (
                              <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                            ) : (
                              <Badge variant="outline">{formatLastSeen(investor.lastSeen!)}</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{investor.description}</p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Focus:</span>
                            <span className="text-sm text-muted-foreground">{investor.focus}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{investor.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm font-medium">Secteurs:</span>
                          {investor.sectors.map((sector) => (
                            <Badge key={sector} className={`sector-${sector}`} variant="secondary">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Stages:</span>
                            {investor.stages.map((stage) => (
                              <Badge key={stage} className={`maturity-${stage}`} variant="outline">
                                {stage}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`mailto:contact@${investor.company.toLowerCase().replace(/\s+/g, '')}.com`)}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleStartChatWithInvestor(investor)}
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">Accès Premium</h3>
                  <p className="text-muted-foreground mb-4">
                    Débloquez l'accès à plus de 500+ investisseurs et fonctionnalités avancées
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade vers PRO+
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Other tabs placeholders */}
            <TabsContent value="metrics" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <p className="text-muted-foreground">Track your company's performance and growth metrics</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue & Users Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#1166FF" />
                        <Bar dataKey="revenue" fill="#00C2A8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={trafficSources}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {trafficSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contacts">
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Contacts Management</h3>
                <p className="text-muted-foreground">Manage your investor and partner relationships</p>
                <Button className="mt-4" onClick={() => setIsChatOpen(true)}>
                  Open Messages
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Events & Meetings</h3>
                <p className="text-muted-foreground">Manage your schedule and upcoming events</p>
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Resources Hub</h3>
                <p className="text-muted-foreground">Access guides, templates, and learning materials</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Chat System Modal */}
      <ChatSystem
        currentUser={{
          id: "startup-ecotrack",
          name: "EcoTrack Team",
          role: "startup"
        }}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}