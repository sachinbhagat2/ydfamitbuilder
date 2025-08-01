import "./global.css";
import "./i18n/config";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Splash from "./pages/Splash";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/support" element={<Support />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
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
