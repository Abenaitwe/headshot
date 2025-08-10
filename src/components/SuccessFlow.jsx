import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Star,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Sparkles,
  Crown
} from 'lucide-react'

export default function SuccessFlow({ 
  isOpen, 
  onClose, 
  transformedImage, 
  onNewTransformation,
  onUpgrade,
  subscription 
}) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isOpen || !transformedImage) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = transformedImage
    link.download = `professional-headshot-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = (platform) => {
    const text = "Just created an amazing professional headshot with HeadshotCam! 🚀"
    const url = window.location.origin
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleRating = (value) => {
    setRating(value)
  }

  const submitFeedback = () => {
    // In production, this would send feedback to your backend
    console.log('Feedback submitted:', { rating, feedback })
    // Show thank you message or close modal
  }

  const getRemainingTransformations = () => {
    if (!subscription) return 0
    const plans = {
      free: 3,
      starter: 15,
      pro: 50,
      premium: 100
    }
    const limit = plans[subscription.plan] || 3
    return Math.max(0, limit - (subscription.transformationsUsed || 0))
  }

  const shouldShowUpgrade = () => {
    const remaining = getRemainingTransformations()
    return subscription?.plan === 'free' && remaining <= 1
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Professional Headshot is Ready! 🎉
          </h2>
          <p className="text-gray-600">
            Congratulations! Your AI-powered transformation is complete.
          </p>
        </div>

        {/* Image Display */}
        <div className="p-6">
          <div className="text-center mb-6">
            <img 
              src={transformedImage} 
              alt="Professional headshot" 
              className="max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <Button 
              onClick={handleDownload}
              className="w-full"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Download High-Resolution Image
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onNewTransformation}
                variant="outline"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Transform Another
              </Button>
              
              <Button 
                onClick={() => setShowShareOptions(!showShareOptions)}
                variant="outline"
                size="lg"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Success
              </Button>
            </div>
          </div>

          {/* Share Options */}
          {showShareOptions && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Share Your Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center justify-center"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCopyLink}
                    className="flex items-center justify-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upgrade Prompt */}
          {shouldShowUpgrade() && (
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Crown className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-purple-900">
                        Almost at your limit!
                      </h3>
                      <p className="text-sm text-purple-700">
                        You have {getRemainingTransformations()} transformation{getRemainingTransformations() === 1 ? '' : 's'} left this month.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={onUpgrade}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating and Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How was your experience?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Star Rating */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Rate your experience:</p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`p-1 transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Tell us about your experience (optional):
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What did you think of your professional headshot?"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={onClose}>
                    Skip
                  </Button>
                  <Button 
                    onClick={submitFeedback}
                    disabled={rating === 0}
                  >
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

