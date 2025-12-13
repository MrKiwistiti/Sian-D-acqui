import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Trash2 } from "lucide-react";
import { useUsersManagement } from "../hooks/useApiData";
import { useAuth } from "../contexts/AuthContext";

interface AdminCRUDPanelProps {
  onNavigate: (page: string) => void;
}

export function AdminCRUDPanel({ onNavigate }: AdminCRUDPanelProps) {
  // Vérification de l'authentification
  const { isAdmin } = useAuth();

  // Hook de gestion des utilisateurs
  const usersManagement = useUsersManagement();

  // Si l'utilisateur n'est pas admin, afficher un message
  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You need administrator privileges to access this panel.
          </p>
          <Button onClick={() => onNavigate('home')} className="mt-4">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage existing user roles and permissions. New users can register through the public signup page.
          </p>
        </div>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>Update user roles and manage permissions for existing users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersManagement.users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={async (newRole) => {
                          try {
                            // Appel direct à l'API pour mettre à jour le rôle
                            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${user.id}`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ role: newRole }),
                            });

                            if (!response.ok) {
                              throw new Error('Failed to update user role');
                            }

                            // Recharger la page pour voir les changements
                            window.location.reload();
                          } catch (error) {
                            console.error('Error updating user role:', error);
                            alert('Erreur lors de la mise à jour du rôle');
                          }
                        }}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => usersManagement.deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!usersManagement.users?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Information about user signup */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">User Registration</h4>
            <p className="text-sm text-muted-foreground">
              New users can create accounts through the public signup page available in the site header. 
              Once registered, you can manage their roles and permissions from this panel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
