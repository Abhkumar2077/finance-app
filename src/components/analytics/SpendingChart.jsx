import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export function SpendingChart() {
  const { state } = useAppContext()
  
  // Calculate category spending
  const categorySpending = state.transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category || 'Other'
      acc[category] = (acc[category] || 0) + Math.abs(t.amount)
      return acc
    }, {})
  
  const topCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({ category, amount }))
  
  // Calculate monthly trends
  const monthlySpending = state.transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const month = t.date.split(' ')[0] // Get month from "Jan 28"
      acc[month] = (acc[month] || 0) + Math.abs(t.amount)
      return acc
    }, {})
  
  return (
    <div className="space-y-6">
      {/* Top Categories */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800">Top Spending Categories</h3>
        </div>
        <div className="space-y-3">
          {topCategories.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <span className="font-medium text-gray-700">{item.category}</span>
              </div>
              <span className="font-bold text-red-600">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Monthly Trend */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold text-gray-800">Monthly Spending Trend</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(monthlySpending).map(([month, amount]) => (
            <div key={month} className="flex items-center justify-between">
              <span className="text-gray-600 capitalize">{month}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min((amount / 1000) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}