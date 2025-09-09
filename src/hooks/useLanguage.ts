import { useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Check if Arabic is stored in localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
      setIsRTL(savedLanguage === 'ar');
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    console.log('Toggling language from', language, 'to', newLanguage);
    setLanguage(newLanguage);
    setIsRTL(newLanguage === 'ar');
    localStorage.setItem('language', newLanguage);
    
    // Update document direction
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
    
    // Force a re-render by updating the document title briefly
    const originalTitle = document.title;
    document.title = newLanguage === 'ar' ? 'زينة للعقارات' : 'Zeina Real Estate';
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return {
    language,
    isRTL,
    toggleLanguage,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      setIsRTL(lang === 'ar');
      localStorage.setItem('language', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };
};
