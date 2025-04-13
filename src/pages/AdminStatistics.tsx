
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BarChart3, BookOpen, Award, TrendingUp, Calendar } from "lucide-react";
import { NavSidebar } from "@/components/NavSidebar";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminStatistics() {
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
            <h1 className="text-3xl font-bold mb-2">Platform Statistics</h1>
            <p className="text-muted-foreground">
              Detailed analytics and metrics for the Aptos Learn-to-Earn platform
            </p>
          </header>
          
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="rewards">Token Rewards</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                      <SelectItem value="quarter">Last 3 months</SelectItem>
                      <SelectItem value="year">Last 12 months</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <TabsContent value="overview" className="mt-6">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                        <p className="text-muted-foreground">User growth chart will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                        <p className="text-muted-foreground">Course engagement chart will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                      <p className="text-muted-foreground">Platform activity chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    title="New Users"
                    value="175"
                    description="Last 30 days"
                    icon={<Users className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Active Users"
                    value="842"
                    description="Monthly active users"
                    icon={<Users className="h-5 w-5" />}
                  />
                  <StatCard
                    title="User Retention"
                    value="78%"
                    description="30-day retention rate"
                    icon={<Users className="h-5 w-5" />}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                        <p className="text-muted-foreground">User demographics chart will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="courses" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    title="Total Courses"
                    value="32"
                    description="Published on platform"
                    icon={<BookOpen className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Course Completions"
                    value="876"
                    description="All time completions"
                    icon={<Award className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Avg. Completion Rate"
                    value="67%"
                    description="Across all courses"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                        <p className="text-muted-foreground">Course performance chart will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="rewards" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatCard
                    title="Total Tokens Rewarded"
                    value="12,430 APT"
                    description="All time distribution"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Monthly Rewards"
                    value="1,843 APT"
                    description="Last 30 days"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Avg. Reward per User"
                    value="9.9 APT"
                    description="Per active user"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Token Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <BarChart3 className="h-24 w-24 text-muted-foreground/40" />
                        <p className="text-muted-foreground">Token distribution chart will be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
