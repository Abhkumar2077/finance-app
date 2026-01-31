import { TrendingUp, TrendingDown, BarChart3, Target, AlertCircle } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { predictMonthlySpending, predictCategorySpending } from '../../utils/predictiveAnalytics'
import { useEffect } from 'react'

export function PredictiveInsights() {
  const { state, dispatch } = useAppContext()
  
  useEffect(() => {
    // Calculate predictions when transactions change
    const predictions = predictMonthlySpending(state.transactions)
    dispatch({ type: 'UPDATE_PREDICTIONS', payload: predictions })
  }, [state.transactions, dispatch])
  
  const predictions = state.predictions
  
  if (!predictions) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  const categoryPredictions = ['Groceries', 'Dining Out', 'Entertainment']
    .map(category => predictCategorySpending(state.transactions, category))
    .filter(pred => pred !== null)
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold text-gray-800">Predictive Insights</h3>
      </div>
      
      {/* Monthly Spending Prediction */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-gray-600">Next Month's Spending</p>
            <p className="text-2xl font-bold text-gray-900">${predictions.predictedNextMonth}</p>
          </div>
          {predictions.trend === 'increasing' ? (
            <TrendingUp className="h-8 w-8 text-red-500" />
          ) : (
            <TrendingDown className="h-8 w-8 text-green-500" />
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Based on {predictions.dataPoints} months of data</span>
          <span className={`px-2 py-1 rounded ${predictions.confidence === 'high' ? 'bg-green-100 text-green-800' : predictions.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
            {predictions.confidence} confidence
          </span>
        </div>
      </div>
      
      {/* Category Predictions */}
      {categoryPredictions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category Forecast</h4>
          <div className="space-y-3">
            {categoryPredictions.map(pred => (
              <div key={pred.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{pred.category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min(pred.predictedNextMonth / 500 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">${pred.predictedNextMonth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* AI Recommendations */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <h4 className="text-sm font-medium text-gray-700">AI Recommendations</h4>
        </div>
        <ul className="space-y-2">
          {predictions.trend === 'increasing' && (
            <li className="flex items-start text-sm text-gray-600">
              <span className="mr-2">•</span>
              Spending trend is increasing. Consider setting stricter budgets.
            </li>
          )}
          {predictions.confidence === 'low' && (
            <li className="flex items-start text-sm text-gray-600">
              <span className="mr-2">•</span>
              Add more transaction history for accurate predictions.
            </li>
          )}
          {categoryPredictions.some(p => p.pattern === 'weekly_peak') && (
            <li className="flex items-start text-sm text-gray-600">
              <span className="mr-2">•</span>
              Some categories show weekly spending patterns.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}