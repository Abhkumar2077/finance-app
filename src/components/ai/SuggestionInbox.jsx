import { useAppContext } from '../../context/AppContext'
import { SuggestionCard } from './SuggestionCard'
import { Inbox, CheckCircle, XCircle } from 'lucide-react'

export function SuggestionInbox() {
  const { state } = useAppContext()
  
  const pendingSuggestions = state.suggestions.filter(s => s.status === 'pending')
  const acceptedSuggestions = state.suggestions.filter(s => s.status === 'accepted')
  const rejectedSuggestions = state.suggestions.filter(s => s.status === 'rejected')
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Inbox className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">AI Suggestions</h2>
        </div>
        <div className="text-sm text-gray-500">
          {pendingSuggestions.length} pending • {acceptedSuggestions.length} accepted • {rejectedSuggestions.length} rejected
        </div>
      </div>
      
      {/* Pending Suggestions */}
      {pendingSuggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            Pending Review ({pendingSuggestions.length})
          </h3>
          {pendingSuggestions.map(suggestion => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      )}
      
      {/* Accepted Suggestions */}
      {acceptedSuggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Accepted ({acceptedSuggestions.length})
          </h3>
          {acceptedSuggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">{suggestion.title}</span>
                <span className="text-xs text-green-600">Applied on {new Date(suggestion.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rejected Suggestions */}
      {rejectedSuggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Rejected ({rejectedSuggestions.length})
          </h3>
          {rejectedSuggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-red-800">{suggestion.title}</span>
                <span className="text-xs text-red-600">Rejected on {new Date(suggestion.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {state.suggestions.length === 0 && (
        <div className="text-center py-8">
          <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No AI suggestions yet.</p>
          <p className="text-sm text-gray-400 mt-1">AI will generate suggestions based on your spending patterns.</p>
        </div>
      )}
    </div>
  )
}