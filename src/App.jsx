import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import ISO50001Assessment from './ISO50001Assessment';
import ESGIntegrationDashboard from './ESGIntegrationDashboard';
import ClientInformationForm from './ClientInformationForm';
import APIKeyManagement from './APIKeyManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ExecutiveDashboardPage />} />
        <Route path="/iso50001" element={<ISO50001Assessment />} />
        <Route path="/integrations" element={<ESGIntegrationDashboard />} />
        <Route path="/client-form" element={<ClientInformationForm />} />
        <Route path="/api-keys" element={<APIKeyManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
