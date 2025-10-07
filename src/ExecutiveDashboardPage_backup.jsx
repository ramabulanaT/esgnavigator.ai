import React from 'react'
import { useNavigate } from 'react-router-dom';

const ExecutiveDashboardPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'financial',
      title: 'Financial Reporting',
      description: 'IFRS S1 & S2 Sustainability Disclosure Standards',
      score: 92,
      bgColor: '#eff6ff',
      icon: '📊'
    },
    {
      id: 'energy',
      title: 'Energy Management',
      description: 'ISO 50001 Energy Management Systems',
      score: 87,
      bgColor: '#fef3c7',
      icon: '⚡'
    },
    {
      id: 'security',
      title: 'Security & Info Security',
      description: 'ISO 27001 Information Security Management',
      score: 88,
      bgColor: '#f3e8ff',
      icon: '🛡️'
    },
    {
      id: 'health',
      title: 'Health & Safety',
      description: 'ISO 45001 Occupational Health & Safety',
      score: 85,
      bgColor: '#fef2f2',
      icon: '❤️'
    },
    {
      id: 'environmental',
      title: 'Environmental Management',
      description: 'ISO 14001 Environmental Management Systems',
      score: 90,
      bgColor: '#d1fae5',
      icon: '🌿'
    },
    {
      id: 'governance',
      title: 'Sustainability & Governance',
      description: 'CDP, GRI, SASB Reporting Standards',
      score: 91,
      bgColor: '#f9fafb',
      icon: '🏢'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh'}}>
      <div style={{
        backgroundColor: 'white', 
        padding: '24px', 
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#111827'}}>ESG Navigator</h1>
            <p style={{color: '#6b7280', margin: '4px 0', fontSize: '16px'}}>Executive Dashboard</p>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Overall ESG Score</div>
            <div style={{fontSize: '36px', fontWeight: 'bold', color: '#10b981'}}>89/100</div>
          </div>
        </div>
      </div>
      
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '24px'
        }}>
          {modules.map((module) => (
            <div 
              key={module.id}
              onClick={() => {
                if (module.id === 'energy') {
                  navigate('/iso50001');
                } else {
                  alert('Module coming soon!');
                }
              }}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '16px'}}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: module.bgColor,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontSize: '20px'
                }}>
                  {module.icon}
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{
                    margin: 0, 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {module.title}
                  </h3>
                  <p style={{
                    color: '#6b7280', 
                    fontSize: '14px', 
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {module.description}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <span style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Active
                </span>
                <span style={{
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: getScoreColor(module.score)
                }}>
                  {module.score}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardPage;
