import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './styles/style.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'perfect-scrollbar/dist/perfect-scrollbar.min.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
