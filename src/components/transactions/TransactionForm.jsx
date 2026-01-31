import { useState } from 'react'
import { Plus, Tag, DollarSign } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export function TransactionForm() {
  const { dispatch } = useAppContext()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('Food')
  
  const categories = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Salary', 'Education', 'Other']
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!description.trim() || !amount) {
      alert('Please fill in all fields')
      return
    }
    
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) {
      alert('Please enter a valid amount')
      return
    }
    
    const transaction = {
      id: Date.now(),
      name: description,
      amount: type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: type,
      category: category
    }
    
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
    
    // Reset form
    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('Food')
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Plus className="text-blue-500" />
        Add New Transaction
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          {/* Type Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 rounded-lg font-medium ${type === 'income' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 rounded-lg font-medium ${type === 'expense' 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Expense
              </button>
            </div>
          </div>
          
          {/* Amount Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Lunch, Salary, Groceries..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Tag className="text-gray-400" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          Add Transaction
        </button>
      </form>
    </div>
  )
}