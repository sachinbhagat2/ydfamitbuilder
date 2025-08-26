import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Award,
  Heart,
  Search,
  MessageCircle,
  User,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const RoleBasedNavigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.userType) {
      case 'student':
        return [
          { path: '/student-dashboard', label: 'Dashboard', icon: Home },
          { path: '/scholarships', label: 'Scholarships', icon: Search },
          { path: '/progress', label: 'Progress', icon: FileText },
          { path: '/support', label: 'Support', icon: MessageCircle },
        ];
      case 'admin':
        return [
          { path: '/admin-dashboard', label: 'Dashboard', icon: Home },
          { path: '/admin/schemes', label: 'Manage Schemes', icon: Award },
          { path: '/admin/applications', label: 'Applications', icon: FileText },
          { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { path: '/admin/users', label: 'Users', icon: Users },
          { path: '/admin/settings', label: 'Settings', icon: Settings },
        ];
      case 'reviewer':
        return [
          { path: '/reviewer-dashboard', label: 'Dashboard', icon: Home },
          { path: '/reviewer/applications', label: 'Review Applications', icon: FileText },
          { path: '/reviewer/reports', label: 'Reports', icon: BarChart3 },
        ];
      case 'donor':
        return [
          { path: '/donor-dashboard', label: 'Dashboard', icon: Home },
          { path: '/donor/contributions', label: 'My Contributions', icon: Heart },
          { path: '/donor/impact', label: 'Impact Tracker', icon: BarChart3 },
          { path: '/donor/opportunities', label: 'New Opportunities', icon: Search },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F3b1b952ac06b422687ab6f8265e647a7%2F209099442e6c42e883b3d324b2f06354?format=webp&width=800"
              alt="Youth Dreamers Foundation"
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold text-gray-900">
              YDF {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.userType}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/support" className="cursor-pointer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;