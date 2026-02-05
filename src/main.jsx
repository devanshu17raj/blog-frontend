import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  /* Make sure this file is EMPTY as per Step 1 */
// import './App.css' /* Sometimes it's imported here, which is fine */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)