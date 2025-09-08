// Security utilities for enhanced data protection and validation

import { supabase } from '@/lib/supabase';

// Input validation and sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Phone validation for Lebanese numbers
export const validateLebanesePhone = (phone: string): boolean => {
  const phoneRegex = /^\+961[0-9\s]+$/;
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('961')) {
    const number = digits.slice(3);
    return number.length === 8 && /^[134678]\d{7}$/.test(number);
  }
  
  return false;
};

// File type validation
export const validateFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = filename.toLowerCase().split('.').pop();
  return extension ? allowedTypes.includes(extension) : false;
};

// File size validation (in bytes)
export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

// Image file validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validateFileType(file.name, allowedTypes)) {
    return { valid: false, error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' };
  }
  
  if (!validateFileSize(file.size, maxSize)) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }
  
  return { valid: true };
};

// Video file validation
export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['mp4', 'webm', 'mov'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!validateFileType(file.name, allowedTypes)) {
    return { valid: false, error: 'Invalid file type. Only MP4, WebM, and MOV are allowed.' };
  }
  
  if (!validateFileSize(file.size, maxSize)) {
    return { valid: false, error: 'File too large. Maximum size is 50MB.' };
  }
  
  return { valid: true };
};

// Property data validation
export const validatePropertyData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!data.location || typeof data.location !== 'string' || data.location.trim().length === 0) {
    errors.push('Location is required');
  }
  
  if (!data.contact_phone || !validateLebanesePhone(data.contact_phone)) {
    errors.push('Valid Lebanese phone number is required');
  }
  
  if (!data.contact_email || !validateEmail(data.contact_email)) {
    errors.push('Valid email address is required');
  }
  
  // Numeric validations
  if (data.price && (isNaN(data.price) || data.price < 0)) {
    errors.push('Price must be a positive number');
  }
  
  if (data.area && (isNaN(data.area) || data.area <= 0)) {
    errors.push('Area must be a positive number');
  }
  
  if (data.bedrooms && (isNaN(data.bedrooms) || data.bedrooms < 0)) {
    errors.push('Bedrooms must be a non-negative number');
  }
  
  if (data.bathrooms && (isNaN(data.bathrooms) || data.bathrooms < 0)) {
    errors.push('Bathrooms must be a non-negative number');
  }
  
  // Enum validations
  const validPropertyTypes = ['apartment', 'house', 'villa', 'commercial', 'land'];
  if (data.property_type && !validPropertyTypes.includes(data.property_type)) {
    errors.push('Invalid property type');
  }
  
  const validStatuses = ['for_sale', 'for_rent', 'sold', 'rented'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Invalid status');
  }
  
  const validGovernorates = ['Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Bekaa', 'Nabatieh', 'Akkar'];
  if (data.governorate && !validGovernorates.includes(data.governorate)) {
    errors.push('Invalid governorate');
  }
  
  // Array validations
  if (data.images && Array.isArray(data.images) && data.images.length > 20) {
    errors.push('Maximum 20 images allowed');
  }
  
  if (data.videos && Array.isArray(data.videos) && data.videos.length > 5) {
    errors.push('Maximum 5 videos allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Rate limiting (client-side)
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (attempt.count >= maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Secure file upload with validation
export const uploadFileSecurely = async (
  file: File, 
  bucket: string, 
  path: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validate file
    const validation = bucket === 'images' ? validateImageFile(file) : validateVideoFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    // Generate secure filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const secureFilename = `${timestamp}_${randomString}.${extension}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${path}/${secureFilename}`, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    return { success: false, error: 'Upload failed' };
  }
};

// Secure property creation with validation
export const createPropertySecurely = async (propertyData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Validate data
    const validation = validatePropertyData(propertyData);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }
    
    // Sanitize inputs
    const sanitizedData = {
      ...propertyData,
      title: sanitizeInput(propertyData.title),
      description: sanitizeInput(propertyData.description),
      location: sanitizeInput(propertyData.location)
    };
    
    // Create property
    const { data, error } = await supabase
      .from('properties')
      .insert([sanitizedData])
      .select()
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to create property' };
  }
};

// Secure property update with validation
export const updatePropertySecurely = async (
  id: string, 
  updates: any
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Validate data
    const validation = validatePropertyData(updates);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }
    
    // Sanitize inputs
    const sanitizedUpdates = {
      ...updates,
      title: updates.title ? sanitizeInput(updates.title) : undefined,
      description: updates.description ? sanitizeInput(updates.description) : undefined,
      location: updates.location ? sanitizeInput(updates.location) : undefined
    };
    
    // Update property
    const { data, error } = await supabase
      .from('properties')
      .update(sanitizedUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to update property' };
  }
};

// Track property view securely
export const trackPropertyView = async (propertyId: string): Promise<void> => {
  try {
    // Get user IP and user agent
    const userAgent = navigator.userAgent;
    const sessionId = sessionStorage.getItem('sessionId') || Math.random().toString(36);
    
    // Store session ID
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', sessionId);
    }
    
    // Track view
    await supabase
      .from('property_views')
      .insert([{
        property_id: propertyId,
        user_agent: userAgent,
        session_id: sessionId
      }]);
    
    // Increment view count
    await supabase.rpc('increment_property_view_count', { property_uuid: propertyId });
  } catch (error) {
    console.error('Failed to track property view:', error);
  }
};

// Secure search with input validation
export const searchPropertiesSecurely = async (searchParams: {
  search?: string;
  property_type?: string;
  governorate?: string;
  min_price?: number;
  max_price?: number;
  status?: string;
}): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    // Sanitize search term
    const sanitizedSearch = searchParams.search ? sanitizeInput(searchParams.search) : '';
    
    // Validate other parameters
    const validPropertyTypes = ['apartment', 'house', 'villa', 'commercial', 'land'];
    const validStatuses = ['for_sale', 'for_rent', 'sold', 'rented'];
    const validGovernorates = ['Beirut', 'Mount Lebanon', 'North Lebanon', 'South Lebanon', 'Bekaa', 'Nabatieh', 'Akkar'];
    
    if (searchParams.property_type && !validPropertyTypes.includes(searchParams.property_type)) {
      return { success: false, error: 'Invalid property type' };
    }
    
    if (searchParams.status && !validStatuses.includes(searchParams.status)) {
      return { success: false, error: 'Invalid status' };
    }
    
    if (searchParams.governorate && !validGovernorates.includes(searchParams.governorate)) {
      return { success: false, error: 'Invalid governorate' };
    }
    
    // Use secure search function
    const { data, error } = await supabase.rpc('search_properties', {
      search_term: sanitizedSearch,
      property_type_filter: searchParams.property_type || null,
      governorate_filter: searchParams.governorate || null,
      min_price: searchParams.min_price || null,
      max_price: searchParams.max_price || null,
      status_filter: searchParams.status || 'for_sale'
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Search failed' };
  }
};
