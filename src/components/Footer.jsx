import logo from '../assets/logo.webp'

export default function Footer() {
  return (
    <footer className="bg-pattern" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logo} 
                alt="HeadshotCam Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-serif font-bold" style={{ color: 'var(--color-text-primary)' }}>
                HeadshotCam
              </span>
            </div>
            <p className="font-sans mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Transform your selfies into professional headshots with AI technology. 
              Fast, affordable, and LinkedIn-ready.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:transform hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:transform hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:transform hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-serif font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#features" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#examples" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Examples
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  API
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-serif font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-serif font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="font-sans transition-colors hover:text-primary"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
              © 2025 HeadshotCam. All rights reserved.
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                support@headshot.cam
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

