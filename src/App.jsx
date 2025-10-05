import React from 'react';
import AssessmentForm from "./AssessmentForm";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import ISO50001Assessment from './ISO50001Assessment';
import ISO14001Assessment from './ISO14001Assessment';
import ISO45001Assessment from './ISO45001Assessment';
import ESGIntegrationDashboard from './ESGIntegrationDashboard';
import ClientInformationForm from './ClientInformationForm';
import APIKeyManagement from './APIKeyManagement';
// NEW IMPORTS
import CSMTrainingLanding from './CSMTrainingLanding';
import CSMDomainDetail from './CSMDomainDetail';
import CSMEnrollmentForm from './CSMEnrollmentForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ExecutiveDashboardPage />} />
        <Route path="/iso50001" element={<ISO50001Assessment />} />
        <Route path="/iso14001" element={<ISO14001Assessment />} />
        <Route path="/iso45001" element={<ISO45001Assessment />} />
        <Route path="/integrations" element={<ESGIntegrationDashboard />} />
        <Route path="/client-form" element={<ClientInformationForm />} />
        <Route path="/api-keys" element={<APIKeyManagement />} />
        {/* NEW ROUTES */}
        <Route path="/training" element={<CSMTrainingLanding />} />
        <Route path="/training/:domainId" element={<CSMDomainDetail />} />
        <Route path="/training/enroll" element={<CSMEnrollmentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
