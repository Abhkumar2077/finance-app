import { Calendar, AlertCircle } from 'lucide-react'

export default function Subscriptions() {
  const subscriptions = [
    { id: 1, name: 'Netflix', amount: 15.99, frequency: 'monthly', nextCharge: '2024-02-01', category: 'Entertainment', active: true },
    { id: 2, name: 'Spotify', amount: 9.99, frequency: 'monthly', nextCharge: '2024-02-05', category: 'Entertainment', active: true },
    { id: 3, name: 'Amazon Prime', amount: 14.99, frequency: 'monthly', nextCharge: '2024-02-10', category: 'Shopping', active: true },
    { id: 4, name: 'Gym Membership', amount: 29.99, frequency: 'monthly', nextCharge: '2024-02-15', category: 'Health', active: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600">Track and manage your recurring payments</p>
      </div>

      {/* Total Monthly Cost */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Monthly Subscription Cost</h2>
            <p className="text-gray-600">Total of all active subscriptions</p>
          </div>
          <div className="text-3xl font-bold text-blue-600">$70.96</div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                  {sub.category}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">${sub.amount}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Next charge: {sub.nextCharge} ({sub.frequency})</span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${sub.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">{sub.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-yellow-50 rounded-xl border border-yellow-200 shadow-sm p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">AI Insight: Subscription Creep</h3>
            <p className="text-yellow-700 mb-3">
              Your subscription costs have increased by 25% over the last 3 months. 
              Consider reviewing which services you actively use.
            </p>
            <div className="text-sm text-yellow-600">
              Total subscriptions: 4 • Monthly cost: $70.96 • Yearly cost: $851.52
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}