import "./global.css";
import "./i18n/config";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Scholarships from "./pages/Scholarships";
import Support from "./pages/Support";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ydf-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<Auth />} />
               <Route path="/index" element={<Homepage />} />
               <Route path="/home" element={<Homepage />} />
                <Route 
                  path="/student-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviewer-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['reviewer']}>
                      <ReviewerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/donor-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['donor']}>
                      <DonorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/scholarships" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Scholarships />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/support" 
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin', 'reviewer', 'donor']}>
                      <Support />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/progress" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Progress />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin', 'reviewer', 'donor']}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                {/* Legacy routes for backward compatibility */}
                <Route 
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviewer"
                  element={
                    <ProtectedRoute allowedRoles={['reviewer']}>
                      <ReviewerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/donor"
                  element={
                    <ProtectedRoute allowedRoles={['donor']}>
                      <DonorDashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;