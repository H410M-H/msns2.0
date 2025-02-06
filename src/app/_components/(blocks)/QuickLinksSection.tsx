

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";

interface QuickLinksSectionProps {
  linkCards: Array<{ title: string; href: string }>;
}

export function QuickLinksSection({ linkCards }: QuickLinksSectionProps) {
  const socialLinks = {
    whatsapp: "https://wa.me/YOUR_PHONE_NUMBER",
    instagram: "https://www.instagram.com/msnazhighschool/",
    facebook: "https://www.facebook.com/your_facebook_page",
    email: "mailto:your_email@example.com",
  };

  const socialIcons = [
    {
      name: "whatsapp",
      href: "https://res.cloudinary.com/dvvbxrs55/image/upload/v1737823588/whatsapp-one_cmzkaf.png",
      link: socialLinks.whatsapp,
    },
    {
      name: "instagram",
      href: "https://res.cloudinary.com/dvvbxrs55/image/upload/v1737823587/insta_rgb_xtkjny.png",
      link: socialLinks.instagram,
    },
    {
      name: "facebook",
      href: "https://res.cloudinary.com/dvvbxrs55/image/upload/v1737823587/facebook3d_flb7sm.png",
      link: socialLinks.facebook,
    },
    {
      name: "email",
      href: "https://res.cloudinary.com/dvvbxrs55/image/upload/v1737823739/mail-3d_ese59y.png",
      link: socialLinks.email,
    },
  ];

  const renderSocialIcons = () => (
    <div className="flex justify-stretch mt-4">
      {socialIcons.map((icon) => (
        <Link
          key={icon.name}
          href={icon.link}
          target="_blank"
          className="hover:scale-110 transition-transform duration-200"
        >
          <Image
            src={icon.href}
            alt={`${icon.name} icon`}
            width={38}
            height={38}
            className="hover:shadow-lg mr-6"
          />
        </Link>
      ))}
    </div>
  );

    return (
      <section className="py-2 px-4 md:px-12 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">        <motion.h2
          className="text-4xl font-extrabold mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Quick Links
        </motion.h2>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {linkCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {card.title === "Enroll Now →" ? (
                <Link href={card.href} legacyBehavior passHref>
                  <Card className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500/50 hover:text-white transition-transform duration-300 hover:scale-105 shadow-lg cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg text-center">{card.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row bg-transparent border border-gray-500 text-gray-300 hover:bg-green-300/50 hover:text-gray-900 transition-transform duration-300 hover:scale-105 shadow-lg rounded-lg p-6">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <h3 className="text-lg text-center font-semibold">{card.title}</h3>
                  </div>
                  {renderSocialIcons()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}