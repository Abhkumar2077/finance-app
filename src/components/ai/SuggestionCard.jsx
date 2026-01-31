import { useAppContext } from '../../context/AppContext'
import { AlertCircle, TrendingUp, PieChart, DollarSign } from 'lucide-react'

const getIcon = (type) => {
  switch (type) {
    case 'risk_alert': return AlertCircle
    case 'budget_adjustment': return TrendingUp
    case 'category_restructure': return PieChart
    default: return DollarSign
  }
}

const getColor = (type) => {
  switch (type) {
    case 'risk_alert': return 'yellow'
    case 'budget_adjustment': return 'blue'
    case 'category_restructure': return 'purple'
    default: return 'gray'
  }
}

export function SuggestionCard({ suggestion }) {
  const { dispatch } = useAppContext()
  const Icon = getIcon(suggestion.type)
  const color = getColor(suggestion.type)
  
  const colorClasses = {
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      lightText: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-700',
      button: 'bg-yellow-500 hover:bg-yellow-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      lightText: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
      button: 'bg-blue-500 hover:bg-blue-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      lightText: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-700',
      button: 'bg-purple-500 hover:bg-purple-600'
    }
  }

  // FIXED: Simple reject handler
  const handleReject = () => {
    dispatch({
      type: 'UPDATE_SUGGESTION_STATUS',
      payload: {
        id: suggestion.id,
        status: 'rejected'
      }
    })
  }

  const handleAccept = () => {
    if (suggestion.type === 'budget_adjustment') {
      dispatch({ type: 'APPLY_SUGGESTION', payload: { id: suggestion.id } })
    } else {
      dispatch({
        type: 'UPDATE_SUGGESTION_STATUS',
        payload: { id: suggestion.id, status: 'accepted' }
      })
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color].bg} ${colorClasses[color].border}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${colorClasses[color].text}`} />
          <h3 className={`font-medium ${colorClasses[color].text}`}>
            {suggestion.title}
          </h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${colorClasses[color].badge}`}>
          {suggestion.confidence}% confidence
        </span>
      </div>
      
      <p className={`text-sm mb-3 ${colorClasses[color].lightText}`}>
        {suggestion.description}
      </p>
      
      {/* Rationale Section (if exists) */}
      {suggestion.rationale && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-1">Rationale:</p>
          <p className="text-xs text-gray-700">{suggestion.rationale}</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {suggestion.status === 'pending' && (
          <>
            <button 
              onClick={handleAccept}
              className={`px-3 py-1.5 text-white rounded-lg text-sm font-medium ${colorClasses[color].button} transition-colors`}
            >
              Accept
            </button>
            <button 
              onClick={handleReject}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
          </>
        )}
        
        {suggestion.status === 'accepted' && (
          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            ✓ Accepted
          </span>
        )}
        
        {suggestion.status === 'rejected' && (
          <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
            ✗ Rejected
          </span>
        )}
      </div>
    </div>
  )
}