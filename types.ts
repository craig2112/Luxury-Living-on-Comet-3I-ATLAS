
export interface Condo {
  id: number;
  name: string;
  priceTier: 'Modest' | 'Comfort' | 'Luxury' | 'Galaxy';
  description: string;
  imageUrl: string;
  hasGeneratedImage: boolean;
}

export interface City {
  name: string;
  lat: number;
  lng: number;
}

export interface MeatSuitDesign {
  baseModel: string;
  skin: string;
  eyes: string;
  hair: string;
}
