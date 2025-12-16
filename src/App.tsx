// HUMSJ External Affairs Website
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import News from "./pages/News";
import VisionMission from "./pages/VisionMission";
import Structure from "./pages/Structure";
import ChildrenRegistration from "./pages/ChildrenRegistration";
import MonthlyCharityRegistration from "./pages/MonthlyCharityRegistration";
import CharityDistribution from "./pages/CharityDistribution";
import HelpRegistration from "./pages/HelpRegistration";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/vision-mission" element={<VisionMission />} />
            <Route path="/structure" element={<Structure />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/children-registration" element={<ChildrenRegistration />} />
            <Route path="/monthly-charity" element={<MonthlyCharityRegistration />} />
            <Route path="/charity-distribution" element={<CharityDistribution />} />
            <Route path="/help-registration" element={<HelpRegistration />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-post" element={<CreatePost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
