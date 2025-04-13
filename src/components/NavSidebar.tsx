
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Trophy,
  Wallet,
  Award,
  BarChart3,
  FileEdit,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const NavItem = ({ icon: Icon, label, to, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

interface NavSidebarProps {
  isAdmin?: boolean;
}

export function NavSidebar({ isAdmin = false }: NavSidebarProps) {
  const location = useLocation();
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const handleConnectWallet = () => {
    if (!walletConnected) {
      setWalletDialogOpen(true);
    }
  };

  const onWalletConnectSuccess = () => {
    setWalletConnected(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    window.location.href = "/login";
  };

  // Define navigation items based on user type
  const navItems = isAdmin
    ? [
        { icon: Home, label: "Dashboard", to: "/admin" },
        { icon: BarChart3, label: "Statistics", to: "/admin/statistics" },
        { icon: FileEdit, label: "Edit Quests", to: "/admin/quests" },
      ]
    : [
        { icon: Home, label: "Dashboard", to: "/user" },
        { icon: BookOpen, label: "Courses", to: "/user/courses" },
        { icon: Trophy, label: "Leaderboard", to: "/user/leaderboard" },
        { icon: Award, label: "Certificates", to: "/user/certificates" },
        { icon: BarChart3, label: "Resume", to: "/user/resume" },
      ];

  return (
    <div className="h-screen bg-sidebar w-64 flex flex-col border-r border-sidebar-border">
        <div className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-aptos-blue to-aptos-purple flex items-center justify-center">
            <span className="text-white font-bold text-sm">AE</span>
          </div>
          <span className="font-display font-semibold text-sidebar-foreground text-lg">
            Aptos<span className="text-aptos-blue">Learn</span>
          </span>
          <div className="px-2 pt-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        </div>
        
      </div>
      </div>

      <div className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={location.pathname === item.to}
          />
        ))}
      </div>

      {!isAdmin && (
        <div className="p-4">
          <button
            onClick={handleConnectWallet}
            disabled={walletConnected}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              walletConnected
                ? "bg-sidebar-accent/50 text-green-400"
                : "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            )}
          >
            <Wallet className="h-4 w-4" />
            <span>{walletConnected ? "Wallet Connected" : "Connect Wallet"}</span>
          </button>
        </div>
      )}

      <div className="px-4 pt-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      <WalletConnectDialog 
        open={walletDialogOpen}
        onOpenChange={setWalletDialogOpen}
        onConnectSuccess={onWalletConnectSuccess}
      />
    </div>
  );
}
