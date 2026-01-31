export function detectSpendingPatterns(transactions) {
  const patterns = []
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  
  // Group by category and week
  const weeklySpending = {}
  
  transactions
    .filter(t => t.amount < 0 && new Date(t.date) > thirtyDaysAgo)
    .forEach(t => {
      const weekNumber = getWeekNumber(new Date(t.date))
      if (!weeklySpending[t.category]) {
        weeklySpending[t.category] = {}
      }
      weeklySpending[t.category][weekNumber] = 
        (weeklySpending[t.category][weekNumber] || 0) + Math.abs(t.amount)
    })
  
  // Detect increasing trends
  Object.entries(weeklySpending).forEach(([category, weeks]) => {
    const weekValues = Object.values(weeks)
    if (weekValues.length >= 3) {
      const trend = calculateTrend(weekValues)
      if (trest > 0.5) {
        patterns.push({
          type: 'increasing_trend',
          category,
          strength: trend,
          message: `${category} spending is increasing`
        })
      }
    }
  })
  
  return patterns
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function calculateTrend(values) {
  // Simple linear regression
  const n = values.length
  const x = Array.from({length: n}, (_, i) => i)
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  return Math.abs(slope)
}