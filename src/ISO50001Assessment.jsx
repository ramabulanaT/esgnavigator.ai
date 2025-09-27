import React, { useState, useEffect } from 'react';

// ISO 50001 API Service
const API_BASE = 'https://backend-worker-production.terrymramabulana.workers.dev';

const iso50001Api = {
  async getTemplate() {
    try {
      const response = await fetch(`${API_BASE}/iso50001/template`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching template:', error);
      return { success: false };
    }
  },

  async createAssessment(assessmentData) {
    try {
      const response = await fetch(`${API_BASE}/iso50001/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating assessment:', error);
      return { success: false };
    }
  }
};

const ISO50001Assessment = () => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    setLoading(true);
    const response = await iso50001Api.getTemplate();
    if (response.success) {
      setTemplate(response.template);
    }
    setLoading(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Assessment...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      <h2 style={{ color: '#E67E22', textAlign: 'center' }}>ISO 50001 Assessment Tool</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>
        Interactive assessment connected to your backend API
      </p>
      
      {template ? (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>Assessment: {template.title}</h3>
          <p>Standard: {template.standard}</p>
          <div style={{ marginTop: '20px' }}>
            {template.sections?.map((section) => (
              <div key={section.id} style={{ 
                padding: '15px', 
                margin: '10px 0', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                borderLeft: '4px solid #E67E22'
              }}>
                <strong>{section.title}</strong>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {section.questions?.length || 0} questions
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Unable to load assessment template. Check API connection.
        </div>
      )}
    </div>
  );
};

export default ISO50001Assessment;