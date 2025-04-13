
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Award, BarChart3, TrendingUp } from "lucide-react";
import { NavSidebar } from "@/components/NavSidebar";
import { StatCard } from "@/components/StatCard";
import { RecentCourses } from "@/components/RecentCourses";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
  
  return (
    <div className="flex h-screen">
      <NavSidebar isAdmin={true} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Admin. Here's an overview of the platform's activity.
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value="1,255"
              description="Active learners on the platform"
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Active Courses"
              value="32"
              description="Published learning materials"
              icon={<BookOpen className="h-5 w-5" />}
              trend={{ value: 4, positive: true }}
            />
            <StatCard
              title="Certificates Issued"
              value="876"
              description="Course completions this month"
              icon={<Award className="h-5 w-5" />}
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              title="Tokens Distributed"
              value="12,430 APT"
              description="Rewards for learning activities"
              icon={<TrendingUp className="h-5 w-5" />}
              trend={{ value: 3, positive: false }}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <RecentCourses isAdmin={true} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Activity Overview</h2>
              <div className="bg-white dark:bg-slate-900 border rounded-md p-4 h-96 flex items-center justify-center">
                <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                <p className="text-muted-foreground">Activity chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
