import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientInformationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    legalName: '',
    registrationNumber: '',
    taxId: '',
    industry: '',
    companySize: '',
    website: '',
    primaryContactName: '',
    title: '',
    email: '',
    phone: '',
    alternateContact: '',
    alternateEmail: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: '',
    swiftCode: '',
    esgStandards: [],
    assessmentFrequency: '',
    certificationNeeded: false,
    hasPaymentTracker: false,
    hasHubSpot: false,
    hasZohoAnalytics: false,
    agreeToTerms: false,
    dataProcessingConsent: false,
    signature: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    alert('Client information submitted successfully! We will contact you within 24 hours.');
    navigate('/dashboard');
  };

  const steps = [
    { number: 1, title: 'Company Information' },
    { number: 2, title: 'Contact Details' },
    { number: 3, title: 'Address Information' },
    { number: 4, title: 'Banking Details' },
    { number: 5, title: 'ESG Requirements' },
    { number: 6, title: 'System Integrations' },
    { number: 7, title: 'Review & Submit' }
  ];

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#2c3e50'
  };

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
      overflowX: 'auto'
    }}>
      {steps.map((step, index) => (
        <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: currentStep >= step.number ? '#e67e22' : '#e9ecef',
            color: currentStep >= step.number ? 'white' : '#6c757d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            margin: '0 10px'
          }}>
            {currentStep > step.number ? '✓' : step.number}
          </div>
          <div style={{
            textAlign: 'center',
            minWidth: '100px',
            fontSize: '12px',
            color: currentStep >= step.number ? '#e67e22' : '#6c757d'
          }}>
            {step.title}
          </div>
          {index < steps.length - 1 && (
            <div style={{
              width: '30px',
              height: '2px',
              backgroundColor: currentStep > step.number ? '#e67e22' : '#e9ecef',
              margin: '0 10px'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const renderFormSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Company Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Company Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Legal Business Name</label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Financial Services</option>
                  <option value="energy">Energy & Utilities</option>
                  <option value="construction">Construction</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Company Size *</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-1000">201-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Contact Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  value={formData.primaryContactName}
                  onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Address Information</h2>
            <div>
              <label style={labelStyle}>Business Address *</label>
              <input
                type="text"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>State/Province *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>ZIP/Postal Code *</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Banking Information</h2>
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '15px', 
              borderRadius: '6px', 
              marginBottom: '25px',
              border: '1px solid #ffeaa7'
            }}>
              <strong>Secure Payment Processing:</strong> All banking information is encrypted and processed securely.
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Bank Name *</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Account Holder Name *</label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Account Number *</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Routing Number *</label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>ESG Requirements</h2>
            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Required ESG Standards *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                {[
                  { value: 'iso50001', label: 'ISO 50001 - Energy Management' },
                  { value: 'iso14001', label: 'ISO 14001 - Environmental Management' },
                  { value: 'iso45001', label: 'ISO 45001 - Health & Safety' },
                  { value: 'gri', label: 'GRI Standards' },
                  { value: 'sasb', label: 'SASB Standards' },
                  { value: 'tcfd', label: 'TCFD Framework' }
                ].map(standard => (
                  <label key={standard.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.esgStandards.includes(standard.value)}
                      onChange={(e) => handleArrayChange('esgStandards', standard.value, e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    {standard.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>System Integrations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasPaymentTracker}
                    onChange={(e) => handleInputChange('hasPaymentTracker', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <strong>PaymentTracker Integration</strong>
                </label>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasHubSpot}
                    onChange={(e) => handleInputChange('hasHubSpot', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <strong>HubSpot CRM Integration</strong>
                </label>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasZohoAnalytics}
                    onChange={(e) => handleInputChange('hasZohoAnalytics', e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <strong>Zoho Analytics Integration</strong>
                </label>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>Review & Submit</h2>
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>Application Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                <div><strong>Company:</strong> {formData.companyName}</div>
                <div><strong>Industry:</strong> {formData.industry}</div>
                <div><strong>Contact:</strong> {formData.primaryContactName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    style={{ marginRight: '8px', marginTop: '2px' }}
                    required
                  />
                  <span style={{ fontSize: '14px' }}>
                    I agree to the Terms of Service and Privacy Policy *
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.dataProcessingConsent}
                    onChange={(e) => handleInputChange('dataProcessingConsent', e.target.checked)}
                    style={{ marginRight: '8px', marginTop: '2px' }}
                    required
                  />
                  <span style={{ fontSize: '14px' }}>
                    I consent to the processing of business data for ESG assessment purposes *
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Digital Signature *</label>
              <input
                type="text"
                value={formData.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
                style={inputStyle}
                placeholder="Type your full name as digital signature"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#2c3e50', margin: '0 0 10px 0', fontSize: '28px' }}>
            ESG Navigator Client Registration
          </h1>
          <p style={{ color: '#7f8c8d', margin: 0, fontSize: '16px' }}>
            Complete your information to begin comprehensive ESG assessment services
          </p>
        </div>

        {renderStepIndicator()}

        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          {renderFormSection()}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '20px 40px',
          borderRadius: '12px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            style={{
              backgroundColor: currentStep === 1 ? '#e9ecef' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Previous
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              Step {currentStep} of {steps.length}
            </div>
          </div>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              style={{
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.agreeToTerms || !formData.dataProcessingConsent || !formData.signature}
              style={{
                backgroundColor: (formData.agreeToTerms && formData.dataProcessingConsent && formData.signature) 
                  ? '#27ae60' : '#e9ecef',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '6px',
                cursor: (formData.agreeToTerms && formData.dataProcessingConsent && formData.signature) 
                  ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInformationForm;