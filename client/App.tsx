import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route
            path="/scholarships"
            element={
              <PlaceholderPage
                title="Scholarship Listings"
                description="Browse available scholarships with filters and detailed information."
              />
            }
          />
          <Route
            path="/support"
            element={
              <PlaceholderPage
                title="Support Center"
                description="Get help with your applications and connect with our support team."
              />
            }
          />
          <Route
            path="/progress"
            element={
              <PlaceholderPage
                title="Application Progress"
                description="Track the status of your scholarship applications."
              />
            }
          />
          <Route
            path="/profile"
            element={
              <PlaceholderPage
                title="User Profile"
                description="Manage your personal information and application settings."
              />
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reviewer" element={<ReviewerDashboard />} />
          <Route path="/donor" element={<DonorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
