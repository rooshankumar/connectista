
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, Book, Clock, Award } from 'lucide-react';

const Profile = () => {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <ProfileCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Language Skills</CardTitle>
                <CardDescription>Your current language levels</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">English</span>
                    <Badge>Native</Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-full bg-primary rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Spanish</span>
                    <Badge variant="outline">Intermediate</Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-3/5 bg-primary rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Japanese</span>
                    <Badge variant="outline">Beginner</Badge>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full w-1/4 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your language learning milestones</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Conversation Starter</p>
                    <p className="text-sm text-muted-foreground">Completed 5 conversations</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Book className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Vocabulary Builder</p>
                    <p className="text-sm text-muted-foreground">Learned 100 new words</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Dedicated Learner</p>
                    <p className="text-sm text-muted-foreground">30 day streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
