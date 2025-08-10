import { Progress } from '@/components/ui/progress.jsx'
import { Button } from '@/components/ui/button.jsx'
import { PRICING_PLANS } from '../lib/freemius.js'
import { 
  Zap, 
  Crown, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

export default function UsageIndicator({ subscription, onUpgradeClick }) {
  if (!subscription) return null

  const plan = PRICING_PLANS[subscription.plan] || PRICING_PLANS.free
  const usagePercentage = (subscription.transformationsUsed / plan.transformations) * 100
  const remaining = plan.transformations - subscription.transformationsUsed
  
  const getUsageColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500'
    if (usagePercentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getUsageIcon = () => {
    if (subscription.plan === 'premium') return <Crown className="h-4 w-4" />
    if (subscription.plan === 'pro') return <TrendingUp className="h-4 w-4" />
    return <Zap className="h-4 w-4" />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getUsageIcon()}
          <span className="font-medium text-gray-900">
            {plan.name} - Usage This Month
          </span>
        </div>
        
        {subscription.plan === 'free' && remaining <= 1 && (
          <Button 
            size="sm" 
            onClick={onUpgradeClick}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Upgrade
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {subscription.transformationsUsed} of {plan.transformations} used
          </span>
          <span className="font-medium text-gray-900">
            {remaining} remaining
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={usagePercentage} 
            className="h-2"
          />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getUsageColor()}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        
        {remaining === 0 && (
          <div className="flex items-center space-x-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                You've reached your monthly limit
              </p>
              <p className="text-xs text-red-600">
                Upgrade to continue transforming images
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={onUpgradeClick}
              className="bg-red-600 hover:bg-red-700"
            >
              Upgrade Now
            </Button>
          </div>
        )}
        
        {remaining <= 2 && remaining > 0 && subscription.plan === 'free' && (
          <div className="flex items-center space-x-2 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Almost at your limit
              </p>
              <p className="text-xs text-yellow-600">
                Only {remaining} transformation{remaining === 1 ? '' : 's'} left this month
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onUpgradeClick}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              Upgrade
            </Button>
          </div>
        )}
      </div>
      
      {subscription.plan !== 'free' && (
        <div className="mt-3 text-xs text-gray-500">
          Usage resets on the {new Date().getDate()}th of each month
        </div>
      )}
    </div>
  )
}

