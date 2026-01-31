import { useAppContext } from '../../context/AppContext'
import { Zap, RefreshCw } from 'lucide-react'

export function SmartSuggestionGenerator() {
  const { state, dispatch } = useAppContext()
  const { learningWeights = {} } = state

  const generateSmartSuggestion = () => {
    // Get suggestion types (safe access)
    const suggestionTypes = Object.entries(learningWeights.suggestionTypes || {})
      .sort(([, weightA], [, weightB]) => weightB - weightA)
      .map(([type]) => type)

    // Get categories (safe access)
    const categories = Object.entries(learningWeights.categories || {})
      .sort(([, weightA], [, weightB]) => weightB - weightA)
      .map(([category]) => category)

    // Pick type and category based on weights or use defaults
    const type = suggestionTypes[0] || 'budget_adjustment'
    const category = categories[0] || 'Groceries'

    // Calculate confidence safely
    const typeWeight = learningWeights.suggestionTypes?.[type] || 1.0
    const categoryWeight = learningWeights.categories?.[category] || 1.0
    const baseConfidence = 70
    const confidence = Math.min(
      95,
      Math.floor(baseConfidence + (typeWeight - 1) * 10 + (categoryWeight - 1) * 10)
    )

    const suggestions = {
      budget_adjustment: {
        title: `Adjust ${category} Budget`,
        description: `Based on your preferences, consider adjusting your ${category.toLowerCase()} budget.`,
        rationale: `You've previously shown interest in ${category.toLowerCase()} budget adjustments.`,
        dataReferences: [
          'Weighted by your preference patterns',
          `Focus: ${category}`,
          `Type: Budget adjustment`
        ],
        type: 'budget_adjustment',
        category,
        confidence,
        proposedChange: { 
          category, 
          newAmount: Math.floor(Math.random() * 150) + 50 
        }
      },
      risk_alert: {
        title: `${category} Spending Insight`,
        description: `Smart monitoring suggestion for ${category.toLowerCase()} based on your patterns.`,
        rationale: `You often review ${category.toLowerCase()} spending alerts.`,
        dataReferences: [
          'Learning from your past decisions',
          `Category focus: ${category}`,
          `Alert type: Spending pattern`
        ],
        type: 'risk_alert',
        category,
        confidence,
        proposedChange: { 
          alert: 'smart_monitor', 
          categoryId: category 
        }
      }
    }

    const suggestion = suggestions[type] || suggestions.budget_adjustment

    dispatch({
      type: 'GENERATE_NEW_SUGGESTION',
      payload: suggestion
    })

    return suggestion
  }

  const getRecommendationReason = () => {
    const topType = Object.entries(learningWeights.suggestionTypes || {})
      .sort(([, a], [, b]) => b - a)[0]
    const topCategory = Object.entries(learningWeights.categories || {})
      .sort(([, a], [, b]) => b - a)[0]

    if (topType && topCategory) {
      return `Based on your history, you prefer ${topType[0].replace('_', ' ')} suggestions about ${topCategory[0].toLowerCase()}.`
    }
    return "Based on general patterns."
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Smart Suggestion Generator</h3>
            <p className="text-sm text-gray-600">AI learns from your decisions</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">{getRecommendationReason()}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>Higher weights = More frequent suggestions</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generateSmartSuggestion}
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Generate Smart Suggestion
        </button>
        
        <button
          onClick={() => {
            const suggestion = generateSmartSuggestion()
            alert(`Generated: ${suggestion.title}\nConfidence: ${suggestion.confidence}%`)
          }}
          className="px-4 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Test
        </button>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 mb-1">Current Learning Weights:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(learningWeights.suggestionTypes || {})
            .filter(([, weight]) => weight !== 1.0)
            .map(([type, weight]) => (
              <span 
                key={type} 
                className={`px-2 py-1 rounded text-xs ${
                  weight > 1.0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {type.replace('_', ' ')}: {weight.toFixed(1)}x
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}