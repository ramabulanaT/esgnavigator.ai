import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientInformationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    esgStandards: []
  });

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>
            Client Registration Form
          </h1>
          <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
            Complete client information form coming soon
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientInformationForm;
