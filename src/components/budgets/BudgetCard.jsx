import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

export function BudgetCard({ budget, onEdit, onDelete }) {
  const getStatusColor = (percentage) => {
    if (percentage > 80) return 'red'
    if (percentage > 60) return 'yellow'
    return 'green'
  }

  const getStatusText = (percentage) => {
    if (percentage > 100) return 'Over Budget!'
    if (percentage > 80) return 'Almost Full'
    if (percentage > 60) return 'Moderate'
    return 'On Track'
  }

  const getStatusIcon = (percentage) => {
    if (percentage > 80) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (percentage > 60) return <TrendingUp className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-green-500" />
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{budget.category}</h3>
          <p className="text-sm text-gray-600">
            ${budget.spent} of ${budget.budget}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            getStatusColor(budget.percentage) === 'red' ? 'bg-red-100 text-red-800' :
            getStatusColor(budget.percentage) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {getStatusText(budget.percentage)}
          </span>
          {getStatusIcon(budget.percentage)}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{budget.percentage}% used</span>
          <span className={`font-medium ${
            getStatusColor(budget.percentage) === 'red' ? 'text-red-600' :
            getStatusColor(budget.percentage) === 'yellow' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            ${budget.budget - budget.spent} remaining
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              getStatusColor(budget.percentage) === 'red' ? 'bg-red-500' :
              getStatusColor(budget.percentage) === 'yellow' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Daily Budget Calculation */}
      <div className="text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Daily budget:</span>
          <span className="font-medium">
            ${((budget.budget - budget.spent) / 30).toFixed(2)}/day
          </span>
        </div>
        <div className="flex justify-between">
          <span>Weekly budget:</span>
          <span className="font-medium">
            ${((budget.budget - budget.spent) / 4).toFixed(2)}/week
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(budget)}
          className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  )
}