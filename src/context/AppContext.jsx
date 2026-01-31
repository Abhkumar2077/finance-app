import { createContext, useContext, useReducer, useEffect } from 'react'

// Helper function for next month date
const getNextMonthDate = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().split('T')[0]
}

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
  acceptedPatterns: [],
  rejectedPatterns: [],
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
  subscriptions: [
    { 
      id: 1, 
      name: 'Netflix', 
      amount: 15.99, 
      frequency: 'monthly', 
      category: 'Entertainment', 
      renewalDate: getNextMonthDate(), 
      active: true,
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      name: 'Spotify', 
      amount: 9.99, 
      frequency: 'monthly', 
      category: 'Entertainment', 
      renewalDate: getNextMonthDate(), 
      active: true,
      createdAt: new Date().toISOString()
    },
    { 
      id: 3, 
      name: 'Gym Membership', 
      amount: 29.99, 
      frequency: 'monthly', 
      category: 'Health', 
      renewalDate: getNextMonthDate(), 
      active: true,
      createdAt: new Date().toISOString()
    }
  ],
  predictions: null,
  financialReports: [],
  learningWeights: initialWeights,
  userPreferences: {
    currency: 'USD',
    weekStart: 'monday',
    aiInsightsEnabled: true,
    notificationsEnabled: true,
    autoGenerateReports: false
  },
  aiInsights: null
}

// Helper function for parsing dates
const parseTransactionDate = (dateString) => {
  try {
    if (dateString === 'Today') return new Date()
    if (dateString === 'Yesterday') {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    }
    
    const [monthStr, dayStr] = dateString.split(' ')
    const monthMap = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }
    
    const month = monthMap[monthStr]
    const day = parseInt(dayStr)
    const currentYear = new Date().getFullYear()
    
    return new Date(currentYear, month, day)
  } catch {
    return null
  }
}

// Helper function for predictive analytics
const calculateMonthlyPredictions = (transactions) => {
  const now = new Date()
  const monthlyData = {}
  
  transactions.forEach(transaction => {
    if (transaction.amount < 0) {
      const date = parseTransactionDate(transaction.date)
      if (date) {
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Math.abs(transaction.amount)
      }
    }
  })
  
  const monthlyTotals = Object.values(monthlyData)
  const averageMonthly = monthlyTotals.length > 0 
    ? monthlyTotals.reduce((a, b) => a + b) / monthlyTotals.length 
    : 0
  
  let predictedNextMonth = averageMonthly
  let trend = 'stable'
  
  if (monthlyTotals.length >= 3) {
    const lastMonth = monthlyTotals[monthlyTotals.length - 1]
    const secondLastMonth = monthlyTotals[monthlyTotals.length - 2]
    const growthRate = (lastMonth - secondLastMonth) / secondLastMonth
    predictedNextMonth = lastMonth * (1 + growthRate)
    trend = growthRate > 0.05 ? 'increasing' : growthRate < -0.05 ? 'decreasing' : 'stable'
  }
  
  let confidence = 'medium'
  if (monthlyTotals.length >= 6) confidence = 'high'
  if (monthlyTotals.length <= 2) confidence = 'low'
  
  return {
    averageMonthly: Math.round(averageMonthly),
    predictedNextMonth: Math.round(predictedNextMonth),
    confidence,
    trend,
    dataPoints: monthlyTotals.length
  }
}

// Helper function for subscription metrics
const calculateSubscriptionMetrics = (subscriptions) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.active)
  
  const monthlyCost = activeSubscriptions.reduce((sum, sub) => {
    const multiplier = sub.frequency === 'yearly' ? 1/12 : sub.frequency === 'weekly' ? 4.33 : 1
    return sum + (sub.amount * multiplier)
  }, 0)
  
  const yearlyCost = monthlyCost * 12
  
  const categoryBreakdown = activeSubscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + sub.amount
    return acc
  }, {})
  
  // Find upcoming renewals (next 7 days)
  const now = new Date()
  const sevenDaysFromNow = new Date(now)
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  
  const upcomingRenewals = activeSubscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewalDate)
    return renewalDate >= now && renewalDate <= sevenDaysFromNow
  })
  
  return {
    monthlyCost,
    yearlyCost,
    activeCount: activeSubscriptions.length,
    categoryBreakdown,
    upcomingRenewals
  }
}

