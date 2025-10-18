import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [showClientForm, setShowClientForm] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            ESG Navigator
          </h1>
          <p style={{
            fontSize: '24px',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            Comprehensive Energy Management & ESG Compliance Platform
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/client-form')}
              style={{
                backgroundColor: '#ffffff',
                color: '#667eea',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Start Free Assessment
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '15px 30px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', color: '#2c3e50', marginBottom: '60px' }}>
            Complete ESG Management Solution
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
              <h3 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>
                ISO Compliance Assessment
              </h3>
              <p style={{ color: '#7f8c8d' }}>
                Complete ISO 50001, 14001, and 45001 compliance evaluation
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>
                Business Intelligence
              </h3>
              <p style={{ color: '#7f8c8d' }}>
                Integrated analytics with PaymentTracker, HubSpot, and Zoho
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>💰</div>
              <h3 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>
                ROI Tracking
              </h3>
              <p style={{ color: '#7f8c8d' }}>
                Monitor sustainability investments and energy savings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
            Ready to Transform Your ESG Performance?
          </h2>
          <button
            onClick={() => navigate('/client-form')}
            style={{
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Start Your ESG Journey Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
