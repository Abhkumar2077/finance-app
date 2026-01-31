import { Container } from '../components/layout/Container'
import { AdvancedAIPanel } from '../components/ai/AdvancedAIPanel'
import { LearningInsights } from '../components/learning/LearningInsights'
import { SmartSuggestionGenerator } from '../components/ai/SmartSuggestionGenerator'
import { TransactionList } from '../components/transactions/TransactionList'
import { SpendingChart } from '../components/analytics/SpendingChart'
import { FinancialHealthScore } from '../components/analytics/FinancialHealthScore'
import { useAppContext } from '../context/AppContext'
import { TrendingUp, DollarSign, PieChart, Target, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const { state } = useAppContext()
  
  // Calculate stats
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
  const netBalance = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((netBalance) / totalIncome) * 100 : 0

  return (
    <Container className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Your financial overview & AI insights</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Balance</p>
              <p className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${netBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Savings Rate</p>
              <p className={`text-2xl font-bold mt-1 ${savingsRate >= 20 ? 'text-green-600' : 'text-yellow-600'}`}>
                {savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - AI & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <AdvancedAIPanel />
          <SpendingChart />
        </div>

        {/* Right Column - Quick Stats & Transactions */}
        <div className="space-y-6">
          <FinancialHealthScore />
          <SmartSuggestionGenerator />
          <LearningInsights />
          <TransactionList />
        </div>
      </div>
    </Container>
  )
}