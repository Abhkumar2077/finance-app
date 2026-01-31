import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Starting Finance AI App...')

const root = ReactDOM.createRoot(document.getElementById('root'))

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  console.log('App rendered successfully')
} catch (error) {
  console.error('Fatal error rendering app:', error)
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c00;">
      <h1>Application Error</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `
}