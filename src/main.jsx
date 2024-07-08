import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <Navbar/>
    <App />
  </React.StrictMode>,
)
