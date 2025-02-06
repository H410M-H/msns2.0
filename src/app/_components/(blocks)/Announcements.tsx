import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Megaphone, BookOpen } from 'lucide-react';

// Reuse SectionTitle component from shared components
interface SectionTitleProps {
  title: string;
  subtitle: string;
}

function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
}

// Define announcement interface
interface Announcement {
  title: string;
  date: string;
  content: string;
  icon: React.ReactNode;
  href: string;
}

// Sample announcements data
const announcements: Announcement[] = [
  {
    title: "New Academic Calendar",
    date: "2024-03-15",
    content: "Updated academic schedule for 2024-25 session now available",
    icon: <Calendar className="w-6 h-6" />,
    href: "/news/academic-calendar"
  },
  {
    title: "Sports Day Announcement",
    date: "2024-03-18",
    content: "Annual sports day scheduled for April 10th, 2024",
    icon: <Megaphone className="w-6 h-6" />,
    href: "/events/sports-day"
  },
  {
    title: "Library Expansion",
    date: "2024-03-20",
    content: "New section added with 500+ books and digital resources",
    icon: <BookOpen className="w-6 h-6" />,
    href: "/facilities/library"
  }
];

export function AnnouncementsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionTitle title="Latest News" subtitle="Stay Updated" />
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {announcements.map((item: Announcement, index: number) => (
            <motion.article 
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ y: -8 }}
            >
              <Link href={item.href} className="block p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {item.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-600 line-clamp-3">{item.content}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}