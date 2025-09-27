import React from 'react';

const ExecutiveDashboardPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>
        ESG Navigator - Executive Dashboard
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ color: '#27ae60' }}>Environmental Score</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>85/100</p>
          <p>Carbon footprint reduction: 15% YoY</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ color: '#3498db' }}>Social Impact</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>92/100</p>
          <p>Employee satisfaction: 94%</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ color: '#e74c3c' }}>Governance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>88/100</p>
          <p>Compliance score: 96%</p>
        </div>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Recent ESG Initiatives</h2>
        <ul>
          <li>Implemented renewable energy program</li>
          <li>Enhanced diversity and inclusion policies</li>
          <li>Updated corporate governance framework</li>
        </ul>
      </div>
    </div>
  );
};

export default ExecutiveDashboardPage;