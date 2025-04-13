
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CourseType } from '@/components/CourseCard';
import { toast } from "@/components/ui/use-toast";

// Define certificate type
export interface CertificateType {
  id: string;
  userId: string;
  username: string; // Username field for certificates
  courseId: string;
  courseName: string;
  issueDate: string;
  tokenReward: number;
  blockchain: boolean;
  verified: boolean; // Added verified field
}

// Define resume entry type
export interface ResumeEntryType {
  id: string;
  userId: string;
  username: string; // Username field for resume entries
  courseId: string;
  courseName: string;
  category: string;
  completionDate: string;
  skills: string[];
  verified: boolean; // Added verified field
}

// Define user profile type
export interface UserProfileType {
  userId: string;
  username: string;
  email?: string;
  bio?: string;
  jobTitle?: string;
  skills?: string[];
  location?: string;
}

// Define user progress type
export interface UserProgressType {
  userId: string;
  courseId: string;
  progress: number;
  lastUpdated: string;
  startDate: string;
  completionDate?: string;
}

// Define the context type
interface CourseContextType {
  courses: CourseType[];
  addCourse: (course: CourseType) => void;
  updateCourse: (id: string, courseData: Partial<CourseType>) => void;
  deleteCourse: (id: string) => void;
  userProgress: UserProgressType[];
  updateUserProgress: (userId: string, courseId: string, progress: number) => void;
  certificates: CertificateType[];
  resumeEntries: ResumeEntryType[];
  userProfile: UserProfileType;
  updateUserProfile: (profileData: Partial<UserProfileType>) => void;
  addManualResumeEntry: (entry: Omit<ResumeEntryType, "id" | "verified">) => void;
  updateResumeEntry: (id: string, entryData: Partial<ResumeEntryType>) => void;
  deleteResumeEntry: (id: string) => void;
  loading: boolean;
}

// Create the context with default values
const CourseContext = createContext<CourseContextType>({
  courses: [],
  addCourse: () => {},
  updateCourse: () => {},
  deleteCourse: () => {},
  userProgress: [],
  updateUserProgress: () => {},
  certificates: [],
  resumeEntries: [],
  userProfile: { userId: "", username: "" },
  updateUserProfile: () => {},
  addManualResumeEntry: () => {},
  updateResumeEntry: () => {},
  deleteResumeEntry: () => {},
  loading: true,
});

// Sample courses data
const sampleCourses: CourseType[] = [
  {
    id: "1",
    title: "Introduction to Blockchain",
    description: "Learn the fundamentals of blockchain technology and how it works.",
    category: "Technology",
    difficulty: "Beginner",
    duration: "4 weeks",
    modules: 5,
    reward: 50,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    progress: 65,
  },
  {
    id: "2",
    title: "Aptos Move Programming",
    description: "Master the Move programming language used in the Aptos blockchain.",
    category: "Programming",
    difficulty: "Intermediate",
    duration: "6 weeks",
    modules: 12,
    reward: 80,
    image: "https://images.unsplash.com/photo-1639322537194-7d80dad34c4b",
    progress: 25,
  },
  {
    id: "3",
    title: "Blockchain Security",
    description: "Learn about the security aspects of blockchain technology and how to secure your applications.",
    category: "Security",
    difficulty: "Advanced",
    duration: "8 weeks",
    modules: 9,
    reward: 120,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    progress: 0,
  },
  {
    id: "4",
    title: "Web3 Fundamentals",
    description: "Understand the basics of Web3 and decentralized applications.",
    category: "Technology",
    difficulty: "Beginner",
    duration: "3 weeks",
    modules: 7,
    reward: 45,
    image: "https://images.unsplash.com/photo-1558494950-09c6ca35c218",
    progress: 100,
  },
];

// Sample user progress data
const sampleUserProgress: UserProgressType[] = [
  {
    userId: "user1",
    courseId: "1",
    progress: 65,
    lastUpdated: "2025-04-10",
    startDate: "2025-03-15",
  },
  {
    userId: "user1",
    courseId: "2",
    progress: 25,
    lastUpdated: "2025-04-05",
    startDate: "2025-03-25",
  },
  {
    userId: "user1",
    courseId: "4",
    progress: 100,
    lastUpdated: "2025-03-20",
    startDate: "2025-03-01",
    completionDate: "2025-03-20",
  },
];

// Sample certificates data
const sampleCertificates: CertificateType[] = [
  {
    id: "cert-001",
    userId: "user1",
    username: "Learner", // Default username
    courseId: "4",
    courseName: "Web3 Fundamentals",
    issueDate: "2025-03-20",
    tokenReward: 45,
    blockchain: true,
    verified: true, // Verified certificate
  },
];

