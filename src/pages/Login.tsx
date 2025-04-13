
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCourses } from "@/contexts/CourseContext";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  username: z.string().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { updateUserProfile } = useCourses();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      // For regular user login
      localStorage.setItem("userType", "user");
      
      // If username is provided, update the user profile and use it for certificates
      if (values.username && values.username.trim()) {
        localStorage.setItem("username", values.username.trim());
        
        // Update the user profile with the username and email
        updateUserProfile({
          userId: "user1",
          username: values.username.trim(),
          email: values.email
        });
      } else {
        // If no username is provided, use the email as the username
        const emailUsername = values.email.split('@')[0];
        localStorage.setItem("username", emailUsername);
        
        // Update the user profile with the email as username
        updateUserProfile({
          userId: "user1",
          username: emailUsername,
          email: values.email
        });
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome${values.username ? `, ${values.username}` : ""}! You're now logged in.`,
      });
      
      // Redirect to user dashboard
      navigate("/user");
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-aptos-blue to-aptos-purple flex items-center justify-center">
            <span className="text-white font-bold text-xl">AE</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">AptosLearn</h1>
        <p className="text-muted-foreground">Learn and earn with Aptos blockchain</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="wallet" disabled>
              Wallet
              <span className="ml-2 text-[10px] bg-muted px-1 rounded">Soon</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name (for certificates)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter your full name" 
                              className="pl-9"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          This name will appear on your certificates and resume
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
                
                <CardFooter className="flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full flex gap-2"
                    disabled={loading}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{loading ? "Signing In..." : "Sign In"}</span>
                  </Button>
                  
                  <div className="w-full text-center">
                    <Button
                      variant="link"
                      onClick={() => navigate("/admin-login")}
                      className="text-muted-foreground text-sm"
                    >
                      Administrator Login
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        For demo purposes: <br />
        - Use any email to login as a regular user<br />
        - Use the admin login for administrative access
      </p>
    </div>
  );
}
