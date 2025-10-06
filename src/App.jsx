import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import ISO50001Assessment from './ISO50001Assessment';
import CSMTrainingLanding from './CSMTrainingLanding';
import CSMDomainDetail from './CSMDomainDetail';
import CSMEnrollmentForm from './CSMEnrollmentForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExecutiveDashboardPage />} />
        <Route path="/iso50001" element={<ISO50001Assessment />} />
        <Route path="/training" element={<CSMTrainingLanding />} />
        <Route path="/training/:domainId" element={<CSMDomainDetail />} />
        <Route path="/training/enroll" element={<CSMEnrollmentForm />} />
      </Routes>
    </Router>
  );
}

export default App;import LandingPage from './LandingPage';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import ISO50001Assessment from './ISO50001Assessment';
import ISO14001Assessment from './ISO14001Assessment';
import ISO45001Assessment from './ISO45001Assessment';
import ESGIntegrationDashboard from './ESGIntegrationDashboard';
import ClientInformationForm from './ClientInformationForm';
import APIKeyManagement from './APIKeyManagement';
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
        <Route path="/training" element={<CSMTrainingLanding />} />
        <Route path="/training/:domainId" element={<CSMDomainDetail />} />
        <Route path="/training/enroll" element={<CSMEnrollmentForm />} />
      </Routes>
    </Router>
  );
}

export default App;import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExecutiveDashboardPage from './ExecutiveDashboardPage';
import ISO50001Assessment from './ISO50001Assessment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExecutiveDashboardPage />} />
        <Route path="/iso50001" element={<ISO50001Assessment />} />
      </Routes>
    </Router>
  );
}

export default App;
