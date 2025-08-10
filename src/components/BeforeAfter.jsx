import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'

// Import before/after images
import beforeAfter1 from '../assets/c8KjCOqFS6In.jpg'
import beforeAfter2 from '../assets/RIBQOJU8K3Yt.jpg'
import beforeAfter3 from '../assets/Jw9NYRffmYyb.jpg'

const transformations = [
  {
    id: 1,
    before: beforeAfter1,
    after: beforeAfter1,
    name: "Sarah M.",
    title: "Marketing Manager",
    testimonial: "Incredible results! My LinkedIn profile views increased by 300%."
  },
  {
    id: 2,
    before: beforeAfter2,
    after: beforeAfter2,
    name: "David L.",
    title: "Software Engineer",
    testimonial: "Professional quality without the hassle. Highly recommend!"
  },
  {
    id: 3,
    before: beforeAfter3,
    after: beforeAfter3,
    name: "Emily R.",
    title: "Business Consultant",
    testimonial: "Perfect for my consulting business. Clients love the professional look."
  }
]

export default function BeforeAfter() {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
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

  const handleTransformClick = () => {
    if (user) {
      window.location.href = '#dashboard'
    } else {
      setShowAuthModal(true)
    }
  }
  
  return (
    <>
      <section 
        id="examples" 
        ref={sectionRef}
        className="section bg-pattern"
        style={{ backgroundColor: 'var(--color-background-secondary)' }}
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              See the Magic Happen
            </h2>
            <p 
              className="font-sans text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Real professionals, real transformations. Watch ordinary selfies become 
              LinkedIn-ready headshots that command attention and respect.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {transformations.map((item, index) => (
              <div 
                key={item.id} 
                className={`card transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative h-80 mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={item.before} 
                    alt={`${item.name} transformation`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-serif font-semibold text-lg">{item.name}</p>
                    <p className="font-sans text-sm opacity-90">{item.title}</p>
                  </div>
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)'
                    }}
                  >
                    AFTER
                  </div>
                </div>
                <blockquote 
                  className="font-sans italic text-center"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  "{item.testimonial}"
                </blockquote>
              </div>
            ))}
          </div>
          
          {/* Results Stats */}
          <div 
            className={`card mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '600ms' }}
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div 
                  className="text-4xl font-serif font-bold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  2 min
                </div>
                <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  Average processing time
                </div>
              </div>
              <div>
                <div 
                  className="text-4xl font-serif font-bold mb-2"
                  style={{ color: 'var(--color-accent)' }}
                >
                  99.2%
                </div>
                <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  Customer satisfaction
                </div>
              </div>
              <div>
                <div 
                  className="text-4xl font-serif font-bold mb-2"
                  style={{ color: 'var(--color-purple)' }}
                >
                  $500+
                </div>
                <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  Saved vs photographer
                </div>
              </div>
              <div>
                <div 
                  className="text-4xl font-serif font-bold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  24/7
                </div>
                <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  Available anytime
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className={`text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '800ms' }}
          >
            <button 
              onClick={handleTransformClick}
              className="btn btn-primary btn-large group"
            >
              <span>Create Your Professional Headshot</span>
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
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  )
}

