import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

interface ChangePasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ChangePasswordPage({ onNavigate }: ChangePasswordPageProps) {
  const { changePassword, user, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validation
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const success = await changePassword(newPassword);
      if (success) {
        // Succès - rediriger vers l'accueil
        onNavigate("home");
      } else {
        setError("Failed to change password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while changing your password");
      console.error("Change password error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const passwordStrength = newPassword.length > 0 ? (
    <div className="mt-2 space-y-1">
      <div className="flex items-center space-x-2 text-xs">
        {newPassword.length >= 8 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <div className="h-3 w-3 rounded-full border border-gray-300" />
        )}
        <span className={newPassword.length >= 8 ? "text-green-600" : "text-gray-500"}>
          At least 8 characters
        </span>
      </div>
      <div className="flex items-center space-x-2 text-xs">
        {/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword) ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <div className="h-3 w-3 rounded-full border border-gray-300" />
        )}
        <span className={/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword) ? "text-green-600" : "text-gray-500"}>
          Contains uppercase, lowercase, and number
        </span>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4" role="img" aria-label="JEB Incubator logo">
            <span className="text-primary-foreground font-bold text-2xl">J</span>
          </div>
          <h1 className="text-2xl font-bold">Change Password</h1>
          <p className="text-muted-foreground">
            Welcome {user?.name}! You must change your temporary password to continue.
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Set New Password</CardTitle>
            <CardDescription className="text-center">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <Alert variant="destructive" role="alert">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 focus-outline"
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-outline"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                {passwordStrength}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 focus-outline"
                    required
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-outline"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full focus-outline" 
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </Button>

              <div className="text-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={logout}
                  className="focus-outline"
                >
                  Logout Instead
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
