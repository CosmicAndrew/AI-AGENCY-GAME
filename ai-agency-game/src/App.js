import React, { useState, useEffect } from 'react';

function App() {
  const [gameState, setGameState] = useState({
    budget: 50000,
    reputation: 50,
    day: 1,
    team: [],
    activeProjects: [],
    completedProjects: 0,
    gameOver: false,
    message: ''
  });

  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(null);

  const aiSpecialists = [
    { id: 1, name: 'ML Engineer', cost: 8000, skill: 'Machine Learning', description: 'Expert in training and deploying ML models' },
    { id: 2, name: 'NLP Specialist', cost: 9000, skill: 'Natural Language Processing', description: 'Specializes in text analysis and language models' },
    { id: 3, name: 'Computer Vision Expert', cost: 9500, skill: 'Computer Vision', description: 'Expert in image and video analysis' },
    { id: 4, name: 'Data Scientist', cost: 7500, skill: 'Data Analysis', description: 'Analyzes data and builds predictive models' },
    { id: 5, name: 'AI Researcher', cost: 10000, skill: 'Research', description: 'Develops cutting-edge AI solutions' }
  ];

  const availableProjects = [
    { 
      id: 1, 
      name: 'Sentiment Analysis Tool', 
      reward: 15000, 
      requiredSkill: 'Natural Language Processing', 
      duration: 3,
      description: 'Build a tool to analyze customer sentiment from reviews',
      difficulty: 'Medium'
    },
    { 
      id: 2, 
      name: 'Image Classification System', 
      reward: 18000, 
      requiredSkill: 'Computer Vision', 
      duration: 4,
      description: 'Create a system to classify product images automatically',
      difficulty: 'Hard'
    },
    { 
      id: 3, 
      name: 'Sales Prediction Model', 
      reward: 12000, 
      requiredSkill: 'Data Analysis', 
      duration: 2,
      description: 'Develop a model to predict future sales trends',
      difficulty: 'Easy'
    },
    { 
      id: 4, 
      name: 'Chatbot Development', 
      reward: 14000, 
      requiredSkill: 'Natural Language Processing', 
      duration: 3,
      description: 'Build an intelligent customer service chatbot',
      difficulty: 'Medium'
    },
    { 
      id: 5, 
      name: 'Recommendation Engine', 
      reward: 16000, 
      requiredSkill: 'Machine Learning', 
      duration: 3,
      description: 'Create a personalized product recommendation system',
      difficulty: 'Medium'
    },
    { 
      id: 6, 
      name: 'Fraud Detection System', 
      reward: 20000, 
      requiredSkill: 'Machine Learning', 
      duration: 5,
      description: 'Build a system to detect fraudulent transactions',
      difficulty: 'Hard'
    }
  ];

  const hireSpecialist = (specialist) => {
    if (gameState.budget >= specialist.cost) {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - specialist.cost,
        team: [...prev.team, { ...specialist, id: Date.now() }],
        message: `Hired ${specialist.name}!`
      }));
      setShowModal(null);
    } else {
      setGameState(prev => ({ ...prev, message: 'Not enough budget!' }));
    }
  };

  const startProject = (project) => {
    const hasRequiredSkill = gameState.team.some(member => member.skill === project.requiredSkill);
    
    if (!hasRequiredSkill) {
      setGameState(prev => ({ 
        ...prev, 
        message: `You need a specialist with ${project.requiredSkill} skill!` 
      }));
      return;
    }

    if (gameState.activeProjects.length >= 3) {
      setGameState(prev => ({ 
        ...prev, 
        message: 'You can only work on 3 projects at a time!' 
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      activeProjects: [...prev.activeProjects, { ...project, daysLeft: project.duration }],
      message: `Started project: ${project.name}!`
    }));
    setShowModal(null);
  };

  const nextDay = () => {
    setGameState(prev => {
      const updatedProjects = prev.activeProjects.map(p => ({
        ...p,
        daysLeft: p.daysLeft - 1
      }));

      const completedToday = updatedProjects.filter(p => p.daysLeft === 0);
      const stillActive = updatedProjects.filter(p => p.daysLeft > 0);

      const totalReward = completedToday.reduce((sum, p) => sum + p.reward, 0);
      const reputationGain = completedToday.length * 5;
      
      const dailyCost = prev.team.length * 200;
      const newBudget = prev.budget + totalReward - dailyCost;

      let message = '';
      if (completedToday.length > 0) {
        message = `Completed ${completedToday.length} project(s)! Earned $${totalReward}`;
      }

      if (newBudget <= 0 && prev.team.length > 0) {
        return {
          ...prev,
          gameOver: true,
          message: 'Game Over! You ran out of money.'
        };
      }

      return {
        ...prev,
        day: prev.day + 1,
        budget: newBudget,
        reputation: Math.min(100, prev.reputation + reputationGain),
        activeProjects: stillActive,
        completedProjects: prev.completedProjects + completedToday.length,
        message: message || `Day ${prev.day + 1} - Daily costs: $${dailyCost}`
      };
    });
  };

  useEffect(() => {
    if (gameState.message) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, message: '' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState.message]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Game Over!</h1>
          <p className="text-xl text-gray-700 mb-6">{gameState.message}</p>
          <div className="space-y-2 mb-8">
            <p className="text-lg">Days Survived: <span className="font-bold">{gameState.day}</span></p>
            <p className="text-lg">Projects Completed: <span className="font-bold">{gameState.completedProjects}</span></p>
            <p className="text-lg">Final Reputation: <span className="font-bold">{gameState.reputation}</span></p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">AI Agency Manager</h1>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-xl font-bold text-green-600">${gameState.budget.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Reputation</p>
                <p className="text-xl font-bold text-purple-600">{gameState.reputation}/100</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Day</p>
                <p className="text-xl font-bold text-blue-600">{gameState.day}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {gameState.message && (
        <div className="bg-indigo-600 text-white px-6 py-3 text-center font-semibold">
          {gameState.message}
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedTab === 'dashboard' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSelectedTab('team')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedTab === 'team' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Team ({gameState.team.length})
          </button>
          <button
            onClick={() => setSelectedTab('projects')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedTab === 'projects' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Projects ({gameState.activeProjects.length}/3)
          </button>
          <button
            onClick={nextDay}
            className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Next Day →
          </button>
        </div>

        {/* Dashboard Tab */}
        {selectedTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Size</h3>
                <p className="text-4xl font-bold text-indigo-600">{gameState.team.length}</p>
                <p className="text-sm text-gray-600 mt-2">Daily cost: ${gameState.team.length * 200}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Projects</h3>
                <p className="text-4xl font-bold text-blue-600">{gameState.activeProjects.length}</p>
                <p className="text-sm text-gray-600 mt-2">Max: 3 concurrent</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
                <p className="text-4xl font-bold text-green-600">{gameState.completedProjects}</p>
                <p className="text-sm text-gray-600 mt-2">Total projects done</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to AI Agency Manager!</h2>
              <div className="space-y-3 text-gray-700">
                <p>🎯 <strong>Goal:</strong> Build a successful AI agency by hiring specialists and completing projects.</p>
                <p>💼 <strong>Hire Team:</strong> Recruit AI specialists with different skills (ML, NLP, Computer Vision, etc.)</p>
                <p>📋 <strong>Take Projects:</strong> Match projects with your team's skills to earn money and reputation.</p>
                <p>💰 <strong>Manage Budget:</strong> Each team member costs $200/day. Keep your budget positive!</p>
                <p>⭐ <strong>Build Reputation:</strong> Complete projects to increase your reputation and unlock better opportunities.</p>
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {selectedTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Team</h2>
                <button
                  onClick={() => setShowModal('hire')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  + Hire Specialist
                </button>
              </div>
              {gameState.team.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No team members yet. Hire your first specialist!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameState.team.map((member) => (
                    <div key={member.id} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
                      <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                      <p className="text-indigo-600 font-semibold">{member.skill}</p>
                      <p className="text-sm text-gray-600 mt-2">{member.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Daily cost: $200</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {selectedTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Projects</h2>
              {gameState.activeProjects.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No active projects. Start a new project below!</p>
              ) : (
                <div className="space-y-4">
                  {gameState.activeProjects.map((project) => (
                    <div key={project.id} className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          <p className="text-sm text-indigo-600 font-semibold mt-2">Required: {project.requiredSkill}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${project.reward.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-1">{project.daysLeft} days left</p>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${((project.duration - project.daysLeft) / project.duration) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableProjects.map((project) => {
                  const hasSkill = gameState.team.some(member => member.skill === project.requiredSkill);
                  const isActive = gameState.activeProjects.some(p => p.id === project.id);
                  
                  return (
                    <div key={project.id} className={`border-2 rounded-lg p-4 ${
                      isActive ? 'border-gray-300 bg-gray-100' : 'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                        <span className={`text-sm font-semibold ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="space-y-1 text-sm mb-3">
                        <p className="text-gray-700">
                          <strong>Reward:</strong> <span className="text-green-600 font-bold">${project.reward.toLocaleString()}</span>
                        </p>
                        <p className="text-gray-700"><strong>Duration:</strong> {project.duration} days</p>
                        <p className={hasSkill ? 'text-green-600' : 'text-red-600'}>
                          <strong>Required:</strong> {project.requiredSkill} {hasSkill ? '✓' : '✗'}
                        </p>
                      </div>
                      <button
                        onClick={() => startProject(project)}
                        disabled={isActive}
                        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                          isActive
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isActive ? 'In Progress' : 'Start Project'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hire Modal */}
      {showModal === 'hire' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Hire AI Specialist</h2>
              <button
                onClick={() => setShowModal(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {aiSpecialists.map((specialist) => (
                <div key={specialist.id} className="border-2 border-indigo-200 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{specialist.name}</h3>
                      <p className="text-indigo-600 font-semibold">{specialist.skill}</p>
                    </div>
                    <p className="text-xl font-bold text-green-600">${specialist.cost.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{specialist.description}</p>
                  <button
                    onClick={() => hireSpecialist(specialist)}
                    disabled={gameState.budget < specialist.cost}
                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                      gameState.budget < specialist.cost
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {gameState.budget < specialist.cost ? 'Not Enough Budget' : 'Hire'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
