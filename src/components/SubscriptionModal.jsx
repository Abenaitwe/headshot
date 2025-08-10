import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { PRICING_PLANS, openCheckout } from '../lib/freemius.js'
import { 
  X, 
  Check, 
  Crown, 
  Zap, 
  Star,
  CreditCard,
  Loader2
} from 'lucide-react'

export default function SubscriptionModal({ isOpen, onClose, userEmail, onSubscriptionUpdate, currentPlan = 'free' }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingPlan, setProcessingPlan] = useState(null)

  if (!isOpen) return null

  const handleUpgrade = async (planKey) => {
    if (planKey === 'free') return
    
    setIsProcessing(true)
    setProcessingPlan(planKey)
    
    try {
      await openCheckout(
        planKey,
        userEmail,
        (paymentData) => {
          // Payment successful
          console.log('Payment successful:', paymentData)
          onSubscriptionUpdate?.(planKey)
          onClose()
          setIsProcessing(false)
          setProcessingPlan(null)
        },
        () => {
          // Payment cancelled
          console.log('Payment cancelled')
          setIsProcessing(false)
          setProcessingPlan(null)
        }
      )
    } catch (error) {
      console.error('Error opening checkout:', error)
      setIsProcessing(false)
      setProcessingPlan(null)
    }
  }

  const getPlanIcon = (planKey) => {
    switch (planKey) {
      case 'starter':
        return <Zap className="h-6 w-6" />
      case 'pro':
        return <Star className="h-6 w-6" />
      case 'premium':
        return <Crown className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  const getPlanColor = (planKey) => {
    switch (planKey) {
      case 'starter':
        return 'text-blue-600 bg-blue-100'
      case 'pro':
        return 'text-purple-600 bg-purple-100'
      case 'premium':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-lg text-gray-600 mb-2">
              Upgrade to unlock more professional headshots
            </h3>
            <p className="text-sm text-gray-500">
              Choose the plan that fits your needs. Cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(PRICING_PLANS).map(([planKey, plan]) => (
              <Card 
                key={planKey} 
                className={`relative ${plan.popular ? 'ring-2 ring-purple-500' : ''} ${currentPlan === planKey ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {currentPlan === planKey && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${getPlanColor(planKey)}`}>
                    {getPlanIcon(planKey)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.price}
                  </div>
                  {plan.yearlyPrice && (
                    <div className="text-sm text-gray-500">
                      or {plan.yearlyPrice} yearly
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleUpgrade(planKey)}
                    disabled={isProcessing || currentPlan === planKey || planKey === 'free'}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : planKey === 'premium'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    variant={currentPlan === planKey ? 'outline' : 'default'}
                  >
                    {isProcessing && processingPlan === planKey ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : currentPlan === planKey ? (
                      'Current Plan'
                    ) : planKey === 'free' ? (
                      'Free Plan'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              All plans include secure payment processing and can be cancelled anytime.
            </p>
            <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
              <span>✓ 30-day money back guarantee</span>
              <span>✓ Secure payment with Freemius</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

