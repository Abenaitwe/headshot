import { useState, useRef, useEffect } from 'react'

const features = [
  {
    icon: "⚡",
    title: "AI-Powered Transformation",
    description: "Advanced AI technology that maintains your facial features while creating professional studio-quality lighting and backgrounds.",
    color: "var(--color-primary)"
  },
  {
    icon: "⏱️",
    title: "2-Minute Processing",
    description: "Get your professional headshots in minutes, not weeks. No scheduling appointments or waiting for photographer availability.",
    color: "var(--color-accent)"
  },
  {
    icon: "💰",
    title: "93.7% Cost Savings",
    description: "Professional photographer sessions cost $300-800. Get the same quality for a fraction of the price with unlimited revisions.",
    color: "var(--color-purple)"
  },
  {
    icon: "📱",
    title: "Any Device, Anywhere",
    description: "Upload from your phone, tablet, or computer. No special equipment needed - just your existing selfies.",
    color: "var(--color-primary)"
  },
  {
    icon: "🛡️",
    title: "Privacy Protected",
    description: "Your photos are processed securely and deleted after 30 days. We never share or sell your personal images.",
    color: "var(--color-accent)"
  },
  {
    icon: "📥",
    title: "High-Resolution Output",
    description: "Download your headshots in multiple formats and resolutions, perfect for LinkedIn, resumes, and business cards.",
    color: "var(--color-purple)"
  }
]

const painPoints = [
  {
    problem: "Expensive photographer sessions ($300-800)",
    solution: "AI transformation starting at $9.99"
  },
  {
    problem: "Scheduling conflicts and long wait times",
    solution: "Instant processing, available 24/7"
  },
  {
    problem: "Multiple outfit changes and studio visits",
    solution: "Upload from home, AI handles the rest"
  },
  {
    problem: "Inconsistent quality and style",
    solution: "Professional results every time"
  }
]

export default function Features() {
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
      id="features" 
      ref={sectionRef}
      className="section bg-pattern"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4">
        {/* Pain Points Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Why Traditional Photography is Broken
          </h2>
          <p 
            className="font-sans text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Professional headshots shouldn't require weeks of planning, hundreds of dollars, 
            and multiple studio visits. There's a better way.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {painPoints.map((item, index) => (
              <div 
                key={index} 
                className={`card transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">❌</span>
                  <span className="font-serif font-semibold" style={{ color: '#DC2626' }}>
                    Old Way:
                  </span>
                </div>
                <div className="font-sans mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.problem}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">✅</span>
                  <span className="font-serif font-semibold" style={{ color: '#059669' }}>
                    HeadshotCam:
                  </span>
                </div>
                <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Features Grid */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="font-serif font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            The Superior Alternative
          </h2>
          <p 
            className="font-sans text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            HeadshotCam combines cutting-edge AI with professional photography principles 
            to deliver exceptional results at a fraction of the cost.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`card group transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                {feature.title}
              </h3>
              <p className="font-sans leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Social Proof */}
        <div 
          className={`card text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ 
            animationDelay: '900ms',
            backgroundColor: 'var(--color-background-secondary)'
          }}
        >
          <h3 className="font-serif text-2xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>
            Trusted by Professionals Worldwide
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: '#FFD700', animationDelay: `${i * 100}ms` }}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <div className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                4.9/5
              </div>
              <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                Average rating
              </div>
            </div>
            
            <div className="group">
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110">👥</div>
              <div className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
                50,000+
              </div>
              <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                Professionals served
              </div>
            </div>
            
            <div className="group">
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110">⚡</div>
              <div className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-purple)' }}>
                2 min
              </div>
              <div className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                Average processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

