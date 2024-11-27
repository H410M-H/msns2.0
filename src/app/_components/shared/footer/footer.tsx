"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 shadow-inner">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <CldImage
              src="Official_LOGO_grn_ic9ldd"
              alt="Company Logo"
              width={100}
              height={100}
            />
            <p className="mt-4 text-green-800 font-serif font-medium">
              Transforming ideas into digital solutions with innovative
              technologies and creative strategies.
            </p>
          </div>
          <div>
            <h5 className="text-green-800 font-bold mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-green-800 font-bold mb-3">Services</h5>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-green-600 hover:text-pink-600 transition-colors duration-300"
                >
                  Consulting
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 bg-white/50 py-4 text-center">
        <p className="text-pink-800 text-sm font-bold">
          &copy; {new Date().getFullYear()} MSNS-DEV | M.S. NAZ HIGH SCHOOL® |
          HH_STUDIOS™ | All rights reserved.
        </p>
      </div>
    </footer>
  );
};
