"use client"

import { useScroll, useTransform } from 'framer-motion'
import { CTASection } from './_components/(blocks)/CTASection'
import { FeaturesSection } from './_components/(blocks)/FeaturesSection'
import { HeroSection } from './_components/(blocks)/HeroSection'
import { QuickLinksSection } from './_components/(blocks)/QuickLinksSection'
import { useEffect, useState } from 'react'
import { AcademicPrograms } from './_components/(blocks)/AcademicPrograms'
import { TestimonialsSection } from './_components/(blocks)/Testimonials'
import { GooglePhotos } from './_components/(blocks)/GooglePhotos'

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])
  const linkCards = [
    {
      title: "Enroll Now →",
      href: "/dashboard",
    },
    {
      title: "Our Socials →",
      href: "https://www.instagram.com/msnazhighschool/",
    },
  ];
  const videos = [
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729269611/clip1_awtegx",
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729269805/clip4_stlpus",
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729269611/clip1_awtegx",
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729267740/clip5_szbx9z",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [videos.length])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 font-sans">
      <HeroSection 
        currentVideoIndex={currentVideoIndex} 
        videos={videos} 
        heroOpacity={heroOpacity} 
        heroScale={heroScale} 
      />
      
      {/* <AnnouncementsSection /> */}

      <QuickLinksSection linkCards={linkCards} />
      {/* <GooglePhotos /> */}
      <AcademicPrograms />

      <FeaturesSection />

      <TestimonialsSection />

      {/* <GallerySection /> */}

      <CTASection />
    </main>
  )
}

