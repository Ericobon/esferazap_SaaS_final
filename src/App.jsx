import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from './layouts/MainLayout';
import { AdminPanel } from './pages/Admin/AdminPanel';
import { DashboardOverview } from './pages/Dashboard/DashboardOverview';
import { LeadPurchase } from './pages/Leads/LeadPurchase';
import { CampaignsPage } from './pages/Campaigns/CampaignsPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Placeholder components for now
const ChatPage = () => <div className="text-white">Chat Page (Coming Soon)</div>;
const KnowledgeBase = () => <div className="text-white">Knowledge Base (Coming Soon)</div>;
const Settings = () => <div className="text-white">Settings (Coming Soon)</div>;


function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Toaster position="top-right" theme="dark" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="leads" element={<LeadPurchase />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="settings" element={<Settings />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
