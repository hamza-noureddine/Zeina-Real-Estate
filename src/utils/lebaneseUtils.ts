// Lebanese area codes and phone formatting utilities

export const LEBANESE_AREA_CODES = {
  'Beirut': '+961 1',
  'Mount Lebanon': '+961 4',
  'North Lebanon': '+961 6',
  'South Lebanon': '+961 7',
  'Bekaa': '+961 8',
  'Nabatieh': '+961 7',
  'Akkar': '+961 6'
} as const;

export const LEBANESE_GOVERNORATES = [
  'Beirut',
  'Mount Lebanon', 
  'North Lebanon',
  'South Lebanon',
  'Bekaa',
  'Nabatieh',
  'Akkar'
] as const;

export type LebaneseGovernorate = typeof LEBANESE_GOVERNORATES[number];

// Format Lebanese phone number
export const formatLebanesePhone = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Handle different input formats
  if (digits.startsWith('961')) {
    // Already has country code
    const number = digits.slice(3);
    if (number.length === 8) {
      return `+961 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`;
    }
  } else if (digits.startsWith('0')) {
    // Local format starting with 0
    const number = digits.slice(1);
    if (number.length === 8) {
      return `+961 ${number.slice(0, 1)} ${number.slice(1, 4)} ${number.slice(4)}`;
    }
  } else if (digits.length === 8) {
    // Just the number
    return `+961 ${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`;
  }
  
  return phone; // Return original if can't format
};

// Validate Lebanese phone number
export const validateLebanesePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  
  // Lebanese mobile numbers start with 3, 7, or 8
  // Landline numbers start with 1, 4, 6, 7, or 8
  if (digits.startsWith('961')) {
    const number = digits.slice(3);
    return number.length === 8 && /^[134678]\d{7}$/.test(number);
  } else if (digits.startsWith('0')) {
    const number = digits.slice(1);
    return number.length === 8 && /^[134678]\d{7}$/.test(number);
  } else if (digits.length === 8) {
    return /^[134678]\d{7}$/.test(digits);
  }
  
  return false;
};

// Get area code for governorate
export const getAreaCodeForGovernorate = (governorate: LebaneseGovernorate): string => {
  return LEBANESE_AREA_CODES[governorate] || '+961';
};

// Format currency for Lebanon (USD/LBP)
export const formatCurrency = (amount: number, currency: 'USD' | 'LBP' = 'USD'): string => {
  if (currency === 'LBP') {
    return `${amount.toLocaleString('ar-LB')} ل.ل`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};
