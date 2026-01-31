export function calculateFinancialHealth(state) {
  const { transactions, budgets } = state
  
  // 1. Savings Rate (30% weight)
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))
  
  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome) * 100 
    : 0
  
  const savingsScore = Math.min(100, Math.max(0, savingsRate * 3))
  
  // 2. Budget Adherence (30% weight)
  const budgetScores = budgets.map(budget => {
    if (budget.percentage <= 80) return 100
    if (budget.percentage <= 100) return 50
    return 0
  })
  
  const budgetScore = budgetScores.length > 0 
    ? budgetScores.reduce((a, b) => a + b) / budgetScores.length 
    : 100
  
  // 3. Spending Diversity (20% weight)
  const categories = new Set(transactions.map(t => t.category))
  const diversityScore = Math.min(100, categories.size * 20)
  
  // 4. Transaction Frequency (20% weight)
  const recentTransactions = transactions.filter(t => {
    // Last 30 days
    const transactionDate = new Date(t.date)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return transactionDate > thirtyDaysAgo
  }).length
  
  const frequencyScore = Math.min(100, recentTransactions * 2)
  
  // Calculate total score
  const totalScore = Math.round(
    (savingsScore * 0.3) +
    (budgetScore * 0.3) +
    (diversityScore * 0.2) +
    (frequencyScore * 0.2)
  )
  
  // Get rating
  let rating = 'Excellent'
  let color = 'green'
  
  if (totalScore < 60) {
    rating = 'Needs Improvement'
    color = 'red'
  } else if (totalScore < 75) {
    rating = 'Good'
    color = 'yellow'
  } else if (totalScore < 90) {
    rating = 'Very Good'
    color = 'blue'
  }
  
  return {
    score: totalScore,
    rating,
    color,
    breakdown: {
      savingsScore: Math.round(savingsScore),
      budgetScore: Math.round(budgetScore),
      diversityScore: Math.round(diversityScore),
      frequencyScore: Math.round(frequencyScore)
    },
    recommendations: getRecommendations(totalScore, savingsRate, budgetScore)
  }
}

function getRecommendations(score, savingsRate, budgetScore) {
  const recommendations = []
  
  if (savingsRate < 20) {
    recommendations.push('Try to save at least 20% of your income')
  }
  
  if (budgetScore < 70) {
    recommendations.push('Review budgets where spending exceeds 80%')
  }
  
  if (score < 70) {
    recommendations.push('Consider tracking more categories for better insights')
  }
  
  return recommendations.slice(0, 3)
}