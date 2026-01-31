import { SuggestionInbox } from '../components/ai/SuggestionInbox'
import { LearningDashboard } from '../components/learning/LearningDashboard'
import { Lightbulb, BarChart3, Shield, Brain } from 'lucide-react'

export default function Suggestions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Suggestions</h1>
        <p className="text-gray-600">Review and manage AI-generated financial insights</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions Inbox
          </div>
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Learning
          </div>
        </button>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          How AI Suggestions Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-medium text-blue-800">Analysis</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI analyzes your spending patterns and identifies opportunities for improvement.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
              </div>
              <h3 className="font-medium text-yellow-800">Suggestion</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI generates suggestions with clear rationale and data references.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="font-medium text-green-800">Your Control</h3>
            </div>
            <p className="text-sm text-gray-600">
              You choose to accept, reject, or modify suggestions. AI never auto-applies changes.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestion Inbox */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <SuggestionInbox />
      </div>

      {/* AI Learning Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <LearningDashboard />
      </div>

      {/* AI Principles */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-3">AI Principles</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>AI only analyzes your actual transaction data</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>All suggestions require your explicit approval</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>AI learns from your decisions to improve suggestions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>No shaming or judgmental language</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>You can reject suggestions without penalty</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>Your preferences are saved locally (no cloud tracking)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}