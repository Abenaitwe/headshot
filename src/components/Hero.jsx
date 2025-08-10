import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'
import heroBackground from '../assets/hero-background.png'

export default function Hero() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleTransformClick = () => {
    if (user) {
      window.location.href = '#dashboard'
    } else {
      setShowAuthModal(true)
    }
  }

  const handleExamplesClick = () => {
    document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Top Banner */}
      <div 
        className="w-full py-3 text-center relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <p className="font-sans text-sm font-medium relative z-10" style={{ color: 'var(--color-white)' }}>
          🔥 Limited-Time Beta Pricing <span className="font-bold">Ending Soon!</span>
        </p>
      </div>

      <section 
        className="relative min-h-screen flex items-center bg-pattern overflow-hidden"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ 
            backgroundImage: `url(${heroBackground})`,
            backgroundPosition: 'right center'
          }}
        ></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-10 animate-float"
            style={{ backgroundColor: 'var(--color-purple)' }}
          ></div>
          <div 
            className="absolute bottom-40 left-20 w-24 h-24 rounded-full opacity-10 animate-float"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10 animate-float"
            style={{ 
              backgroundColor: 'var(--color-accent)',
              animationDelay: '2s'
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            {/* Main Headline */}
            <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h1 className="font-serif font-bold mb-6 leading-tight">
                <span 
                  className="block text-5xl md:text-7xl mb-4"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Transform Your Selfies,
                </span>
                <span 
                  className="block text-4xl md:text-6xl italic"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Get Professional
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <p 
                className="font-sans text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                No photographer. No studio. No expensive sessions. 
                Just upload your selfie and get LinkedIn-ready headshots in minutes.
              </p>
            </div>

            {/* Stats */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="flex flex-wrap gap-8 mb-12">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  ></div>
                  <span className="font-sans font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    93.7% cheaper
                  </span>
                  <span className="font-sans" style={{ color: 'var(--color-text-muted)' }}>
                    than photographers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  ></div>
                  <span className="font-sans font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    2 minutes
                  </span>
                  <span className="font-sans" style={{ color: 'var(--color-text-muted)' }}>
                    processing time
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--color-purple)' }}
                  ></div>
                  <span className="font-sans font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    50,000+
                  </span>
                  <span className="font-sans" style={{ color: 'var(--color-text-muted)' }}>
                    professionals served
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <button 
                  onClick={handleTransformClick}
                  className="btn btn-primary btn-large group"
                >
                  <span>Transform your first selfie</span>
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button 
                  onClick={handleExamplesClick}
                  className="btn btn-secondary btn-large"
                >
                  View Examples
                </button>
              </div>
            </div>

            {/* Social Proof */}
            <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  <div 
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      borderColor: 'var(--color-white)',
                      color: 'var(--color-white)'
                    }}
                  >
                    JD
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: 'var(--color-accent)',
                      borderColor: 'var(--color-white)',
                      color: 'var(--color-white)'
                    }}
                  >
                    SM
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: 'var(--color-purple)',
                      borderColor: 'var(--color-white)',
                      color: 'var(--color-white)'
                    }}
                  >
                    AL
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      borderColor: 'var(--color-white)',
                      color: 'var(--color-white)'
                    }}
                  >
                    MK
                  </div>
                  <div 
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: 'var(--color-accent)',
                      borderColor: 'var(--color-white)',
                      color: 'var(--color-white)'
                    }}
                  >
                    RH
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: '#FFD700' }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="font-sans" style={{ color: 'var(--color-text-muted)' }}>
                <span className="font-semibold">Loved by achievers</span> - Join thousands of professionals who've upgraded their image
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  )
}

