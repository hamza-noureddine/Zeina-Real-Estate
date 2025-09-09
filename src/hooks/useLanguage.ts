import { useState, useEffect } from 'react';

// Custom event for language changes
const LANGUAGE_CHANGE_EVENT = 'languageChange';

export const triggerLanguageChange = () => {
  window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT));
};

export type Language = 'en' | 'ar';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [version, setVersion] = useState(0); // Version number to force re-renders
  const [forceUpdate, setForceUpdate] = useState(0); // Force update counter
  const [refreshKey, setRefreshKey] = useState(Date.now()); // Timestamp-based key

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
    console.log('Current version:', version);
    
    setLanguage(newLanguage);
    setIsRTL(newLanguage === 'ar');
    setVersion(prev => {
      const newVersion = prev + 1;
      console.log('Version updated from', prev, 'to', newVersion);
      return newVersion;
    });
    setForceUpdate(prev => prev + 1);
    setRefreshKey(Date.now()); // Update timestamp
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
    
    // Additional debugging
    console.log('Language toggle completed. New language:', newLanguage);
    
    // Trigger custom event for components to listen to
    triggerLanguageChange();
  };

  return {
    language,
    isRTL,
    version, // Export version for components to use as key
    forceUpdate, // Export force update counter
    refreshKey, // Export timestamp-based key
    toggleLanguage,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      setIsRTL(lang === 'ar');
      setVersion(prev => prev + 1); // Increment version to force re-renders
      setForceUpdate(prev => prev + 1);
      setRefreshKey(Date.now());
      localStorage.setItem('language', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };
};
