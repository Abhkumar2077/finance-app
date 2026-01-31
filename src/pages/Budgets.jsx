import { useState } from 'react'
import { Plus, PieChart, Target, TrendingUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { BudgetForm } from '../components/budgets/BudgetForm'
import { BudgetCard } from '../components/budgets/BudgetCard'

export default function Budgets() {
  const { state, dispatch } = useAppContext()
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)

  const totalBudget = state.budgets.reduce((sum, b) => sum + b.budget, 0)
  const totalSpent = state.budgets.reduce((sum, b) => sum + b.spent, 0)
  const averageUsage = state.budgets.length > 0 
    ? state.budgets.reduce((sum, b) => sum + b.percentage, 0) / state.budgets.length 
    : 0

  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
    setShowBudgetForm(true)
  }

  const handleDeleteBudget = (id) => {
    if (window.confirm('Delete this budget?')) {
      dispatch({ type: 'DELETE_BUDGET', payload: id })
    }
  }

  const handleCloseForm = () => {
    setShowBudgetForm(false)
    setEditingBudget(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Set and track your spending limits</p>
        </div>
        <button 
          onClick={() => setShowBudgetForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </button>
      </div>

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <BudgetForm 
              budgetToEdit={editingBudget}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}

      {/* Budget Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalBudget}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${totalSpent}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <PieChart className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Usage</p>
              <p className={`text-2xl font-bold mt-1 ${
                averageUsage > 80 ? 'text-red-600' :
                averageUsage > 60 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {averageUsage.toFixed(0)}%
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              averageUsage > 80 ? 'bg-red-100' :
              averageUsage > 60 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <TrendingUp className={`h-5 w-5 ${
                averageUsage > 80 ? 'text-red-600' :
                averageUsage > 60 ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.budgets.length > 0 ? (
          state.budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4 text-6xl">💰</div>
            <h3 className="text-lg font-medium text-gray-600">No budgets yet</h3>
            <p className="text-gray-500 mt-1">Create your first budget to start tracking</p>
            <button 
              onClick={() => setShowBudgetForm(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600"
            >
              Create Budget
            </button>
          </div>
        )}
      </div>

      {/* AI Budget Suggestions */}
      {state.budgets.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">AI Budget Insights</h3>
              <p className="text-yellow-700 mb-3">
                Based on your spending patterns, consider these adjustments:
              </p>
              <ul className="space-y-2">
                {state.budgets
                  .filter(b => b.percentage > 90)
                  .map(budget => (
                    <li key={budget.id} className="flex items-center justify-between">
                      <span className="text-sm text-yellow-800">{budget.category}</span>
                      <span className="text-sm font-medium text-yellow-600">
                        Consider increasing by ${Math.round(budget.budget * 0.2)}
                      </span>
                    </li>
                  ))}
                {state.budgets
                  .filter(b => b.percentage < 30 && b.budget > 100)
                  .map(budget => (
                    <li key={budget.id} className="flex items-center justify-between">
                      <span className="text-sm text-yellow-800">{budget.category}</span>
                      <span className="text-sm font-medium text-green-600">
                        Could reduce by ${Math.round(budget.budget * 0.15)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}