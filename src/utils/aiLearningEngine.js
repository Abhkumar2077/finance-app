// Simple AI Learning Engine for Finance App
export class AILearningEngine {
  constructor(initialWeights) {
    this.weights = initialWeights || {
      suggestionTypes: {
        budget_adjustment: 1.0,
        risk_alert: 1.0,
        category_restructure: 1.0,
        savings_opportunity: 1.0,
        subscription_optimization: 1.0
      },
      categories: {},
      timePatterns: {
        morning: 1.0,
        afternoon: 1.0,
        evening: 1.0,
        weekend: 1.0
      }
    }
    this.userHistory = []
    this.patterns = []
  }

  learnFromDecision(decision) {
    const { suggestion, action } = decision
    
    // Simple weight adjustment
    const change = action === 'accepted' ? 0.1 : -0.2
    
    // Update suggestion type
    if (this.weights.suggestionTypes[suggestion.type] !== undefined) {
      this.weights.suggestionTypes[suggestion.type] = 
        Math.max(0.3, Math.min(2.0, this.weights.suggestionTypes[suggestion.type] + change))
    }
    
    // Update category
    if (suggestion.category) {
      this.weights.categories[suggestion.category] = 
        Math.max(0.3, Math.min(2.0, 
          (this.weights.categories[suggestion.category] || 1.0) + change
        ))
    }
    
    return this.weights
  }

  generateSuggestion(context) {
    // Get top suggestion type
    const suggestionTypes = Object.entries(this.weights.suggestionTypes)
      .sort(([, a], [, b]) => b - a)
    
    const topType = suggestionTypes[0]?.[0] || 'budget_adjustment'
    
    // Get top category
    const categories = Object.entries(this.weights.categories)
      .sort(([, a], [, b]) => b - a)
    
    const topCategory = categories[0]?.[0] || 'Groceries'
    
    // Simple confidence calculation
    const typeWeight = this.weights.suggestionTypes[topType] || 1.0
    const categoryWeight = this.weights.categories[topCategory] || 1.0
    
    const confidence = Math.min(95, 
      70 + Math.floor((typeWeight - 1) * 10 + (categoryWeight - 1) * 5)
    )
    
    return {
      type: topType,
      category: topCategory,
      confidence: confidence,
      context: {
        timeOfDay: context?.timeOfDay || 'afternoon',
        isWeekend: context?.isWeekend || false
      }
    }
  }

  getInsights() {
    const totalDecisions = this.userHistory.length
    
    return {
      readiness: totalDecisions >= 3,
      totalDecisions,
      learningProgress: Math.min(100, (totalDecisions / 10) * 100)
    }
  }

  exportWeights() {
    return {
      weights: this.weights,
      userHistory: this.userHistory,
      patterns: this.patterns,
      lastUpdated: new Date().toISOString()
    }
  }

  importWeights(savedData) {
    if (savedData.weights) this.weights = savedData.weights
    if (savedData.userHistory) this.userHistory = savedData.userHistory
    if (savedData.patterns) this.patterns = savedData.patterns
  }
}

// Initialize singleton instance
let aiEngineInstance = null

export function getAIEngine(initialWeights) {
  if (!aiEngineInstance) {
    aiEngineInstance = new AILearningEngine(initialWeights)
  }
  return aiEngineInstance
}