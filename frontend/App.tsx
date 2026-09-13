import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LocationProvider } from "@/hooks/useLocationContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Services from "./pages/Services";
import PostRequirement from "./pages/PostRequirement";
import Emergency from "./pages/Emergency";
import Language from "./pages/Language";
import Auth from "./pages/Auth";
import ProviderAuth from "./pages/ProviderAuth";
import Join from "./pages/Join";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import BrowseRequirements from "./pages/BrowseRequirements";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/post-requirement" element={<PostRequirement />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/language" element={<Language />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/provider-auth" element={<ProviderAuth />} />
              <Route path="/admin-login" element={<AdminAuth />} />
              <Route path="/join" element={<Join />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/provider-dashboard" element={<ProviderDashboard />} />
              <Route path="/browse-requirements" element={<BrowseRequirements />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LocationProvider>
  </QueryClientProvider>
);

export default App;
