import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ISO50001Assessment = () => {
  const [activeTab, setActiveTab] = useState('planning');
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();

  const tabs = [
    { id: 'planning', name: 'Planning & Policy', icon: '📋', color: '#3b82f6', bgColor: '#eff6ff' },
    { id: 'implementation', name: 'Implementation', icon: '⚙️', color: '#f59e0b', bgColor: '#fef3c7' },
    { id: 'monitoring', name: 'Monitoring & Review', icon: '📊', color: '#10b981', bgColor: '#d1fae5' },
    { id: 'improvement', name: 'Improvement', icon: '📈', color: '#8b5cf6', bgColor: '#f3e8ff' }
  ];

  const questions = {
    planning: [
      { id: 'p1', text: 'Has your organization established an energy policy?', category: 'Policy' },
      { id: 'p2', text: 'Are energy objectives and targets documented?', category: 'Objectives' },
      { id: 'p3', text: 'Is there a designated energy management team?', category: 'Resources' }
    ],
    implementation: [
      { id: 'i1', text: 'Are energy performance indicators (EnPIs) established?', category: 'Performance' },
      { id: 'i2', text: 'Is energy data collection systematic?', category: 'Data Management' },
      { id: 'i3', text: 'Are employees trained on energy management?', category: 'Competence' }
    ],
    monitoring: [
      { id: 'm1', text: 'Is energy performance regularly monitored?', category: 'Monitoring' },
      { id: 'm2', text: 'Are internal energy audits conducted?', category: 'Auditing' },
      { id: 'm3', text: 'Is energy data analyzed for trends?', category: 'Analysis' }
    ],
    improvement: [
      { id: 'im1', text: 'Are corrective actions implemented for non-conformities?', category: 'Corrective Action' },
      { id: 'im2', text: 'Is the energy management system regularly reviewed?', category: 'Management Review' },
      { id: 'im3', text: 'Are improvement opportunities identified?', category: 'Continual Improvement' }
    ]
  };

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateProgress = (tabId) => {
    const tabQuestions = questions[tabId];
    const answered = tabQuestions.filter(q => responses[q.id] !== undefined).length;
    return Math.round((answered / tabQuestions.length) * 100);
  };

  const getOverallProgress = () => {
    const allQuestions = Object.values(questions).flat();
    const totalAnswered = allQuestions.filter(q => responses[q.id] !== undefined).length;
    return Math.round((totalAnswered / allQuestions.length) * 100);
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh'}}>
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px 24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginRight: '24px',
                  padding: '8px 12px',
                  borderRadius: '8px'
                }}
              >
                <ChevronLeft style={{width: '16px', height: '16px', marginRight: '8px'}} />
                Back to Dashboard
              </button>
              <div>
                <h1 style={{fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#111827'}}>
                  ISO 50001 Energy Management Assessment
                </h1>
                <p style={{color: '#6b7280', margin: '4px 0', fontSize: '16px'}}>
                  Comprehensive energy management system evaluation
                </p>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Overall Progress</div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: getOverallProgress() >= 80 ? '#10b981' : '#f59e0b',
                backgroundColor: getOverallProgress() >= 80 ? '#d1fae5' : '#fef3c7',
                padding: '8px 16px',
                borderRadius: '12px'
              }}>
                {getOverallProgress()}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
        <div style={{marginBottom: '32px'}}>
          <div style={{
            display: 'flex',
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px'
          }}>
            {tabs.map((tab) => {
              const progress = calculateProgress(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? tab.color : '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <span style={{fontSize: '16px', marginRight: '8px'}}>{tab.icon}</span>
                  <span>{tab.name}</span>
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: progress === 100 ? '#d1fae5' : tab.bgColor,
                    color: progress === 100 ? '#065f46' : tab.color
                  }}>
                    {progress}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${activeTabData.bgColor} 0%, white 100%)`,
            padding: '24px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: activeTabData.bgColor,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                fontSize: '20px'
              }}>
                {activeTabData.icon}
              </div>
              <div>
                <h2 style={{fontSize: '24px', fontWeight: '600', margin: 0, color: '#111827'}}>
                  {activeTabData.name}
                </h2>
                <p style={{color: '#6b7280', margin: '4px 0', fontSize: '14px'}}>
                  Answer all questions in this section to complete your assessment
                </p>
              </div>
            </div>
          </div>

          <div style={{padding: '24px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
              {questions[activeTab].map((question, index) => (
                <div key={question.id}>
                  <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '20px'}}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: activeTabData.bgColor,
                      color: activeTabData.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginRight: '16px'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{flex: 1}}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        margin: '0 0 8px 0',
                        color: '#111827'
                      }}>
                        {question.text}
                      </h3>
                      <span style={{
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px'
                      }}>
                        {question.category}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{marginLeft: '48px', display: 'flex', gap: '12px'}}>
                    {['Yes', 'Partial', 'No', 'N/A'].map((option) => {
                      const isSelected = responses[question.id] === option;
                      const optionColors = {
                        'Yes': { bg: '#d1fae5', color: '#065f46', border: '#10b981' },
                        'Partial': { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
                        'No': { bg: '#fef2f2', color: '#991b1b', border: '#ef4444' },
                        'N/A': { bg: '#f3f4f6', color: '#374151', border: '#9ca3af' }
                      };
                      
                      return (
                        <label key={option} style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: `2px solid ${isSelected ? optionColors[option].border : '#e5e7eb'}`,
                          backgroundColor: isSelected ? optionColors[option].bg : 'white',
                          color: isSelected ? optionColors[option].color : '#6b7280',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={isSelected}
                            onChange={(e) => handleResponse(question.id, e.target.value)}
                            style={{display: 'none'}}
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISO50001Assessment;
