// src/app/_components/(blocks)/GooglePhotos.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface GooglePhoto {
  photo_url: string
}

interface ApiResponse {
  photos: GooglePhoto[]
}

// Type guard function for API response validation
function isApiResponse(data: unknown): data is ApiResponse {
  return !!data && 
         typeof data === 'object' && 
         'photos' in data && 
         Array.isArray((data as ApiResponse).photos)
}

export function GooglePhotos() {
  const [photos, setPhotos] = useState<GooglePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/google-photos')
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        const data: unknown = await response.json()
        
        if (!isApiResponse(data)) {
          throw new Error('Invalid API response structure')
        }

        setPhotos(data.photos)
        setError(null)
      } catch (err) {
        console.error('Photo fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load photos')
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    void fetchPhotos()
  }, [])

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (photos.length === 0) return
    
    setCurrentPhotoIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % photos.length
      }
      return (prev - 1 + photos.length) % photos.length
    })
  }

  const currentPhoto = photos[currentPhotoIndex]

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Gallery</h2>

        <div className="flex items-center justify-center gap-4 md:gap-8 mb-16">
          <button
            onClick={() => handleNavigation('prev')}
            disabled={loading || photos.length === 0}
            className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-8 h-8 text-gray-600" />
          </button>

          <div className="flex-1 max-w-4xl min-h-[500px] relative">
            {loading ? (
              <div className="aspect-video bg-gray-200 rounded-xl animate-pulse" />
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : photos.length > 0 && currentPhoto ? (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentPhoto.photo_url}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="relative aspect-video"
                >
                  <Image
                    src={currentPhoto.photo_url}
                    alt="School gallery"
                    fill
                    className="object-cover rounded-xl shadow-md"
                    sizes="(max-width: 768px) 100vw, 75vw"
                    priority={currentPhotoIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="text-gray-600 text-center">No photos available</p>
            )}
          </div>

          <button
            onClick={() => handleNavigation('next')}
            disabled={loading || photos.length === 0}
            className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}