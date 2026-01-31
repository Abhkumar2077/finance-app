import { createContext, useContext, useReducer, useEffect } from 'react'

// Learning weights - tracks user preferences
const initialWeights = {
  suggestionTypes: {
    budget_adjustment: 1.0,
    risk_alert: 1.0,
    category_restructure: 1.0,
    system_improvement: 1.0
  },
  categories: {
    Groceries: 1.0,
    'Dining Out': 1.0,
    Rent: 1.0,
    Entertainment: 1.0,
    Transportation: 1.0,
    Education: 1.0
  },
  rejectedPatterns: [],
  acceptedPatterns: [],
  frequencyAdjustment: 0.8 // Reduce frequency of ignored suggestions
}

const initialState = {
  transactions: [
    { id: 1, name: 'Groceries', amount: -45.00, date: 'Today', type: 'expense', category: 'Food' },
    { id: 2, name: 'Part-time Job', amount: 120.00, date: 'Yesterday', type: 'income', category: 'Income' },
    { id: 3, name: 'Coffee', amount: -4.50, date: 'Jan 28', type: 'expense', category: 'Dining' },
    { id: 4, name: 'Textbooks', amount: -85.00, date: 'Jan 27', type: 'expense', category: 'Education' },
  ],
  budgets: [
    { id: 1, category: 'Groceries', spent: 45, budget: 100, percentage: 45 },
    { id: 2, category: 'Dining Out', spent: 48, budget: 80, percentage: 60 },
    { id: 3, category: 'Rent', spent: 300, budget: 400, percentage: 75 },
    { id: 4, category: 'Entertainment', spent: 25, budget: 50, percentage: 50 },
  ],
  suggestions: [
    { 
      id: 1, 
      title: 'Adjust Groceries Budget', 
      description: 'Consider increasing your groceries budget by $50 based on recent spending patterns.',
      rationale: 'Over the last 3 weeks, you spent an average of $55 on groceries, consistently exceeding your $50 budget.',
      dataReferences: ['Weekly spending average: $55', 'Budget: $50', 'Variance: +10%'],
      type: 'budget_adjustment',
      category: 'Groceries',
      proposedChange: { category: 'Groceries', newAmount: 100 },
      confidence: 85,
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      title: 'Coffee Spending Alert', 
      description: '12 coffee purchases detected in the last 7 days, totaling $48.',
      rationale: 'Frequent small expenses detected in Dining Out category. This pattern suggests potential budget drift.',
      dataReferences: ['12 transactions in 7 days', 'Total: $48', 'Average: $4 per transaction'],
      type: 'risk_alert',
      category: 'Dining Out',
      proposedChange: { alert: 'monitor_category', categoryId: 'Dining Out' },
      confidence: 92,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ],
  learningWeights: initialWeights,
  userPreferences: {
    currency: 'USD',
    weekStart: 'monday',
    aiInsightsEnabled: true,
    notificationsEnabled: true
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      }
    case 'DELETE_TRANSACTION':
  return {
    ...state,
    transactions: state.transactions.filter(t => t.id !== action.payload)
  }
   case 'UPDATE_SUGGESTION_STATUS':
  return {
    ...state,
    suggestions: state.suggestions.map(s =>
      s.id === action.payload.id
        ? { ...s, status: action.payload.status }
        : s
    )
  }

      // Update learning weights based on decision
      let newWeights = { ...state.learningWeights }
      
      if (suggestion) {
        if (action.payload.status === 'accepted') {
          // Increase weight for this suggestion type and category
          newWeights.suggestionTypes[suggestion.type] = 
            Math.min(1.5, (newWeights.suggestionTypes[suggestion.type] || 1.0) + 0.1)
          
          if (suggestion.category) {
            newWeights.categories[suggestion.category] = 
              Math.min(1.5, (newWeights.categories[suggestion.category] || 1.0) + 0.1)
          }
          
          newWeights.acceptedPatterns.push({
            type: suggestion.type,
            category: suggestion.category,
            timestamp: new Date().toISOString()
          })
        } 
        else if (action.payload.status === 'rejected') {
          // Decrease weight for this suggestion type and category
          newWeights.suggestionTypes[suggestion.type] = 
            Math.max(0.3, (newWeights.suggestionTypes[suggestion.type] || 1.0) - 0.2)
          
          if (suggestion.category) {
            newWeights.categories[suggestion.category] = 
              Math.max(0.3, (newWeights.categories[suggestion.category] || 1.0) - 0.2)
          }
          
          newWeights.rejectedPatterns.push({
            type: suggestion.type,
            category: suggestion.category,
            timestamp: new Date().toISOString()
          })
        }
      }

      return {
        ...state,
        suggestions: updatedSuggestions,
        learningWeights: newWeights
      }
    
    case 'APPLY_SUGGESTION':
      const applySuggestion = state.suggestions.find(s => s.id === action.payload.id)
      
      if (applySuggestion?.type === 'budget_adjustment') {
        return {
          ...state,
          budgets: state.budgets.map(budget =>
            budget.category === applySuggestion.proposedChange.category
              ? { ...budget, budget: applySuggestion.proposedChange.newAmount }
              : budget
          ),
          suggestions: state.suggestions.map(s =>
            s.id === action.payload.id
              ? { ...s, status: 'accepted' }
              : s
          )
        }
      }
      return state
    
    case 'GENERATE_NEW_SUGGESTION':
      // Generate a new suggestion based on learning weights
      const newSuggestion = {
        id: Date.now(),
        ...action.payload,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      
      return {
        ...state,
        suggestions: [...state.suggestions, newSuggestion]
      }
    
    case 'RESET_LEARNING':
      return {
        ...state,
        learningWeights: initialWeights
      }
    
    default:
      return state
  }
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load learning weights from localStorage on startup
  useEffect(() => {
    const savedWeights = localStorage.getItem('finance-ai-learning-weights')
    if (savedWeights) {
      dispatch({ 
        type: 'LOAD_LEARNING_WEIGHTS', 
        payload: JSON.parse(savedWeights) 
      })
    }
  }, [])

  // Save learning weights to localStorage on changes
  useEffect(() => {
    localStorage.setItem('finance-ai-learning-weights', JSON.stringify(state.learningWeights))
  }, [state.learningWeights])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}