import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Add SectionTitle component
interface SectionTitleProps {
  title: string;
  subtitle: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
}

// Define program interface
interface Program {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

// Define programs data
const programs: Program[] = [
  {
    title: "Science Stream",
    description: "Advanced curriculum focusing on Physics, Chemistry, and Biology",
    href: "/programs/science",
    icon: <ArrowRight className="w-8 h-8 text-emerald-600" />
  },
  {
    title: "Commerce Stream",
    description: "Comprehensive business and accounting studies",
    href: "/programs/commerce",
    icon: <ArrowRight className="w-8 h-8 text-emerald-600" />
  },
  {
    title: "Arts Stream",
    description: "Creative studies in humanities and social sciences",
    href: "/programs/arts",
    icon: <ArrowRight className="w-8 h-8 text-emerald-600" />
  }
];

export function AcademicPrograms() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle title="Our Programs" subtitle="Academic Excellence" />
        
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {programs.map((program: Program, index: number) => (
            <motion.div 
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-slate-50"
              whileHover={{ scale: 1.03 }}
            >
              <div className="p-8">
                <div className="mb-4 text-emerald-600">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-slate-600 mb-4">{program.description}</p>
                <Link
                  href={program.href}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}