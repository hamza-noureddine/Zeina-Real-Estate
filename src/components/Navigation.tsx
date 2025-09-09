import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Menu, X, Home, Building2, User, Phone, Languages } from 'lucide-react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, isRTL, toggleLanguage } = useLanguageContext();
  const t = translations[language];

  const navItems = [
    { path: '/', label: t.home, icon: Home },
    { path: '/properties', label: t.properties, icon: Building2 },
    { path: '/about', label: t.about, icon: User },
    { path: '/contact', label: t.contact, icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50">
      <div className="flex justify-between items-center h-16">
        {/* Logo - Far Left Edge */}
        <Link to="/" className="flex items-center pl-2">
          <Logo size="sm" showText={false} />
        </Link>
        
        <div className="flex-1 flex justify-between items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Language Toggle & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'en' ? 'عربي' : 'EN'}</span>
            </Button>
            
            <Button variant="elegant" asChild>
              <Link to="/contact">{t.getInTouch}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t border-border px-4">
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium py-2 transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-accent'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex space-x-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2 flex-1"
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? 'عربي' : 'EN'}</span>
              </Button>
              
              <Button variant="elegant" className="flex-1" asChild>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  {t.getInTouch}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;