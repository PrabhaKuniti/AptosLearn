
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CourseProvider } from "@/contexts/CourseContext";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import UserCourses from "./pages/UserCourses";
import UserCourse from "./pages/UserCourse";
import UserLeaderboard from "./pages/UserLeaderboard";
import UserCertificates from "./pages/UserCertificates";
import UserResume from "./pages/UserResume";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStatistics from "./pages/AdminStatistics";
import AdminQuests from "./pages/AdminQuests";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="aptos-learn-theme">
      <CourseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* User Routes */}
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/user/courses" element={<UserCourses />} />
              <Route path="/user/courses/:courseId" element={<UserCourse />} />
              <Route path="/user/leaderboard" element={<UserLeaderboard />} />
              <Route path="/user/certificates" element={<UserCertificates />} />
              <Route path="/user/resume" element={<UserResume />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/statistics" element={<AdminStatistics />} />
              <Route path="/admin/quests" element={<AdminQuests />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CourseProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
