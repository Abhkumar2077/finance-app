import { useState } from 'react'
import { Plus, Upload, Trash2 } from 'lucide-react'  // ✅ Added Trash2 import
import { CSVImportModal } from '../components/transactions/CSVImportModal'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { useAppContext } from '../context/AppContext'

export default function Transactions() {
  const { state, dispatch } = useAppContext()  // ✅ Added dispatch
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [filter, setFilter] = useState('all')
  
  // Filter transactions
  const filteredTransactions = state.transactions.filter(t => {
    if (filter === 'income') return t.type === 'income'
    if (filter === 'expense') return t.type === 'expense'
    return true
  })

  return (
    <>
      {/* CSV Import Modal */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <CSVImportModal onClose={() => setShowCSVImport(false)} />
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Track and manage all your income and expenses</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCSVImport(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </button>
          </div>
        </div>

        {/* Add Transaction Form */}
        <TransactionForm />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All ({state.transactions.length})
            </button>
            <button 
              onClick={() => setFilter('income')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'income' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Income ({state.transactions.filter(t => t.type === 'income').length})
            </button>
            <button 
              onClick={() => setFilter('expense')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'expense' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Expenses ({state.transactions.filter(t => t.type === 'expense').length})
            </button>
          </div>
        </div>

        {/* Transactions List with filtered data */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {filter === 'all' ? 'All Transactions' : 
               filter === 'income' ? 'Income Transactions' : 'Expense Transactions'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredTransactions.length} transactions
            </span>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4 text-6xl">📭</div>
              <p className="text-gray-600 mb-2">No transactions found</p>
              <p className="text-sm text-gray-500">Try changing your filter or add new transactions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.amount > 0 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'}`}
                    >
                      {transaction.amount > 0 ? '+' : '-'}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{transaction.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {transaction.category}
                        </span>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-bold ${transaction.amount > 0 
                      ? 'text-green-600' 
                      : 'text-red-600'}`}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this transaction?')) {
                          dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id })
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-150"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CSV Import Instructions */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">CSV Import Guide</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                Export your bank statement as CSV from your banking portal
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                Expected columns: date, description, amount, category (optional)
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                AI will help map columns and categorize transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}