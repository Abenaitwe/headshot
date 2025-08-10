// Freemius Configuration
export const FREEMIUS_CONFIG = {
  productId: import.meta.env.VITE_FREEMIUS_PRODUCT_ID,
  publicKey: import.meta.env.VITE_FREEMIUS_PUBLIC_KEY,
  secretKey: import.meta.env.VITE_FREEMIUS_SECRET_KEY
}

export const PRICING_PLANS = {
  starter: {
    name: 'Starter Plan',
    price: '$9.99/month',
    yearlyPrice: '$99.99/year',
    features: [
      '15 professional headshots',
      'HD quality',
      'Fast generation',
      'No watermark'
    ],
    checkoutUrl: `https://checkout.freemius.com/product/${import.meta.env.VITE_FREEMIUS_PRODUCT_ID}/plan/33343/`,
    planId: '33343',
    transformations: 15
  },
  pro: {
    name: 'Pro Plan',
    price: '$15.99/month',
    yearlyPrice: '$149.99/year',
    features: [
      '50 professional headshots',
      'Better quality',
      'Faster generation',
      'No watermark'
    ],
    checkoutUrl: `https://checkout.freemius.com/product/${import.meta.env.VITE_FREEMIUS_PRODUCT_ID}/plan/33378/`,
    planId: '33378',
    popular: true,
    transformations: 50
  },
  premium: {
    name: 'Premium Plan',
    price: '$49.99/month',
    yearlyPrice: '$499.99/year',
    features: [
      '100 professional headshots',
      'Best quality',
      'Fastest generation',
      'No watermark'
    ],
    checkoutUrl: `https://checkout.freemius.com/product/${import.meta.env.VITE_FREEMIUS_PRODUCT_ID}/plan/33379/`,
    planId: '33379',
    transformations: 100
  },
  free: {
    name: 'Free Plan',
    price: 'Free',
    features: [
      '3 transformations per month',
      'Standard quality',
      'Basic support'
    ],
    transformations: 3
  }
}

export const openCheckout = (planKey, userEmail, successCallback, cancelCallback) => {
  const plan = PRICING_PLANS[planKey]
  if (!plan || !plan.checkoutUrl) {
    console.error('Invalid plan or missing checkout URL:', planKey)
    return
  }
  
  const params = new URLSearchParams({
    email: userEmail || '',
    success_url: `${window.location.origin}/payment-success`,
    cancel_url: `${window.location.origin}/payment-cancel`
  })
  
  const fullCheckoutUrl = `${plan.checkoutUrl}?${params.toString()}`
  
  const checkoutWindow = window.open(
    fullCheckoutUrl,
    'freemius_checkout',
    'width=600,height=700,scrollbars=yes,resizable=yes'
  )
  
  const checkoutListener = (event) => {
    if (event.origin !== 'https://checkout.freemius.com') return
    
    if (event.data.type === 'checkout.success') {
      checkoutWindow.close()
      successCallback?.(event.data)
      window.removeEventListener('message', checkoutListener)
    } else if (event.data.type === 'checkout.cancel') {
      checkoutWindow.close()
      cancelCallback?.()
      window.removeEventListener('message', checkoutListener)
    }
  }
  
  window.addEventListener('message', checkoutListener)
  
  const checkClosed = setInterval(() => {
    if (checkoutWindow.closed) {
      clearInterval(checkClosed)
      window.removeEventListener('message', checkoutListener)
      cancelCallback?.()
    }
  }, 1000)
}

// Server integration
export const serverBaseUrl = import.meta.env.VITE_SERVER_BASE_URL || ''

export const fetchServerSubscription = async (email) => {
  try {
    if (!serverBaseUrl || !email) return null
    const res = await fetch(`${serverBaseUrl}/api/subscription?email=${encodeURIComponent(email)}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const incrementServerUsage = async (email) => {
  try {
    if (!serverBaseUrl || !email) return null
    const res = await fetch(`${serverBaseUrl}/api/subscription/increment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!res.ok) throw new Error('increment failed')
    return await res.json()
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const mergeServerSubscription = (serverSub) => {
  const planKey = serverSub?.plan_key || 'free'
  const plan = PRICING_PLANS[planKey] || PRICING_PLANS.free
  return {
    plan: planKey,
    transformationsUsed: serverSub?.transformations_used ?? 0,
    transformationsLimit: serverSub?.transformations_limit ?? plan.transformations,
    isActive: (serverSub?.status || 'active') !== 'canceled',
    expiresAt: serverSub?.renews_at || null,
  }
}

// Subscription management functions (Supabase-backed)
export const getUserSubscription = async (email) => {
  try {
    const server = await fetchServerSubscription(email)
    if (server) return mergeServerSubscription(server)
    // fallback
    return { plan: 'free', transformationsUsed: 0, transformationsLimit: 3, isActive: true, expiresAt: null }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return { plan: 'free', transformationsUsed: 0, transformationsLimit: 3, isActive: true }
  }
}

export const updateSubscription = async (_email, subscriptionData) => {
  // No-op client-side; server updates happen via webhooks
  return { ...subscriptionData }
}

export const incrementTransformationUsage = async (email) => {
  try {
    const updated = await incrementServerUsage(email)
    return mergeServerSubscription(updated)
  } catch (error) {
    console.error('Error incrementing usage:', error)
    throw error
  }
}

export const canUserTransform = (subscription) => {
  if (!subscription?.isActive) return false
  const plan = PRICING_PLANS[subscription.plan] || PRICING_PLANS.free
  return subscription.transformationsUsed < (subscription.transformationsLimit ?? plan.transformations)
}

export const getRemainingTransformations = (subscription) => {
  const plan = PRICING_PLANS[subscription.plan] || PRICING_PLANS.free
  const limit = subscription.transformationsLimit ?? plan.transformations
  return Math.max(0, limit - subscription.transformationsUsed)
}

