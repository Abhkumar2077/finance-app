export function predictMonthlySpending(transactions) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  // Group transactions by month
  const monthlyData = {}
  
  transactions.forEach(transaction => {
    if (transaction.amount < 0) { // Only expenses
      const date = parseTransactionDate(transaction.date)
      if (date) {
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Math.abs(transaction.amount)
      }
    }
  })
  
  // Calculate average monthly spending
  const monthlyTotals = Object.values(monthlyData)
  const averageMonthly = monthlyTotals.length > 0 
    ? monthlyTotals.reduce((a, b) => a + b) / monthlyTotals.length 
    : 0
  
  // Predict next month (simple linear regression)
  let predictedNextMonth = averageMonthly
  
  if (monthlyTotals.length >= 3) {
    const recentTrend = calculateTrend(monthlyTotals.slice(-3))
    predictedNextMonth = monthlyTotals[monthlyTotals.length - 1] * (1 + recentTrend)
  }
  
  // Categorize prediction confidence
  let confidence = 'medium'
  if (monthlyTotals.length >= 6) confidence = 'high'
  if (monthlyTotals.length <= 2) confidence = 'low'
  
  return {
    averageMonthly: Math.round(averageMonthly),
    predictedNextMonth: Math.round(predictedNextMonth),
    confidence,
    trend: predictedNextMonth > averageMonthly ? 'increasing' : 'decreasing',
    dataPoints: monthlyTotals.length
  }
}

export function predictCategorySpending(transactions, category) {
  const categoryTransactions = transactions
    .filter(t => t.category === category && t.amount < 0)
  
  if (categoryTransactions.length === 0) return null
  
  // Simple moving average for category
  const amounts = categoryTransactions.map(t => Math.abs(t.amount))
  const average = amounts.reduce((a, b) => a + b) / amounts.length
  
  // Detect seasonality (e.g., higher spending on weekends/holidays)
  const weeklyPattern = detectWeeklyPattern(categoryTransactions)
  
  return {
    category,
    averageMonthly: Math.round(average * 4.33), // Weekly average to monthly
    predictedNextMonth: Math.round(average * 4.33 * (weeklyPattern?.trend || 1)),
    frequency: categoryTransactions.length,
    pattern: weeklyPattern?.pattern || 'consistent'
  }
}

function parseTransactionDate(dateString) {
  try {
    // Handle formats like "Jan 28", "Today", "Yesterday"
    if (dateString === 'Today') return new Date()
    if (dateString === 'Yesterday') {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    }
    
    // Parse "Jan 28" format
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

function calculateTrend(values) {
  if (values.length < 2) return 0
  
  const n = values.length
  const x = Array.from({length: n}, (_, i) => i)
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  
  const slope = (n * sumXY - sumX * xumY) / (n * sumX2 - sumX * sumX)
  return slope / values[values.length - 1] // Normalize
}

function detectWeeklyPattern(transactions) {
  const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } // 0=Sunday
  
  transactions.forEach(t => {
    const date = parseTransactionDate(t.date)
    if (date) {
      const day = date.getDay()
      dayCounts[day] = (dayCounts[day] || 0) + 1
    }
  })
  
  // Find peak spending day
  const peakDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]
  const totalTransactions = Object.values(dayCounts).reduce((a, b) => a + b, 0)
  
  return {
    peakDay: getDayName(peakDay[0]),
    peakPercentage: Math.round((peakDay[1] / totalTransactions) * 100),
    pattern: peakDay[1] > totalTransactions * 0.3 ? 'weekly_peak' : 'consistent'
  }
}

function getDayName(dayNumber) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[parseInt(dayNumber)]
}