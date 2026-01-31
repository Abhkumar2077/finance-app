import { Heart, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { calculateFinancialHealth } from '../../utils/financialHealth'

export function FinancialHealthScore() {
  const { state } = useAppContext()
  const health = calculateFinancialHealth(state)
  
  const getColorClasses = (color) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100'
      case 'yellow': return 'text-yellow-600 bg-yellow-100'
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'red': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-gray-800">Financial Health</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(health.color)}`}>
          {health.rating}
        </div>
      </div>
      
      {/* Score Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{health.score}</div>
              <div className="text-xs text-gray-500">/100</div>
            </div>
          </div>
          <div 
            className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-transparent"
            style={{
              borderTopColor: health.color === 'green' ? '#10B981' : 
                            health.color === 'yellow' ? '#F59E0B' :
                            health.color === 'blue' ? '#3B82F6' : '#EF4444',
              transform: 'rotate(45deg)',
              clipPath: `inset(0 ${100 - health.score}% 0 0)`
            }}
          ></div>
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="space-y-3">
        {Object.entries(health.breakdown).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {value >= 70 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : value >= 50 ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-gray-600 capitalize">
                {key.replace('Score', '').replace(/([A-Z])/g, ' $1')}
              </span>
            </div>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
      
      {/* Recommendations */}
      {health.recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {health.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <span className="mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}