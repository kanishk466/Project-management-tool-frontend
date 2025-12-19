import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SprintsPage from "./pages/SprintsPage";
import SprintDetailPage from "./pages/SprintDetailPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import SprintTicketPage from "./pages/SprintTicketPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import VerifyPage from "./pages/VerifyPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
            <Route path="/sprints" element={<AppLayout><SprintsPage /></AppLayout>} />
            <Route path="/sprints/:id" element={<AppLayout><SprintDetailPage /></AppLayout>} />
            <Route path="/tickets" element={<AppLayout><TicketsPage /></AppLayout>} />
            <Route path="/tickets/create" element={<AppLayout><CreateTicketPage /></AppLayout>} />
             <Route path="/sprints/create" element={<AppLayout><SprintTicketPage /></AppLayout>} />
            <Route path="/tickets/:id" element={<AppLayout><TicketDetailPage /></AppLayout>} />
            <Route path="/my-tickets" element={<AppLayout><MyTicketsPage /></AppLayout>} />
            <Route path="/verify" element={<AppLayout><VerifyPage /></AppLayout>} />
            <Route path="/admin" element={<AppLayout><AdminPage /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
