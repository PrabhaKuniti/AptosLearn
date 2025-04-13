
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Award, CheckCircle, Clock, Gift, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { NavSidebar } from "@/components/NavSidebar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Certificate } from "@/components/Certificate";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/contexts/CourseContext";

interface CourseModule {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  reward: number;
  image: string;
  progress?: number; // Make progress optional to fix the type error
  modules: CourseModule[];
}

export default function UserCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const { courses, userProfile, updateUserProgress } = useCourses();
  
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "user") {
      navigate("/login");
    }

    // Find the specific course from our courses list based on courseId parameter
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (foundCourse) {
      // Create course data with modules
      const mockModules: CourseModule[] = [
        {
          id: "m1",
          title: "What is " + foundCourse.title + "?",
          content: "This is an introduction to " + foundCourse.title + ". " + foundCourse.description,
          completed: foundCourse.progress >= 20
        },
        {
          id: "m2",
          title: "Core Concepts",
          content: "Learning the fundamental concepts of " + foundCourse.title + " will help you understand how it works and how it can be applied in various scenarios.",
          completed: foundCourse.progress >= 40
        },
        {
          id: "m3",
          title: "Advanced Topics",
          content: "Now that you understand the basics, let's dive deeper into more advanced topics related to " + foundCourse.title + ".",
          completed: foundCourse.progress >= 60
        },
        {
          id: "m4",
          title: "Practical Applications",
          content: "Let's look at some real-world applications of " + foundCourse.title + " and how it's being used in industry today.",
          completed: foundCourse.progress >= 80
        },
        {
          id: "m5",
          title: "Final Assessment",
          content: "Complete this final assessment to demonstrate your understanding of " + foundCourse.title + " and earn your certificate.",
          completed: foundCourse.progress >= 100
        }
      ];

      setCourse({
        ...foundCourse,
        modules: mockModules,
        progress: foundCourse.progress || 0, // Ensure progress always has a value
      });

      // Set current module index based on progress
      const completedModuleCount = Math.floor(((foundCourse.progress || 0) / 100) * 5);
      setCurrentModuleIndex(completedModuleCount < 5 ? completedModuleCount : 4);
    } else {
      // If course not found, redirect to courses page
      toast({
        title: "Course not found",
        description: "The requested course could not be found.",
        variant: "destructive"
      });
      navigate("/user/courses");
    }
  }, [courseId, navigate, courses, toast]);
  
  if (!course) {
    return (
      <div className="flex h-screen">
        <NavSidebar isAdmin={false} />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }
  
  const handleCompleteModule = () => {
    if (!course) return;
    
    const updatedModules = [...course.modules];
    updatedModules[currentModuleIndex].completed = true;
    
    const completedCount = updatedModules.filter(m => m.completed).length;
    const newProgress = Math.floor((completedCount / updatedModules.length) * 100);
    
    setCourse({
      ...course,
      modules: updatedModules,
      progress: newProgress
    });
    
    // Update user progress in CourseContext
    updateUserProgress("user1", course.id, newProgress);
    
    toast({
      title: "Module Completed",
      description: "Your progress has been saved.",
    });
    
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    } else if (newProgress === 100) {
      toast({
        title: "Course Completed!",
        description: `You've earned ${course.reward} APT tokens!`,
      });
      setShowCertificate(true);
    }
  };
  
  const currentModule = course.modules[currentModuleIndex];
  const allModulesCompleted = course.progress === 100;
  
  return (
    <div className="flex h-screen">
      <NavSidebar isAdmin={false} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate("/user/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <div className="flex items-center gap-2 mt-2 mb-4">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge 
                      variant="outline"
                      className={
                        course.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : course.difficulty === "Intermediate"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                      }
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground">{course.description}</p>
                  
                  <div className="flex gap-4 mt-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course.reward} APT Reward</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    {currentModule.title}
                  </h2>
                  
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p>{currentModule.content}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleCompleteModule}>
                      {currentModuleIndex < course.modules.length - 1 
                        ? "Complete & Continue" 
                        : "Complete Course"}
                    </Button>
                  </div>
                </div>
                
                {allModulesCompleted && (
                  <Alert className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900">
                    <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-400" />
                    <AlertTitle className="text-green-700 dark:text-green-400">Course Completed!</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-300">
                      You've successfully completed this course and earned {course.reward} APT tokens.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border p-6">
                <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
                
                <div className="mb-2 flex justify-between text-sm">
                  <span>Your Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2 mb-6" />
                
                <h3 className="font-medium text-sm text-muted-foreground mb-3">MODULES</h3>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div 
                      key={module.id}
                      className={`p-3 rounded-md border flex items-center gap-3 cursor-pointer transition-colors ${
                        index === currentModuleIndex 
                          ? "bg-primary/10 border-primary/20" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        if (module.completed || index <= currentModuleIndex) {
                          setCurrentModuleIndex(index);
                        } else {
                          toast({
                            title: "Module Locked",
                            description: "Complete the previous modules first.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <div className="flex-shrink-0">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : index <= currentModuleIndex ? (
                          <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className={`text-sm ${module.completed ? "line-through text-muted-foreground" : ""}`}>
                        {module.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {allModulesCompleted && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Gift className="h-5 w-5" />
                      <span className="font-medium">
                        {course.reward} APT Earned
                      </span>
                    </div>
                    
                    <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
                      <DialogTrigger asChild>
                        <Button className="w-full">View Certificate</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Your Certificate of Completion</DialogTitle>
                          <DialogDescription>
                            Congratulations on completing the course!
                          </DialogDescription>
                        </DialogHeader>
                        <Certificate 
                          name={userProfile.username}
                          courseName={course.title}
                          date={new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          tokenReward={course.reward}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
