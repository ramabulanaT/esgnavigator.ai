import React from 'react';
import { useNavigate } from 'react-router-dom';

const CSMTrainingLanding = () => {
  const navigate = useNavigate();

  const domains = [
    { id: 'grc', title: 'Governance, Risk & Compliance', icon: '🛡️', color: '#ef4444' },
    { id: 'esg', title: 'ESG & Sustainability', icon: '🌍', color: '#10b981' },
    { id: 'ai-ml', title: 'AI & Machine Learning', icon: '🤖', color: '#3b82f6' },
    { id: 'leadership', title: 'Leadership & Strategy', icon: '👥', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #7e22ce 100%)',
        color: 'white',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => navigate('/')}
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
          ← Back to Home
        </button>

        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          CSM Training Portal
        </h1>
        <p style={{ fontSize: '20px' }}>
          IntelliMat 8 Domains Framework - Transform Your Leadership
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => navigate(`/training/${domain.id}`)}
              style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>{domain.icon}</div>
              <h3 style={{ color: domain.color, marginBottom: '15px' }}>{domain.title}</h3>
              <button style={{
                padding: '10px 20px',
                backgroundColor: domain.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CSMTrainingLanding;