// Sample resume entries
const sampleResumeEntries: ResumeEntryType[] = [
  {
    id: "resume-001",
    userId: "user1",
    username: "Learner", // Default username
    courseId: "4",
    courseName: "Web3 Fundamentals",
    category: "Technology",
    completionDate: "2025-03-20",
    skills: ["Web3", "Blockchain Basics", "Decentralized Applications"],
    verified: true, // Verified entry
  },
  {
    id: "resume-002",
    userId: "user1",
    username: "Learner", // Default username
    courseId: "manual-1",
    courseName: "Introduction to Cryptocurrency",
    category: "Finance",
    completionDate: "2024-12-15",
    skills: ["Crypto", "Bitcoin", "Digital Assets"],
    verified: false, // Manually added (unverified) entry
  },
];

// Sample user profile
const sampleUserProfile: UserProfileType = {
  userId: "user1",
  username: "Learner",
  email: "learner@example.com",
  bio: "Blockchain enthusiast and continuous learner",
  jobTitle: "Software Developer",
  skills: ["JavaScript", "React", "Blockchain"],
  location: "New York, USA"
};

// Helper function to initialize data from localStorage or fall back to sample data
const initializeDataFromStorage = <T extends unknown>(key: string, sampleData: T): T => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    try {
      return JSON.parse(storedData) as T;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return sampleData;
    }
  }
  return sampleData;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // Initialize state from localStorage or fall back to sample data
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgressType[]>([]);
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [resumeEntries, setResumeEntries] = useState<ResumeEntryType[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileType>({userId: "", username: ""});

  // Load data from localStorage on initial render
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setCourses(initializeDataFromStorage('courses', sampleCourses));
      setUserProgress(initializeDataFromStorage('userProgress', sampleUserProgress));
      setCertificates(initializeDataFromStorage('certificates', sampleCertificates));
      setResumeEntries(initializeDataFromStorage('resumeEntries', sampleResumeEntries));
      setUserProfile(initializeDataFromStorage('userProfile', sampleUserProfile));
      setLoading(false);
    }, 1000);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('courses', JSON.stringify(courses));
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
      localStorage.setItem('certificates', JSON.stringify(certificates));
      localStorage.setItem('resumeEntries', JSON.stringify(resumeEntries));
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [courses, userProgress, certificates, resumeEntries, userProfile, loading]);

  const addCourse = (course: CourseType) => {
    const newCourse = {
      ...course,
      id: Date.now().toString(), // Simple ID generation
      progress: 0, // New courses start with 0 progress for users
    };
    
    setCourses((prevCourses) => [...prevCourses, newCourse]);
    
    // Show a toast notification
    toast({
      title: "New Course Added",
      description: `The course "${course.title}" has been added to the platform.`,
    });
  };

  const updateCourse = (id: string, courseData: Partial<CourseType>) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id ? { ...course, ...courseData } : course
      )
    );
  };

  const deleteCourse = (id: string) => {
    // Remove the course
    setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
    
    // Clean up related user progress
    setUserProgress((prevProgress) => 
      prevProgress.filter((progress) => progress.courseId !== id)
    );
    
    // Clean up related certificates
    setCertificates((prevCertificates) => 
      prevCertificates.filter((cert) => cert.courseId !== id)
    );
    
    // Clean up related resume entries
    setResumeEntries((prevEntries) => 
      prevEntries.filter((entry) => entry.courseId !== id)
    );
    
    toast({
      title: "Course Deleted",
      description: "The course and all related user data have been removed.",
    });
  };

  const updateUserProgress = (userId: string, courseId: string, progress: number) => {
    const now = new Date().toISOString().split('T')[0];
    const existingProgressIndex = userProgress.findIndex(
      (p) => p.userId === userId && p.courseId === courseId
    );

    if (existingProgressIndex >= 0) {
      // Update existing progress
      setUserProgress((prev) => {
        const updated = [...prev];
        updated[existingProgressIndex] = {
          ...updated[existingProgressIndex],
          progress,
          lastUpdated: now,
          // If progress is 100%, set completionDate
          ...(progress === 100 && !updated[existingProgressIndex].completionDate && { completionDate: now }),
        };
        return updated;
      });

      // If course is newly completed, generate certificate and add to resume
      if (progress === 100 && (!userProgress[existingProgressIndex].completionDate || userProgress[existingProgressIndex].progress < 100)) {
        const completedCourse = courses.find((c) => c.id === courseId);
        
        if (completedCourse) {
          // Get current username from userProfile
          const username = userProfile.username || "Learner";
          const email = userProfile.email || "";
          
          // Check if certificate already exists
          const existingCertificate = certificates.find(
            cert => cert.userId === userId && cert.courseId === courseId
          );

          // Only create certificate if it doesn't exist
          if (!existingCertificate) {
            // Generate certificate
            const newCertificate: CertificateType = {
              id: `cert-${Date.now()}`,
              userId,
              username, // Use current username
              courseId,
              courseName: completedCourse.title,
              issueDate: now,
              tokenReward: completedCourse.reward,
              blockchain: true,
              verified: true, // Platform-verified certificate
            };
            setCertificates((prev) => [...prev, newCertificate]);
            
            // Check if resume entry already exists
            const existingEntry = resumeEntries.find(
              entry => entry.userId === userId && entry.courseId === courseId
            );
            
            // Only create resume entry if it doesn't exist
            if (!existingEntry) {
              // Add to resume
              const newResumeEntry: ResumeEntryType = {
                id: `resume-${Date.now()}`,
                userId,
                username, // Use current username
                courseId,
                courseName: completedCourse.title,
                category: completedCourse.category,
                completionDate: now,
                skills: [completedCourse.category, `${completedCourse.difficulty} Level`, "Aptos Ecosystem"],
                verified: true, // Platform-verified entry
              };
              setResumeEntries((prev) => [...prev, newResumeEntry]);
            }
            
            toast({
              title: "Course Completed!",
              description: `Congratulations! You've earned a verified certificate for completing ${completedCourse.title}.`,
            });
          }
        }
      }
    } else {
      // Create new progress entry
      setUserProgress((prev) => [
        ...prev,
        {
          userId,
          courseId,
          progress,
          startDate: now,
          lastUpdated: now,
          ...(progress === 100 && { completionDate: now }),
        },
      ]);
    }

    // Update the course's progress in the UI
    updateCourse(courseId, { progress });
  };

  // New function to update user profile
  const updateUserProfile = (profileData: Partial<UserProfileType>) => {
    setUserProfile(prev => {
      const updatedProfile = { ...prev, ...profileData };
      
      // If username is updated, update all certificates and resume entries
      if (profileData.username && profileData.username !== prev.username) {
        // Update certificates
        setCertificates(prevCerts => 
          prevCerts.map(cert => 
            cert.userId === prev.userId ? { ...cert, username: profileData.username as string } : cert
          )
        );
        
        // Update resume entries
        setResumeEntries(prevEntries => 
          prevEntries.map(entry => 
            entry.userId === prev.userId ? { ...entry, username: profileData.username as string } : entry
          )
        );
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated, including your username across certificates and resume.",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully updated.",
        });
      }
      
      return updatedProfile;
    });
  };

  // Add a manual entry to resume (unverified)
  const addManualResumeEntry = (entry: Omit<ResumeEntryType, "id" | "verified">) => {
    const newEntry: ResumeEntryType = {
      ...entry,
      id: `manual-${Date.now()}`,
      verified: false, // Manual entries are unverified
    };
    
    setResumeEntries(prev => [...prev, newEntry]);
    
    toast({
      title: "Course Added to Resume",
      description: "Your course has been added to your resume as an unverified entry.",
    });
  };

  // Update a resume entry
  const updateResumeEntry = (id: string, entryData: Partial<ResumeEntryType>) => {
    // Don't allow changing verification status for platform-verified entries
    const entry = resumeEntries.find(e => e.id === id);
    if (entry?.verified && entryData.hasOwnProperty('verified')) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Cannot change verification status of platform-verified entries.",
      });
      return;
    }
    
    setResumeEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...entryData } : entry
      )
    );
    
    toast({
      title: "Resume Updated",
      description: "Your resume entry has been successfully updated.",
    });
  };

  // Delete a resume entry
  const deleteResumeEntry = (id: string) => {
    // Check if this is a verified entry
    const entry = resumeEntries.find(e => e.id === id);
    if (entry?.verified) {
      // For verified entries, we'll require additional confirmation
      if (!window.confirm("This is a verified course entry. Deleting it won't affect your certificate, but it will remove it from your resume. Continue?")) {
        return;
      }
    }
    
    setResumeEntries(prev => prev.filter(entry => entry.id !== id));
    
    toast({
      title: "Resume Entry Removed",
      description: "The entry has been removed from your resume.",
    });
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      addCourse, 
      updateCourse, 
      deleteCourse, 
      userProgress, 
      updateUserProgress, 
      certificates, 
      resumeEntries,
      userProfile,
      updateUserProfile,
      addManualResumeEntry,
      updateResumeEntry,
      deleteResumeEntry,
      loading 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);
