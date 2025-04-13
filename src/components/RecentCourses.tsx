
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Award, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CourseForm } from "@/components/CourseForm";
import { useCourses } from "@/contexts/CourseContext";
import { CourseType } from "@/components/CourseCard";
import { useToast } from "@/components/ui/use-toast";

interface RecentActivityProps {
  isAdmin?: boolean;
}

export function RecentCourses({ isAdmin = false }: RecentActivityProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    courses, 
    userProgress, 
    deleteCourse, 
    updateUserProgress,
    certificates 
  } = useCourses();
  
  const difficultyColor = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
  };

  const getStatusBadge = (progress: number) => {
    if (progress === 0) return (
      <Badge variant="outline" className="bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
        Not started
      </Badge>
    );
    
    if (progress === 100) return (
      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
        <Award className="h-3 w-3" />
        Completed
      </Badge>
    );
    
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        In Progress ({progress}%)
      </Badge>
    );
  };

  const recentCourses = isAdmin 
    ? courses.slice(-4).reverse() 
    : courses.filter(course => {
        return true;
      }).slice(-4).reverse();
  
  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course? This will remove it for all users.")) {
      deleteCourse(courseId);
    }
  };
  
  const handleContinueCourse = (courseId: string) => {
    navigate(`/user/courses/${courseId}`);
  };
  
  const handleViewCertificate = (courseId: string) => {
    navigate(`/user/certificates`);
  };
  
  const handleUnenroll = (courseId: string) => {
    updateUserProgress("user1", courseId, 0);
    toast({
      title: "Course Unenrolled",
      description: "You have been unenrolled from this course.",
    });
  };

  const hasCertificate = (courseId: string) => {
    return certificates.some(cert => cert.courseId === courseId && cert.userId === "user1");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isAdmin ? "Recent Courses" : "Your Courses"}
        </h2>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Course</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
              <CourseForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              {isAdmin ? (
                <>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead>Status</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                </>
              )}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCourses.map((course: CourseType) => {
              const courseProgress = userProgress.find(p => p.courseId === course.id && p.userId === "user1");
              const progress = courseProgress?.progress || course.progress || 0;
              const hasCourseCertificate = hasCertificate(course.id);
              
              return (
                <TableRow 
                  key={course.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => !isAdmin && navigate(`/user/courses/${course.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {hasCourseCertificate && <Award className="h-4 w-4 text-yellow-500" />}
                      {course.title}
                    </div>
                  </TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        difficultyColor[course.difficulty as keyof typeof difficultyColor]
                      )}
                    >
                      {course.difficulty}
                    </Badge>
                  </TableCell>
                  {isAdmin ? (
                    <>
                      <TableCell className="text-right">
                        {userProgress.filter(p => p.courseId === course.id).length}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Published
                        </Badge>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        {courseProgress ? courseProgress.startDate : "Not started"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(progress)}
                      </TableCell>
                    </>
                  )}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => 
                          isAdmin 
                            ? navigate(`/admin/quests/${course.id}`) 
                            : navigate(`/user/courses/${course.id}`)
                        }>
                          View Details
                        </DropdownMenuItem>
                        {isAdmin ? (
                          <>
                            <DropdownMenuItem>Edit Course</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            {progress === 100 ? (
                              <DropdownMenuItem 
                                className="flex items-center gap-2"
                                onClick={() => handleViewCertificate(course.id)}
                              >
                                <Award className="h-4 w-4" />
                                View Certificate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleContinueCourse(course.id)}>
                                Continue
                              </DropdownMenuItem>
                            )}
                            {progress === 100 && (
                              <DropdownMenuItem 
                                className="flex items-center gap-2"
                                onClick={() => navigate(`/user/resume`)}
                              >
                                <Briefcase className="h-4 w-4" />
                                View in Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleUnenroll(course.id)}>
                              Unenroll
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
