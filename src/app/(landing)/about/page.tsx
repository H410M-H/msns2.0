"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { BookOpen, Users, Trophy, Lightbulb, ChevronDown } from "lucide-react"
import { CldImage } from "next-cloudinary"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export default function About() {
  const [expandedValue, setExpandedValue] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [15, 0]), {
    stiffness: 300,
    damping: 40
  })

  const stats = [
    { icon: BookOpen, label: "AP Courses", value: "15+", color: "text-purple-400" },
    { icon: Users, label: "Student-Teacher Ratio", value: "18:1", color: "text-teal-400" },
    { icon: Trophy, label: "State Championships", value: "25", color: "text-amber-400" },
    { icon: Lightbulb, label: "Clubs & Activities", value: "50+", color: "text-pink-400" },
  ]

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in all aspects of education and personal development.",
      details: "Our commitment to excellence is reflected in our rigorous academic programs, state-of-the-art facilities, and highly qualified faculty.",
      gradient: "from-purple-600 to-blue-500"
    },
    // ... keep other values with unique gradients
  ]

  return (
    <section className="flex flex-col min-h-screen pt-4 bg-gradient-to-br from-green-900 via-yellow-700/50 to-purple-900/30">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ scale, rotateX }} 
            className="absolute inset-0 shadow-2xl"
          >
            <CldImage
              src="FrontView1_alaabu"
              alt="School building"
              fill
              style={{ objectFit: 'cover' }}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/90" />
          </motion.div>

          <motion.div
            className="relative z-10 text-center px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-white via-emerald-300 to-white bg-clip-text text-transparent">
              M.S.NAZ HIGH SCHOOL
            </h1>
            <motion.p
              className="text-xl md:text-3xl font-serif text-white mb-12 font-normal"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Nurturing Minds, Shaping Futures
            </motion.p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-lg rounded-full px-8 py-6 shadow-lg"
              >
                Explore Our World
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-10 h-10 text-white animate-pulse" />
          </motion.div>
        </section>

        {/* Mission Statement */}
        <motion.section 
          className="py-24 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/10">
              <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <motion.p
                className="text-xl text-center max-w-4xl mx-auto text-slate-200 leading-relaxed"
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                At M.S.NAZ High School, we are committed to providing a nurturing and challenging educational environment that empowers students to become lifelong learners, critical thinkers, and responsible global citizens.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Key Statistics */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              MSNS by the Numbers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.15
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-slate-800/50 backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all">
                    <CardContent className="flex flex-col items-center justify-center h-full p-8">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring" }}
                      >
                        <stat.icon className={`w-16 h-16 mb-6 ${stat.color}`} />
                      </motion.div>
                      <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {stat.value}
                      </h3>
                      <p className="text-slate-300 text-center text-lg">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* School Values */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.1
                  }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-gradient-to-br from-slate-800 to-slate-900/50 border border-white/10 hover:border-blue-400/30 transition-all group">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className={`w-full h-2 mb-6 rounded-full bg-gradient-to-r ${value.gradient}`} />
                      <h3 className="text-2xl font-bold mb-4 text-slate-100">{value.title}</h3>
                      <p className="text-slate-300 mb-6 flex-grow">{value.description}</p>
                      
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: expandedValue === index ? "auto" : 0,
                          opacity: expandedValue === index ? 1 : 0
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-400 text-sm pb-4">{value.details}</p>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="self-end"
                      >
                        <Button
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-400/10 rounded-full"
                          onClick={() => setExpandedValue(expandedValue === index ? null : index)}
                        >
                          {expandedValue === index ? "Show Less" : "Learn More"}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </section>
  )
}