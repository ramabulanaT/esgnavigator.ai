import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Leaf, Brain, Users, Rocket } from 'lucide-react';

const CSMTrainingLanding = () => {
  const navigate = useNavigate();

  const domains = [
    {
      id: 'grc',
      title: 'Governance, Risk & Compliance',
      icon: Shield,
      description: 'Master GRC frameworks and ESG compliance',
      color: 'bg-blue-500'
    },
    {
      id: 'esg',
      title: 'ESG & Sustainability',
      icon: Leaf,
      description: 'Lead sustainability initiatives and reporting',
      color: 'bg-green-500'
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      icon: Brain,
      description: 'Implement AI solutions for business impact',
      color: 'bg-purple-500'
    },
    {
      id: 'leadership',
      title: 'Leadership & Strategy',
      icon: Users,
      description: 'Drive organizational transformation',
      color: 'bg-orange-500'
    },
    {
      id: 'digital-transformation',
      title: 'Digital Transformation',
      icon: Rocket,
      description: 'Lead enterprise digital innovation and change',
      color: 'bg-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">CSM Training Portal</h1>
          <p className="text-xl text-purple-200">Professional development for modern business leaders</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {domains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                onClick={() => navigate(`/training/${domain.id}`)}
                className="bg-white rounded-lg p-8 cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className={`${domain.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{domain.title}</h3>
                <p className="text-gray-600">{domain.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CSMTrainingLanding;
