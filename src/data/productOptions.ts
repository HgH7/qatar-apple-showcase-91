// Product property options based on category
export interface ProductOptions {
  colors?: { value: string; label: { en: string; ar: string } }[];
  storage?: { value: string; label: { en: string; ar: string } }[];
  sizes?: { value: string; label: { en: string; ar: string } }[];
}

export const getProductOptions = (category: string): ProductOptions => {
  switch (category) {
    case 'phones':
      return {
        colors: [
          { value: 'black', label: { en: 'Black', ar: 'أسود' } },
          { value: 'white', label: { en: 'White', ar: 'أبيض' } },
          { value: 'blue', label: { en: 'Blue', ar: 'أزرق' } },
          { value: 'natural', label: { en: 'Natural Titanium', ar: 'تيتانيوم طبيعي' } },
        ],
        storage: [
          { value: '128GB', label: { en: '128GB', ar: '128 جيجابايت' } },
          { value: '256GB', label: { en: '256GB', ar: '256 جيجابايت' } },
          { value: '512GB', label: { en: '512GB', ar: '512 جيجابايت' } },
          { value: '1TB', label: { en: '1TB', ar: '1 تيرابايت' } },
        ],
      };
    case 'laptops':
      return {
        colors: [
          { value: 'silver', label: { en: 'Silver', ar: 'فضي' } },
          { value: 'space-gray', label: { en: 'Space Gray', ar: 'رمادي فلكي' } },
          { value: 'midnight', label: { en: 'Midnight', ar: 'منتصف الليل' } },
        ],
        storage: [
          { value: '256GB', label: { en: '256GB SSD', ar: '256 جيجابايت SSD' } },
          { value: '512GB', label: { en: '512GB SSD', ar: '512 جيجابايت SSD' } },
          { value: '1TB', label: { en: '1TB SSD', ar: '1 تيرابايت SSD' } },
          { value: '2TB', label: { en: '2TB SSD', ar: '2 تيرابايت SSD' } },
        ],
      };
    case 'tablets':
      return {
        colors: [
          { value: 'silver', label: { en: 'Silver', ar: 'فضي' } },
          { value: 'space-gray', label: { en: 'Space Gray', ar: 'رمادي فلكي' } },
        ],
        storage: [
          { value: '128GB', label: { en: '128GB', ar: '128 جيجابايت' } },
          { value: '256GB', label: { en: '256GB', ar: '256 جيجابايت' } },
          { value: '512GB', label: { en: '512GB', ar: '512 جيجابايت' } },
          { value: '1TB', label: { en: '1TB', ar: '1 تيرابايت' } },
        ],
      };
    case 'watches':
      return {
        colors: [
          { value: 'natural', label: { en: 'Natural Titanium', ar: 'تيتانيوم طبيعي' } },
          { value: 'black', label: { en: 'Black Titanium', ar: 'تيتانيوم أسود' } },
        ],
        sizes: [
          { value: '41mm', label: { en: '41mm', ar: '41 مم' } },
          { value: '45mm', label: { en: '45mm', ar: '45 مم' } },
          { value: '49mm', label: { en: '49mm', ar: '49 مم' } },
        ],
      };
    case 'headphones':
      return {
        colors: [
          { value: 'white', label: { en: 'White', ar: 'أبيض' } },
          { value: 'black', label: { en: 'Black', ar: 'أسود' } },
          { value: 'silver', label: { en: 'Silver', ar: 'فضي' } },
          { value: 'space-gray', label: { en: 'Space Gray', ar: 'رمادي فلكي' } },
        ],
      };
    default:
      return {};
  }
};
