import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import ISO50001Assessment from './ISO50001Assessment';
import ESGIntegrationDashboard from './ESGIntegrationDashboard';
import ClientInformationForm from './ClientInformationForm';
import APIKeyManagement from './APIKeyManagement';

const ProtectedRoute = ({ children }) => {
  return localStorage.getItem('isAuthenticated') === 'true' ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/client-form" element={<ClientInformationForm />} />
        <Route path="/dashboard" element={<ProtectedRoute><ExecutiveDashboardPage /></ProtectedRoute>} />
        <Route path="/iso50001" element={<ProtectedRoute><ISO50001Assessment /></ProtectedRoute>} />
        <Route path="/integrations" element={<ProtectedRoute><ESGIntegrationDashboard /></ProtectedRoute>} />
        <Route path="/api-keys" element={<ProtectedRoute><APIKeyManagement /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
