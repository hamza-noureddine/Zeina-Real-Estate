// Smart property display utilities
export interface PropertyDisplayInfo {
  primaryFields: Array<{
    label: string;
    value: string | number;
    icon: string;
  }>;
  secondaryFields: Array<{
    label: string;
    value: string | number;
  }>;
}

export const getPropertyDisplayInfo = (property: any, language: 'en' | 'ar'): PropertyDisplayInfo => {
  const isArabic = language === 'ar';
  
  // Translation mappings
  const translations = {
    en: {
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      floors: 'Floors',
      apartments: 'Apartments',
      rooms: 'Rooms',
      studios: 'Studios',
      parking: 'Parking',
      landArea: 'Land Area',
      buildingArea: 'Building Area',
      totalArea: 'Total Area',
      floor: 'Floor',
      view: 'View',
      m2: 'm²'
    },
    ar: {
      bedrooms: 'غرف النوم',
      bathrooms: 'الحمامات',
      area: 'المساحة',
      floors: 'الطوابق',
      apartments: 'الشقق',
      rooms: 'الغرف',
      studios: 'الاستوديوهات',
      parking: 'مواقف السيارات',
      landArea: 'مساحة الأرض',
      buildingArea: 'مساحة البناء',
      totalArea: 'المساحة الإجمالية',
      floor: 'الطابق',
      view: 'الإطلالة',
      m2: 'م²'
    }
  };

  const t = translations[language];
  
  const primaryFields: Array<{ label: string; value: string | number; icon: string }> = [];
  const secondaryFields: Array<{ label: string; value: string | number }> = [];

  switch (property.property_type) {
    case 'apartment':
      if (property.bedrooms && property.bedrooms > 0) {
        primaryFields.push({ label: t.bedrooms, value: property.bedrooms, icon: 'bed' });
      }
      if (property.bathrooms && property.bathrooms > 0) {
        primaryFields.push({ label: t.bathrooms, value: property.bathrooms, icon: 'bath' });
      }
      if (property.area && property.area > 0) {
        primaryFields.push({ label: t.area, value: `${property.area} ${t.m2}`, icon: 'square' });
      }
      if (property.floor && property.floor > 0) {
        secondaryFields.push({ label: t.floor, value: property.floor });
      }
      if (property.parking && property.parking > 0) {
        secondaryFields.push({ label: t.parking, value: property.parking });
      }
      break;

    case 'villa':
      if (property.bedrooms && property.bedrooms > 0) {
        primaryFields.push({ label: t.bedrooms, value: property.bedrooms, icon: 'bed' });
      }
      if (property.bathrooms && property.bathrooms > 0) {
        primaryFields.push({ label: t.bathrooms, value: property.bathrooms, icon: 'bath' });
      }
      if (property.area && property.area > 0) {
        primaryFields.push({ label: t.area, value: `${property.area} ${t.m2}`, icon: 'square' });
      }
      if (property.floors && property.floors > 0) {
        secondaryFields.push({ label: t.floors, value: property.floors });
      }
      if (property.parking && property.parking > 0) {
        secondaryFields.push({ label: t.parking, value: property.parking });
      }
      break;

    case 'building':
      if (property.floors && property.floors > 0) {
        primaryFields.push({ label: t.floors, value: property.floors, icon: 'building' });
      }
      if (property.apartments && property.apartments > 0) {
        primaryFields.push({ label: t.apartments, value: property.apartments, icon: 'home' });
      }
      if (property.land_area && property.land_area > 0) {
        primaryFields.push({ label: t.landArea, value: `${property.land_area} ${t.m2}`, icon: 'square' });
      }
      if (property.building_area && property.building_area > 0) {
        secondaryFields.push({ label: t.buildingArea, value: `${property.building_area} ${t.m2}` });
      }
      if (property.parking && property.parking > 0) {
        secondaryFields.push({ label: t.parking, value: property.parking });
      }
      break;

    case 'hotel':
      if (property.floors && property.floors > 0) {
        primaryFields.push({ label: t.floors, value: property.floors, icon: 'building' });
      }
      if (property.rooms && property.rooms > 0) {
        primaryFields.push({ label: t.rooms, value: property.rooms, icon: 'bed' });
      }
      if (property.studios && property.studios > 0) {
        primaryFields.push({ label: t.studios, value: property.studios, icon: 'home' });
      }
      if (property.total_area && property.total_area > 0) {
        primaryFields.push({ label: t.totalArea, value: `${property.total_area} ${t.m2}`, icon: 'square' });
      }
      if (property.parking && property.parking > 0) {
        secondaryFields.push({ label: t.parking, value: property.parking });
      }
      break;

    case 'office':
      if (property.area && property.area > 0) {
        primaryFields.push({ label: t.area, value: `${property.area} ${t.m2}`, icon: 'square' });
      }
      if (property.floors && property.floors > 0) {
        primaryFields.push({ label: t.floors, value: property.floors, icon: 'building' });
      }
      if (property.parking && property.parking > 0) {
        secondaryFields.push({ label: t.parking, value: property.parking });
      }
      break;

    case 'land':
      if (property.area && property.area > 0) {
        primaryFields.push({ label: t.area, value: `${property.area} ${t.m2}`, icon: 'square' });
      }
      break;

    default:
      // Fallback for unknown types
      if (property.area && property.area > 0) {
        primaryFields.push({ label: t.area, value: `${property.area} ${t.m2}`, icon: 'square' });
      }
      if (property.bedrooms && property.bedrooms > 0) {
        primaryFields.push({ label: t.bedrooms, value: property.bedrooms, icon: 'bed' });
      }
      if (property.bathrooms && property.bathrooms > 0) {
        primaryFields.push({ label: t.bathrooms, value: property.bathrooms, icon: 'bath' });
      }
  }

  return {
    primaryFields,
    secondaryFields
  };
};
