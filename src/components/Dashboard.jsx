import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { transformImage } from '../lib/flux-api.js'
import { fileToBase64, resizeImage, validateImageFile, downloadImage } from '../lib/imageUtils.js'
import { 
  getUserSubscription, 
  incrementTransformationUsage, 
  canUserTransform,
  updateSubscription 
} from '../lib/freemius.js'
import SubscriptionModal from './SubscriptionModal.jsx'
import UsageIndicator from './UsageIndicator.jsx'
import TransformationHistory from './TransformationHistory.jsx'
import OnboardingFlow from './OnboardingFlow.jsx'
import SuccessFlow from './SuccessFlow.jsx'
import logo from '../assets/logo.webp'
import heroBackground from '../assets/hero-background.png'
import { addTransformation } from '../lib/db.js'
import { getUserSettings, upsertUserSettings } from '../lib/db.js'
import { uploadDataUrlToHeadshots, uploadRemoteImageToHeadshots } from '../lib/storage.js'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [transformedImage, setTransformedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [error, setError] = useState('')
  const [transformationId, setTransformationId] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSuccessFlow, setShowSuccessFlow] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  useEffect(() => {
    if (user) {
      loadUserSubscription()
      checkFirstTimeUser()
    }
  }, [user])

  const loadUserSubscription = async () => {
    try {
      const userSub = await getUserSubscription(user.email)
      setSubscription(userSub)
    } catch (error) {
      console.error('Error loading subscription:', error)
    }
  }

  const checkFirstTimeUser = async () => {
    try {
      const settings = await getUserSettings(user.id)
      const hasSeen = !!settings?.has_seen_onboarding
      if (!hasSeen) {
        setIsFirstTime(true)
        setShowOnboarding(true)
      }
    } catch (e) {
      console.error('Failed fetching user settings', e)
    }
  }

  const handleFileSelect = (file) => {
    try {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        setError(validation.error)
        return
      }

      setSelectedFile(file)
      setError('')
      setTransformedImage(null)
      
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    } catch (error) {
      setError('Error processing file: ' + error.message)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleTransform = async () => {
    if (!selectedFile) return

    try {
      const canTransformNow = canUserTransform(subscription)
      if (!canTransformNow) {
        setShowSubscriptionModal(true)
        return
      }

      setIsProcessing(true)
      setProgress(0)
      setError('')
      setProgressMessage('Preparing your image...')

      // Resize image
      const resizedFile = await resizeImage(selectedFile, 1024, 1024)
      const base64Image = await fileToBase64(resizedFile)

      setProgress(25)
      setProgressMessage('Uploading to AI processor...')

      // Transform image
      const result = await transformImage(base64Image, (progressData) => {
        setProgress(25 + (progressData.progress * 0.75))
        setProgressMessage(progressData.message || 'Processing your professional headshot...')
      })

      if (result.success || result.status === 'completed') {
        const imageUrl = result.imageUrl || result.result?.sample
        const jobId = result.id

        // Upload images to Storage and get public URLs
        let originalPublicUrl = null
        let transformedPublicUrl = null
        try {
          if (preview) {
            originalPublicUrl = await uploadDataUrlToHeadshots(user.id, preview, 'original')
          }
          if (imageUrl) {
            transformedPublicUrl = await uploadRemoteImageToHeadshots(user.id, imageUrl, 'transformed')
          }
        } catch (e) {
          console.error('Failed to upload to storage', e)
          // Fallback to existing URLs if upload fails
          originalPublicUrl = preview
          transformedPublicUrl = imageUrl
        }

        setTransformedImage(transformedPublicUrl || imageUrl)
        setTransformationId(jobId)
        
        // Save transformation to DB with storage URLs
        try {
          await addTransformation({
            userId: user.id,
            originalImageUrl: originalPublicUrl,
            transformedImageUrl: transformedPublicUrl || imageUrl,
            status: 'completed',
            processingTime: undefined,
            jobId,
          })
        } catch (e) {
          console.error('Failed to save transformation', e)
        }
        
        // Increment usage on server
        try {
          const updated = await incrementTransformationUsage(user.email)
          setSubscription(updated)
        } catch (e) {
          console.error('Failed to increment server usage', e)
        }
        
        setProgress(100)
        setProgressMessage('Transformation complete!')
        
        setTimeout(() => {
          setShowSuccessFlow(true)
        }, 1000)
      } else {
        throw new Error(result.error || 'Transformation failed')
      }
    } catch (error) {
      setError(error.message)
      console.error('Transformation error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (transformedImage) {
      downloadImage(transformedImage, `headshot-${Date.now()}.png`)
    }
  }

  const resetTransformation = () => {
    setSelectedFile(null)
    setPreview(null)
    setTransformedImage(null)
    setProgress(0)
    setProgressMessage('')
    setError('')
    setTransformationId(null)
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={async () => {
          setShowOnboarding(false)
          try {
            await upsertUserSettings(user.id, { has_seen_onboarding: true })
          } catch (e) {
            console.error('Failed to update onboarding flag', e)
          }
        }}
      />
    )
  }

  return (
    <div 
      className="min-h-screen bg-pattern"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: `url(${heroBackground})`,
          backgroundPosition: 'right center'
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="HeadshotCam Logo" 
                className="w-10 h-10 animate-float"
              />
              <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                HeadshotCam
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: 'var(--color-text-secondary)' }}
                title="View History"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowOnboarding(true)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: 'var(--color-text-secondary)' }}
                title="Help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {user?.email}
                </span>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: 'var(--color-text-secondary)' }}
                  title="Sign Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Usage Indicator */}
          <div className="mb-8">
            <UsageIndicator 
              subscription={subscription}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          </div>

          {/* Upload Section */}
          <div className="card mb-8">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center" style={{ color: 'var(--color-text-primary)' }}>
              Transform Your Selfie
            </h2>
            
            {!selectedFile ? (
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  isDragOver 
                    ? 'border-primary bg-primary/5 transform scale-105' 
                    : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' + '20' }}
                  >
                    <svg 
                      className="w-8 h-8" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Drop your selfie here
                    </p>
                    <p className="font-sans" style={{ color: 'var(--color-text-secondary)' }}>
                      or click to browse files
                    </p>
                  </div>
                  <div className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Supports JPG, PNG • Max 10MB
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-serif font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                      Original
                    </h3>
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src={preview} 
                        alt="Original" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-serif font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                      Professional Result
                    </h3>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                      {transformedImage ? (
                        <img 
                          src={transformedImage} 
                          alt="Transformed" 
                          className="w-full h-full object-cover"
                        />
                      ) : isProcessing ? (
                        <div className="text-center">
                          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            {progressMessage}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="font-sans text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            Your professional headshot will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--color-primary)',
                          width: `${progress}%`
                        }}
                      ></div>
                    </div>
                    <p className="font-sans text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!transformedImage && !isProcessing && (
                    <button
                      onClick={handleTransform}
                      className="btn btn-primary btn-large group"
                    >
                      <span>✨ Transform to Professional</span>
                      <svg 
                        className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  )}
                  
                  {transformedImage && (
                    <>
                      <button
                        onClick={handleDownload}
                        className="btn btn-primary btn-large group"
                      >
                        <span>📥 Download Result</span>
                        <svg 
                          className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={resetTransformation}
                        className="btn btn-secondary btn-large"
                      >
                        🔄 Transform Another Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="font-sans text-red-700 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History Panel */}
      {showHistory && (
        <TransformationHistory 
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Modals */}
      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
      
      {showSuccessFlow && transformedImage && (
        <SuccessFlow 
          transformedImage={transformedImage}
          onClose={() => setShowSuccessFlow(false)}
          onDownload={handleDownload}
          onTransformAnother={resetTransformation}
        />
      )}
      
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={async () => {
            setShowOnboarding(false)
            try {
              await upsertUserSettings(user.id, { has_seen_onboarding: true })
            } catch (e) {
              console.error('Failed to update onboarding flag', e)
            }
          }}
        />
      )}
    </div>
  )
}

