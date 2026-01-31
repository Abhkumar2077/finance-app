import { useState } from 'react'
import { Calendar, AlertCircle, Plus, TrendingUp, DollarSign, Clock } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Subscriptions() {
  const { state, dispatch } = useAppContext()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    category: 'Entertainment',
    renewalDate: getNextMonthDate()
  })
  
  // Calculate subscription metrics
  const totalMonthly = state.subscriptions?.reduce((sum, sub) => {
    if (!sub.active) return sum
    const multiplier = sub.frequency === 'yearly' ? 1/12 : sub.frequency === 'weekly' ? 4.33 : 1
    return sum + (parseFloat(sub.amount) || 0) * multiplier
  }, 0) || 0
  
  const upcomingRenewals = state.subscriptions
    ?.filter(sub => sub.active && isUpcoming(sub.renewalDate, 7))
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
    .slice(0, 5) || []
  
  const subscriptionByCategory = state.subscriptions?.reduce((acc, sub) => {
    if (!sub.active) return acc
    acc[sub.category] = (acc[sub.category] || 0) + parseFloat(sub.amount)
    return acc
  }, {}) || {}
  
  const handleAddSubscription = (e) => {
    e.preventDefault()
    
    const subscription = {
      id: Date.now(),
      ...newSubscription,
      amount: parseFloat(newSubscription.amount),
      active: true,
      createdAt: new Date().toISOString()
    }
    
    dispatch({ 
      type: 'ADD_SUBSCRIPTION', 
      payload: subscription 
    })
    
    setNewSubscription({
      name: '',
      amount: '',
      frequency: 'monthly',
      category: 'Entertainment',
      renewalDate: getNextMonthDate()
    })
    setShowAddForm(false)
  }
  
  const toggleSubscription = (id) => {
    dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: id })
  }
  
  const deleteSubscription = (id) => {
    if (window.confirm('Delete this subscription?')) {
      dispatch({ type: 'DELETE_SUBSCRIPTION', payload: id })
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Track and manage your recurring payments</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </button>
      </div>
      
      {/* Add Subscription Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Subscription</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <input
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSubscription.amount}
                    onChange={(e) => setNewSubscription({...newSubscription, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select
                    value={newSubscription.frequency}
                    onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newSubscription.category}
                    onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Health">Health</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Next Renewal</label>
                  <input
                    type="date"
                    value={newSubscription.renewalDate}
                    onChange={(e) => setNewSubscription({...newSubscription, renewalDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600"
                >
                  Add Subscription
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Cost</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${totalMonthly.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total active subscriptions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Yearly Cost</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">${(totalMonthly * 12).toFixed(2)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Annual projection</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Renewals</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{upcomingRenewals.length}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Next 7 days</p>
        </div>
      </div>

      {/* Upcoming Renewals */}
      {upcomingRenewals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming Renewals
          </h3>
          <div className="space-y-3">
            {upcomingRenewals.map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="font-medium">{sub.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">${sub.amount}</span>
                    <span>•</span>
                    <span>{sub.frequency}</span>
                    <span>•</span>
                    <span>{sub.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {formatDate(sub.renewalDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getDaysUntil(sub.renewalDate)} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">All Subscriptions</h3>
        
        {state.subscriptions?.length > 0 ? (
          <div className="space-y-3">
            {state.subscriptions.map(sub => (
              <div key={sub.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${sub.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <h4 className="font-medium">{sub.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>${sub.amount}</span>
                      <span>•</span>
                      <span>{sub.frequency}</span>
                      <span>•</span>
                      <span>{sub.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSubscription(sub.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${sub.active 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {sub.active ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4 text-6xl">📱</div>
            <p className="text-gray-600">No subscriptions yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your first subscription to start tracking</p>
          </div>
        )}
      </div>

      {/* AI Subscription Insights */}
      <div className="bg-yellow-50 rounded-xl border border-yellow-200 shadow-sm p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">AI Subscription Insights</h3>
            <p className="text-yellow-700 mb-3">
              {totalMonthly > 100 ? 
                `Your subscription costs ($${totalMonthly.toFixed(2)}/month) are above the average. Consider reviewing which services you actively use.` :
                `Your subscription costs are manageable at $${totalMonthly.toFixed(2)}/month. Good job keeping recurring expenses low!`
              }
            </p>
            {Object.keys(subscriptionByCategory).length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-yellow-800 mb-2">Spending by category:</p>
                <div className="space-y-2">
                  {Object.entries(subscriptionByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-yellow-700">{category}</span>
                      <span className="text-sm font-medium text-yellow-800">${amount.toFixed(2)}/month</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getNextMonthDate() {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().split('T')[0]
}

function isUpcoming(dateString, days = 7) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= days
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getDaysUntil(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}