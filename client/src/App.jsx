import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import GeneratePost from './pages/GeneratePost'
import CalendarView from './pages/CalendarView'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import { Toaster } from 'react-hot-toast'
import { HiMenu, HiX } from 'react-icons/hi'

function App() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/welcome'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30 font-inter">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a1919',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '10px 16px',
          fontSize: '13px',
          fontFamily: 'Manrope, sans-serif'
        }
      }} />
      
      {/* Mobile menu toggle */}
      {!isLandingPage && (
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-xl bg-surface-low border border-white/10 text-white/60 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
        </button>
      )}

      {/* Sidebar */}
      {!isLandingPage && <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)} />
      )}
      
      <main className={`flex-1 overflow-y-auto ${!isLandingPage ? 'lg:ml-56' : ''}`}>
        <div className={!isLandingPage ? "max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10" : ""}>
          <Routes>
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate" element={<GeneratePost />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
