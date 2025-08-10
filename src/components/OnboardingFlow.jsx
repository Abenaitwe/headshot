import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Download,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react'

export default function OnboardingFlow({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to HeadshotCam!',
      description: 'Transform your selfies into professional headshots in just a few simple steps.',
      icon: <Camera className="h-12 w-12 text-blue-600" />,
      content: (
        <div className="text-center space-y-4">
          <div className="bg-blue-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <Camera className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Ready to create your professional headshot?
          </h3>
          <p className="text-gray-600">
            We'll guide you through the process step by step. It only takes a few minutes!
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Upload</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Transform</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-2">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Download</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'photo-tips',
      title: 'Photo Tips for Best Results',
      description: 'Follow these simple guidelines to get the best professional headshot.',
      icon: <Camera className="h-12 w-12 text-green-600" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Do This
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use good lighting (natural light works best)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Face the camera directly
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Keep your face clearly visible
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use a high-resolution image
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Smile naturally or keep a neutral expression
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                Avoid This
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Dark or poorly lit photos
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Side angles or looking away
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Sunglasses or face coverings
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Blurry or low-quality images
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Group photos or multiple people
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> The better your original photo, the better your professional headshot will look!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'subscription',
      title: 'Choose Your Plan',
      description: 'Select a plan that fits your needs. You can always upgrade later.',
      icon: <Sparkles className="h-12 w-12 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Start with our Free Plan
            </h4>
            <p className="text-gray-600">
              Try HeadshotCam with 3 free transformations per month. No credit card required.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-semibold text-gray-900">Free Plan</h5>
                <p className="text-sm text-gray-600">Perfect for trying out the service</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">Free</div>
                <div className="text-sm text-gray-500">Forever</div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                3 professional headshots per month
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Standard quality transformations
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Basic customer support
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Need more transformations? You can upgrade anytime from your dashboard.
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <span>✓ No credit card required</span>
              <span>✓ Upgrade anytime</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      title: 'You\'re All Set!',
      description: 'Ready to create your first professional headshot?',
      icon: <CheckCircle className="h-12 w-12 text-green-600" />,
      content: (
        <div className="text-center space-y-6">
          <div className="bg-green-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Transform Your Selfie!
            </h3>
            <p className="text-gray-600">
              You're all set up and ready to create your first professional headshot. 
              The process is simple and takes just a few minutes.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">What happens next:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">1</span>
                Upload your best selfie
              </div>
              <div className="flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">2</span>
                Our AI transforms it in ~2 minutes
              </div>
              <div className="flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">3</span>
                Download your professional headshot
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete?.()
      onClose?.()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete?.()
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            {currentStepData.icon}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStepData.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <Sparkles className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

