'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from './ui/Button';
import { ShoppingCart, User } from 'lucide-react';
import { useUI } from '@/app/context/UIProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { openLoginModal, openSignUpModal } = useUI();

  const fetchCartCount = () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setCartCount(data.data?.length || 0));
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCartCount();
      window.addEventListener('cartUpdated', fetchCartCount);
      return () => {
        window.removeEventListener('cartUpdated', fetchCartCount);
      };
    } else {
      setCartCount(0);
    }
  }, [status]);

  return (
    <header className="bg-t top-2 shadow-sm sticky top-0 z-40 backdrop-blur-xs">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">
              <img src="/logo-black.png" className="h-8" alt="Logo" />
            </Link>
          </div>

          {/* Hamburger Button (Mobile) */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-black focus:outline-none"
            >
              {/* Animated Hamburger */}
              <motion.div
                animate={isOpen ? "open" : "closed"}
                className="relative w-6 h-6"
              >
                {/* Top line */}
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 7, x: -3 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-1 block h-0.5 w-full bg-gray-700 rounded"
                />

                {/* Middle line */}
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-[11.5] block h-0.5 w-full bg-gray-700 rounded"
                />

                {/* Bottom line */}
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -7, x: -3 },
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 bottom-1 block h-0.5 w-full bg-gray-700 rounded"
                />
              </motion.div>
            </button>

            {/* Mobile Dropdown Box (Right-Aligned) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="absolute right-0 mt-2 w-60 rounded-2xl shadow-lg bg-white border border-gray-200 p-4 space-y-3 z-50"
                >
                  {status === 'loading' && (
                    <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse" />
                  )}
                  {status === 'unauthenticated' && (
                    <>
                      <button
                        onClick={openLoginModal}
                        className="block w-full text-left text-sm font-medium text-gray-700 hover:text-black"
                      >
                        Log In
                      </button>
                      <Button
                        onClick={openSignUpModal}
                        className="!w-full !px-4 !py-2 !h-auto !bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                  {status === 'authenticated' && session?.user && (
                    <>
                      <Link href="/products/new">
                        <Button className="!w-full !px-4 !py-2 !h-auto !bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70">
                          Create Listing
                        </Button>
                      </Link>

                      <Link
                        href="/cart"
                        className="relative flex items-center text-gray-600 hover:text-black p-2 rounded-md"
                      >
                        <ShoppingCart size={20} className="mr-2" />
                        Cart
                        {cartCount > 0 && (
                          <span className="ml-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        className="flex items-center p-2 text-gray-600 hover:text-black rounded-md"
                      >
                        <User size={20} className="mr-2" />
                        Profile
                      </Link>

                      <Button
                        onClick={() => signOut()}
                        className="!w-full !px-4 !py-2 !h-auto !bg-red-600/60 hover:!bg-red-700/20"
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' && (
              <div className="w-24 h-8 bg-gray-200 rounded-md animate-pulse" />
            )}
            {status === 'unauthenticated' && (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  Log In
                </button>
                <Button
                  onClick={openSignUpModal}
                  className="!w-auto !px-4 !py-2 !h-auto !bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70"
                >
                  Sign Up
                </Button>
              </>
            )}
            {status === 'authenticated' && session?.user && (
              <>
                <Link href="/products/new">
                  <Button className="!w-auto !px-4 !py-2 !h-auto !bg-[#A16E4B]/70 hover:!bg-[#F2EDDE] hover:!text-[#A16E4B]/70">
                    Create Listing
                  </Button>
                </Link>

                <Link href="/cart" className="relative text-gray-600 hover:text-black p-2">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link href="/dashboard/profile" className="p-2 text-gray-600 hover:text-black">
                  <User size={24} />
                </Link>

                <Button
                  onClick={() => signOut()}
                  className="!w-auto !px-4 !py-2 !h-auto !bg-red-600/60 hover:!bg-red-700/20"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
