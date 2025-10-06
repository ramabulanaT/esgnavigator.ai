import React from 'react';
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
