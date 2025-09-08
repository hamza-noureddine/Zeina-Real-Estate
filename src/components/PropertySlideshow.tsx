import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/data/translations';

interface PropertySlideshowProps {
  properties: any[];
  className?: string;
}

const PropertySlideshow: React.FC<PropertySlideshowProps> = ({ properties, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (properties.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [properties.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + properties.length) % properties.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!properties || properties.length === 0) {
    return (
      <div className={`py-20 text-center ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {language === 'ar' ? 'لا توجد عقارات متاحة حالياً' : 'No Properties Available'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'تحقق مرة أخرى قريباً للعقارات الجديدة' 
              : 'Check back soon for new properties'
            }
          </p>
        </div>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];

  return (
    <section className={`py-20 bg-gradient-to-br from-background to-muted/20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {language === 'ar' ? 'عقارات مميزة' : 'Featured Properties'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف أحدث العقارات المضافة إلى مجموعتنا المختارة بعناية'
              : 'Discover the latest properties added to our carefully curated collection'
            }
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Main Slide */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              {/* Image Section */}
              <div className={`relative ${currentIndex % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative h-full min-h-[300px] lg:min-h-[500px]">
                  {currentProperty.images && currentProperty.images.length > 0 ? (
                    <img
                      src={currentProperty.images[0]}
                      alt={currentProperty.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Square className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>{language === 'ar' ? 'لا توجد صورة' : 'No Image Available'}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Property Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge 
                      variant="default" 
                      className="bg-white/90 text-primary font-semibold px-4 py-2"
                    >
                      {currentProperty.is_featured && (
                        <span className="mr-2">⭐</span>
                      )}
                      {currentProperty.status === 'for_sale' 
                        ? (language === 'ar' ? 'للبيع' : 'For Sale')
                        : (language === 'ar' ? 'للإيجار' : 'For Rent')
                      }
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className={`p-8 lg:p-12 flex flex-col justify-center ${currentIndex % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="max-w-lg">
                  {/* Price */}
                  <div className="mb-4">
                    <Badge variant="outline" className="text-2xl font-bold px-4 py-2 bg-logo/10 text-logo border-logo">
                      {currentProperty.contact_for_price 
                        ? (language === 'ar' ? 'اتصل للسعر' : 'Contact for Price')
                        : `${currentProperty.currency} ${currentProperty.price?.toLocaleString() || 'N/A'}`
                      }
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-4 leading-tight">
                    {currentProperty.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center mb-6 text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{currentProperty.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed line-clamp-3">
                    {currentProperty.description}
                  </p>

                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-logo" />
                      <div className="text-2xl font-bold text-primary">{currentProperty.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">{t.bedrooms}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-logo" />
                      <div className="text-2xl font-bold text-primary">{currentProperty.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">{t.bathrooms}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <Square className="w-6 h-6 mx-auto mb-2 text-logo" />
                      <div className="text-2xl font-bold text-primary">{currentProperty.area}</div>
                      <div className="text-sm text-muted-foreground">{t.area} m²</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to={`/property/${currentProperty.id}`}>
                    <Button size="lg" className="w-full lg:w-auto bg-logo hover:bg-logo/90 text-logo-foreground">
                      {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {properties.length > 1 && (
            <>
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {properties.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-logo scale-125'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Slide Counter */}
              <div className="text-center mt-4 text-muted-foreground">
                {currentIndex + 1} / {properties.length}
              </div>
            </>
          )}
        </div>

        {/* View All Properties Button */}
        <div className="text-center mt-12">
          <Link to="/properties">
            <Button variant="outline" size="lg" className="px-8">
              {language === 'ar' ? 'عرض جميع العقارات' : 'View All Properties'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertySlideshow;
