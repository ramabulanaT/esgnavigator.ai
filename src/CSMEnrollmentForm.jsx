import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CSMEnrollmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const domain = location.state?.domain || 'Training Program';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for enrolling in ${domain}! We will contact you shortly.`);
    navigate('/training');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Enroll in Training</h1>
          <p className="text-gray-600 mb-8">{domain}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Company</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">Submit Enrollment</button>
              <button type="button" onClick={() => navigate('/training')} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSMEnrollmentForm;
