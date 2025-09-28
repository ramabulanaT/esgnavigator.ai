import React, { useState, useEffect } from 'react';

const ESGIntegrationDashboard = ({ assessmentData, onIntegrationComplete }) => {
  const [apiKeys, setApiKeys] = useState({
    paymentTracker: '',
    hubspot: '',
    zoho: ''
  });
  const [integrationStatus, setIntegrationStatus] = useState({
    paymentTracker: { status: 'disconnected', lastSync: null },
    hubspot: { status: 'disconnected', lastSync: null },
    zoho: { status: 'disconnected', lastSync: null }
  });
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#27ae60';
      case 'disconnected': return '#95a5a6';
      case 'error': return '#e74c3c';
      default: return '#f39c12';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '✅';
      case 'disconnected': return '⚪';
      case 'error': return '❌';
      default: return '⚠️';
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '32px' }}>
            ESG Navigator Integrations
          </h1>
          <p style={{ color: '#7f8c8d', margin: 0, fontSize: '16px' }}>
            Connect your ESG assessments with PaymentTracker, HubSpot, and Zoho Analytics
          </p>
        </div>

        {/* Integration Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
          {/* PaymentTracker Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: `3px solid ${getStatusColor(integrationStatus.paymentTracker.status)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#2c3e50', margin: 0, fontSize: '20px' }}>PaymentTracker</h3>
              <span style={{ fontSize: '24px' }}>{getStatusIcon(integrationStatus.paymentTracker.status)}</span>
            </div>
            <p style={{ color: '#7f8c8d', marginBottom: '15px', lineHeight: '1.5' }}>
              Track ESG assessment costs, sustainability investments, and calculate ROI on energy efficiency projects.
            </p>
            <div style={{ fontSize: '14px', color: '#95a5a6' }}>
              Status: <strong style={{ color: getStatusColor(integrationStatus.paymentTracker.status) }}>
                {integrationStatus.paymentTracker.status}
              </strong>
            </div>
          </div>

          {/* HubSpot Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: `3px solid ${getStatusColor(integrationStatus.hubspot.status)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#2c3e50', margin: 0, fontSize: '20px' }}>HubSpot CRM</h3>
              <span style={{ fontSize: '24px' }}>{getStatusIcon(integrationStatus.hubspot.status)}</span>
            </div>
            <p style={{ color: '#7f8c8d', marginBottom: '15px', lineHeight: '1.5' }}>
              Sync ESG assessment results with company records, create custom ESG properties, and automate workflows.
            </p>
            <div style={{ fontSize: '14px', color: '#95a5a6' }}>
              Status: <strong style={{ color: getStatusColor(integrationStatus.hubspot.status) }}>
                {integrationStatus.hubspot.status}
              </strong>
            </div>
          </div>

          {/* Zoho Analytics Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: `3px solid ${getStatusColor(integrationStatus.zoho.status)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#2c3e50', margin: 0, fontSize: '20px' }}>Zoho Analytics</h3>
              <span style={{ fontSize: '24px' }}>{getStatusIcon(integrationStatus.zoho.status)}</span>
            </div>
            <p style={{ color: '#7f8c8d', marginBottom: '15px', lineHeight: '1.5' }}>
              Create comprehensive ESG dashboards, generate automated reports, and visualize sustainability trends.
            </p>
            <div style={{ fontSize: '14px', color: '#95a5a6' }}>
              Status: <strong style={{ color: getStatusColor(integrationStatus.zoho.status) }}>
                {integrationStatus.zoho.status}
              </strong>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>Integration Configuration</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
            Enter your API keys to connect ESG Navigator with your business systems.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                PaymentTracker API Key:
              </label>
              <input
                type="password"
                value={apiKeys.paymentTracker}
                onChange={(e) => setApiKeys(prev => ({ ...prev, paymentTracker: e.target.value }))}
                placeholder="Enter PaymentTracker API key"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                HubSpot Private App Token:
              </label>
              <input
                type="password"
                value={apiKeys.hubspot}
                onChange={(e) => setApiKeys(prev => ({ ...prev, hubspot: e.target.value }))}
                placeholder="Enter HubSpot private app token"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Zoho Analytics OAuth Token:
              </label>
              <input
                type="password"
                value={apiKeys.zoho}
                onChange={(e) => setApiKeys(prev => ({ ...prev, zoho: e.target.value }))}
                placeholder="Enter Zoho Analytics OAuth token"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <button
              onClick={() => alert('Integration setup coming soon!')}
              style={{
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Test Connections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGIntegrationDashboard;
