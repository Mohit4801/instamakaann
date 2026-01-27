import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomIcon from '@/components/CustomIcon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  User,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Partner With Us', path: '/partner' },
  { name: 'FAQ', path: '/faq' },
];

const moreLinks = [
  { name: 'Blog', path: '/blog' },
  { name: 'About Us', path: '/about' },
  { name: 'Refer & Earn', path: '/refer' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [openMore, setOpenMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300',
        isScrolled
          ? 'bg-[#0b1220]/90 backdrop-blur-xl shadow-sm'
          : 'bg-[#0b1220]/75 backdrop-blur-lg',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 w-full">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <CustomIcon src="/images/orglogo.png" className="h-8 w-8" />
            <div className="leading-tight">
              <div className="text-sm font-bold text-teal-400">
                Insta
              </div>
              <div className="text-sm font-bold text-yellow-400 -mt-1">
                Makaan
              </div>
            </div>
          </Link>

          {/* LEFT NAV (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'text-teal-400'
                    : 'text-slate-300 hover:text-teal-400',
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* MORE */}
            <div className="relative">
              <button
                onClick={() => setOpenMore((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-teal-400"
              >
                More
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform',
                    openMore && 'rotate-180',
                  )}
                />
              </button>

              {openMore && (
                <div className="absolute top-full mt-2 w-40 rounded-xl bg-[#0b1220] border border-white/10 shadow-lg overflow-hidden">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.path}
                      to={l.path}
                      onClick={() => setOpenMore(false)}
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                    >
                      {l.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT ACTIONS (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="teal" size="sm" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {!user ? (
              <button
                onClick={() => navigate('/auth/login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-white/20 text-white"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20">
                  <Menu className="w-5 h-5 text-white" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] bg-[#0b1220] p-6">
                <div className="space-y-4">
                  {[...navLinks, ...moreLinks].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10"
                    >
                      {link.name}
                    </Link>
                  ))}

                  {!user ? (
                    <Button
                      className="w-full"
                      onClick={() => navigate('/auth/login')}
                    >
                      Login
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
};
