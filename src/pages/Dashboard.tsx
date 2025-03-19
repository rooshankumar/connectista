
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Languages, 
  User, 
  BookOpen,
  TrendingUp,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuth();
  
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.full_name || 'Friend'}
          </h1>
          <p className="text-muted-foreground">
            Connect with language partners and improve your skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Your Chats</CardTitle>
              <MessageCircle className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Connect with language partners through real-time chat
              </CardDescription>
              <Button asChild className="w-full">
                <Link to="/chat">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Find Partners</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Discover language partners who match your learning goals
              </CardDescription>
              <Button asChild className="w-full">
                <Link to="/partners">Browse Partners</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Your Profile</CardTitle>
              <User className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Update your profile and language preferences
              </CardDescription>
              <Button asChild className="w-full">
                <Link to="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Language Resources</CardTitle>
              <BookOpen className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Access learning materials and helpful resources
              </CardDescription>
              <Button asChild className="w-full">
                <Link to="/resources">Explore Resources</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Translation Help</CardTitle>
              <Languages className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Get help translating difficult phrases and expressions
              </CardDescription>
              <Button asChild className="w-full">
                <Link to="/translate">Translate Now</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">Progress</CardTitle>
              <TrendingUp className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Track your language learning progress over time
              </CardDescription>
              <Button asChild className="w-full">
                <Link to="/progress">View Progress</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
