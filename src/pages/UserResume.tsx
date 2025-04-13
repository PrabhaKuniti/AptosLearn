
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Share2, Users, Award, ShieldCheck, AlertTriangle, Briefcase } from "lucide-react";
import { NavSidebar } from "@/components/NavSidebar";
import { ResumeEditor } from "@/components/ResumeEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/contexts/CourseContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function UserResume() {
  const navigate = useNavigate();
  const { resumeEntries, userProfile, certificates, loading } = useCourses();
  
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "user" && userType !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const verifiedCertificates = certificates.filter(cert => cert.verified).length;
  const totalCertificates = certificates.length;
  
  const handleDownloadResume = () => {
    // This is a placeholder for actual resume download functionality
    alert("Resume download functionality would be implemented here");
  };
  
  const handleShareResume = () => {
    // This is a placeholder for actual resume sharing functionality
    alert("Resume sharing functionality would be implemented here");
  };
  
  // Create a view-only version of the resume for preview mode
  const ResumeView = () => (
    <div className="space-y-6">
      <div className="p-6 border rounded-md bg-white dark:bg-slate-900">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <h2 className="text-2xl font-bold">{userProfile.username}</h2>
            {userProfile.jobTitle && <p className="text-muted-foreground">{userProfile.jobTitle}</p>}
          </div>
          
          {userProfile.email && (
            <p>{userProfile.email}</p>
          )}
          
          {userProfile.location && (
            <p className="text-muted-foreground">{userProfile.location}</p>
          )}
          
          {userProfile.bio && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Bio</p>
              <p>{userProfile.bio}</p>
            </div>
          )}
          
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Education & Certifications</h3>
            </div>
            <div className="mt-2 space-y-4">
              {resumeEntries.map((entry) => (
                <div key={entry.id} className="pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{entry.courseName}</h4>
                        {entry.verified ? (
                          <Badge 
                            variant="outline" 
                            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Verified</span>
                          </Badge>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Unverified</span>
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{entry.category}</p>
                    </div>
                    
                    <div className="text-sm">
                      Completed: {entry.completionDate}
                    </div>
                  </div>
                  
                  {entry.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {resumeEntries.length === 0 && (
                <p className="text-muted-foreground py-4">No courses or certifications added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleDownloadResume}
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          onClick={handleShareResume}
        >
          <Share2 className="h-4 w-4" />
          <span>Share Resume</span>
        </Button>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex h-screen">
        <NavSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Resume</h1>
              <p className="text-muted-foreground">Showcase your skills and achievements</p>
            </header>
            <div className="grid gap-6">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Resume</h1>
                <p className="text-muted-foreground">Showcase your skills and achievements</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Certificates</p>
                    <p className="text-xs text-muted-foreground">
                      {verifiedCertificates}/{totalCertificates} Verified
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Learning Record</p>
                    <p className="text-xs text-muted-foreground">AptosLearn Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <Tabs defaultValue="view">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="view">View Resume</TabsTrigger>
              <TabsTrigger value="edit">Edit Resume</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <ResumeView />
            </TabsContent>
            
            <TabsContent value="edit">
              <ResumeEditor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
