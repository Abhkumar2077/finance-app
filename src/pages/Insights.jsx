export default function Insights() {
  const weeklySummary = {
    weekStart: 'Jan 15',
    weekEnd: 'Jan 21',
    totalIncome: 1200,
    totalExpenses: 437,
    netChange: 763,
    insights: [
      'Spent 15% more on dining out compared to previous week',
      'Saved 20% of income this week',
      'Rent accounted for 68% of total expenses',
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600">Weekly summaries and financial patterns</p>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Weekly Summary: {weeklySummary.weekStart} - {weeklySummary.weekEnd}
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            AI Generated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-700">Total Income</div>
            <div className="text-2xl font-bold text-green-800">${weeklySummary.totalIncome}</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-700">Total Expenses</div>
            <div className="text-2xl font-bold text-red-800">${weeklySummary.totalExpenses}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700">Net Change</div>
            <div className="text-2xl font-bold text-blue-800">+${weeklySummary.netChange}</div>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
        <ul className="space-y-2">
          {weeklySummary.insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}