'use client'

import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import { Button } from "~/components/ui/button"
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { User } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled
        ? 'bg-transparent backdrop-blur-md py-2'
        : 'bg-green-100/40 py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        <Link href="/landing" className="flex items-center">
          <CldImage
            src="Official_LOGO_grn_ic9ldd"
            alt="Logo"
            width={50}
            height={50}
            className="transition-all duration-300 ease-in-out hover:scale-110"
          />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-4 text-black font-bold">
            <li>
              <Link href="/dashboard">
                <Button variant="ghost">Home</Button>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
            </li>
            <li>
              <Link href="">
                <Button variant="ghost">Contact</Button>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out"
                >
                  <User className="h-5 w-5 text-red-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-transform duration-300 ease-in-out"
              >
                <DropdownMenuItem className="hover:bg-purple-100 focus:bg-purple-200">
                  <Link href="">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-100 focus:bg-purple-200">
                  <Link href="">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-100 focus:bg-purple-200">
                  <Link href="">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/signup">
              <Button variant="default">Join Now</Button>
            </Link>
          )}

          <button
            className="block md:hidden text-black hover:text-green-600 transition-colors duration-300 ease-in-out"
            aria-label="Toggle Navigation"
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}