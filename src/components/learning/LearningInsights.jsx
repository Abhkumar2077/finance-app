import { useAppContext } from '../../context/AppContext'
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react'

export function LearningInsights() {
  const { state } = useAppContext()
  const { learningWeights } = state

  const totalDecisions = learningWeights.acceptedPatterns.length + learningWeights.rejectedPatterns.length
  
  const getTopInsights = () => {
    const insights = []
    
    // Find most accepted type
    const acceptedByType = {}
    learningWeights.acceptedPatterns.forEach(pattern => {
      acceptedByType[pattern.type] = (acceptedByType[pattern.type] || 0) + 1
    })
    
    const topAcceptedType = Object.entries(acceptedByType)
      .sort(([, a], [, b]) => b - a)[0]
    
    if (topAcceptedType) {
      insights.push({
        icon: TrendingUp,
        color: 'green',
        text: `You frequently accept ${topAcceptedType[0].replace('_', ' ')} suggestions`,
        strength: (topAcceptedType[1] / learningWeights.acceptedPatterns.length) * 100
      })
    }
    
    // Find most rejected type
    const rejectedByType = {}
    learningWeights.rejectedPatterns.forEach(pattern => {
      rejectedByType[pattern.type] = (rejectedByType[pattern.type] || 0) + 1
    })
    
    const topRejectedType = Object.entries(rejectedByType)
      .sort(([, a], [, b]) => b - a)[0]
    
    if (topRejectedType) {
      insights.push({
        icon: TrendingDown,
        color: 'red',
        text: `You often reject ${topRejectedType[0].replace('_', ' ')} suggestions`,
        strength: (topRejectedType[1] / learningWeights.rejectedPatterns.length) * 100
      })
    }
    
    // Find strongest preference
    const strongestWeight = Object.entries(learningWeights.suggestionTypes)
      .sort(([, a], [, b]) => Math.abs(b - 1) - Math.abs(a - 1))[0]
    
    if (strongestWeight && Math.abs(strongestWeight[1] - 1) > 0.2) {
      insights.push({
        icon: Target,
        color: 'blue',
        text: `Strong preference for ${strongestWeight[0].replace('_', ' ')} suggestions`,
        strength: Math.abs(strongestWeight[1] - 1) * 100
      })
    }
    
    return insights.slice(0, 3) // Return top 3 insights
  }

  const insights = getTopInsights()

  if (totalDecisions < 3) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-800">AI Learning Status</h3>
        </div>
        <p className="text-yellow-700 mb-2">
          AI needs more data to learn your preferences.
        </p>
        <p className="text-sm text-yellow-600">
          Make at least 3 more decisions on AI suggestions to enable personalized learning.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${(totalDecisions / 3) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-yellow-700">{totalDecisions}/3 decisions</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold text-gray-800">AI Learning Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              insight.color === 'green' ? 'bg-green-100' :
              insight.color === 'red' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <insight.icon className={`h-4 w-4 ${
                insight.color === 'green' ? 'text-green-600' :
                insight.color === 'red' ? 'text-red-600' : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{insight.text}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      insight.color === 'green' ? 'bg-green-500' :
                      insight.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(insight.strength, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{insight.strength.toFixed(0)}% strength</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          Based on {totalDecisions} decisions • {learningWeights.acceptedPatterns.length} accepted • {learningWeights.rejectedPatterns.length} rejected
        </p>
      </div>
    </div>
  )
}