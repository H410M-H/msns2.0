import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Link, ArrowRight } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface HeroSectionProps {
    currentVideoIndex: number;
    videos: string[];
    heroOpacity: MotionValue<number>;
    heroScale: MotionValue<number>;
  }

export function HeroSection({ currentVideoIndex, videos, heroOpacity, heroScale }: HeroSectionProps) {
  return (
    <motion.section
      className="relative h-screen overflow-hidden"
      style={{ opacity: heroOpacity, scale: heroScale }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      <video
        className="absolute inset-0 w-full h-full object-cover"
        key={currentVideoIndex}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-6xl px-4">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            M.S. Naz High School
          </motion.h1>
          
          <motion.div
            className="flex flex-col gap-4 md:flex-row justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button asChild variant="secondary" size="lg" className="rounded-full">
              <Link href="/admissions">
                Admissions 2024
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      <ScrollIndicator />
    </motion.section>
  )
}

function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1])

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <motion.svg
        width="40" 
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
      >
        <motion.path
          d="M5 15.5L12 22.5L19 15.5"
          style={{ pathLength }}
        />
      </motion.svg>
    </div>
  )
}