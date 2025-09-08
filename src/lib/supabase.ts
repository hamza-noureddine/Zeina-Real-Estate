import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vglodnemihqwoddfifvj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbG9kbmVtaWhxd29kZGZpZnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzc1NTAsImV4cCI6MjA3Mjc1MzU1MH0.FREVBheeQIazbAWuMy9LvKjKgO5rWKZCu9lQtSybK9U'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'zeina-real-estate-web'
    }
  }
})

// Database types
export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: string
  area: number
  bedrooms: number
  bathrooms: number
  floor: number
  floors: number
  parking: number
  view: string
  land_area: number
  building_area: number
  apartments: number
  total_area: number
  rooms: number
  studios: number
  property_type: 'apartment' | 'villa' | 'building' | 'hotel' | 'office' | 'land'
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented'
  images: string[]
  videos: string[]
  features: string[]
  contact_phone: string
  contact_email: string
  is_featured: boolean
  contact_for_price: boolean
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  created_at: string
}

// Database functions
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Property[]
}

export const getFeaturedProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  
  if (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
  
  console.log('Featured properties query result:', data);
  return data as Property[]
}

export const getRecentProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
  
  if (error) {
    console.error('Error fetching recent properties:', error);
    throw error;
  }
  
  console.log('Recent properties query result:', data);
  return data as Property[]
}

export const getPropertyById = async (id: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Property
}

// Storage functions
export const uploadImage = async (file: File, propertyId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export const uploadVideo = async (file: File, propertyId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('property-videos')
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('property-videos')
    .getPublicUrl(fileName)

  return publicUrl
}

export const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()
    .single()
  
  if (error) throw error
  return data as Property
}

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Property
}

export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Authentication functions
export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOutAdmin = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Optimized database functions with security
export const searchProperties = async (searchParams: {
  search?: string;
  property_type?: string;
  governorate?: string;
  min_price?: number;
  max_price?: number;
  status?: string;
}) => {
  const { data, error } = await supabase.rpc('search_properties', {
    search_term: searchParams.search || '',
    property_type_filter: searchParams.property_type || null,
    governorate_filter: searchParams.governorate || null,
    min_price: searchParams.min_price || null,
    max_price: searchParams.max_price || null,
    status_filter: searchParams.status || 'for_sale'
  })
  
  if (error) throw error
  return data as Property[]
}

export const getPropertyAnalytics = async (propertyId: string) => {
  const { data, error } = await supabase.rpc('get_property_analytics', {
    property_uuid: propertyId
  })
  
  if (error) throw error
  return data[0]
}

export const trackPropertyView = async (propertyId: string) => {
  const { error } = await supabase
    .from('property_views')
    .insert([{
      property_id: propertyId,
      user_agent: navigator.userAgent,
      session_id: sessionStorage.getItem('sessionId') || Math.random().toString(36)
    }])
  
  if (error) console.error('Failed to track view:', error)
  
  // Increment view count
  await supabase.rpc('increment_property_view_count', { property_uuid: propertyId })
}

export const createPropertyInquiry = async (inquiry: {
  property_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from('property_inquiries')
    .insert([inquiry])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getPropertyInquiries = async (propertyId?: string) => {
  let query = supabase
    .from('property_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (propertyId) {
    query = query.eq('property_id', propertyId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export const updateInquiryStatus = async (inquiryId: string, status: string) => {
  const { data, error } = await supabase
    .from('property_inquiries')
    .update({ status })
    .eq('id', inquiryId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Data safety functions
export const createDataBackup = async () => {
  const { data, error } = await supabase.rpc('backup_properties')
  
  if (error) throw error
  return data[0]
}

export const validateDataIntegrity = async () => {
  // Check for orphaned data
  const { data: orphanedViews } = await supabase
    .from('property_views')
    .select('property_id')
    .not('property_id', 'in', '(SELECT id FROM properties)')
  
  const { data: orphanedInquiries } = await supabase
    .from('property_inquiries')
    .select('property_id')
    .not('property_id', 'in', '(SELECT id FROM properties)')
  
  return {
    orphanedViews: orphanedViews?.length || 0,
    orphanedInquiries: orphanedInquiries?.length || 0
  }
}
