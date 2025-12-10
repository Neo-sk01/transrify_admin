'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavBarProps {
  currentPath?: string;
}

export function NavBar({ currentPath }: NavBarProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/demo', label: 'Demo' },
    { href: '/admin', label: 'Admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(href);
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-b border-gray-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold text-white hover:text-blue-400 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded px-2 py-1"
              aria-label="Transrify home"
            >
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Transrify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
