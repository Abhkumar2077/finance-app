import { useState } from 'react'
import { Plus, Edit2, DollarSign, Tag } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export function BudgetForm({ budgetToEdit = null, onClose = () => {} }) {
  const { state, dispatch } = useAppContext()
  const [category, setCategory] = useState(budgetToEdit?.category || '')
  const [budgetAmount, setBudgetAmount] = useState(budgetToEdit?.budget || '')
  const [spentAmount, setSpentAmount] = useState(budgetToEdit?.spent || '')
  const [customCategory, setCustomCategory] = useState('')
  
  const existingCategories = ['Groceries', 'Dining Out', 'Rent', 'Entertainment', 'Transportation', 'Education', 'Shopping', 'Healthcare']
  const usedCategories = state.budgets.map(b => b.category)
  const availableCategories = [...existingCategories, ...(customCategory ? [customCategory] : [])]
    .filter(cat => !usedCategories.includes(cat) || cat === budgetToEdit?.category)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!category || !budgetAmount) {
      alert('Please fill in category and budget amount')
      return
    }
    
    const budget = budgetToEdit 
      ? {
          ...budgetToEdit,
          category: category,
          budget: parseFloat(budgetAmount),
          spent: parseFloat(spentAmount) || 0,
          percentage: Math.round(((parseFloat(spentAmount) || 0) / parseFloat(budgetAmount)) * 100)
        }
      : {
          id: Date.now(),
          category: category,
          budget: parseFloat(budgetAmount),
          spent: parseFloat(spentAmount) || 0,
          percentage: Math.round(((parseFloat(spentAmount) || 0) / parseFloat(budgetAmount)) * 100)
        }
    
    if (budgetToEdit) {
      // Update existing budget
      dispatch({ 
        type: 'UPDATE_BUDGET', 
        payload: budget 
      })
    } else {
      // Add new budget
      dispatch({ 
        type: 'ADD_BUDGET', 
        payload: budget 
      })
    }
    
    // Reset form or close
    if (!budgetToEdit) {
      setCategory('')
      setBudgetAmount('')
      setSpentAmount('')
      setCustomCategory('')
    }
    
    onClose()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        {budgetToEdit ? (
          <>
            <Edit2 className="text-blue-500" />
            Edit Budget
          </>
        ) : (
          <>
            <Plus className="text-blue-500" />
            Add New Budget
          </>
        )}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Tag className="text-gray-400" />
            Category
          </label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value)
                setCategory(e.target.value)
              }}
              placeholder="Custom category"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Budget Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">Budget Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          {/* Spent Amount (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">Spent Amount (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                value={spentAmount}
                onChange={(e) => setSpentAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        
        {/* Preview */}
        {(budgetAmount || spentAmount) && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Budget Preview</h4>
            <div className="flex justify-between text-sm mb-2">
              <span>Budget: ${parseFloat(budgetAmount) || 0}</span>
              <span>Spent: ${parseFloat(spentAmount) || 0}</span>
              <span className={`font-medium ${
                budgetAmount && spentAmount ? 
                  (spentAmount/budgetAmount > 0.8 ? 'text-red-600' : 
                   spentAmount/budgetAmount > 0.6 ? 'text-yellow-600' : 'text-green-600') 
                  : 'text-gray-600'
              }`}>
                {budgetAmount && spentAmount ? 
                  Math.round((spentAmount/budgetAmount) * 100) + '%' : 
                  '0%'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  budgetAmount && spentAmount ? 
                    (spentAmount/budgetAmount > 0.8 ? 'bg-red-500' : 
                     spentAmount/budgetAmount > 0.6 ? 'bg-yellow-500' : 'bg-green-500') 
                    : 'bg-blue-500'
                }`}
                style={{ 
                  width: `${budgetAmount && spentAmount ? 
                    Math.min((spentAmount/budgetAmount) * 100, 100) : 0}%` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            {budgetToEdit ? 'Update Budget' : 'Add Budget'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}