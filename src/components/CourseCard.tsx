
import { Award, Clock, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCourses } from "@/contexts/CourseContext";

export interface CourseType {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: number;
  reward: number;
  image: string;
  progress?: number;
}

interface CourseCardProps {
  course: CourseType;
  userView?: boolean;
  onClick?: () => void;
}

export function CourseCard({ course, userView = true, onClick }: CourseCardProps) {
  const { userProgress, updateUserProgress } = useCourses();
  
  const difficultyColor = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };
  
  // Get user's progress for this course
  const courseProgress = userView 
    ? userProgress.find(p => p.courseId === course.id && p.userId === "user1")?.progress 
    : undefined;
    
  // Use courseProgress if available, otherwise fall back to course.progress
  const progressValue = courseProgress !== undefined ? courseProgress : (course.progress || 0);

  const getProgressStatus = () => {
    if (!progressValue) return "Not Started";
    if (progressValue === 100) return "Completed";
    return "In Progress";
  };

  const getStatusColor = () => {
    if (!progressValue) return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400";
    if (progressValue === 100) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  };

  const handleStartCourse = () => {
    if (userView) {
      // Start or update progress to 10% when clicking "Start Course"
      if (progressValue === 0) {
        updateUserProgress("user1", course.id, 10);
      }
      
      // Call the onClick handler if provided
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge variant="outline" className={cn("font-medium", difficultyColor[course.difficulty])}>
            {course.difficulty}
          </Badge>
          
          {userView && progressValue !== undefined && (
            <Badge variant="outline" className={cn("font-medium", getStatusColor())}>
              {getProgressStatus()}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit">
            {course.category}
          </Badge>
          
          <h3 className="font-semibold text-lg leading-tight">{course.title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>
        
        {userView && progressValue !== undefined && progressValue > 0 && progressValue < 100 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progressValue}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-in-out" 
                style={{ width: `${progressValue}%` }} 
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>{course.modules} modules</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{course.reward} APT</span>
          </div>
        </div>
        
        {userView ? (
          <Button 
            variant="default" 
            asChild={!onClick} 
            className="w-full"
            onClick={onClick ? handleStartCourse : undefined}
          >
            {onClick ? (
              <div className="flex items-center justify-center gap-2">
                {progressValue === 100 ? "View Details" : "Start Course"}
                <ArrowRight className="h-4 w-4" />
              </div>
            ) : (
              <Link to={`/user/courses/${course.id}`} className="flex items-center justify-center gap-2">
                {progressValue === 100 ? "View Details" : "Start Course"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" asChild className="flex-1">
              <Link to={`/admin/quests/${course.id}`}>Edit</Link>
            </Button>
            <Button variant="default" className="flex-1">
              <Link to={`/admin/quests/${course.id}`}>View</Link>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
