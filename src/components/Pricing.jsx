import { useState, useRef, useEffect } from 'react'
import { PRICING_PLANS, openCheckout } from '../lib/freemius.js'

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      id="pricing" 
      ref={sectionRef}
      className="section bg-pattern"
      style={{ backgroundColor: 'var(--color-background-secondary)' }}
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Simple, Transparent Pricing
          </h2>
          <p 
            className="font-sans text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Choose the plan that fits your needs. All plans include high-quality AI transformations, 
            fast processing, and no watermarks.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {Object.entries(PRICING_PLANS)
            .filter(([key]) => key !== 'free')
            .map(([key, plan], index) => (
            <div 
              key={key}
              className={`card relative transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${
                plan.popular ? 'transform scale-105' : ''
              }`}
              style={{ 
                animationDelay: `${index * 200}ms`,
                border: plan.popular ? '2px solid var(--color-primary)' : undefined
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="px-4 py-2 rounded-full text-sm font-serif font-semibold flex items-center gap-1"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)'
                    }}
                  >
                    <span>⭐</span>
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="font-serif text-5xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {plan.price.split('/')[0]}
                  </span>
                  <span className="font-sans text-lg" style={{ color: 'var(--color-text-muted)' }}>
                    /{plan.price.split('/')[1]}
                  </span>
                </div>
                <div className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  or {plan.yearlyPrice} billed annually
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <svg 
                        className="w-3 h-3" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--color-white)' }}
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <span className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`btn w-full py-4 text-lg font-semibold group ${
                  plan.popular ? 'btn-primary' : 'btn-secondary'
                }`}
                onClick={() => openCheckout(key)}
              >
                <span>Get Started</span>
                <svg 
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        {/* Value Proposition */}
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
          <div className="card max-w-4xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-center mb-8" style={{ color: 'var(--color-text-primary)' }}>
              Compare to Traditional Photography
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-serif font-semibold mb-4 flex items-center gap-2" style={{ color: '#DC2626' }}>
                  <span>📸</span>
                  Traditional Photographer
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-red-500">❌</span>
                    $300-800 per session
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-red-500">❌</span>
                    2-4 weeks scheduling wait
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-red-500">❌</span>
                    2-3 hours time commitment
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-red-500">❌</span>
                    Limited revisions
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-red-500">❌</span>
                    Travel to studio required
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-red-500">❌</span>
                    Outfit changes needed
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-serif font-semibold mb-4 flex items-center gap-2" style={{ color: '#059669' }}>
                  <span>🤖</span>
                  HeadshotCam AI
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">✅</span>
                    Starting at $9.99
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">✅</span>
                    Instant availability
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">✅</span>
                    2 minutes processing
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">✅</span>
                    Unlimited revisions
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">✅</span>
                    Upload from anywhere
                  </li>
                  <li className="flex items-center gap-3 font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-green-500">✅</span>
                    AI handles everything
                  </li>
                </ul>
              </div>
            </div>
            
            <div 
              className="p-6 rounded-xl text-center"
              style={{ backgroundColor: '#059669' + '20' }}
            >
              <div className="font-serif text-3xl font-bold mb-2" style={{ color: '#059669' }}>
                Save 93.7% with HeadshotCam
              </div>
              <div className="font-sans text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                Get professional results at a fraction of the cost
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

