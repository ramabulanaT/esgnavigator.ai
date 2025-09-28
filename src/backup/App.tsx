import React, { useState } from 'react';

const ExecutiveDashboardPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);

  const moduleData = {
    financial: { score: 88, status: 'Compliant', lastUpdate: '2024-09-26' },
    security: { score: 92, status: 'Certified', lastUpdate: '2024-09-25' },
    healthSafety: { score: 95, status: 'Excellent', lastUpdate: '2024-09-26' },
    environmental: { score: 85, status: 'Good', lastUpdate: '2024-09-26' },
    energy: { score: 90, status: 'Optimized', lastUpdate: '2024-09-26' },
    governance: { score: 87, status: 'Strong', lastUpdate: '2024-09-25' }
  };

  const modules = [
    {
      id: 'financial',
      title: 'Financial Reporting',
      icon: '📊',
      frameworks: ['IFRS S1', 'IFRS S2', 'ISSB'],
      color: '#2E86C1'
    },
    {
      id: 'security',
      title: 'Security & Info Security',
      icon: '🔒',
      frameworks: ['ISO 27001', 'SOC 2'],
      color: '#A569BD'
    },
    {
      id: 'healthSafety',
      title: 'Health & Safety',
      icon: '⛑️',
      frameworks: ['ISO 45001'],
      color: '#F39C12'
    },
    {
      id: 'environmental',
      title: 'Environmental Management',
      icon: '🌱',
      frameworks: ['ISO 14001'],
      color: '#27AE60'
    },
    {
      id: 'energy',
      title: 'Energy Management',
      icon: '⚡',
      frameworks: ['ISO 50001'],
      color: '#E67E22'
    },
    {
      id: 'governance',
      title: 'Sustainability & Governance',
      icon: '🏛️',
      frameworks: ['TCFD', 'CDP', 'GRI', 'SASB'],
      color: '#8E44AD'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Compliant': '#27AE60',
      'Certified': '#2E86C1',
      'Excellent': '#F39C12',
      'Good': '#27AE60',
      'Optimized': '#8E44AD',
      'Strong': '#2E86C1'
    };
    return colors[status] || '#95A5A6';
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F8F9FA',
      minHeight: '100vh'
    }}>
      <div style={{ 
        marginBottom: '30px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#2C3E50', 
          margin: '0 0 10px 0',
          fontSize: '2.5em',
          fontWeight: 'bold'
        }}>
          ESG Navigator - Executive Dashboard
        </h1>
        <p style={{ 
          color: '#7F8C8D',
          fontSize: '1.1em',
          margin: '0'
        }}>
          Comprehensive ESG Management & Compliance Platform
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2C3E50', marginBottom: '15px' }}>Overall ESG Score</h2>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#27AE60' }}>
          89/100
        </div>
        <p style={{ color: '#7F8C8D', margin: '10px 0 0 0' }}>
          Excellent performance across all ESG frameworks
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '20px'
      }}>
        {modules.map((module) => (
          <div 
            key={module.id}
            style={{ 
              padding: '25px', 
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: `2px solid ${module.color}20`,
              cursor: 'pointer'
            }}
            onClick={() => {
              if (module.id === 'energy') {
                alert('ISO 50001 Energy Module - Coming Soon!');
              } else {
                setSelectedModule(selectedModule === module.id ? null : module.id);
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '24px', marginRight: '10px' }}>{module.icon}</span>
              <h3 style={{ color: module.color, margin: '0', flex: 1 }}>
                {module.title}
              </h3>
              <div style={{
                backgroundColor: getStatusColor(moduleData[module.id].status),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {moduleData[module.id].status}
              </div>
            </div>

            <div style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: module.color,
              marginBottom: '10px'
            }}>
              {moduleData[module.id].score}/100
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
              {module.frameworks.map((framework) => (
                <span 
                  key={framework}
                  style={{
                    backgroundColor: `${module.color}15`,
                    color: module.color,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                >
                  {framework}
                </span>
              ))}
            </div>

            <div style={{ 
              fontSize: '12px', 
              color: '#BDC3C7',
              borderTop: '1px solid #ECF0F1',
              paddingTop: '10px'
            }}>
              Last updated: {moduleData[module.id].lastUpdate}
            </div>

            {selectedModule === module.id && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', color: module.color }}>
                  Module Details:
                </div>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#5D6D7E' }}>
                  <li>Specialized processing engine deployed</li>
                  <li>Real-time compliance monitoring active</li>
                  <li>API integration established</li>
                  <li>Automated reporting configured</li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveDashboardPage;