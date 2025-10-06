import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CSMEnrollmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const domain = location.state?.domain || 'Training Program';

  const [formData, setFormData] = useState({
    c97e91a4-f608-4910-9437-35fec6ff96ccname: '',
    email: '',
    phone: '',
    company: ''  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = {
      access_key: "YOUR_ACCESS_KEY_HERE",  // c97e91a4-f608-4910-9437-35fec6ff96cc
      subject: `New Training Enrollment: ${domain}`,
      from_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      program: domain,
      message: `New enrollment request for ${domain}`
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      });

      const json = await response.json();
      
      if (response.status === 200) {
        alert(`Thank you ${formData.name}! Your enrollment request has been received. We'll contact you at ${formData.email} within 24 hours.`);
        navigate('/training');
      } else {
        alert(`Error: ${json.message}. Please email terryr@tis-holdings.com directly.`);
      }
    } catch (error) {
      alert('Submission failed. Please email terryr@tis-holdings.com directly.');
    }
  };
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'c97e91a4-f608-4910-9437-35fec6ff96cc',
          subject: `New Training Enrollment: ${domain}`,
          from_name: formData.name,
          email: formData.email,
          message: `
New Training Enrollment

Program: ${domain}
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company}
          `
        })
      });

      if (response.ok) {
        alert(`Thank you for enrolling in ${domain}! We will contact you shortly at ${formData.email}`);
        navigate('/training');
      } else {
        alert('There was an error submitting your enrollment. Please email terryr@tis-holdings.com directly.');
      }
    } catch (error) {
      alert('There was an error submitting your enrollment. Please email terryr@tis-holdings.com directly.');
    }
  };
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
