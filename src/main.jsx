import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Tutorial from './Tutorial.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Tutorial /> */}
  </StrictMode>,
)
