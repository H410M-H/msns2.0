"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[url('https://res.cloudinary.com/dvvbxrs55/image/upload/v1729267627/FrontView1_alaabu.jpg')] bg-cover bg-center px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-600 shadow-xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-80 transition duration-700 ease-in-out hover:rotate-0 hover:skew-y-0 hover:scale-105"></div>
        <div className="relative bg-white/80 backdrop-blur-lg shadow-lg rounded-3xl p-6 sm:p-10 animate-fade-in-up">
          <div className="flex flex-col items-center">
            <CldImage
              src="Official_LOGO_grn_ic9ldd"
              alt="logo"
              width={200}
              height={200}
              className="animate-pulse"
            />
            <h1 className="text-4xl font-serif font-semibold text-amber-600 mt-6 transition duration-300 transform hover:scale-105">
              MSNS-LMS
            </h1>
            <h5 className="text-2xl font-serif font-medium text-emerald-600 mt-3 transition duration-300 transform hover:scale-105">
              Enroll Now / Sign Up
            </h5>
          </div>
          <form className="space-y-6 mt-8">
            <div className="relative">
              <input
                autoComplete="off"
                id="fullName"
                name="fullName"
                type="text"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
                placeholder="Full Name"
              />
              <label
                htmlFor="fullName"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Full Name
              </label>
            </div>
            <div className="relative">
              <input
                autoComplete="off"
                id="email"
                name="email"
                type="email"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
                placeholder="Email address"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Email Address
              </label>
            </div>
            <div className="relative">
              <input
                autoComplete="off"
                id="password"
                name="password"
                type="password"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                autoComplete="off"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-600 bg-transparent transition duration-200 ease-in-out"
                placeholder="Confirm Password"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Confirm Password
              </label>
            </div>
            <div className="flex justify-center mt-6">
              <Button className="bg-yellow-500 w-full py-3 rounded-lg text-white text-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105">
                Sign Up
              </Button>
            </div>
          </form>
          <div className="flex justify-between items-center mt-8 gap-4">
            <Link href="/login">
              <Button className="bg-green-500 w-full py-2 rounded-lg text-white font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105">
                Back to Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-blue-500 w-full py-2 rounded-lg text-white font-semibold hover:bg-blue-600 transition duration-300 transform hover:scale-105">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
