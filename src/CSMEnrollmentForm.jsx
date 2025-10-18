import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CSMEnrollmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    program: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const programs = [
    { value: 'grc', label: 'Governance, Risk & Compliance' },
    { value: 'esg', label: 'ESG & Sustainability Leadership' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'leadership', label: 'Leadership & Strategic Management' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://backend-worker-production.terrymramabulana.workers.dev/csm/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => navigate('/training'), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72, #7e22ce)',
        color: 'white',
        padding: '60px 40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <button
          onClick={() => navigate('/training')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Back to Training
        </button>

        <h1 style={{ fontSize: '42px', marginBottom: '15px' }}>Enroll in CSM Training</h1>
        <p style={{ fontSize: '18px' }}>Begin your leadership transformation journey</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 40px' }}>
        {submitStatus === 'success' && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            color: '#065f46'
          }}>
            ✓ Enrollment successful! Redirecting...
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            color: '#991b1b'
          }}>
            ✗ Submission failed. Please try again.
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '28px', color: '#1e3c72', marginBottom: '30px' }}>
            Enrollment Form
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e7ff',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e7ff',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', color: '#1e3c72', fontWeight: 'bold', marginBottom: '8px' }}>
                Select Program *
              </label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e7ff',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">-- Choose a program --</option>
                {programs.map(prog => (
                  <option key={prog.value} value={prog.value}>
                    {prog.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitStatus === 'success'}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #7e22ce, #2a5298)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: submitStatus === 'success' ? 'not-allowed' : 'pointer',
                opacity: submitStatus === 'success' ? 0.7 : 1
              }}
            >
              {submitStatus === 'success' ? '✓ Enrolled Successfully' : 'Submit Enrollment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSMEnrollmentForm;