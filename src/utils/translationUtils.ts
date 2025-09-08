// Smart translation utilities for property content

import { useLanguage } from '@/hooks/useLanguage';

// Property type translations
export const propertyTypeTranslations = {
  en: {
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    commercial: 'Commercial',
    land: 'Land'
  },
  ar: {
    apartment: 'شقة',
    house: 'منزل',
    villa: 'فيلا',
    commercial: 'تجاري',
    land: 'أرض'
  }
};

// Property status translations
export const propertyStatusTranslations = {
  en: {
    for_sale: 'For Sale',
    for_rent: 'For Rent',
    sold: 'Sold',
    rented: 'Rented'
  },
  ar: {
    for_sale: 'للبيع',
    for_rent: 'للإيجار',
    sold: 'مباع',
    rented: 'مؤجر'
  }
};

// Lebanese governorate translations
export const governorateTranslations = {
  en: {
    'Beirut': 'Beirut',
    'Mount Lebanon': 'Mount Lebanon',
    'North Lebanon': 'North Lebanon',
    'South Lebanon': 'South Lebanon',
    'Bekaa': 'Bekaa',
    'Nabatieh': 'Nabatieh',
    'Akkar': 'Akkar'
  },
  ar: {
    'Beirut': 'بيروت',
    'Mount Lebanon': 'جبل لبنان',
    'North Lebanon': 'شمال لبنان',
    'South Lebanon': 'جنوب لبنان',
    'Bekaa': 'البقاع',
    'Nabatieh': 'النبطية',
    'Akkar': 'عكار'
  }
};

// Smart content translation function
export const translatePropertyContent = (property: any, targetLanguage: 'en' | 'ar') => {
  if (!property) return property;

  const translatedProperty = { ...property };

  // Translate property type
  if (property.property_type) {
    translatedProperty.property_type_display = propertyTypeTranslations[targetLanguage][property.property_type] || property.property_type;
  }

  // Translate status
  if (property.status) {
    translatedProperty.status_display = propertyStatusTranslations[targetLanguage][property.status] || property.status;
  }

  // Translate governorate
  if (property.governorate) {
    translatedProperty.governorate_display = governorateTranslations[targetLanguage][property.governorate] || property.governorate;
  }

  // Handle bilingual content
  if (property.title_en && property.title_ar) {
    translatedProperty.title = targetLanguage === 'ar' ? property.title_ar : property.title_en;
  }

  if (property.description_en && property.description_ar) {
    translatedProperty.description = targetLanguage === 'ar' ? property.description_ar : property.description_en;
  }

  if (property.location_en && property.location_ar) {
    translatedProperty.location = targetLanguage === 'ar' ? property.location_ar : property.location_en;
  }

  // Handle features translation
  if (property.features_en && property.features_ar) {
    translatedProperty.features = targetLanguage === 'ar' ? property.features_ar : property.features_en;
  }

  return translatedProperty;
};

// Auto-detect content language
export const detectContentLanguage = (text: string): 'ar' | 'en' | 'mixed' => {
  if (!text) return 'en';
  
  // Check for Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[a-zA-Z]/;
  
  const hasArabic = arabicRegex.test(text);
  const hasEnglish = englishRegex.test(text);
  
  if (hasArabic && hasEnglish) return 'mixed';
  if (hasArabic) return 'ar';
  if (hasEnglish) return 'en';
  
  return 'en'; // Default to English
};

// Smart display function for property content
export const getDisplayContent = (property: any, userLanguage: 'en' | 'ar') => {
  if (!property) return property;

  const contentLanguage = detectContentLanguage(property.title || '');
  
  // If content is in the same language as user preference, show as is
  if (contentLanguage === userLanguage) {
    return translatePropertyContent(property, userLanguage);
  }
  
  // If content is mixed or different language, show with language indicator
  const translatedProperty = translatePropertyContent(property, userLanguage);
  
  // Add language indicator for mixed content
  if (contentLanguage === 'mixed') {
    translatedProperty.languageIndicator = '🌐';
  } else if (contentLanguage !== userLanguage) {
    translatedProperty.languageIndicator = contentLanguage === 'ar' ? '🇱🇧' : '🇺🇸';
  }
  
  return translatedProperty;
};

// Format property for display with smart translation
export const formatPropertyForDisplay = (property: any, userLanguage: 'en' | 'ar') => {
  const displayProperty = getDisplayContent(property, userLanguage);
  
  // Format price
  if (displayProperty.contact_for_price) {
    displayProperty.price_display = userLanguage === 'ar' ? 'اتصل للسعر' : 'Contact for Price';
  } else if (displayProperty.price) {
    displayProperty.price_display = `${displayProperty.currency} ${displayProperty.price.toLocaleString()}`;
  }
  
  // Format area
  if (displayProperty.area) {
    displayProperty.area_display = `${displayProperty.area} m²`;
  }
  
  return displayProperty;
};

// Professional content guidelines
export const getContentGuidelines = (language: 'en' | 'ar') => {
  return {
    en: {
      title: 'Professional Content Guidelines',
      tips: [
        'Use clear, descriptive titles',
        'Write detailed property descriptions',
        'Include all relevant features',
        'Use proper Lebanese location names',
        'Keep content professional and accurate'
      ],
      examples: {
        goodTitle: 'Modern 3-Bedroom Apartment in Hamra, Beirut',
        goodDescription: 'Beautiful modern apartment with stunning city views, premium finishes, and access to building amenities.',
        goodLocation: 'Hamra, Beirut, Lebanon'
      }
    },
    ar: {
      title: 'إرشادات المحتوى المهني',
      tips: [
        'استخدم عناوين واضحة ووصفية',
        'اكتب أوصاف مفصلة للعقار',
        'اذكر جميع المميزات ذات الصلة',
        'استخدم أسماء المواقع اللبنانية الصحيحة',
        'حافظ على المحتوى مهنياً ودقيقاً'
      ],
      examples: {
        goodTitle: 'شقة حديثة 3 غرف نوم في الحمرا، بيروت',
        goodDescription: 'شقة حديثة جميلة مع إطلالة رائعة على المدينة، تشطيبات عالية الجودة، وإمكانية الوصول إلى مرافق المبنى.',
        goodLocation: 'الحمرا، بيروت، لبنان'
      }
    }
  }[language];
};

// Content quality checker
export const checkContentQuality = (property: any, language: 'en' | 'ar') => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check title
  if (!property.title || property.title.length < 10) {
    issues.push(language === 'ar' ? 'العنوان قصير جداً' : 'Title is too short');
    suggestions.push(language === 'ar' ? 'أضف وصفاً أكثر تفصيلاً' : 'Add more descriptive details');
  }
  
  // Check description
  if (!property.description || property.description.length < 50) {
    issues.push(language === 'ar' ? 'الوصف قصير جداً' : 'Description is too short');
    suggestions.push(language === 'ar' ? 'اكتب وصفاً مفصلاً للعقار' : 'Write a detailed property description');
  }
  
  // Check location
  if (!property.location || property.location.length < 5) {
    issues.push(language === 'ar' ? 'الموقع غير محدد بوضوح' : 'Location is not clearly specified');
    suggestions.push(language === 'ar' ? 'اذكر الموقع بالتفصيل' : 'Specify the location in detail');
  }
  
  // Check features
  if (!property.features || property.features.length === 0) {
    issues.push(language === 'ar' ? 'لا توجد مميزات مذكورة' : 'No features mentioned');
    suggestions.push(language === 'ar' ? 'أضف مميزات العقار' : 'Add property features');
  }
  
  return {
    hasIssues: issues.length > 0,
    issues,
    suggestions,
    score: Math.max(0, 100 - (issues.length * 20))
  };
};
