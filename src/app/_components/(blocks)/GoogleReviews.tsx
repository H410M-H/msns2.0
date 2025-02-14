'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { z } from 'zod'

// Zod validation schemas
const GoogleReviewSchema = z.object({
  author_name: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  relative_time_description: z.string()
})

const ApiResponseSchema = z.object({
  reviews: z.array(GoogleReviewSchema),
  error: z.string().optional()
})

type GoogleReview = z.infer<typeof GoogleReviewSchema>

export function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews')
        const rawData: unknown = await response.json()
        
        const result = ApiResponseSchema.safeParse(rawData)
        
        if (!result.success) {
          setError('Invalid reviews data format')
          console.error('Validation error:', result.error)
          return
        }

        const data = result.data
        
        if (data.error) {
          setError(data.error)
        } else {
          setReviews(data.reviews)
        }
      } catch (err) {
        setError('Failed to load reviews')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchReviews()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          What People Are Saying
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}/5
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 italic">&ldquo;{review.text}&rdquo;</p>
              
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">{review.author_name}</p>
                <span className="text-sm text-gray-500">
                  {review.relative_time_description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}