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

export default App;
