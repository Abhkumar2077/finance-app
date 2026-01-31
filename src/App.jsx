import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import { AppProvider } from './context/AppContext'
import './index.css'

// Error boundary for development
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-gray-700">Check browser console for errors</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

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
                  {/* Add other routes one by one to test */}
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