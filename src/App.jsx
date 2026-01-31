import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import Subscriptions from './pages/Subscriptions'
import Suggestions from './pages/Suggestions'  // Add this import
import { AppProvider } from './context/AppContext'
import './index.css'

function App() {
  return (
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
                <Route path="/suggestions" element={<Suggestions />} />  {/* Add this route */}
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App