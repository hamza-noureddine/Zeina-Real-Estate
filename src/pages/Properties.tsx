import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// Removed static properties import - using only dynamic data
import { getProperties } from '@/lib/supabase';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/data/translations';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('price');
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  const t = translations[language];

  const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Commercial', 'Land'];

  // Transform Supabase property to PropertyCard format
  const transformProperty = (property: any) => {
    return {
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.contact_for_price ? 'Contact for Price' : `${property.currency} ${property.price.toLocaleString()}`,
      type: property.property_type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      image: property.images && property.images.length > 0 ? property.images[0] : '/placeholder-house.jpg',
      images: property.images || [],
      videos: property.videos || [],
      description: property.description
    };
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Get properties from Supabase
        const supabaseProperties = await getProperties();
        if (supabaseProperties && supabaseProperties.length > 0) {
          const transformedProperties = supabaseProperties.map(transformProperty);
          setAllProperties(transformedProperties);
        } else {
          // No properties available
          setAllProperties([]);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        // Set empty array on error
        setAllProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const filteredProperties = allProperties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || property.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
        case 'area':
          return b.area - a.area;
        case 'bedrooms':
          return b.bedrooms - a.bedrooms;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Properties
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover exceptional properties in the world's most desirable locations. 
            Each property is carefully selected for its unique character and luxury appeal.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow-card p-6 mb-8 fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by location or property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Property Type Filter */}
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedType === type 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="price">Price</option>
                <option value="area">Area</option>
                <option value="bedrooms">Bedrooms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProperties.length} of {allProperties.length} properties
          </p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <div key={property.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <PropertyCard {...property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">No Properties Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters to find more properties.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedType('All');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;