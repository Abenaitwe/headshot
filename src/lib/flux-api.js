import axios from 'axios'

const FLUX_API_KEY = import.meta.env.VITE_FLUX_KONTEXT_PRO_API_KEY
const FLUX_API_BASE = import.meta.env.VITE_FLUX_KONTEXT_PRO_API_BASE_URL

const TRANSFORMATION_PROMPT = `Transform this person into a professional corporate headshot while keeping their face, facial features, and identity exactly the same. Change the lighting to soft, professional studio lighting with even illumination on the face. Replace the background with a clean, neutral gradient. Improve the clothing to business professional attire - add a well-fitted blazer or business shirt. Enhance skin texture to be smooth and polished but maintain natural appearance. Ensure sharp focus on the eyes with professional catchlight reflections. Keep the person's expression confident and approachable with a subtle professional smile. Make this LinkedIn-ready quality.`

export const transformImage = async (imageBase64, onProgress) => {
  try {
    // Step 1: Submit transformation request
    onProgress?.({ status: 'submitting', message: 'Submitting your image for transformation...' })
    
    const response = await axios.post(
      `${FLUX_API_BASE}/v1/flux-kontext-pro`,
      {
        prompt: TRANSFORMATION_PROMPT,
        input_image: imageBase64,
        aspect_ratio: '1:1',
        output_format: 'png',
        safety_tolerance: 2
      },
      {
        headers: {
          'x-key': FLUX_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const { id, polling_url } = response.data
    
    // Step 2: Poll for results
    onProgress?.({ status: 'processing', message: 'AI is transforming your image...' })
    
    const result = await pollForResult(polling_url, onProgress)
    return result
    
  } catch (error) {
    console.error('Error transforming image:', error)
    
    if (error.response?.status === 400) {
      throw new Error('Invalid image format. Please upload a clear selfie.')
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please try again.')
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.')
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    } else {
      throw new Error('Failed to transform image. Please check your connection and try again.')
    }
  }
}

const pollForResult = async (pollingUrl, onProgress, maxAttempts = 60) => {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(pollingUrl)
      const data = response.data
      
      if (data.status === 'Ready') {
        onProgress?.({ status: 'completed', message: 'Transformation completed!' })
        return {
          status: 'completed',
          imageUrl: data.result.sample,
          id: data.id
        }
      } else if (data.status === 'Error') {
        throw new Error(data.error || 'Transformation failed')
      } else {
        // Still processing
        const progress = Math.min(90, (attempts / maxAttempts) * 100)
        onProgress?.({ 
          status: 'processing', 
          message: 'AI is working on your professional headshot...', 
          progress 
        })
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++
      
    } catch (error) {
      if (error.response?.status === 404) {
        // Job not found, continue polling
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
        continue
      }
      throw error
    }
  }
  
  throw new Error('Transformation timed out. Please try again.')
}

export const getTransformationStatus = async (jobId) => {
  try {
    const response = await axios.get(`${FLUX_API_BASE}/v1/get_result`, {
      params: { id: jobId },
      headers: {
        'x-key': FLUX_API_KEY
      }
    })
    return response.data
  } catch (error) {
    console.error('Error getting transformation status:', error)
    throw error
  }
}

