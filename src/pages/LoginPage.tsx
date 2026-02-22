import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Rocket } from 'lucide-react';
import axios from "axios"


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DEVELOPER');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {


  //     const success = await login(email, password, role);
  //     if (success) {
  //       toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
  //       navigate('/dashboard');
  //     } else {
  //       toast({ title: 'Login failed', description: 'Please check your credentials.', variant: 'destructive' });
  //     }
  //   } catch {
  //     toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };




  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const success = await login(email, password);

    if (success) {
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary mx-auto mb-4 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl"> Project Management Tool</CardTitle>
          <CardDescription>Sign in to manage your sprints and tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="role">Login as</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="tester">Tester</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
{/* 
          <div className="mt-6 p-3 bg-muted/50 border border-border text-sm">
            <p className="font-medium mb-1">Demo Credentials</p>
            <p className="text-muted-foreground text-xs">
              Enter any email and password (4+ chars). Select a role to see role-specific features.
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
