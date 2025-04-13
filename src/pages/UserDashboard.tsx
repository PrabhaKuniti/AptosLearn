
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Trophy, Clock, BadgeCheck } from "lucide-react";
import { NavSidebar } from "@/components/NavSidebar";
import { StatCard } from "@/components/StatCard";
import { RecentCourses } from "@/components/RecentCourses";
import { CourseCard } from "@/components/CourseCard";
import { useCourses } from "@/contexts/CourseContext";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { courses, loading } = useCourses();
  const [username, setUsername] = useState("Learner");
  
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "user") {
      navigate("/login");
    } else {
      // Get username from localStorage
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [navigate]);
  
  // Get recommended courses that aren't completed yet
  const recommendedCourses = courses
    .filter(course => course.progress !== 100)
    .slice(0, 3);
  
  return (
    <div className="flex h-screen">
      <NavSidebar isAdmin={false} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {username}!</h1>
            <p className="text-muted-foreground">
              Continue your learning journey and earn Aptos tokens.
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="APT Balance"
              value="120 APT"
              description="Your current token balance"
              icon={<Wallet className="h-5 w-5" />}
            />
            <StatCard
              title="Leaderboard Position"
              value="#24"
              description="Out of 1,255 learners"
              icon={<Trophy className="h-5 w-5" />}
            />
            <StatCard
              title="Learning Streak"
              value="7 days"
              description="Keep going to earn bonuses!"
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Certificates"
              value="4"
              description="Courses completed"
              icon={<BadgeCheck className="h-5 w-5" />}
            />
          </div>
          
          <div className="space-y-8">
            <RecentCourses />
            
            {recommendedCourses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onClick={() => navigate(`/user/courses/${course.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
