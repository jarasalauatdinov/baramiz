export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  city: string;
  region: string;
  category: string;
  durationMinutes: number;
  imageUrl: string;
  coordinates: Coordinates;
  featured: boolean;
}