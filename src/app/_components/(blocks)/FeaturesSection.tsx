import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardTitle } from "~/components/ui/card"
import { GraduationCap, Book, Users, Calendar } from 'lucide-react'

export function FeaturesSection() {
  const featureCards = [
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: "Academic Excellence",
      description: "Our rigorous curriculum prepares students for success in higher education and beyond."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Dedicated Faculty",
      description: "Experienced teachers committed to nurturing each student's potential."
    },
    {
      icon: <Book className="h-12 w-12 text-primary" />,
      title: "Diverse Programs",
      description: "A wide range of academic and extracurricular activities to foster well-rounded development."
    },
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: "Modern Facilities",
      description: "State-of-the-art classrooms, labs, and sports facilities to enhance learning experiences."
    }
  ];

  return (
    <section className="bg-gradient-to-r from-yellow-200 to-emerald-300 py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Why Choose M.S.N.S?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence>
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <FeatureCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">{icon}</div>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}