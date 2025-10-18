import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CSMDomainDetail = () => {
  const navigate = useNavigate();
  const { domainId } = useParams();

  const domains = {
    'grc': {
      title: 'Governance, Risk & Compliance',
      icon: '🛡️',
      color: '#ef4444',
      description: 'Build robust governance frameworks and manage organizational risk effectively.',
      price: 'R3,800',
      sessions: 16,
      topics: [
        'Corporate Governance Best Practices',
        'Enterprise Risk Management',
        'Regulatory Compliance',
        'Internal Controls & Audit',
        'Board Effectiveness'
      ]
    },
    'esg': {
      title: 'ESG & Sustainability Leadership',
      icon: '🌍',
      color: '#10b981',
      description: 'Lead sustainable business practices aligned with global ESG standards.',
      price: 'R4,200',
      sessions: 12,
      topics: [
        'ESG Framework Implementation',
        'Sustainability Reporting Standards',
        'Climate Risk Management',
        'Stakeholder Engagement',
        'Sustainable Business Models'
      ]
    },
    'ai-ml': {
      title: 'AI & Machine Learning',
      icon: '🤖',
      color: '#3b82f6',
      description: 'Master AI strategy and implementation to drive innovation.',
      price: 'R4,500',
      sessions: 12,
      topics: [
        'AI Strategy & Business Transformation',
        'Machine Learning Fundamentals',
        'Ethical AI & Responsible Innovation',
        'AI Implementation Frameworks',
        'Generative AI Applications'
      ]
    },
    'leadership': {
      title: 'Leadership & Strategic Management',
      icon: '👥',
      color: '#f59e0b',
      description: 'Develop executive presence and strategic thinking capabilities.',
      price: 'R3,500',
      sessions: 16,
      topics: [
        'Executive Leadership Development',
        'Strategic Planning & Execution',
        'Coaching & Mentoring Excellence',
        'Organizational Culture Building',
        'High-Performance Team Leadership'
      ]
    }
  };

  const domain = domains[domainId];

  if (!domain) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', color: '#1e3c72' }}>Domain Not Found</h1>
          <button
            onClick={() => navigate('/training')}
            style={{
              padding: '15px 30px',
              backgroundColor: '#7e22ce',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Back to Training
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{
        background: `linear-gradient(135deg, ${domain.color}, ${domain.color}dd)`,
        color: 'white',
        padding: '80px 40px',
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

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>{domain.icon}</div>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{domain.title}</h1>
          <p style={{ fontSize: '20px', opacity: 0.95 }}>{domain.description}</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              marginBottom: '30px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '28px', color: '#1e3c72', marginBottom: '25px' }}>
                Topics Covered
              </h2>
              {domain.topics.map((topic, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    borderLeft: `4px solid ${domain.color}`
                  }}
                >
                  ✓ {topic}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '24px', color: '#1e3c72', marginBottom: '20px' }}>
                Program Details
              </h3>

              <div style={{
                padding: '15px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>
                  Investment
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: domain.color }}>
                  {domain.price}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>per learner (excl. VAT)</div>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '25px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Sessions:</strong> {domain.sessions} per year
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Duration:</strong> 3-5 days per session
                </div>
                <div>
                  <strong>Certification:</strong> Included
                </div>
              </div>

              <button
                onClick={() => navigate('/training/enroll')}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: domain.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
              >
                Enroll Now
              </button>

<button
                onClick={() => window.open('/training-brochure.pdf', '_blank')}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: 'white',
                  color: domain.color,
                  border: `2px solid ${domain.color}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSMDomainDetail;