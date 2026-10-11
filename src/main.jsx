import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StoresProvider } from './hooks/use-session-stores.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoresProvider>
        <App />
      </StoresProvider>
    </BrowserRouter>
  </StrictMode>,
)
