
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useCourses } from "@/contexts/CourseContext";
import { CourseType } from "@/components/CourseCard";

const courseFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  reward: z.coerce.number().min(1, {
    message: "Reward must be at least 1 token.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  modules: z.array(
    z.object({
      title: z.string().min(3, "Module title must be at least 3 characters"),
      content: z.string().min(10, "Module content must be at least 10 characters"),
    })
  ).min(1, {
    message: "Course must have at least one module.",
  }),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

const defaultValues: Partial<CourseFormValues> = {
  title: "",
  description: "",
  category: "",
  difficulty: "Beginner",
  duration: "",
  reward: 10,
  imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
  modules: [
    { title: "Introduction", content: "Welcome to this course." },
  ],
};

interface CourseFormProps {
  onClose?: () => void;
}

export function CourseForm({ onClose }: CourseFormProps) {
  const { toast } = useToast();
  const { addCourse } = useCourses();
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: CourseFormValues) {
    // Convert form data to CourseType
    const newCourse: CourseType = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      modules: data.modules.length,
      reward: data.reward,
      image: data.imageUrl,
      progress: 0
    };
    
    // Add the course through the context
    addCourse(newCourse);
    
    toast({
      title: "Course created",
      description: "Your course has been published successfully and is now available to users.",
    });
    
    onClose?.();
  }

  const addModule = () => {
    const currentModules = form.getValues("modules") || [];
    form.setValue("modules", [
      ...currentModules,
      { title: "", content: "" },
    ]);
  };

  const removeModule = (index: number) => {
    const currentModules = form.getValues("modules");
    if (currentModules.length <= 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Course must have at least one module.",
      });
      return;
    }
    
    const updatedModules = currentModules.filter((_, i) => i !== index);
    form.setValue("modules", updatedModules);
  };

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create Course</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Blockchain">Blockchain</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Course description" 
                    className="resize-none min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. '2 hours', '4 weeks'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>APT Token Reward</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tokens awarded on completion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Use a URL for the course cover image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Course Modules</h3>
              <Button 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={addModule}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Module</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {form.watch("modules")?.map((_, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-md bg-muted/30"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Module {index + 1}</h4>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeModule(index)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`modules.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Module title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`modules.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Module content" 
                              className="resize-none min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                form.reset(defaultValues);
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                toast({
                  title: "Draft Saved",
                  description: "Your course has been saved as a draft.",
                });
                onClose?.();
              }}
            >
              Save as Draft
            </Button>
            <Button type="submit">Publish Course</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
