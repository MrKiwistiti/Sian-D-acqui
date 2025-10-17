import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Crown,
  Zap,
  TrendingUp,
  Users,
  Shield,
  Globe,
} from "lucide-react";

interface StartupLoginPageProps {
  onLogin: (email: string, password: string) => boolean;
  onNavigate: (page: string) => void;
}

export function StartupLoginPage({
  onLogin,
  onNavigate,
}: StartupLoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login process
    setTimeout(() => {
      const success = onLogin(email, password);
      if (success) {
        onNavigate("startup-dashboard");
      } else {
        setError(
          "Invalid email or password. Please try again.",
        );
      }
      setIsLoading(false);
    }, 1000);
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description:
        "Track your metrics, growth, and performance in real-time",
    },
    {
      icon: Users,
      title: "Contact Management",
      description:
        "Manage leads, investors, and partnership opportunities",
    },
    {
      icon: Globe,
      title: "Public Profile",
      description:
        "Showcase your startup to potential investors and partners",
    },
    {
      icon: Shield,
      title: "Secure Data",
      description:
        "Enterprise-grade security for your sensitive information",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="absolute left-4 top-4"
          >
            ← Back to Home
          </Button>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    JEB Incubator
                  </h1>
                  <Badge className="bg-accent text-accent-foreground mt-1">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO for Startups
                  </Badge>
                </div>
              </div>
              <p className="text-xl text-muted-foreground">
                The exclusive startup dashboard to manage your
                company profile, track performance, and connect
                with investors.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                What you get with PRO:
              </h2>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white/50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4">
                Demo Credentials
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-2">Startup Account:</p>
                  <div className="space-y-1 ml-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <code className="bg-muted px-2 py-1 rounded">startup@ecotrack.com</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Password:</span>
                      <code className="bg-muted px-2 py-1 rounded">startup123</code>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Founder Account:</p>
                  <div className="space-y-1 ml-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <code className="bg-muted px-2 py-1 rounded">founder@example.com</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Password:</span>
                      <code className="bg-muted px-2 py-1 rounded">founder123</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Startup Login
                </CardTitle>
                <CardDescription>
                  Access your startup dashboard and manage your
                  profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="startup@example.com"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Logging in..."
                    ) : (
                      <>
                        Log In to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have a startup account?
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                    >
                      Request Access
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate("login")}
                    >
                      Admin Login →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">
            Join the JEB Startup Community
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">
                Exclusive Access
              </h3>
              <p className="text-sm text-muted-foreground">
                Access to premium events, investor networks, and
                mentorship programs
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold">Growth Tools</h3>
              <p className="text-sm text-muted-foreground">
                Advanced analytics, performance tracking, and
                growth optimization tools
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold">Network</h3>
              <p className="text-sm text-muted-foreground">
                Connect with other startups, investors, and
                industry experts in our ecosystem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}