function appReducer(state, action) {
  switch (action.type) {
    // ========== TRANSACTION ACTIONS ==========
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
      
    case 'IMPORT_TRANSACTIONS':
      const importedTransactions = action.payload.map((tx, index) => ({
        ...tx,
        id: Date.now() + index
      }))
      
      return {
        ...state,
        transactions: [...state.transactions, ...importedTransactions]
      }
      
    // ========== BUDGET ACTIONS ==========
    case 'ADD_BUDGET':
      const budgetWithPercentage = {
        ...action.payload,
        percentage: action.payload.budget > 0 
          ? Math.round((action.payload.spent / action.payload.budget) * 100)
          : 0
      }
      
      return {
        ...state,
        budgets: [...state.budgets, budgetWithPercentage]
      }
    
    case 'UPDATE_BUDGET':
      const updatedBudget = {
        ...action.payload,
        percentage: action.payload.budget > 0 
          ? Math.round((action.payload.spent / action.payload.budget) * 100)
          : 0
      }
      
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id
            ? updatedBudget
            : budget
        )
      }
    
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      }
      
    // ========== SUGGESTION ACTIONS ==========
    case 'UPDATE_SUGGESTION_STATUS':
      const suggestion = state.suggestions.find(s => s.id === action.payload.id)
      
      if (!suggestion) {
        return state
      }
      
      const updatedSuggestions = state.suggestions.map(s =>
        s.id === action.payload.id
          ? { ...s, status: action.payload.status }
          : s
      )
      
      const timestamp = new Date().toISOString()
      const hour = new Date().getHours()
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
      const isWeekend = [0, 6].includes(new Date().getDay())
      
      const newWeights = { ...state.learningWeights }
      const change = action.payload.status === 'accepted' ? 0.1 : -0.2
      
      if (newWeights.suggestionTypes[suggestion.type] !== undefined) {
        newWeights.suggestionTypes[suggestion.type] = 
          Math.max(0.3, Math.min(2.0, newWeights.suggestionTypes[suggestion.type] + change))
      }
      
      if (suggestion.category && newWeights.categories[suggestion.category] !== undefined) {
        newWeights.categories[suggestion.category] = 
          Math.max(0.3, Math.min(2.0, newWeights.categories[suggestion.category] + change))
      }
      
      const pattern = {
        type: suggestion.type,
        category: suggestion.category,
        timestamp,
        context: { timeOfDay, isWeekend }
      }
      
      if (action.payload.status === 'accepted') {
        newWeights.acceptedPatterns = [...newWeights.acceptedPatterns, pattern]
      } else if (action.payload.status === 'rejected') {
        newWeights.rejectedPatterns = [...newWeights.rejectedPatterns, pattern]
      }
      
      return {
        ...state,
        suggestions: updatedSuggestions,
        learningWeights: newWeights
      }
    
    case 'APPLY_SUGGESTION':
      const applySuggestion = state.suggestions.find(s => s.id === action.payload.id)
      
      if (!applySuggestion) {
        return state
      }
      
      if (applySuggestion.type === 'budget_adjustment') {
        return {
          ...state,
          budgets: state.budgets.map(budget =>
            budget.category === applySuggestion.proposedChange.category
              ? { 
                  ...budget, 
                  budget: applySuggestion.proposedChange.newAmount,
                  percentage: Math.round((budget.spent / applySuggestion.proposedChange.newAmount) * 100)
                }
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
      const categories = ['Groceries', 'Dining Out', 'Entertainment', 'Transportation', 'Shopping']
      const suggestionTypes = ['budget_adjustment', 'risk_alert', 'category_restructure']
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomType = suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)]
      
      const suggestionTemplates = {
        budget_adjustment: (category) => ({
          title: `Adjust ${category} Budget`,
          description: `Consider optimizing your ${category.toLowerCase()} budget based on spending patterns.`,
          rationale: 'Analysis suggests budget optimization opportunity.',
          type: 'budget_adjustment',
          category,
          proposedChange: { 
            category, 
            newAmount: Math.floor(Math.random() * 150) + 50 
          }
        }),
        risk_alert: (category) => ({
          title: `${category} Spending Pattern`,
          description: `Unusual patterns detected in ${category.toLowerCase()} spending.`,
          rationale: 'Pattern analysis suggests attention needed.',
          type: 'risk_alert',
          category,
          proposedChange: { 
            alert: 'monitor_category', 
            categoryId: category 
          }
        }),
        category_restructure: (category) => ({
          title: `Restructure ${category} Spending`,
          description: `Consider restructuring your ${category.toLowerCase()} spending for efficiency.`,
          rationale: 'Analysis suggests restructuring could improve financial flow.',
          type: 'category_restructure',
          category,
          proposedChange: { 
            category,
            action: 'restructure'
          }
        })
      }
      
      const template = suggestionTemplates[randomType]
      const suggestionData = template 
        ? template(randomCategory)
        : suggestionTemplates.budget_adjustment(randomCategory)
      
      const advancedSuggestion = {
        id: Date.now(),
        ...suggestionData,
        confidence: Math.floor(Math.random() * 30) + 70,
        status: 'pending',
        createdAt: new Date().toISOString(),
        dataReferences: ['Simple pattern detection']
      }
      
      return {
        ...state,
        suggestions: [...state.suggestions, advancedSuggestion]
      }
      
    // ========== SUBSCRIPTION ACTIONS ==========
    case 'ADD_SUBSCRIPTION':
      const subscription = {
        id: Date.now(),
        ...action.payload,
        active: true,
        createdAt: new Date().toISOString()
      }
      
      return {
        ...state,
        subscriptions: [...state.subscriptions, subscription]
      }
    
    case 'UPDATE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(sub =>
          sub.id === action.payload.id
            ? { ...sub, ...action.payload.updates }
            : sub
        )
      }
    
    case 'TOGGLE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(sub =>
          sub.id === action.payload
            ? { ...sub, active: !sub.active }
            : sub
        )
      }
    
    case 'DELETE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter(sub => sub.id !== action.payload)
      }
      
    // ========== PREDICTIVE ANALYTICS ACTIONS ==========
    case 'UPDATE_PREDICTIONS':
      return {
        ...state,
        predictions: action.payload
      }
    
    case 'CALCULATE_PREDICTIONS':
      const predictions = calculateMonthlyPredictions(state.transactions)
      return {
        ...state,
        predictions
      }
      
    // ========== FINANCIAL REPORTS ACTIONS ==========
    case 'GENERATE_REPORT':
      const now = new Date()
      const report = {
        id: Date.now(),
        type: action.payload.type || 'weekly',
        period: action.payload.period || 
          `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
        data: {
          transactions: state.transactions,
          budgets: state.budgets,
          subscriptions: state.subscriptions,
          suggestions: state.suggestions
        },
        summary: action.payload.summary || {},
        createdAt: new Date().toISOString()
      }
      
      return {
        ...state,
        financialReports: [report, ...state.financialReports]
      }
    
    case 'DELETE_REPORT':
      return {
        ...state,
        financialReports: state.financialReports.filter(r => r.id !== action.payload)
      }
      
    // ========== AI & LEARNING ACTIONS ==========
    case 'GET_AI_INSIGHTS':
      const totalDecisions = state.learningWeights.acceptedPatterns.length + 
                            state.learningWeights.rejectedPatterns.length
      
      const insights = {
        readiness: totalDecisions >= 3,
        totalDecisions,
        learningProgress: Math.min(100, (totalDecisions / 10) * 100),
        typePreferences: Object.entries(state.learningWeights.suggestionTypes)
          .map(([type, weight]) => ({
            type,
            weight,
            preference: weight > 1.0 ? 'High' : weight < 1.0 ? 'Low' : 'Neutral'
          }))
          .sort((a, b) => b.weight - a.weight),
        patterns: []
      }
      
      return {
        ...state,
        aiInsights: insights
      }
    
    case 'RESET_LEARNING':
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
      
    // ========== USER PREFERENCES ACTIONS ==========
    case 'UPDATE_USER_PREFERENCES':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        }
      }
    
    // ========== BULK & SYSTEM ACTIONS ==========
    case 'CLEAR_ALL_DATA':
      if (window.confirm('Are you sure? This will delete ALL your data including transactions, budgets, and learning history.')) {
        return {
          ...initialState,
          learningWeights: initialWeights,
          userPreferences: state.userPreferences // Keep preferences
        }
      }
      return state
    
    case 'EXPORT_DATA':
      // This action doesn't modify state, just triggers export
      return state
      
    case 'IMPORT_DATA':
      try {
        const importedData = action.payload
        
        return {
          ...state,
          transactions: importedData.transactions || state.transactions,
          budgets: importedData.budgets || state.budgets,
          subscriptions: importedData.subscriptions || state.subscriptions,
          suggestions: importedData.suggestions || state.suggestions,
          learningWeights: importedData.learningWeights || state.learningWeights
        }
      } catch (error) {
        console.error('Error importing data:', error)
        return state
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
    try {
      const savedWeights = localStorage.getItem('finance-ai-learning-weights')
      if (savedWeights) {
        const parsedWeights = JSON.parse(savedWeights)
        const weightsToLoad = parsedWeights.weights || parsedWeights
        
        dispatch({ 
          type: 'LOAD_LEARNING_WEIGHTS', 
          payload: {
            ...initialWeights,
            ...weightsToLoad,
            acceptedPatterns: weightsToLoad.acceptedPatterns || [],
            rejectedPatterns: weightsToLoad.rejectedPatterns || []
          }
        })
      }
    } catch (error) {
      console.error('Error loading saved weights:', error)
    }
  }, [])

  // Save learning weights to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('finance-ai-learning-weights', JSON.stringify({
        weights: state.learningWeights,
        lastUpdated: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error saving weights:', error)
    }
  }, [state.learningWeights])

  // Auto-calculate predictions when transactions change
  useEffect(() => {
    if (state.transactions.length > 0) {
      const predictions = calculateMonthlyPredictions(state.transactions)
      dispatch({ type: 'UPDATE_PREDICTIONS', payload: predictions })
    }
  }, [state.transactions])

  // Get AI insights when patterns change
  useEffect(() => {
    const totalDecisions = state.learningWeights.acceptedPatterns.length + 
                          state.learningWeights.rejectedPatterns.length
    
    if (totalDecisions >= 3) {
      dispatch({ type: 'GET_AI_INSIGHTS' })
    }
  }, [state.learningWeights.acceptedPatterns.length, state.learningWeights.rejectedPatterns.length])

  // Auto-generate weekly report if enabled
  useEffect(() => {
    if (state.userPreferences.autoGenerateReports) {
      const lastReport = state.financialReports[0]
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      if (!lastReport || new Date(lastReport.createdAt) < oneWeekAgo) {
        // Calculate weekly summary
        const weeklySummary = {
          totalTransactions: state.transactions.length,
          newTransactions: state.transactions.filter(t => {
            const txDate = parseTransactionDate(t.date)
            return txDate && txDate > oneWeekAgo
          }).length,
          budgetsUsed: state.budgets.filter(b => b.percentage > 0).length,
          suggestionsGenerated: state.suggestions.length
        }
        
        dispatch({ 
          type: 'GENERATE_REPORT', 
          payload: { 
            type: 'weekly',
            summary: weeklySummary
          }
        })
      }
    }
  }, [state.transactions, state.userPreferences.autoGenerateReports, state.financialReports])

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

// Export helper functions for use in components
export { calculateSubscriptionMetrics, calculateMonthlyPredictions }