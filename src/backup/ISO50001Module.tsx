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
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading Assessment...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#E67E22', marginBottom: '10px' }}>ISO 50001 Assessment Tool</h2>
        <p style={{ color: '#7F8C8D', fontSize: '16px' }}>
          Interactive assessment connected to your backend API
        </p>
      </div>
      
      {template ? (
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#2C3E50', marginBottom: '20px' }}>
            {template.title}
          </h3>
          <div style={{ marginBottom: '20px' }}>
            <strong>Standard:</strong> {template.standard}
          </div>
          
          <h4 style={{ color: '#E67E22', marginBottom: '15px' }}>Assessment Sections:</h4>
          {template.sections?.map((section) => (
            <div key={section.id} style={{
              backgroundColor: '#F8F9FA',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '15px',
              borderLeft: '4px solid #E67E22'
            }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#2C3E50' }}>
                Section {section.id}: {section.title}
              </h5>
              <div style={{ color: '#666', fontSize: '14px' }}>
                {section.questions?.length || 0} questions available
              </div>
              
              {section.questions?.slice(0, 2).map((question) => (
                <div key={question.id} style={{
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  <strong>Q{question.id}:</strong> {question.question}
                  <div style={{ color: '#999', marginTop: '5px' }}>
                    Type: {question.type} | Weight: {question.weight}
                  </div>
                </div>
              ))}
              
              {section.questions?.length > 2 && (
                <div style={{ marginTop: '10px', color: '#666', fontSize: '12px' }}>
                  ... and {section.questions.length - 2} more questions
                </div>
              )}
            </div>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button style={{
              backgroundColor: '#E67E22',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Start Full Assessment
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#FFF3CD',
          borderRadius: '8px',
          border: '1px solid #FFEAA7'
        }}>
          <div style={{ color: '#856404', fontSize: '16px' }}>
            Unable to load assessment template from API
          </div>
          <div style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Check your backend connection at: {API_BASE}
          </div>
        </div>
      )}
    </div>
  );
};

export default ISO50001Assessment;