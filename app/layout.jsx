'use client';

import './globals.css';
import { useState } from 'react';
import ThemeToggle from '@/app/components/ThemeToggle';

export default function RootLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Data Visualization Dashboard</title>
        <meta name="description" content="A full-stack data visualization dashboard built with Next.js, MongoDB, Tailwind CSS, and D3.js" />
      </head>
      <body className="bg-background dark:bg-gray-900 text-text dark:text-gray-100 min-h-screen">
        <header className="bg-card dark:bg-gray-800 shadow-md py-4 sticky top-0 z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary dark:text-blue-300">Data Visualization Dashboard</h1>
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li><a href="/" className="text-primary dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="/dashboard" className="text-primary dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Dashboard</a></li>
              </ul>
            </nav>
            {/* Theme Toggle Button */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-primary dark:text-blue-300" 
              aria-label="Menu"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-card dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <nav className="container mx-auto px-4 py-2">
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/" 
                      className="block py-2 text-primary dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/dashboard" 
                      className="block py-2 text-primary dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </header>
        
        <main className="container mx-auto px-4 py-6 md:py-8">
          {children}
        </main>
        
        <footer className="bg-card dark:bg-gray-800 shadow-inner py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-300">
            <p>© {new Date().getFullYear()} Data Visualization Dashboard</p>
          </div>
        </footer>
      </body>
    </html>
  );
}