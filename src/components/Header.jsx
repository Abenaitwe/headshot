import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'
import logo from '../assets/logo.webp'

export default function Header() {
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleTransformClick = () => {
    if (user) {
      window.location.href = '#dashboard'
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-pattern" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="HeadshotCam Logo" 
                className="w-10 h-10 animate-float"
              />
              <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                HeadshotCam
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a 
                href="#features" 
                className="font-sans font-medium transition-colors hover:text-primary"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Features
              </a>
              <a 
                href="#examples" 
                className="font-sans font-medium transition-colors hover:text-primary"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Examples
              </a>
              <a 
                href="#pricing" 
                className="font-sans font-medium transition-colors hover:text-primary"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Pricing
              </a>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-sans" style={{ color: 'var(--color-text-muted)' }}>
                    Welcome, {user.email}
                  </span>
                  <button 
                    onClick={() => window.location.href = '#dashboard'}
                    className="btn btn-primary"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="font-sans font-medium transition-colors hover:text-primary"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="font-sans font-medium transition-colors hover:text-primary hidden sm:block"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleTransformClick}
                    className="btn btn-primary"
                  >
                    Transform Your Selfie
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  )
}

