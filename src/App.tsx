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
import MediaLibrary from "./pages/MediaLibrary";
import ManageNews from "./pages/ManageNews";
import QiratDashboard from "./pages/QiratDashboard";
import DawaDashboard from "./pages/DawaDashboard";
import CharityDashboard from "./pages/CharityDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
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
            <Route path="/admin/unauthorized" element={<Unauthorized />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/qirat" element={
              <ProtectedRoute allowedRoles={['superadmin', 'qirat']}>
                <QiratDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dawa" element={
              <ProtectedRoute allowedRoles={['superadmin', 'dawa']}>
                <DawaDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/charity" element={
              <ProtectedRoute allowedRoles={['superadmin', 'charity']}>
                <CharityDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-post" element={
              <ProtectedRoute allowedRoles={['superadmin', 'qirat', 'dawa']}>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/admin/media-library" element={
              <ProtectedRoute allowedRoles={['superadmin', 'qirat', 'dawa']}>
                <MediaLibrary />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-news" element={
              <ProtectedRoute allowedRoles={['superadmin', 'qirat', 'dawa']}>
                <ManageNews />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
