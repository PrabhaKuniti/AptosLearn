
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Save, X, Trash2, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCourses, ResumeEntryType, UserProfileType } from "@/contexts/CourseContext";
import { cn } from "@/lib/utils";

// Profile form schema
const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
});

// Manual course entry schema
const courseEntrySchema = z.object({
  courseName: z.string().min(3, {
    message: "Course name must be at least 3 characters.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  completionDate: z.string().min(1, {
    message: "Completion date is required.",
  }),
  skills: z.string().optional(),
});

export function ResumeEditor() {
  const { 
    userProfile, 
    updateUserProfile, 
    resumeEntries, 
    addManualResumeEntry, 
    updateResumeEntry,
    deleteResumeEntry 
  } = useCourses();
  
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [isEditEntryDialogOpen, setIsEditEntryDialogOpen] = useState(false);
  const [currentEditEntry, setCurrentEditEntry] = useState<ResumeEntryType | null>(null);

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userProfile.username,
      email: userProfile.email || "",
      bio: userProfile.bio || "",
      jobTitle: userProfile.jobTitle || "",
      location: userProfile.location || "",
    },
  });

  // Add course form
  const addCourseForm = useForm<z.infer<typeof courseEntrySchema>>({
    resolver: zodResolver(courseEntrySchema),
    defaultValues: {
      courseName: "",
      category: "",
      completionDate: new Date().toISOString().split('T')[0],
      skills: "",
    },
  });

  // Edit course form
  const editCourseForm = useForm<z.infer<typeof courseEntrySchema>>({
    resolver: zodResolver(courseEntrySchema),
    defaultValues: {
      courseName: "",
      category: "",
      completionDate: "",
      skills: "",
    },
  });

  // Reset profile form when dialog opens
  const handleProfileDialogOpen = (open: boolean) => {
    if (open) {
      profileForm.reset({
        username: userProfile.username,
        email: userProfile.email || "",
        bio: userProfile.bio || "",
        jobTitle: userProfile.jobTitle || "",
        location: userProfile.location || "",
      });
    }
    setIsProfileDialogOpen(open);
  };

  // Handle profile save
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    const updatedProfile: Partial<UserProfileType> = {
      username: data.username,
      email: data.email,
      bio: data.bio,
      jobTitle: data.jobTitle,
      location: data.location,
    };
    
    updateUserProfile(updatedProfile);
    setIsProfileDialogOpen(false);
  };

  // Handle adding a manual course
  const onAddCourseSubmit = (data: z.infer<typeof courseEntrySchema>) => {
    const skills = data.skills 
      ? data.skills.split(",").map(s => s.trim()).filter(s => s.length > 0) 
      : [];
    
    addManualResumeEntry({
      userId: userProfile.userId || "user1",
      username: userProfile.username,
      courseId: `manual-${Date.now()}`,
      courseName: data.courseName,
      category: data.category,
      completionDate: data.completionDate,
      skills,
    });
    
    addCourseForm.reset();
    setIsAddCourseDialogOpen(false);
  };

  // Handle edit entry button click
  const handleEditEntry = (entry: ResumeEntryType) => {
    setCurrentEditEntry(entry);
    
    editCourseForm.reset({
      courseName: entry.courseName,
      category: entry.category,
      completionDate: entry.completionDate,
      skills: entry.skills.join(", "),
    });
    
    setIsEditEntryDialogOpen(true);
  };

  // Handle edit submit
  const onEditEntrySubmit = (data: z.infer<typeof courseEntrySchema>) => {
    if (!currentEditEntry) return;
    
    const skills = data.skills 
      ? data.skills.split(",").map(s => s.trim()).filter(s => s.length > 0) 
      : [];
    
    updateResumeEntry(currentEditEntry.id, {
      courseName: data.courseName,
      category: data.category,
      completionDate: data.completionDate,
      skills,
    });
    
    setIsEditEntryDialogOpen(false);
    setCurrentEditEntry(null);
  };

  // Handle delete entry
  const handleDeleteEntry = (entry: ResumeEntryType) => {
    deleteResumeEntry(entry.id);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resume Profile</CardTitle>
          <Dialog open={isProfileDialogOpen} onOpenChange={handleProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <PenLine className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Resume Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information for your resume. Your username will appear on certificates.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>
                          This name will appear on your certificates and resume.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A brief description about yourself" 
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <div className="flex flex-col space-y-1">
              <h3 className="text-xl font-bold">{userProfile.username}</h3>
              {userProfile.jobTitle && <p className="text-muted-foreground">{userProfile.jobTitle}</p>}
            </div>
            
            {userProfile.email && (
              <p className="text-sm">{userProfile.email}</p>
            )}
            
            {userProfile.location && (
              <p className="text-sm text-muted-foreground">{userProfile.location}</p>
            )}
            
            {userProfile.bio && (
              <p className="pt-2 text-sm">{userProfile.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education & Courses</h2>
        
        <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Course</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Course to Resume</DialogTitle>
              <DialogDescription>
                Add a course you've completed outside the platform. These entries will be marked as unverified.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...addCourseForm}>
              <form onSubmit={addCourseForm.handleSubmit(onAddCourseSubmit)} className="space-y-4">
                <FormField
                  control={addCourseForm.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Blockchain" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addCourseForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Technology, Programming, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addCourseForm.control}
                  name="completionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Completion Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addCourseForm.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills (Comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Blockchain, Smart Contracts, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Add to Resume</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {resumeEntries.length > 0 ? (
        <div className="space-y-4">
          {resumeEntries.map((entry) => (
            <Card key={entry.id} className="relative">
              <CardContent className="pt-6 pb-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{entry.courseName}</h3>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{entry.category}</Badge>
                        
                        {entry.verified ? (
                          <Badge 
                            variant="outline" 
                            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                          >
                            Verified
                          </Badge>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Completed: {entry.completionDate}
                    </div>
                  </div>
                  
                  {entry.skills.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.skills.map((skill, i) => (
                          <Badge key={i} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteEntry(entry)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEntry(entry)}
                      disabled={entry.verified} // Verified entries can't be edited
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No courses in your resume yet.</p>
          <p className="text-muted-foreground text-sm">Complete courses or add them manually.</p>
        </div>
      )}
      
      {/* Edit Entry Dialog */}
      <Dialog open={isEditEntryDialogOpen} onOpenChange={setIsEditEntryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course Entry</DialogTitle>
            <DialogDescription>
              Update details for this course entry.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editCourseForm}>
            <form onSubmit={editCourseForm.handleSubmit(onEditEntrySubmit)} className="space-y-4">
              <FormField
                control={editCourseForm.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCourseForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCourseForm.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editCourseForm.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills (Comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditEntryDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
