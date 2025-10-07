import React, { useState } from 'react';

const APIKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState({
    paymentTracker: '',
    hubspot: '',
    zoho: ''
  });

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '12px'
        }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>
            API Key Management
          </h1>
          <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
            Configure API connections for PaymentTracker, HubSpot, and Zoho Analytics
          </p>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3>PaymentTracker API</h3>
              <input
                type="password"
                placeholder="Enter PaymentTracker API key"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              />
            </div>
            
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3>HubSpot API</h3>
              <input
                type="password"
                placeholder="Enter HubSpot API key"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              />
            </div>
            
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3>Zoho Analytics</h3>
              <input
                type="password"
                placeholder="Enter Zoho Analytics token"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManagement;
