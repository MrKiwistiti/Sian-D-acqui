import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProjectCard } from "./ProjectCard";
import {
  ArrowRight,
  Building,
  Award,
  ExternalLink,
} from "lucide-react";
import {
  useProjectsData,
  useNewsData,
  useStatsData,
} from "../hooks/useApiData";

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { projects, loading: projectsLoading, error: projectsError } = useProjectsData();
  const { news, loading: newsLoading, error: newsError } = useNewsData();
  const stats = useStatsData();

  const featuredProjects = projects.slice(0, 3);
  const recentNews = news.slice(0, 3);

  // Simple loading state - only show for 3 seconds max
  const isLoading = (projectsLoading || newsLoading) && projects.length === 0 && news.length === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-xl mb-4">Loading JEB Incubator...</div>
          <p className="text-muted-foreground max-w-md">
            We're gathering the latest startup projects and news for you
          </p>
        </div>
      </div>
    );
  }

  if (projectsError || newsError) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Unable to load content</div>
          <p className="text-muted-foreground mb-6">
            There was an error loading the startup data. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const displayStats = {
    ...stats,
    projectsCount: projects.length,
    newsCount: news.length,
    startupCount: projects.length, // Total projects as startup count
    investorCount: 25, // Fixed number as this isn't in API
    successRate: "85%", // Fixed rate as this isn't in API
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                JEB Incubator
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mt-6 mb-8">
                Empowering startups to transform ideas into successful businesses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" onClick={() => onNavigate("projects")}>
                  Explore Projects
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => onNavigate("startup-login")}>
                  For Startups
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {displayStats.projectsCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    startups
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {displayStats.investorCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    investors
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {displayStats.newsCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    news
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {displayStats.successRate}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    success rate
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12">
              <div className="text-center">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Innovation Hub</h3>
                <p className="text-lg text-muted-foreground">
                  Where startups transform ideas into reality
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover the startups making headlines in our ecosystem
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("projects")}
              className="hidden sm:flex"
            >
              View all projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={(project) =>
                  onNavigate("project", project.id)
                }
                onContact={(project) => {
                  // TODO: Open contact modal
                  console.log("Contact project:", project.name);
                }}
              />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button
              variant="outline"
              onClick={() => onNavigate("projects")}
            >
              View all projects
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Startup PRO Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="font-medium">
                NEW: For Startups
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              JEB Incubator{" "}
              <span className="text-primary">PRO</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              The exclusive startup dashboard to manage your projects, track progress, and connect with investors. Get access to powerful tools designed specifically for growing businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("startup-login")}
                className="text-lg px-8"
              >
                Access PRO Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("projects")}
              >
                Learn More
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                News
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow the startup ecosystem news
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("news")}
              className="hidden sm:flex"
            >
              All news
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((news) => (
              <Card
                key={news.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => onNavigate("news", news.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {news.tags
                      .slice(0, 2)
                      .map((tag, tagIndex) => (
                        <Badge
                          key={`${news.id}-tag-${tagIndex}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {news.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(news.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button
              variant="outline"
              onClick={() => onNavigate("news")}
            >
              All news
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join JEB Incubator and get access to funding, mentorship, and a network of successful entrepreneurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate("startup-login")}
            >
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("projects")}
              className="border-primary-foreground/20 hover:bg-primary-foreground/10"
            >
              Learn More
              <Building className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
