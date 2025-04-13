
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Award, Users, Medal } from "lucide-react";
import { NavSidebar } from "@/components/NavSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  aptEarned: number;
  completedCourses: number;
  streak: number;
  isCurrentUser?: boolean;
}

export default function UserLeaderboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "user") {
      navigate("/login");
    }
  }, [navigate]);
  
  // Sample leaderboard data
  const leaderboardData: LeaderboardUser[] = [
    {
      rank: 1,
      username: "BlockchainMaster",
      avatar: "BM",
      score: 3850,
      aptEarned: 520,
      completedCourses: 18,
      streak: 45
    },
    {
      rank: 2,
      username: "CryptoQueen",
      avatar: "CQ",
      score: 3720,
      aptEarned: 480,
      completedCourses: 15,
      streak: 30
    },
    {
      rank: 3,
      username: "TokenTrader",
      avatar: "TT",
      score: 3550,
      aptEarned: 430,
      completedCourses: 14,
      streak: 22
    },
    {
      rank: 4,
      username: "Web3Wizard",
      avatar: "WW",
      score: 3200,
      aptEarned: 390,
      completedCourses: 12,
      streak: 28
    },
    {
      rank: 5,
      username: "SmartContractDev",
      avatar: "SC",
      score: 2980,
      aptEarned: 360,
      completedCourses: 11,
      streak: 19
    },
    {
      rank: 6,
      username: "AptosEnthusiast",
      avatar: "AE",
      score: 2750,
      aptEarned: 330,
      completedCourses: 10,
      streak: 15
    },
    {
      rank: 7,
      username: "BitByBit",
      avatar: "BB",
      score: 2600,
      aptEarned: 310,
      completedCourses: 9,
      streak: 12
    },
    {
      rank: 8,
      username: "ChainLinker",
      avatar: "CL",
      score: 2450,
      aptEarned: 290,
      completedCourses: 8,
      streak: 10
    },
    {
      rank: 9,
      username: "TokenomicsGuru",
      avatar: "TG",
      score: 2300,
      aptEarned: 270,
      completedCourses: 8,
      streak: 8
    },
    {
      rank: 10,
      username: "NFTCollector",
      avatar: "NC",
      score: 2150,
      aptEarned: 250,
      completedCourses: 7,
      streak: 7
    },
    {
      rank: 24,
      username: "John Doe",
      avatar: "JD",
      score: 1250,
      aptEarned: 120,
      completedCourses: 4,
      streak: 7,
      isCurrentUser: true
    },
  ];
  
  // Get top 3 users and the rest
  const topThree = leaderboardData.slice(0, 3);
  const otherUsers = leaderboardData.slice(3);
  
  // Find the current user if not in the top positions
  const currentUser = leaderboardData.find(user => user.isCurrentUser);
  
  return (
    <div className="flex h-screen">
      <NavSidebar isAdmin={false} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">
              See how you rank among other learners. Complete more courses to climb the ranks!
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {topThree.map((user, index) => {
              const colors = [
                "from-yellow-400 to-amber-600", // Gold
                "from-gray-300 to-gray-400",    // Silver
                "from-amber-700 to-amber-800"   // Bronze
              ];
              
              const trophyIcons = [
                <Trophy className="h-12 w-12 text-yellow-400" key="gold" />,
                <Award className="h-12 w-12 text-gray-400" key="silver" />,
                <Medal className="h-12 w-12 text-amber-700" key="bronze" />
              ];
              
              return (
                <Card 
                  key={user.username} 
                  className={`overflow-hidden ${index === 0 ? "md:transform md:-translate-y-4" : ""}`}
                >
                  <CardHeader className={`bg-gradient-to-r ${colors[index]} text-white text-center pb-8`}>
                    <div className="flex justify-center mb-2">
                      {trophyIcons[index]}
                    </div>
                    <CardTitle className="text-lg">Rank #{user.rank}</CardTitle>
                  </CardHeader>
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800">
                        <AvatarFallback className="text-xl">{user.avatar}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <CardContent className="pt-12 text-center">
                    <h3 className="font-semibold text-xl mb-1">{user.username}</h3>
                    <p className="text-3xl font-bold">{user.score}</p>
                    <p className="text-sm text-muted-foreground mb-4">points</p>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-semibold">{user.aptEarned}</p>
                        <p className="text-xs text-muted-foreground">APT Earned</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{user.completedCourses}</p>
                        <p className="text-xs text-muted-foreground">Courses</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{user.streak}</p>
                        <p className="text-xs text-muted-foreground">Streak</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Leaderboard Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>Learner</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">APT Earned</TableHead>
                      <TableHead className="text-right">Courses</TableHead>
                      <TableHead className="text-right">Streak</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {otherUsers.map((user) => (
                      <TableRow key={user.username} className={user.isCurrentUser ? "bg-muted" : ""}>
                        <TableCell className="font-medium">#{user.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.avatar}</AvatarFallback>
                            </Avatar>
                            <span>{user.username}</span>
                            {user.isCurrentUser && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{user.score.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{user.aptEarned}</TableCell>
                        <TableCell className="text-right">{user.completedCourses}</TableCell>
                        <TableCell className="text-right">{user.streak} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {currentUser && !topThree.some(user => user.isCurrentUser) && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Current Score: {currentUser.score}</span>
                        <span>Next Rank: {currentUser.score + 100}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        You need 100 more points to reach rank #{currentUser.rank - 1}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">You're in the top 5% of all learners!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
