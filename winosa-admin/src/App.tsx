import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BlogsPage from './pages/BlogsPage';
import BlogFormPage from './pages/BlogFormPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import PortfolioFormPage from './pages/PortfolioFormPage';
import ServicesPage from './pages/ServicesPage';
import ServiceFormPage from './pages/ServiceFormPage';
import ServiceInfoPage from './pages/ServiceInfoPage';
import ContactsPage from './pages/ContactsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SubscriptionFormPage from './pages/SubscriptionFormPage';
import NewsletterPage from './pages/NewsletterPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ContentPage from './pages/ContentPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: {
              iconTheme: { primary: '#C4A832', secondary: '#1A1A1A' },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/new" element={<BlogFormPage />} />
            <Route path="blogs/edit/:id" element={<BlogFormPage />} />

            {/* Portfolio */}
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="portfolio/add" element={<PortfolioFormPage />} />
            <Route path="portfolio/edit/:id" element={<PortfolioFormPage />} />
            <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />

            {/* Services — specific routes BEFORE :id */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/add" element={<ServiceFormPage />} />
            <Route path="services/edit/:id" element={<ServiceFormPage />} />
            <Route path="services/info-section" element={<ServiceInfoPage />} />

            <Route path="contacts" element={<ContactsPage />} />

            {/* Subscriptions */}
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="subscriptions/add" element={<SubscriptionFormPage />} />
            <Route path="subscriptions/edit/:id" element={<SubscriptionFormPage />} />

            <Route path="content" element={<ContentPage />} />

            {/* Newsletter */}
            <Route path="newsletter" element={<NewsletterPage />} />

            <Route path="settings" element={<SettingsPage />} />
            <Route path="account" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;