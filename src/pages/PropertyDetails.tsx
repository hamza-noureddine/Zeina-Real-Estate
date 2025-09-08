import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// Removed static property import - using only dynamic data
import { getPropertyById as getSupabasePropertyById } from '@/lib/supabase';
import DefaultPropertyImage from '@/components/DefaultPropertyImage';
import { 
  MapPin, Bed, Bath, Square, Calendar, ArrowLeft, 
  Phone, Mail, MessageSquare, Star, Image as ImageIcon, 
  Video, Play, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Normalize property data to handle both Supabase and static formats
  const normalizeProperty = (prop: any) => {
    if (!prop) return null;
    
    // Ensure images and videos are always arrays
    const normalizedProp = {
      ...prop,
      images: prop.images || prop.gallery || [],
      videos: prop.videos || []
    };
    
    // If it's already in static format, return as is
    if (prop.image && prop.type) {
      return normalizedProp;
    }
    
    // Transform Supabase format to static format
    return {
      ...normalizedProp,
      image: normalizedProp.images && normalizedProp.images.length > 0 ? normalizedProp.images[0] : '/placeholder-house.jpg',
      type: prop.property_type || prop.type,
      price: prop.contact_for_price ? 'Contact for Price' : `${prop.currency} ${prop.price.toLocaleString()}`,
      status: prop.status === 'for_sale' ? 'For Sale' : 
              prop.status === 'for_rent' ? 'For Rent' :
              prop.status === 'sold' ? 'Sold' : 'Rented'
    };
  };

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        // Try to get property from Supabase first
        const supabaseProperty = await getSupabasePropertyById(id);
        if (supabaseProperty) {
          setProperty(normalizeProperty(supabaseProperty));
        } else {
          // No property found
          setProperty(null);
        }
      } catch (error) {
        console.error('Error loading property:', error);
        // Set null on error
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  // Keyboard navigation for modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showImageModal && property?.images) {
        switch (event.key) {
          case 'Escape':
            setShowImageModal(false);
            break;
          case 'ArrowLeft':
            setSelectedImageIndex(prev => 
              prev === 0 ? property.images.length - 1 : prev - 1
            );
            break;
          case 'ArrowRight':
            setSelectedImageIndex(prev => 
              prev === property.images.length - 1 ? 0 : prev + 1
            );
            break;
        }
      } else if (showVideoModal) {
        switch (event.key) {
          case 'Escape':
            setShowVideoModal(false);
            setSelectedVideo(null);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, showVideoModal, property?.images]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The property you're looking for doesn't exist.
          </p>
          <Button variant="premium" asChild>
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/properties">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 rounded-lg overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-96 md:h-[500px] object-cover cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
          ) : (
            <DefaultPropertyImage 
              propertyType={property.property_type || property.type} 
              size="lg"
              className="h-96 md:h-[500px]"
            />
          )}
          <div className="absolute top-6 left-6">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {property.type}
            </Badge>
          </div>
          <div className="absolute top-6 right-6">
            <Badge variant="default" className="bg-accent text-accent-foreground font-bold text-lg px-4 py-2">
              {property.price}
            </Badge>
          </div>
          <div className="absolute bottom-6 left-6">
            <Badge 
              variant={property.status === 'For Sale' ? 'default' : 'secondary'}
              className={property.status === 'For Sale' ? 'bg-green-600' : 'bg-blue-600'}
            >
              {property.status}
            </Badge>
          </div>
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-6 right-6">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                <ImageIcon className="w-4 h-4 mr-1" />
                {property.images.length} photos
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Info */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>

              {/* Property Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-primary">
                  <Bed className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center text-primary">
                  <Bath className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center text-primary">
                  <Square className="w-5 h-5 mr-2" />
                  <span className="font-semibold">{property.area} sqft</span>
                </div>
                <div className="flex items-center text-primary">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Built {property.year}</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold text-primary mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {(property.images && property.images.length > 0) && (
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative overflow-hidden rounded-lg group cursor-pointer"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowImageModal(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-48 object-cover gallery-image"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                      </div>
                      {/* Image number badge */}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Click any image to view full screen
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-elegant">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-6">Contact Agent</h3>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-primary mb-3">Property Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Type:</span>
                      <span className="font-medium">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year Built:</span>
                      <span className="font-medium">{property.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{property.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property ID:</span>
                      <span className="font-medium">#{property.id.padStart(6, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <Button variant="premium" className="w-full" size="lg" asChild>
                    <Link to="/contact">
                      Schedule Viewing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Videos Section */}
        {property.videos && property.videos.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-primary mb-6">Property Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.videos.map((video, index) => (
                <Card key={index} className="overflow-hidden cursor-pointer group" onClick={() => {
                  setSelectedVideo(video);
                  setShowVideoModal(true);
                }}>
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-muted">
                      <video
                        src={video}
                        className="w-full h-full object-cover"
                        poster={property.images && property.images.length > 0 ? property.images[0] : undefined}
                        muted
                      >
                        Your browser does not support the video tag.
                      </video>
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </div>
                      </div>
                      {/* Video info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            <span className="text-sm font-medium">Property Video {index + 1}</span>
                          </div>
                          <p className="text-xs text-white/80 mt-1">Click to view full screen</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showImageModal && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            {property.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? property.images.length - 1 : prev - 1
                  )}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === property.images.length - 1 ? 0 : prev + 1
                  )}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            
            <img
              src={property.images[selectedImageIndex]}
              alt={`${property.title} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
            
            {/* Navigation instructions */}
            {property.images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
                <p className="text-white/80 text-sm">
                  Use ← → arrow keys or click dots to navigate
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => {
                setShowVideoModal(false);
                setSelectedVideo(null);
                setVideoLoading(false);
                setVideoError(null);
              }}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading video...</p>
                    <p className="text-sm text-white/70 mt-2">This may take a moment for large videos</p>
                  </div>
                </div>
              )}
              
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-lg font-semibold mb-2">Video Error</p>
                    <p className="text-sm text-white/70 mb-4">{videoError}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setVideoError(null);
                        setVideoLoading(true);
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
              
              <video
                src={selectedVideo}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
                poster={property.images && property.images.length > 0 ? property.images[0] : undefined}
                onLoadStart={() => {
                  setVideoLoading(true);
                  setVideoError(null);
                }}
                onCanPlay={() => {
                  setVideoLoading(false);
                  setVideoError(null);
                }}
                onError={(e) => {
                  setVideoLoading(false);
                  setVideoError('Failed to load video. The file may be too large or corrupted.');
                }}
                onWaiting={() => setVideoLoading(true)}
                onPlaying={() => setVideoLoading(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 text-white px-4 py-3 rounded-lg backdrop-blur-sm">
                <h4 className="font-semibold">{property.title}</h4>
                <p className="text-sm text-white/80">Property Video</p>
                <p className="text-xs text-white/60 mt-1">
                  Tip: Use the seek bar to jump to different parts of long videos
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;