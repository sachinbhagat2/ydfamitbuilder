import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import { User, CreateUserInput } from "../../shared/types/database";
import { toast } from "../components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: CreateUserInput) => Promise<boolean>;
  logout: () => void;
  redirectToDashboard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to hold login errors
  const navigate = useNavigate();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("ydf_token");
        const storedUser = localStorage.getItem("ydf_user");

        if (token && storedUser) {
          // Verify token with server
          try {
            const response = await apiService.verifyToken();
            if (response.success && response.data) {
              const parsed = JSON.parse(storedUser);
              const merged = { ...parsed, ...response.data };
              setUser(merged);
              setIsAuthenticated(true);
              // persist merged so names/phone are preserved
              localStorage.setItem("ydf_user", JSON.stringify(merged));
            } else {
              // Token invalid, clear auth data
              apiService.clearAuth();
            }
          } catch (error) {
            // Token verification failed, clear auth data
            apiService.clearAuth();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Attempting login for:", email);

      const result = await apiService.login({ email, password });

      console.log("Login result:", result);

      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(true);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.data.user.firstName}!`,
        });

        // Navigate based on user role
        const userType = result.data.user.userType;
        if (userType === "admin") {
          navigate("/admin-dashboard");
        } else if (userType === "student") {
          navigate("/student-dashboard");
        } else if (userType === "reviewer") {
          navigate("/reviewer-dashboard");
        } else if (userType === "donor") {
          navigate("/donor-dashboard");
        } else if (userType === "surveyor") {
          navigate("/surveyor-dashboard");
        } else {
          navigate("/student-dashboard");
        }

        return true;
      } else {
        const errorMessage = result.error || "Login failed";
        console.error("Login failed:", errorMessage);
        setError(errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: CreateUserInput): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);

      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);

        toast({
          title: "Registration Successful",
          description: `Welcome to Youth Dreamers Foundation, ${response.data.user.firstName}!`,
        });

        // Redirect to appropriate dashboard
        redirectToDashboard(response.data.user);
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: response.error || "Registration failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description:
          error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      apiService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const redirectToDashboard = (userToRedirect?: User) => {
    const targetUser = userToRedirect || user;
    if (!targetUser) return;

    switch (targetUser.userType) {
      case "student":
        navigate("/student-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard?tab=overview");
        break;
      case "reviewer":
        navigate("/reviewer-dashboard");
        break;
      case "donor":
        navigate("/donor-dashboard");
        break;
      case "surveyor":
        navigate("/surveyor-dashboard");
        break;
      default:
        navigate("/student-dashboard");
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    redirectToDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};