import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, ArrowRight, Image as ImageIcon, Video } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatPropertyForDisplay } from '@/utils/translationUtils';
import { getPropertyDisplayInfo } from '@/utils/propertyDisplay';
import DefaultPropertyImage from '@/components/DefaultPropertyImage';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  videos?: string[];
  description: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  type,
  bedrooms,
  bathrooms,
  area,
  image,
  images,
  videos,
  description,
}) => {
  const { language, isRTL } = useLanguage();
  
  // Format property for display with smart translation
  const displayProperty = formatPropertyForDisplay({
    id,
    title,
    location,
    price,
    currency: 'USD', // Default currency
    bedrooms,
    bathrooms,
    area,
    property_type: type,
    status: 'for_sale', // Default status
    images,
    videos,
    is_featured: false
  }, language);
  
  // Get smart property display info based on property type
  const propertyData = {
    property_type: type,
    bedrooms,
    bathrooms,
    area,
    floors: 0, // Add other fields as needed
    apartments: 0,
    rooms: 0,
    studios: 0,
    parking: 0,
    land_area: 0,
    building_area: 0,
    total_area: 0,
    floor: 0
  };
  
  const displayInfo = getPropertyDisplayInfo(propertyData, language);

  return (
    <Card className={`property-card overflow-hidden border-0 bg-white group cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="relative overflow-hidden">
        {(images && images.length > 0) || image ? (
          <img
            src={images && images.length > 0 ? images[0] : image}
            alt={displayProperty.title}
            className="w-full h-64 object-cover gallery-image"
          />
        ) : (
          <DefaultPropertyImage 
            propertyType={type} 
            size="lg"
            className="h-64"
          />
        )}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {displayProperty.property_type_display || type}
            {displayProperty.languageIndicator && (
              <span className="ml-1">{displayProperty.languageIndicator}</span>
            )}
          </Badge>
        </div>
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
          <Badge variant="default" className="bg-primary text-primary-foreground font-semibold">
            {displayProperty.price_display || price}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-primary/80 transition-colors">
            {displayProperty.title}
            {displayProperty.languageIndicator && (
              <span className="ml-2 text-sm text-muted-foreground">{displayProperty.languageIndicator}</span>
            )}
          </h3>
          <div className={`flex items-center text-muted-foreground text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span>{displayProperty.location}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className={`flex items-center justify-between text-sm text-muted-foreground mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            {displayInfo.primaryFields.map((field, index) => {
              const IconComponent = field.icon === 'bed' ? Bed : 
                                  field.icon === 'bath' ? Bath : 
                                  field.icon === 'square' ? Square : 
                                  field.icon === 'building' ? MapPin : 
                                  field.icon === 'home' ? MapPin : Square;
              
              return (
                <div key={index} className="flex items-center">
                  <IconComponent className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  <span>{field.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Media indicators */}
        {(images && images.length > 0) || (videos && videos.length > 0) ? (
          <div className={`flex items-center gap-4 text-xs text-muted-foreground mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {images && images.length > 0 && (
              <div className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>{images.length} {language === 'ar' ? 'صورة' : 'photo'}{images.length > 1 ? (language === 'ar' ? '' : 's') : ''}</span>
              </div>
            )}
            {videos && videos.length > 0 && (
              <div className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>{videos.length} {language === 'ar' ? 'فيديو' : 'video'}{videos.length > 1 ? (language === 'ar' ? '' : 's') : ''}</span>
              </div>
            )}
          </div>
        ) : null}

        <Button variant="outline" className="w-full group" asChild>
          <Link to={`/property/${id}`}>
            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;