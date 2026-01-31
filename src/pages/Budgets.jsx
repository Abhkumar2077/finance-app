export default function Budgets() {
  const budgets = [
    { category: 'Groceries', spent: 45, budget: 100, percentage: 45 },
    { category: 'Dining Out', spent: 48, budget: 80, percentage: 60 },
    { category: 'Rent', spent: 300, budget: 400, percentage: 75 },
    { category: 'Entertainment', spent: 25, budget: 50, percentage: 50 },
    { category: 'Transportation', spent: 30, budget: 100, percentage: 30 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <p className="text-gray-600">Set and track your spending limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {budgets.map((budget, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                  <p className="text-sm text-gray-600">
                    ${budget.spent} of ${budget.budget}
                  </p>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {budget.percentage}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    budget.percentage > 80 ? 'bg-red-500' :
                    budget.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Total Monthly Budget</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">$730</div>
            <div className="text-sm text-gray-600">of $800 allocated</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">AI Suggestions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your spending patterns, AI suggests adjusting these budgets:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span className="text-sm">Groceries</span>
                <span className="text-sm font-medium text-blue-600">+$50</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm">Dining Out</span>
                <span className="text-sm font-medium text-yellow-600">Monitor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}