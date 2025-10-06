import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CSMDomainDetail = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();

  const domainData = {
    'grc': {
      title: 'Governance, Risk & Compliance',
      price: 'R15,000',
      duration: '8 weeks',
      description: 'Comprehensive GRC training covering ISO standards and ESG compliance'
    },
    'esg': {
      title: 'ESG & Sustainability',
      price: 'R12,000',
      duration: '6 weeks',
      description: 'Master ESG reporting and sustainability management'
    },
    'ai-ml': {
      title: 'AI & Machine Learning',
      price: 'R18,000',
      duration: '10 weeks',
      description: 'Practical AI implementation for business applications'
    },
    'leadership': {
      title: 'Leadership & Strategy',
      price: 'R10,000',
      duration: '6 weeks',
      description: 'Strategic leadership for organizational transformation'
    }
}'digital-transformation': {
      title: 'Digital Transformation',
      price: 'R16,000',
      duration: '8 weeks',
      description: 'Lead enterprise digital transformation with proven frameworks and change management strategies'
      };

  const domain = domainData[domainId];

  if (!domain) {
    return <div className="p-8">Domain not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/training')}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to all domains
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{domain.title}</h1>
          <div className="flex gap-4 mb-6">
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded">{domain.price}</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded">{domain.duration}</span>
          </div>
          <p className="text-gray-600 text-lg mb-8">{domain.description}</p>
          
          <button
            onClick={() => navigate('/training/enroll', { state: { domain: domain.title } })}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSMDomainDetail;
