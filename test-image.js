// Test script to verify Flux API functionality
import axios from 'axios'
import fs from 'fs'

const FLUX_API_KEY = '8d918692-cd55-44ad-99d3-bb917252d168'
const FLUX_API_BASE = 'https://api.bfl.ai'

async function testFluxAPI() {
  try {
    console.log('Testing Flux API connection...')
    
    // Create a simple test image (1x1 pixel base64)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    const response = await axios.post(
      `${FLUX_API_BASE}/v1/flux-kontext-pro`,
      {
        prompt: 'Transform this into a professional headshot',
        input_image: testImageBase64,
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
    
    console.log('API Response:', response.data)
    console.log('API connection successful!')
    
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message)
    console.error('Status:', error.response?.status)
  }
}

testFluxAPI()

