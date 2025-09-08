import React from 'react';
import { Building2, Camera, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/data/translations';

interface DefaultPropertyImageProps {
  propertyType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DefaultPropertyImage: React.FC<DefaultPropertyImageProps> = ({ 
  propertyType = 'property', 
  className = '',
  size = 'md'
}) => {
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-80'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getPropertyTypeText = () => {
    if (language === 'ar') {
      switch (propertyType) {
        case 'apartment': return 'شقة';
        case 'house': return 'منزل';
        case 'villa': return 'فيلا';
        case 'commercial': return 'عقار تجاري';
        case 'land': return 'أرض';
        default: return 'عقار';
      }
    } else {
      switch (propertyType) {
        case 'apartment': return 'Apartment';
        case 'house': return 'House';
        case 'villa': return 'Villa';
        case 'commercial': return 'Commercial';
        case 'land': return 'Land';
        default: return 'Property';
      }
    }
  };

  const getDefaultText = () => {
    if (language === 'ar') {
      return {
        title: 'لا توجد صور متاحة',
        subtitle: `اتصل للحصول على صور ${getPropertyTypeText()}`,
        contact: 'اتصل بنا للصور'
      };
    } else {
      return {
        title: 'No Images Available',
        subtitle: `Contact for ${getPropertyTypeText()} Photos`,
        contact: 'Contact for Photos'
      };
    }
  };

  const text = getDefaultText();

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-muted to-muted/50 rounded-lg flex flex-col items-center justify-center p-6 text-center ${className}`}>
      {/* Icon */}
      <div className="mb-4">
        <div className="relative">
          <Building2 className={`${iconSizes[size]} text-muted-foreground/60`} />
          <Camera className={`${iconSizes[size === 'sm' ? 'sm' : 'md']} absolute -bottom-1 -right-1 text-muted-foreground/40`} />
        </div>
      </div>

      {/* Text Content */}
      <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h3 className={`font-semibold text-muted-foreground ${textSizes[size]}`}>
          {text.title}
        </h3>
        <p className={`text-muted-foreground/80 ${textSizes[size === 'sm' ? 'sm' : 'md']}`}>
          {text.subtitle}
        </p>
        <div className="flex items-center justify-center gap-2 text-primary">
          <ImageIcon className="w-4 h-4" />
          <span className={`font-medium ${textSizes[size === 'sm' ? 'sm' : 'md']}`}>
            {text.contact}
          </span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute top-4 left-4 w-2 h-2 bg-primary/20 rounded-full"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-primary/30 rounded-full"></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-primary/25 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default DefaultPropertyImage;
