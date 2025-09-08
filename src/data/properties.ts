// Legacy interface for backward compatibility
export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  features: string[];
  gallery: string[];
  year: number;
  status: 'For Sale' | 'For Rent' | 'Sold';
}

// Fallback functions for when no dynamic data is available
export const getFeaturedProperties = (): Property[] => {
  // Return empty array - all data now comes from Supabase
  return [];
};

export const getPropertyById = (id: string): Property | undefined => {
  // Return undefined - all data now comes from Supabase
  return undefined;
};