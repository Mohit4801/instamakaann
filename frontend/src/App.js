import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute, {
  RoleBasedRedirect,
} from '@/components/auth/ProtectedRoute';

/* ================= PUBLIC PAGES ================= */
import HomePage from '@/pages/HomePage';
import PartnerPage from '@/pages/PartnerPage';
import AllPropertiesPage from '@/pages/AllPropertiesPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import BlogPage from '@/pages/BlogPage';
import AboutPage from '@/pages/AboutPage';
import ReferPage from '@/pages/ReferPage';
import FAQPage from '@/pages/FAQPage';
import ContactPage from '@/pages/ContactPage';

/* ================= AUTH PAGES ================= */
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

/* ================= ADMIN PAGES ================= */
import AdminLayout from '@/pages/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import PropertiesListPage from '@/pages/admin/PropertiesListPage';
import PropertyFormPage from '@/pages/admin/PropertyFormPage';
import InquiriesPage from '@/pages/admin/InquiriesPage';
import OwnersPage from '@/pages/admin/OwnersPage';
import AdminOwnerDashboardPage from '@/pages/admin/OwnerDashboardPage';
import AgentsPage from '@/pages/admin/AgentsPage';
import AdminAgentInquiriesPage from '@/pages/admin/AgentInquiriesPage';

/* ================= AGENT PAGES ================= */
import AgentLayout from '@/pages/agent/AgentLayout';
import AgentDashboard from '@/pages/agent/AgentDashboard';

/* ================= OWNER PAGES ================= */
import OwnerLayout from '@/pages/owner/OwnerLayout';
import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import OwnerProperties from '@/pages/owner/OwnerProperties';
import OwnerEarnings from '@/pages/owner/OwnerEarnings';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/" element={<HomePage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/all-properties" element={<AllPropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* ================= AUTH ROUTES ================= */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

            {/* ================= ROLE BASED REDIRECT ================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ROUTES ================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="properties" element={<PropertiesListPage />} />
              <Route path="properties/new" element={<PropertyFormPage />} />
              <Route
                path="properties/:id/edit"
                element={<PropertyFormPage />}
              />
              <Route path="owners" element={<OwnersPage />} />
              <Route
                path="owners/:ownerId/dashboard"
                element={<AdminOwnerDashboardPage />}
              />
              <Route path="agents" element={<AgentsPage />} />
              <Route
                path="agents/:agentId/inquiries"
                element={<AdminAgentInquiriesPage />}
              />
              <Route path="inquiries" element={<InquiriesPage />} />
            </Route>

            {/* ================= AGENT ROUTES ================= */}
            <Route
              path="/agent"
              element={
                <ProtectedRoute allowedRoles={['AGENT']}>
                  <AgentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AgentDashboard />} />
            </Route>

            {/* ================= OWNER ROUTES ================= */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OwnerDashboard />} />
              <Route path="properties" element={<OwnerProperties />} />
              <Route path="earnings" element={<OwnerEarnings />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <Toaster position="top-right" />
      </AuthProvider>
    </div>
  );
}

export default App;
