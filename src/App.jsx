import { AuthProvider } from './contexts/AuthContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import BeforeAfter from './components/BeforeAfter.jsx'
import Features from './components/Features.jsx'
import Pricing from './components/Pricing.jsx'
import Footer from './components/Footer.jsx'
import Dashboard from './components/Dashboard.jsx'
import './App.css'

function App() {
  // Simple routing based on hash
  const currentView = window.location.hash

  if (currentView === '#dashboard') {
    return (
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Hero />
        <BeforeAfter />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App

