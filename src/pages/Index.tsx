
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "@/contexts/CourseContext";

const Index = () => {
  const navigate = useNavigate();
  const { loading } = useCourses();

  useEffect(() => {
    if (loading) return; // Wait until the course data is loaded

    // Check if user is logged in, otherwise redirect to login page
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') {
      navigate('/admin');
    } else if (userType === 'user') {
      navigate('/user');
    } else {
      navigate('/login');
    }
  }, [navigate, loading]);

  // Show a simple loading state while determining where to redirect
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">AptosLearn</h1>
        <p className="text-muted-foreground">Loading your learning experience...</p>
      </div>
    </div>
  );
};

export default Index;
