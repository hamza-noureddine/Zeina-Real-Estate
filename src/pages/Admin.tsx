import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import { supabase, Property, uploadImage, uploadVideo } from '@/lib/supabase';
import ContentGuidelines from '@/components/ContentGuidelines';
import DefaultPropertyImage from '@/components/DefaultPropertyImage';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut, 
  Building2,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Square,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Play,
  Star,
  Languages
} from 'lucide-react';
// Removed complex data management dashboard - keeping admin simple

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, isRTL, toggleLanguage } = useLanguageContext();
  const t = translations[language];
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    location: '',
    area: '0',
    bedrooms: '0',
    bathrooms: '0',
    floor: '0',
    floors: '0',
    parking: '0',
    view: '',
    land_area: '0',
    building_area: '0',
    apartments: '0',
    total_area: '0',
    rooms: '0',
    studios: '0',
    property_type: 'apartment' as const,
    status: 'for_sale' as const,
    features: '',
    contact_phone: '+961 76 340 101',
    contact_email: 'zeinasleiman@hotmail.com',
    is_featured: false,
    contact_for_price: false
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Property type configurations
  const propertyTypeConfig = {
    apartment: {
      label: 'Apartment',
      fields: ['area', 'bedrooms', 'bathrooms', 'floor', 'parking', 'view'],
      required: ['area', 'bedrooms', 'bathrooms']
    },
    villa: {
      label: 'Villa',
      fields: ['area', 'bedrooms', 'bathrooms', 'floors', 'parking'],
      required: ['area', 'bedrooms', 'bathrooms']
    },
    building: {
      label: 'Building',
      fields: ['land_area', 'building_area', 'floors', 'apartments', 'parking'],
      required: ['land_area', 'building_area', 'floors']
    },
    hotel: {
      label: 'Hotel',
      fields: ['total_area', 'floors', 'rooms', 'studios', 'parking'],
      required: ['total_area', 'floors', 'rooms']
    },
    office: {
      label: 'Office',
      fields: ['area', 'floors', 'parking'],
      required: ['area']
    },
    land: {
      label: 'Land',
      fields: ['area'],
      required: ['area']
    }
  };

  // Get required fields based on property type
  const getRequiredFields = (propertyType: string) => {
    const baseRequired = ['title', 'description', 'location', 'property_type', 'status', 'contact_phone', 'contact_email'];
    const typeRequired = propertyTypeConfig[propertyType as keyof typeof propertyTypeConfig]?.required || [];
    return [...baseRequired, ...typeRequired];
  };

  // Check if field should be shown based on property type
  const shouldShowField = (fieldName: string, propertyType: string) => {
    const config = propertyTypeConfig[propertyType as keyof typeof propertyTypeConfig];
    return config?.fields.includes(fieldName) || false;
  };

  useEffect(() => {
    checkAuth();
    loadProperties();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/admin/login');
    }
  };

  const loadProperties = async () => {
    try {
      const data = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (data.data) {
        console.log('Admin: All properties from database:', data.data);
        setProperties(data.data as Property[]);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          // Create a temporary property ID for upload
          const tempId = `temp-${Date.now()}-${i}`;
          const imageUrl = await uploadImage(file, tempId);
          newImageUrls.push(imageUrl);
        }
      }

      setUploadedImages(prev => [...prev, ...newImageUrls]);
      toast({
        title: "Images uploaded",
        description: `${newImageUrls.length} image(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const newVideoUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('video/')) {
          // Create a temporary property ID for upload
          const tempId = `temp-${Date.now()}-${i}`;
          const videoUrl = await uploadVideo(file, tempId);
          newVideoUrls.push(videoUrl);
        }
      }

      setUploadedVideos(prev => [...prev, ...newVideoUrls]);
      toast({
        title: "Videos uploaded",
        description: `${newVideoUrls.length} video(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        ...formData,
        price: formData.contact_for_price ? 0 : (formData.price && formData.price !== '' ? parseFloat(formData.price) : 0),
        area: formData.area && formData.area !== '' ? parseFloat(formData.area) : 0,
        bedrooms: formData.bedrooms && formData.bedrooms !== '' ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms && formData.bathrooms !== '' ? parseInt(formData.bathrooms) : 0,
        floor: formData.floor && formData.floor !== '' ? parseInt(formData.floor) : 0,
        floors: formData.floors && formData.floors !== '' ? parseInt(formData.floors) : 0,
        parking: formData.parking && formData.parking !== '' ? parseInt(formData.parking) : 0,
        land_area: formData.land_area && formData.land_area !== '' ? parseFloat(formData.land_area) : 0,
        building_area: formData.building_area && formData.building_area !== '' ? parseFloat(formData.building_area) : 0,
        apartments: formData.apartments && formData.apartments !== '' ? parseInt(formData.apartments) : 0,
        total_area: formData.total_area && formData.total_area !== '' ? parseFloat(formData.total_area) : 0,
        rooms: formData.rooms && formData.rooms !== '' ? parseInt(formData.rooms) : 0,
        studios: formData.studios && formData.studios !== '' ? parseInt(formData.studios) : 0,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        videos: uploadedVideos // Re-enabled videos
      };

      console.log('Submitting property data:', propertyData);

      if (editingProperty) {
        const { data, error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Property updated successfully:', data);
        toast({
          title: "Success",
          description: t.propertyUpdated
        });
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert([propertyData])
          .select();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Property added successfully:', data);
        toast({
          title: "Success",
          description: t.propertySaved
        });
      }

      setShowForm(false);
      setEditingProperty(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'USD',
        location: '',
        area: '0',
        bedrooms: '0',
        bathrooms: '0',
        floor: '0',
        floors: '0',
        parking: '0',
        view: '',
        land_area: '0',
        building_area: '0',
        apartments: '0',
        total_area: '0',
        rooms: '0',
        studios: '0',
        property_type: 'apartment',
        status: 'for_sale',
        features: '',
        contact_phone: '+961 76 340 101',
        contact_email: 'zeinasleiman@hotmail.com',
        is_featured: false,
        contact_for_price: false
      });
      setUploadedImages([]);
      setUploadedVideos([]);
      loadProperties();
    } catch (error: any) {
      console.error('Failed to save property:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      await supabase.from('properties').delete().eq('id', id);
      toast({
        title: "Success",
        description: t.propertyDeleted
      });
      loadProperties();
    } catch (error) {
      console.error('Failed to delete property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      currency: property.currency,
      location: property.location,
      area: property.area.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      floor: property.floor?.toString() || '0',
      floors: property.floors?.toString() || '0',
      parking: property.parking?.toString() || '0',
      view: property.view || '',
      land_area: property.land_area?.toString() || '0',
      building_area: property.building_area?.toString() || '0',
      apartments: property.apartments?.toString() || '0',
      total_area: property.total_area?.toString() || '0',
      rooms: property.rooms?.toString() || '0',
      studios: property.studios?.toString() || '0',
      property_type: property.property_type as any,
      status: property.status as any,
      features: property.features.join(', '),
      contact_phone: property.contact_phone,
      contact_email: property.contact_email,
      is_featured: property.is_featured,
      contact_for_price: property.contact_for_price || false
    });
    setUploadedImages(property.images || []);
    setUploadedVideos(property.videos || []);
    setShowForm(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`flex justify-between items-center mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold text-primary">{t.adminDashboard}</h1>
            <p className="text-muted-foreground">{t.manageProperties}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Languages className="w-4 h-4" />
              <span>{language === 'en' ? 'عربي' : 'EN'}</span>
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t.addNewProperty}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout || 'Logout'}
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingProperty ? t.editPropertyDetails : t.addNewProperty}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property Type - First field so other fields can adapt */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-primary/20">
                  <Label htmlFor="property_type" className="text-lg font-semibold">{t.propertyType}</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select the property type first to see relevant fields below
                  </p>
                  <Select value={formData.property_type} onValueChange={(value) => handleSelectChange('property_type', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">🏠 Apartment</SelectItem>
                      <SelectItem value="villa">🏡 Villa</SelectItem>
                      <SelectItem value="building">🏗️ Building</SelectItem>
                      <SelectItem value="hotel">🏨 Hotel</SelectItem>
                      <SelectItem value="office">🏢 Office</SelectItem>
                      <SelectItem value="land">🌍 Land</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-xs text-primary">
                    ✓ Showing fields for: <span className="font-medium capitalize">{propertyTypeConfig[formData.property_type as keyof typeof propertyTypeConfig]?.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">{t.propertyTitle}</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">{t.propertyLocation}</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">{t.propertyPrice}</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="contact_for_price"
                          checked={formData.contact_for_price}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, contact_for_price: checked }))}
                        />
                        <Label htmlFor="contact_for_price" className="text-sm">
                          {t.contactForPrice}
                        </Label>
                      </div>
                      {!formData.contact_for_price && (
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder={t.enterPrice || 'Enter price'}
                        />
                      )}
                      {formData.contact_for_price && (
                        <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                          {t.priceWillShow || 'Price will show as "Contact for Price"'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="currency">{t.currency || 'Currency'}</Label>
                    <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="LBP">LBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Area - Show for all except land (optional for land) */}
                  {shouldShowField('area', formData.property_type) && (
                    <div>
                      <Label htmlFor="area">{t.area}</Label>
                      <Input
                        id="area"
                        name="area"
                        type="number"
                        value={formData.area}
                        onChange={handleInputChange}
                        required={getRequiredFields(formData.property_type).includes('area')}
                      />
                    </div>
                  )}
                  {/* Bedrooms - Only show for residential properties */}
                  {shouldShowField('bedrooms', formData.property_type) && (
                    <div>
                      <Label htmlFor="bedrooms">{t.bedrooms}</Label>
                      <Input
                        id="bedrooms"
                        name="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        required={getRequiredFields(formData.property_type).includes('bedrooms')}
                      />
                    </div>
                  )}
                  
                  {/* Bathrooms - Only show for residential properties */}
                  {shouldShowField('bathrooms', formData.property_type) && (
                    <div>
                      <Label htmlFor="bathrooms">{t.bathrooms}</Label>
                      <Input
                        id="bathrooms"
                        name="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        required={getRequiredFields(formData.property_type).includes('bathrooms')}
                      />
                    </div>
                  )}
                  
                  
                  {/* Floor - Show for apartment, master */}
                  {shouldShowField('floor', formData.property_type) && (
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        name="floor"
                        type="number"
                        value={formData.floor}
                        onChange={handleInputChange}
                        placeholder="e.g., 7"
                      />
                    </div>
                  )}
                  
                  {/* Floors - Show for villa, building, hotel, office */}
                  {shouldShowField('floors', formData.property_type) && (
                    <div>
                      <Label htmlFor="floors">Floors</Label>
                      <Input
                        id="floors"
                        name="floors"
                        type="number"
                        value={formData.floors}
                        onChange={handleInputChange}
                        placeholder="e.g., 7"
                        required={getRequiredFields(formData.property_type).includes('floors')}
                      />
                    </div>
                  )}
                  
                  {/* Parking - Show for most types */}
                  {shouldShowField('parking', formData.property_type) && (
                    <div>
                      <Label htmlFor="parking">Parking Spaces</Label>
                      <Input
                        id="parking"
                        name="parking"
                        type="number"
                        value={formData.parking}
                        onChange={handleInputChange}
                        placeholder="e.g., 2"
                      />
                    </div>
                  )}
                  
                  {/* View - Show for apartment, master */}
                  {shouldShowField('view', formData.property_type) && (
                    <div>
                      <Label htmlFor="view">View</Label>
                      <Input
                        id="view"
                        name="view"
                        value={formData.view}
                        onChange={handleInputChange}
                        placeholder="e.g., Sea view, Mountain view"
                      />
                    </div>
                  )}
                  
                  
                  {/* Land Area - Show for building */}
                  {shouldShowField('land_area', formData.property_type) && (
                    <div>
                      <Label htmlFor="land_area">Land Area (m²)</Label>
                      <Input
                        id="land_area"
                        name="land_area"
                        type="number"
                        value={formData.land_area}
                        onChange={handleInputChange}
                        placeholder="e.g., 320"
                        required={getRequiredFields(formData.property_type).includes('land_area')}
                      />
                    </div>
                  )}
                  
                  {/* Building Area - Show for building */}
                  {shouldShowField('building_area', formData.property_type) && (
                    <div>
                      <Label htmlFor="building_area">Building Area (m²)</Label>
                      <Input
                        id="building_area"
                        name="building_area"
                        type="number"
                        value={formData.building_area}
                        onChange={handleInputChange}
                        placeholder="e.g., 170"
                        required={getRequiredFields(formData.property_type).includes('building_area')}
                      />
                    </div>
                  )}
                  
                  {/* Apartments - Show for building */}
                  {shouldShowField('apartments', formData.property_type) && (
                    <div>
                      <Label htmlFor="apartments">Number of Apartments</Label>
                      <Input
                        id="apartments"
                        name="apartments"
                        type="number"
                        value={formData.apartments}
                        onChange={handleInputChange}
                        placeholder="e.g., 36"
                      />
                    </div>
                  )}
                  
                  {/* Total Area - Show for hotel */}
                  {shouldShowField('total_area', formData.property_type) && (
                    <div>
                      <Label htmlFor="total_area">Total Area (m²)</Label>
                      <Input
                        id="total_area"
                        name="total_area"
                        type="number"
                        value={formData.total_area}
                        onChange={handleInputChange}
                        placeholder="e.g., 165"
                        required={getRequiredFields(formData.property_type).includes('total_area')}
                      />
                    </div>
                  )}
                  
                  {/* Rooms - Show for hotel */}
                  {shouldShowField('rooms', formData.property_type) && (
                    <div>
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Input
                        id="rooms"
                        name="rooms"
                        type="number"
                        value={formData.rooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 40"
                        required={getRequiredFields(formData.property_type).includes('rooms')}
                      />
                    </div>
                  )}
                  
                  {/* Studios - Show for hotel */}
                  {shouldShowField('studios', formData.property_type) && (
                    <div>
                      <Label htmlFor="studios">Number of Studios</Label>
                      <Input
                        id="studios"
                        name="studios"
                        type="number"
                        value={formData.studios}
                        onChange={handleInputChange}
                        placeholder="e.g., 11"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="status">Property Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for_sale">For Sale</SelectItem>
                        <SelectItem value="for_rent">For Rent</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Featured Property Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured" className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {t.featuredProperty}
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="description">{t.propertyDescription}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="features">{t.propertyFeatures}</Label>
                  <Input
                    id="features"
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="e.g., Pool, Garden, Parking, Balcony"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <Label>Property Images</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  </div>
                  
                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Uploaded Images ({uploadedImages.length}):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Upload Section */}
                <div>
                  <Label>Property Videos</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recommended: MP4 format, max 100MB per video. Longer videos may take time to load.
                  </p>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Videos'}
                    </Button>
                  </div>
                  
                  {/* Display uploaded videos */}
                  {uploadedVideos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Uploaded Videos ({uploadedVideos.length}):
                      </p>
                      <div className="space-y-2">
                        {uploadedVideos.map((video, index) => (
                          <div key={index} className="relative group">
                            <div className="flex items-center gap-2 p-2 border rounded-lg">
                              <Play className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm flex-1">Video {index + 1}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeVideo(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingProperty ? t.editProperty : t.addProperty}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                  }}>
                    {t.cancel}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Content Guidelines - Show when form is open */}
        {showForm && (
          <ContentGuidelines property={editingProperty} showQualityCheck={true} />
        )}

        {/* Properties List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className={`property-card ${isRTL ? 'text-right' : 'text-left'}`}>
              <CardContent className="p-6">
                <div className="mb-4">
                  {property.images && property.images.length > 0 ? (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <DefaultPropertyImage 
                      propertyType={property.property_type} 
                      size="md"
                      className="aspect-video"
                    />
                  )}
                </div>
                
                <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  {property.is_featured && (
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      <Star className="w-3 h-3" />
                      <span>{t.featured}</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-4">{property.location}</p>
                
                <div className={`flex items-center justify-between text-sm mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center gap-4">
                    {property.bedrooms !== null && property.bedrooms !== undefined && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms !== null && property.bathrooms !== undefined && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area !== null && property.area !== undefined && (
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{property.area}m²</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media indicators */}
                <div className={`flex items-center gap-4 text-xs text-muted-foreground mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {property.images && property.images.length > 0 && (
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{property.images.length} {t.images}</span>
                    </div>
                  )}
                  {property.videos && property.videos.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>{property.videos.length} {t.videos}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg">
                    {property.currency} {property.price.toLocaleString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    property.status === 'for_sale' ? 'bg-green-100 text-green-800' :
                    property.status === 'for_rent' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(property)} title={t.editProperty}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(property.id)} title={t.deleteProperty}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
