import { useState } from 'react'
import { Brain, Zap, TrendingUp, Clock, Calendar, Target, BarChart } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { getAIEngine } from '../../utils/aiLearningEngine'

export function AdvancedAIPanel() {
  const { state, dispatch } = useAppContext()
  const [showDetails, setShowDetails] = useState(false)
  
  const aiEngine = getAIEngine(state.learningWeights)
  const insights = aiEngine.getInsights()
  
  const generateAdvancedSuggestion = () => {
    dispatch({ type: 'GENERATE_ADVANCED_SUGGESTION' })
  }
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    return 'evening'
  }
  
  const getLearningLevel = () => {
    const totalDecisions = state.learningWeights.acceptedPatterns.length + 
                          state.learningWeights.rejectedPatterns.length
    
    if (totalDecisions < 5) return { level: 'Beginner', color: 'blue', progress: (totalDecisions / 5) * 100 }
    if (totalDecisions < 15) return { level: 'Intermediate', color: 'green', progress: (totalDecisions / 15) * 100 }
    if (totalDecisions < 30) return { level: 'Advanced', color: 'purple', progress: (totalDecisions / 30) * 100 }
    return { level: 'Expert', color: 'yellow', progress: 100 }
  }
  
  const learningLevel = getLearningLevel()

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Advanced AI Learning</h2>
            <p className="text-gray-300 text-sm">Personalized financial intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Learning Level */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="font-medium">AI Learning Level</span>
          </div>
          <span className={`font-bold text-${learningLevel.color}-400`}>
            {learningLevel.level}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full bg-gradient-to-r from-${learningLevel.color}-500 to-${learningLevel.color}-300`}
            style={{ width: `${learningLevel.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {state.learningWeights.acceptedPatterns.length + state.learningWeights.rejectedPatterns.length} decisions analyzed
        </p>
      </div>

      {/* Generate Advanced Suggestion */}
      <div className="mb-6">
        <button
          onClick={generateAdvancedSuggestion}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
        >
          <Zap className="h-5 w-5" />
          Generate Advanced AI Suggestion
        </button>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Uses pattern recognition and time-based learning
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-300">Top Type</span>
          </div>
          <div className="text-lg font-bold">
            {Object.entries(state.learningWeights.suggestionTypes)
              .sort(([, a], [, b]) => b - a)[0]?.[0]?.replace('_', ' ') || 'Budget'}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-300">Top Category</span>
          </div>
          <div className="text-lg font-bold">
            {Object.entries(state.learningWeights.categories)
              .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Groceries'}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Best Time</span>
          </div>
          <div className="text-lg font-bold capitalize">
            {getTimeOfDay()}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-300">Patterns</span>
          </div>
          <div className="text-lg font-bold">
            {insights.patterns?.length || 0}
          </div>
        </div>
      </div>

      {/* Detailed Insights (Collapsible) */}
      {showDetails && insights.readiness && (
        <div className="border-t border-gray-700 pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Learning Insights
          </h3>
          
          {/* Type Preferences */}
          {insights.typePreferences.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Type Preferences</h4>
              <div className="space-y-2">
                {insights.typePreferences.map(pref => (
                  <div key={pref.type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{pref.type.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${Math.min((parseFloat(pref.weight) - 1) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{pref.preference}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Detected Patterns */}
          {insights.patterns.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Detected Patterns</h4>
              <div className="space-y-2">
                {insights.patterns.map((pattern, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">
                        {pattern.type.replace('_', ' ')}: {pattern.value}
                      </span>
                      <span className="text-sm text-green-400">
                        {pattern.acceptanceRate}% acceptance
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Strength: {pattern.strength}% • {pattern.strength > 70 ? 'Strong' : 'Moderate'} pattern
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Learning Progress */}
          <div className="p-3 bg-gray-800/30 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Learning Progress</span>
              <span className="text-green-400">{insights.learningProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                style={{ width: `${insights.learningProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              AI becomes more accurate with more decisions. {insights.totalDecisions}/20 decisions needed for full learning.
            </p>
          </div>
        </div>
      )}

      {showDetails && !insights.readiness && (
        <div className="border-t border-gray-700 pt-6 text-center py-4">
          <p className="text-gray-300">Collect more data to see advanced insights</p>
          <p className="text-sm text-gray-400 mt-1">
            Make {3 - (state.learningWeights.acceptedPatterns.length + state.learningWeights.rejectedPatterns.length)} more decisions
          </p>
        </div>
      )}
    </div>
  )
}