import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertCircle, DollarSign, Plus, Upload } from 'lucide-react'
import { SuggestionInbox } from '../components/ai/SuggestionInbox'
import { SmartSuggestionGenerator } from '../components/learning/SmartSuggestionGenerator'
import { LearningInsights } from '../components/learning/LearningInsights'
import { CSVImportModal } from '../components/transactions/CSVImportModal'

export default function Dashboard() {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const [showCSVImport, setShowCSVImport] = useState(false)
  
  const pendingSuggestions = state.suggestions.filter(s => s.status === 'pending')
  const totalBalance = state.transactions.reduce((sum, t) => sum + t.amount, 0)
  
  // Calculate income for current week (last 7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const thisWeekIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalBudget = state.budgets.reduce((sum, b) => sum + b.budget, 0)
  const spentBudget = state.budgets.reduce((sum, b) => sum + b.spent, 0)
  const budgetPercentage = totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0

  const handleAddTransaction = () => {
    navigate('/transactions')
  }

  return (
    <>
      {/* CSV Import Modal */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <CSVImportModal onClose={() => setShowCSVImport(false)} />
        </div>
      )}

      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Student!</h1>
              <p className="text-gray-600">
                Your AI assistant has analyzed your spending patterns and found {pendingSuggestions.length} opportunities to optimize.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={handleAddTransaction}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
              <button 
                onClick={() => setShowCSVImport(true)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 whitespace-nowrap flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </button>
            </div>
          </div>
        </div>

        {/* Smart Suggestion Generator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <SmartSuggestionGenerator />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${totalBalance >= 0 ? totalBalance.toFixed(2) : `-$${Math.abs(totalBalance).toFixed(2)}`}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-5 w-5 ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                totalBalance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {totalBalance >= 0 ? 'Positive' : 'Negative'} balance
              </span>
            </div>
          </div>

          {/* This Week */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div>
              <p className="text-sm text-gray-500">This Week</p>
              <p className={`text-2xl font-bold mt-1 ${
                thisWeekIncome >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {thisWeekIncome >= 0 ? '+' : '-'}${Math.abs(thisWeekIncome).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Net income (7 days)</p>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className={`h-4 w-4 mr-1 ${
                thisWeekIncome >= 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className={`text-sm ${
                thisWeekIncome >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {thisWeekIncome >= 0 ? 'Positive' : 'Negative'} trend
              </span>
            </div>
          </div>

          {/* Monthly Budget */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div>
              <p className="text-sm text-gray-500">Monthly Budget</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${spentBudget.toFixed(0)}/${totalBudget.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {budgetPercentage.toFixed(0)}% used
              </p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    budgetPercentage > 80 ? 'bg-red-500' :
                    budgetPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">AI Suggestions</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingSuggestions.length} pending
                </p>
                <p className="text-xs text-gray-500 mt-1">Ready for review</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <button 
                onClick={() => navigate('/transactions')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all →
              </button>
            </div>
            
            <div className="space-y-4">
              {state.transactions.length > 0 ? (
                state.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className={`font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '↑' : '↓'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.name}</div>
                        <div className="text-sm text-gray-500">{transaction.date}</div>
                        <div className="text-xs text-gray-400">{transaction.category}</div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No transactions yet</p>
                  <button 
                    onClick={handleAddTransaction}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Add your first transaction →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions Inbox */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <SuggestionInbox />
          </div>
        </div>

        {/* Two Column Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Budget Overview</h2>
              <button 
                onClick={() => navigate('/budgets')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Manage →
              </button>
            </div>
            <div className="space-y-4">
              {state.budgets.length > 0 ? (
                state.budgets.map((budget, index) => (
                  <div key={budget.id || `budget-${index}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{budget.category}</span>
                      <span className="text-gray-600">${budget.spent} / ${budget.budget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          budget.percentage > 80 ? 'bg-red-500' :
                          budget.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No budgets set up yet
                </div>
              )}
            </div>
          </div>

          {/* Learning Insights */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <LearningInsights />
          </div>
        </div>
      </div>
    </>
  )
}