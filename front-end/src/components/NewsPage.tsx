import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, User, Search } from "lucide-react";
import { useNewsData } from "../hooks/useApiData";
import ReactMarkdown from "react-markdown";


interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  description: string;
  author: string;
  date: string;
  category?: string;
}

const categories = [
  { value: "all", label: "All News" },
  { value: "news", label: "News" },
  { value: "events", label: "Events" },
  { value: "success-story", label: "Success Stories" },
  { value: "innovation", label: "Innovation" }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Utiliser les vraies données de l'API
  const { news, loading } = useNewsData();

  // Afficher un état de chargement si nécessaire
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Loading news...</div>
        </div>
      </div>
    );
  }

  // Convertir les données API en format NewsArticle (seulement les champs réels)
  const convertedNews: NewsArticle[] = news.map((item) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    description: item.description || "No description available",
    author: item.author,
    date: new Date(item.publishedAt).toISOString().split('T')[0],
    category: item.tags?.[0] || undefined,
  }));

  const filteredNews = convertedNews.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedArticle(null)}
            className="mb-8"
          >
            ← Back to News
          </Button>
          
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="mb-4">{selectedArticle.title}</h1>
              <div className="flex items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedArticle.date)}</span>
                </div>
                {selectedArticle.category && (
                  <Badge variant="secondary">
                    {selectedArticle.category}
                  </Badge>
                )}
              </div>
            </header>
            
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line">
                <ReactMarkdown>{selectedArticle.description}</ReactMarkdown>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="mb-6">News & Insights</h1>
            <p className="text-xl text-muted-foreground">
              Stay updated with the latest news, insights and developments from the JEB incubator ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8">Latest News</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article: NewsArticle) => (
              <Card 
                key={article.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    {article.category && (
                      <Badge variant="secondary">
                        {article.category}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
