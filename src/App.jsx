import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
// Add these imports:
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import ErrorBoundary from './components/ErrorBoundary'

// Import all pages
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Subscriptions from './pages/Subscriptions'
import Insights from './pages/Insights'
import Suggestions from './pages/Suggestions'
import Settings from './pages/Settings'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64">
              <Header />
              <main className="flex-1 p-4 md:p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/budgets" element={<Budgets />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/suggestions" element={<Suggestions />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App