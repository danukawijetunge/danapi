import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import './App.css'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <div className="card">
        {location.pathname !== '/dashboard' && (
          <button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        )}
      </div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  )
}

export default App
