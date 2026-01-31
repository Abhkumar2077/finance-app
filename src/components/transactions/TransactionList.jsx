import { useAppContext } from '../../context/AppContext'
import { Trash2, ArrowUp, ArrowDown, Tag } from 'lucide-react'

export function TransactionList() {
  const { state, dispatch } = useAppContext()
  
  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  if (state.transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4 text-6xl">💸</div>
        <h3 className="text-lg font-medium text-gray-600">No transactions yet</h3>
        <p className="text-gray-500 mt-1">Add your first transaction above!</p>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      
      <div className="space-y-3">
        {state.transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
          >
            <div className="flex items-center gap-4">
              {/* Type Icon */}
              <div className={`p-2 rounded-full ${transaction.amount > 0 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'}`}
              >
                {transaction.amount > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </div>
              
              {/* Description & Category */}
              <div>
                <h3 className="font-medium">{transaction.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Tag className="h-3 w-3" />
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{transaction.date}</span>
                </div>
              </div>
            </div>
            
            {/* Amount & Delete Button */}
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold ${transaction.amount > 0 
                ? 'text-green-600' 
                : 'text-red-600'}`}
              >
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </span>
              
              <button
                onClick={() => handleDelete(transaction.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-150"
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}