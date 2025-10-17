import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Target, Lightbulb, TrendingUp, Mail, Linkedin, MapPin, Phone, Globe, Eye, Heart, Zap } from "lucide-react";

const stats = [
  { label: "Startups Incubated", value: "50+", icon: TrendingUp },
  { label: "Success Rate", value: "85%", icon: Users },
  { label: "Countries Reached", value: "15", icon: Target },
  { label: "Innovation Projects", value: "120+", icon: Lightbulb }
];

const team = [
  {
    name: "Reichert Sven",
    role: "Developer Fullstack",
    city: "Nice",
    bio: "Passionate fullstack developer with expertise in modern web technologies, bringing innovative solutions to life.",
    image: "/images/team/sven.jpg",
    linkedin: "#"
  },
  {
    name: "Durand Arranz Herranz Evan",
    role: "Lead Project + Backend Dev",
    city: "Gruissan",
    bio: "Experienced project leader and backend specialist, driving technical excellence and team coordination.",
    image: "/images/team/evan.jpg",
    linkedin: "#"
  },
  {
    name: "Fournales Tony",
    role: "Developer Frontend",
    city: "Toulouse",
    bio: "Creative frontend developer focused on user experience and modern interface design.",
    image: "/images/team/tony.jpg",
    linkedin: "#"
  },
  {
    name: "Soual Aymerick",
    role: "DevOps",
    city: "Namur, Belgium",
    bio: "DevOps engineer specialized in infrastructure automation and continuous deployment strategies.",
    image: "/images/team/aymerick.jpg",
    linkedin: "#"
  }
];

const values = [
  {
    icon: Eye,
    title: "Innovation",
    description: "We foster cutting-edge ideas that transform industries and create sustainable solutions for tomorrow's challenges."
  },
  {
    icon: Users,
    title: "Community",
    description: "Building strong networks that connect entrepreneurs, mentors, and investors in a collaborative ecosystem."
  },
  {
    icon: Heart,
    title: "Impact",
    description: "Focusing on ventures that generate positive social and environmental impact while achieving commercial success."
  },
  {
    icon: Zap,
    title: "Excellence",
    description: "Delivering world-class support and resources to ensure every startup reaches its maximum potential."
  }
];

interface Partner {
  id: number;
  name: string;
  email: string;
  partnershipType: string;
  description: string;
  address?: string;
  phone?: string;
}

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/partners`);
        if (response.ok) {
          const data = await response.json();
          setPartners(data.slice(0, 6)); // Limit to 6 partners
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About JEB Incubator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Empowering the next generation of entrepreneurs through innovation, mentorship, and strategic partnerships across Europe.
            </p>
            <Button size="lg" onClick={() => onNavigate("projects")}>
              Explore Our Startups
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To accelerate the growth of innovative startups by providing comprehensive support, mentorship, and access to a global network of investors and partners.
                </p>
                <p className="text-muted-foreground mb-8">
                  We believe in the power of entrepreneurship to solve complex challenges and create positive change in the world. Our mission is to identify, nurture, and scale the most promising ventures.
                </p>
                <Button variant="outline" onClick={() => onNavigate("projects")}>
                  See Our Impact
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                  alt="Team collaboration"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop" 
                  alt="Innovation workspace"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To become Europe's leading startup incubator, known for fostering breakthrough innovations that shape the future of technology and society.
                </p>
                <p className="text-muted-foreground mb-8">
                  We envision a world where entrepreneurial talent is nurtured without boundaries, where great ideas have the resources to flourish, and where innovation drives sustainable progress.
                </p>
                <Button variant="outline" onClick={() => onNavigate("events")}>
                  Join Our Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These core values guide everything we do, from selecting startups to building partnerships and creating lasting impact.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Meet the passionate professionals who make JEB Incubator a world-class platform for startup success.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit mx-auto mb-2">
                      {member.role}
                    </Badge>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{member.city}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {member.bio}
                    </p>
                    <Button variant="ghost" size="sm">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Partners</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We collaborate with leading organizations across Europe to provide comprehensive support and opportunities for our startups.
              </p>
            </div>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-center">
                        <CardTitle className="text-lg mb-2">{partner.name}</CardTitle>
                        <Badge variant="outline" className="mb-2">
                          {partner.partnershipType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        {partner.description}
                      </p>
                      {partner.email && (
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{partner.email}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-lg text-muted-foreground">
                Ready to join our ecosystem? We'd love to hear from you and discuss how we can support your entrepreneurial journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    Our Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <strong>Nice Office</strong><br />
                      Innovation District, Nice, France
                    </div>
                    <div>
                      <strong>Toulouse Hub</strong><br />
                      Tech Quarter, Toulouse, France
                    </div>
                    <div>
                      <strong>European Network</strong><br />
                      Offices across 15+ European cities
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">contact@jeb-incubator.eu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">+33 1 42 86 83 44</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">www.jeb-incubator.eu</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button size="lg" onClick={() => onNavigate("projects")}>
                Explore Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}