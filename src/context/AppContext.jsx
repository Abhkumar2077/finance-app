import { createContext, useContext, useReducer, useEffect } from 'react'
import { getAIEngine } from '../utils/aiLearningEngine'

// Advanced learning weights - tracks user preferences
const initialWeights = {
  suggestionTypes: {
    budget_adjustment: 1.0,
    risk_alert: 1.0,
    category_restructure: 1.0,
    savings_opportunity: 1.0,
    subscription_optimization: 1.0,
    system_improvement: 1.0
  },
  categories: {
    Groceries: 1.0,
    'Dining Out': 1.0,
    Rent: 1.0,
    Entertainment: 1.0,
    Transportation: 1.0,
    Education: 1.0,
    Shopping: 1.0,
    Healthcare: 1.0
  },
  timePatterns: {
    morning: 1.0,
    afternoon: 1.0,
    evening: 1.0,
    weekend: 1.0
  },
  rejectedPatterns: [],
  acceptedPatterns: [],
  frequencyAdjustment: 0.8
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
  },
  aiInsights: null
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
      const suggestion = state.suggestions.find(s => s.id === action.payload.id)
      const updatedSuggestions = state.suggestions.map(s =>
        s.id === action.payload.id
          ? { ...s, status: action.payload.status }
          : s
      )
      
      // Initialize AI Engine
      const aiEngine = getAIEngine(state.learningWeights)
      
      // Learn from decision with advanced AI
      const timestamp = new Date().toISOString()
      const hour = new Date().getHours()
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
      const isWeekend = [0, 6].includes(new Date().getDay())
      
      if (suggestion) {
        // Record decision for AI learning
        aiEngine.learnFromDecision({
          suggestion: {
            type: suggestion.type,
            category: suggestion.category,
            confidence: suggestion.confidence
          },
          action: action.payload.status,
          timestamp,
          context: {
            timeOfDay,
            isWeekend
          }
        })
        
        // Get updated weights from AI engine
        const newWeightsData = aiEngine.exportWeights()
        
        // Update learning weights in state
        let newWeights = { ...state.learningWeights }
        
        // Merge AI engine weights with existing weights
        newWeights = {
          ...newWeights,
          suggestionTypes: { 
            ...newWeights.suggestionTypes, 
            ...newWeightsData.weights.suggestionTypes 
          },
          categories: { 
            ...newWeights.categories, 
            ...newWeightsData.weights.categories 
          },
          timePatterns: newWeightsData.weights.timePatterns || initialWeights.timePatterns,
          rejectedPatterns: action.payload.status === 'rejected' 
            ? [...newWeights.rejectedPatterns, {
                type: suggestion.type,
                category: suggestion.category,
                timestamp,
                context: { timeOfDay, isWeekend }
              }]
            : newWeights.rejectedPatterns,
          acceptedPatterns: action.payload.status === 'accepted' 
            ? [...newWeights.acceptedPatterns, {
                type: suggestion.type,
                category: suggestion.category,
                timestamp,
                context: { timeOfDay, isWeekend }
              }]
            : newWeights.acceptedPatterns
        }
        
        return {
          ...state,
          suggestions: updatedSuggestions,
          learningWeights: newWeights
        }
      }
      return state
    
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
    
    case 'GENERATE_ADVANCED_SUGGESTION':
      const aiEngineAdvanced = getAIEngine(state.learningWeights)
      const hourNow = new Date().getHours()
      const timeOfDayNow = hourNow < 12 ? 'morning' : hourNow < 17 ? 'afternoon' : 'evening'
      const isWeekendNow = [0, 6].includes(new Date().getDay())
      
      // Generate suggestion using advanced AI
      const aiSuggestion = aiEngineAdvanced.generateSuggestion({
        transactions: state.transactions,
        budgets: state.budgets,
        timeOfDay: timeOfDayNow,
        isWeekend: isWeekendNow
      })
      
      // Create suggestion based on AI output
      const suggestionTemplates = {
        budget_adjustment: (category) => ({
          title: `Adjust ${category} Budget`,
          description: `Consider optimizing your ${category.toLowerCase()} budget based on AI analysis of your spending patterns.`,
          rationale: 'AI detected patterns in your spending that suggest budget optimization.',
          type: 'budget_adjustment',
          category,
          proposedChange: { 
            category, 
            newAmount: Math.floor(Math.random() * 150) + 50 
          }
        }),
        risk_alert: (category) => ({
          title: `${category} Spending Pattern Alert`,
          description: `AI detected unusual patterns in your ${category.toLowerCase()} spending that may need attention.`,
          rationale: 'Pattern analysis suggests potential overspending in this category.',
          type: 'risk_alert',
          category,
          proposedChange: { 
            alert: 'monitor_category', 
            categoryId: category 
          }
        }),
        savings_opportunity: (category) => ({
          title: `Savings Opportunity in ${category}`,
          description: `AI found potential savings in your ${category.toLowerCase()} spending without sacrificing quality.`,
          rationale: 'Comparative analysis suggests optimization opportunities.',
          type: 'savings_opportunity',
          category,
          proposedChange: { 
            category, 
            potentialSavings: Math.floor(Math.random() * 50) + 20 
          }
        }),
        subscription_optimization: () => ({
          title: `Subscription Optimization`,
          description: `AI analyzed your recurring payments and found potential optimization opportunities.`,
          rationale: 'Subscription cost analysis reveals potential savings.',
          type: 'subscription_optimization',
          category: 'Subscriptions',
          proposedChange: { 
            action: 'review_subscriptions',
            potentialSavings: Math.floor(Math.random() * 30) + 10 
          }
        }),
        category_restructure: (category) => ({
          title: `Restructure ${category} Spending`,
          description: `Consider restructuring your ${category.toLowerCase()} spending for better efficiency.`,
          rationale: 'AI analysis suggests category restructuring could improve financial flow.',
          type: 'category_restructure',
          category,
          proposedChange: { 
            category,
            action: 'restructure'
          }
        })
      }
      
      const template = suggestionTemplates[aiSuggestion.type]
      const suggestionData = template 
        ? template(aiSuggestion.category)
        : suggestionTemplates.budget_adjustment(aiSuggestion.category)
      
      const advancedSuggestion = {
        id: Date.now(),
        ...suggestionData,
        confidence: aiSuggestion.confidence,
        status: 'pending',
        createdAt: new Date().toISOString(),
        aiContext: aiSuggestion.context,
        dataReferences: [
          `AI Confidence: ${aiSuggestion.confidence}%`,
          `Time Context: ${timeOfDayNow}${isWeekendNow ? ' (Weekend)' : ''}`,
          'Powered by Advanced Learning Engine'
        ]
      }
      
      return {
        ...state,
        suggestions: [...state.suggestions, advancedSuggestion]
      }
    
    case 'GET_AI_INSIGHTS':
      const aiEngineInsights = getAIEngine(state.learningWeights)
      const insights = aiEngineInsights.getInsights()
      
      return {
        ...state,
        aiInsights: insights
      }
    
    case 'RESET_LEARNING':
      // Reset AI engine instance
      const resetEngine = getAIEngine(initialWeights)
      resetEngine.importWeights({ weights: initialWeights, userHistory: [], patterns: [] })
      
      return {
        ...state,
        learningWeights: initialWeights,
        aiInsights: null
      }
    
    case 'LOAD_LEARNING_WEIGHTS':
      return {
        ...state,
        learningWeights: action.payload
      }
    
    // Budget Management Actions
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      }
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id
            ? { ...budget, ...action.payload }
            : budget
        )
      }
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
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
      try {
        const parsedWeights = JSON.parse(savedWeights)
        // Initialize AI engine with saved weights
        const aiEngine = getAIEngine(parsedWeights)
        aiEngine.importWeights(parsedWeights)
        
        dispatch({ 
          type: 'LOAD_LEARNING_WEIGHTS', 
          payload: parsedWeights 
        })
      } catch (error) {
        console.error('Error loading saved weights:', error)
      }
    }
  }, [])

  // Save learning weights to localStorage on changes
  useEffect(() => {
    const aiEngine = getAIEngine(state.learningWeights)
    const fullData = aiEngine.exportWeights()
    
    localStorage.setItem('finance-ai-learning-weights', JSON.stringify(fullData))
  }, [state.learningWeights])

  // Get AI insights on mount and when patterns change
  useEffect(() => {
    const totalDecisions = state.learningWeights.acceptedPatterns.length + 
                          state.learningWeights.rejectedPatterns.length
    
    if (totalDecisions >= 3) {
      dispatch({ type: 'GET_AI_INSIGHTS' })
    }
  }, [state.learningWeights.acceptedPatterns.length, state.learningWeights.rejectedPatterns.length])

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