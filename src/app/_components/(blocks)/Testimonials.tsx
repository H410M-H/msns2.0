'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GoogleReview {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
}

interface ApiResponse {
  reviews: GoogleReview[]
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [supportsLazyLoading, setSupportsLazyLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  useEffect(() => {
    setSupportsLazyLoading('loading' in HTMLIFrameElement.prototype)
  }, [])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews')
        const data = await response.json() as ApiResponse
        setReviews(data.reviews || [])
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    void fetchReviews()
  }, [])

  const goNext = () => {
    if (reviews.length === 0) return
    setCurrentReviewIndex(prev => (prev + 1) % reviews.length)
  }

  const goPrev = () => {
    if (reviews.length === 0) return
    setCurrentReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)
  }

  const currentReview = reviews[currentReviewIndex]

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-xl overflow-hidden shadow-xl">
          <iframe
            title="School Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3371.371635373706!2d74.13877557608704!3d32.32873130675971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f27141ae512e1%3A0x4a728b0cac341ccf!2sM.S.%20NAZ%20HIGH%20SCHOOL%C2%AE%20%7C%20M.S.N.S%E2%84%A2!5e0!3m2!1sen!2s!4v1738881226323!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            {...(supportsLazyLoading ? { loading: "lazy" } : {})}
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          />
        </div>

        <h2 className="text-3xl font-bold text-center mb-12 mt-16">What People Say</h2>

        <div className="flex items-center justify-center gap-4 md:gap-8 mb-16">
          <button
            onClick={goPrev}
            disabled={loading || reviews.length === 0}
            className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-8 h-8 text-gray-600" />
          </button>

          <div className="flex-1 max-w-2xl min-h-[300px]">
            {loading ? (
              <SkeletonCard />
            ) : reviews.length > 0 && currentReview ? (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentReviewIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentReview.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    &quot;{currentReview.text}&quot;
                  </p>
                  <p className="font-semibold">{currentReview.author_name}</p>
                  <p className="text-sm text-gray-500">
                    {currentReview.relative_time_description}
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="text-gray-600 text-center">No reviews available</p>
            )}
          </div>

          <button
            onClick={goNext}
            disabled={loading || reviews.length === 0}
            className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next review"
          >
            <ChevronRight className="w-8 h-8 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="h-24 bg-gray-200 rounded mb-4" />
    <div className="h-4 bg-gray-200 rounded w-1/4" />
  </div>
)