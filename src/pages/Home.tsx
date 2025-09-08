import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PropertySlideshow from '@/components/PropertySlideshow';
import { getFeaturedProperties as getSupabaseFeaturedProperties, getRecentProperties } from '@/lib/supabase';
import { ArrowRight, Award, Users, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-house.jpg';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/data/translations';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  // Transform Supabase property for slideshow format
  const transformProperty = (property: any) => {
    return {
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      currency: property.currency,
      contact_for_price: property.contact_for_price,
      type: property.property_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      images: property.images || [],
      videos: property.videos || [],
      description: property.description,
      status: property.status,
      is_featured: property.is_featured
    };
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Get recent properties from Supabase (limit to 3 for slideshow)
        const recentProperties = await getRecentProperties();
        
        console.log('Recent properties from Supabase:', recentProperties);
        
        if (recentProperties && recentProperties.length > 0) {
          const propertiesToShow = recentProperties
            .slice(0, 3) // Limit to 3 properties for slideshow
            .map(transformProperty);
          
          console.log('Properties for slideshow:', propertiesToShow);
          setFeaturedProperties(propertiesToShow);
        } else {
          // No properties available
          setFeaturedProperties([]);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setFeaturedProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto fade-in">
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.findYourPerfect}
              <span className="block text-logo">
                {t.homeInLebanon}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/properties">
                  {t.viewAllProperties}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/contact">
                  {t.scheduleViewing}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-in">
              <div className="w-16 h-16 bg-logo rounded-full flex items-center justify-center mx-auto mb-4 shadow-elegant">
                <Award className="w-8 h-8 text-logo-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">{t.premiumProperties}</p>
            </div>
            <div className="text-center fade-in">
              <div className="w-16 h-16 bg-logo rounded-full flex items-center justify-center mx-auto mb-4 shadow-elegant">
                <Users className="w-8 h-8 text-logo-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">100+</h3>
              <p className="text-muted-foreground">{t.happyClients}</p>
            </div>
            <div className="text-center fade-in">
              <div className="w-16 h-16 bg-logo rounded-full flex items-center justify-center mx-auto mb-4 shadow-elegant">
                <MapPin className="w-8 h-8 text-logo-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">All</h3>
              <p className="text-muted-foreground">{t.lebaneseRegions}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Property Slideshow */}
      <PropertySlideshow properties={featuredProperties} />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto fade-in">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.readyToFind}
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              {t.ctaDescription}
            </p> 
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;