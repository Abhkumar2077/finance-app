import { useAppContext } from '../../context/AppContext'
import { TrendingUp, TrendingDown, Brain, RefreshCw, AlertCircle, PieChart } from 'lucide-react'

export function LearningDashboard() {
  const { state, dispatch } = useAppContext()
  const { learningWeights } = state

  const totalSuggestions = state.suggestions.length
  const acceptedCount = state.suggestions.filter(s => s.status === 'accepted').length
  const rejectedCount = state.suggestions.filter(s => s.status === 'rejected').length
  const acceptanceRate = totalSuggestions > 0 ? (acceptedCount / totalSuggestions) * 100 : 0

  const getWeightColor = (weight) => {
    if (weight >= 1.2) return 'text-green-600'
    if (weight <= 0.8) return 'text-red-600'
    return 'text-yellow-600'
  }

  const getWeightIcon = (weight) => {
    if (weight >= 1.2) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (weight <= 0.8) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <TrendingUp className="h-4 w-4 text-yellow-500" />
  }

  const generateTestSuggestion = () => {
    const suggestionTypes = ['budget_adjustment', 'risk_alert', 'category_restructure']
    const categories = ['Groceries', 'Dining Out', 'Entertainment', 'Transportation']
    
    const type = suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    
    const suggestions = {
      budget_adjustment: {
        title: `Adjust ${category} Budget`,
        description: `Consider adjusting your ${category.toLowerCase()} budget based on recent patterns.`,
        rationale: 'Based on 4 weeks of spending data analysis.',
        type: 'budget_adjustment',
        category,
        confidence: Math.floor(Math.random() * 30) + 70,
        proposedChange: { category, newAmount: Math.floor(Math.random() * 200) + 50 }
      },
      risk_alert: {
        title: `${category} Spending Pattern`,
        description: `Unusual spending pattern detected in ${category.toLowerCase()} category.`,
        rationale: 'Multiple transactions detected in short timeframe.',
        type: 'risk_alert',
        category,
        confidence: Math.floor(Math.random() * 30) + 70,
        proposedChange: { alert: 'monitor_category', categoryId: category }
      }
    }

    dispatch({
      type: 'GENERATE_NEW_SUGGESTION',
      payload: suggestions[type] || suggestions.budget_adjustment
    })
  }

  const resetLearning = () => {
    if (window.confirm('Reset all learning data? This will clear your preference history.')) {
      dispatch({ type: 'RESET_LEARNING' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">AI Learning System</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateTestSuggestion}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Test Suggestion
          </button>
          <button
            onClick={resetLearning}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            Reset Learning
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuggestions}</p>
            </div>
            <Brain className="h-5 w-5 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div>
            <p className="text-sm text-gray-500">Acceptance Rate</p>
            <p className="text-2xl font-bold text-green-600">{acceptanceRate.toFixed(0)}%</p>
            <p className="text-xs text-gray-500">{acceptedCount} accepted</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div>
            <p className="text-sm text-gray-500">Rejection Rate</p>
            <p className="text-2xl font-bold text-red-600">{((rejectedCount / totalSuggestions) * 100).toFixed(0) || 0}%</p>
            <p className="text-xs text-gray-500">{rejectedCount} rejected</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div>
            <p className="text-sm text-gray-500">Learning Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(learningWeights.acceptedPatterns).length + Object.keys(learningWeights.rejectedPatterns).length}
            </p>
            <p className="text-xs text-gray-500">Patterns learned</p>
          </div>
        </div>
      </div>

      {/* Learning Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suggestion Type Weights */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Suggestion Type Preferences
          </h3>
          <div className="space-y-3">
            {Object.entries(learningWeights.suggestionTypes).map(([type, weight]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeightIcon(weight)}
                  <span className="text-sm text-gray-700 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        weight >= 1.2 ? 'bg-green-500' :
                        weight <= 0.8 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(weight * 50, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getWeightColor(weight)}`}>
                    {weight.toFixed(2)}x
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Higher weight = AI will suggest this type more often
          </p>
        </div>

        {/* Category Weights */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Category Preferences
          </h3>
          <div className="space-y-3">
            {Object.entries(learningWeights.categories).map(([category, weight]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getWeightIcon(weight)}
                  <span className="text-sm text-gray-700">{category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        weight >= 1.2 ? 'bg-green-500' :
                        weight <= 0.8 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(weight * 50, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getWeightColor(weight)}`}>
                    {weight.toFixed(2)}x
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Higher weight = AI focuses more on this category
          </p>
        </div>
      </div>

      {/* Learning Patterns */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Learning Patterns</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accepted Patterns */}
          <div>
            <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Accepted Patterns ({learningWeights.acceptedPatterns.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {learningWeights.acceptedPatterns.length > 0 ? (
                learningWeights.acceptedPatterns.map((pattern, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium text-green-800 capitalize">
                          {pattern.type?.replace('_', ' ')}
                        </span>
                        {pattern.category && (
                          <span className="text-sm text-green-700 ml-2">• {pattern.category}</span>
                        )}
                      </div>
                      <span className="text-xs text-green-600">
                        {new Date(pattern.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No accepted patterns yet</p>
              )}
            </div>
          </div>

          {/* Rejected Patterns */}
          <div>
            <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              Rejected Patterns ({learningWeights.rejectedPatterns.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {learningWeights.rejectedPatterns.length > 0 ? (
                learningWeights.rejectedPatterns.map((pattern, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium text-red-800 capitalize">
                          {pattern.type?.replace('_', ' ')}
                        </span>
                        {pattern.category && (
                          <span className="text-sm text-red-700 ml-2">• {pattern.category}</span>
                        )}
                      </div>
                      <span className="text-xs text-red-600">
                        {new Date(pattern.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No rejected patterns yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Learning Explanation */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">How AI Learning Works</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• When you accept suggestions, AI increases focus on similar suggestions</li>
            <li>• When you reject suggestions, AI reduces focus on similar suggestions</li>
            <li>• Weights adjust gradually (max 1.5x, min 0.3x multiplier)</li>
            <li>• Your preferences are saved locally in your browser</li>
            <li>• AI becomes more personalized over time</li>
          </ul>
        </div>
      </div>
    </div>
  )
}