import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { 
  Download, 
  Calendar, 
  Image as ImageIcon,
  Trash2,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react'
import { listTransformationsPage, deleteTransformation as deleteTransformationDb } from '../lib/db.js'

export default function TransformationHistory() {
  const { user } = useAuth()
  const [transformations, setTransformations] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    if (user?.id) {
      loadTransformationHistory()
    }
  }, [user, page])

  const loadTransformationHistory = async () => {
    if (!user?.id) return
    try {
      const { rows, count } = await listTransformationsPage(user.id, { page, pageSize })
      const mapped = rows.map(r => ({
        id: r.id,
        originalImage: r.original_image_url,
        transformedImage: r.transformed_image_url,
        createdAt: r.created_at,
        status: r.status,
        processingTime: r.processing_time || undefined,
      }))
      setTransformations(mapped)
      setTotal(count)
    } catch (e) {
      console.error('Failed to load transformations', e)
      setTransformations([])
      setTotal(0)
    }
  }

  const deleteTransformation = async (id) => {
    try {
      await deleteTransformationDb(user.id, id)
      // Reload current page
      await loadTransformationHistory()
    } catch (e) {
      console.error('Failed to delete transformation', e)
    }
  }

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename || `headshot-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Transformation History
          </div>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages} ({total} total)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transformations.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transformations yet
            </h3>
            <p className="text-gray-500">
              Your transformation history will appear here after you create your first professional headshot.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transformations.map((transformation) => (
              <div 
                key={transformation.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Before/After Images */}
                <div className="flex space-x-2">
                  <div className="relative">
                    <img 
                      src={transformation.originalImage} 
                      alt="Original" 
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                      onClick={() => setSelectedImage(transformation.originalImage)}
                    />
                    <div className="absolute -bottom-1 -left-1 bg-gray-600 text-white text-xs px-1 rounded">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={transformation.transformedImage} 
                      alt="Transformed" 
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                      onClick={() => setSelectedImage(transformation.transformedImage)}
                    />
                    <div className="absolute -bottom-1 -left-1 bg-blue-600 text-white text-xs px-1 rounded">
                      After
                    </div>
                  </div>
                </div>

                {/* Transformation Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">
                      Professional Headshot
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(transformation.createdAt)}
                    </div>
                    {transformation.processingTime && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {transformation.processingTime}s processing
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedImage(transformation.transformedImage)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadImage(
                      transformation.transformedImage, 
                      `headshot-${transformation.id}.png`
                    )}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTransformation(transformation.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="max-w-full max-h-full rounded-lg"
              />
              <Button
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-75"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

