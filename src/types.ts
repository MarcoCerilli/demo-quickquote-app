export type DemoType = 
  | 'hub'
  | 'realestate' 
  | 'ecommerce' 
  | 'landing' 
  | 'webapp' 
  | 'restaurant' 
  | 'hotel';

export type DeviceMode = 'responsive' | 'desktop' | 'tablet' | 'mobile';

// Real Estate Types (Tornesi & Luxury style)
export type PropertyContract = 'vendita' | 'affitto';

export type PropertyType = 
  | 'villa' 
  | 'attico' 
  | 'appartamento' 
  | 'rustico' 
  | 'loft' 
  | 'dimora-storica'
  | 'commerciale';

export type EnergyClass = 'A4' | 'A3' | 'A2' | 'A1' | 'A+' | 'B' | 'C' | 'D' | 'E';

export interface Property {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  city: string;
  address: string;
  contract: PropertyContract;
  type: PropertyType;
  price: number; // in EUR (or monthly for rent)
  sqm: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  totalFloors?: number;
  energyClass: EnergyClass;
  yearBuilt?: number;
  condition: 'Nuova Costruzione' | 'Ristrutturato' | 'Ottimo Stato' | 'Da Ristrutturare';
  heating: 'Autonomo a pavimento' | 'Centralizzato con contabilizzatore' | 'Pompa di calore / Geotermico';
  featured: boolean;
  badge?: string;
  images: string[];
  description: string;
  features: string[]; // e.g. 'Piscina Privata', 'Terrazzo Panoramico', 'Garage Doppio', 'Vista Mare'
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% relative for interactive map canvas
    mapY: number;
  };
  agent: {
    name: string;
    role: string;
    phone: string;
    whatsapp: string;
    email: string;
    avatar: string;
  };
  planimetryUrl?: string;
  virtualTourAvailable?: boolean;
}

export interface PropertyFilters {
  searchQuery: string;
  contract: 'tutti' | PropertyContract;
  type: 'tutti' | PropertyType;
  city: string;
  priceMin: number;
  priceMax: number;
  roomsMin: number;
  bathroomsMin: number;
  sqmMin: number;
  sqmMax: number;
  energyClass: string;
  features: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'sqm-desc' | 'recent';
}

export interface LeadSubmission {
  propertyId?: string;
  propertyTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  visitDate?: string;
  visitTime?: string;
  visitType?: 'in-persona' | 'virtual-tour';
  message: string;
  dateSubmitted: string;
}

// E-Commerce Types
export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  category: 'caffe' | 'macchine' | 'accessori' | 'gift-box';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  origin?: string;
  roastLevel?: 'Chiara' | 'Media' | 'Intensa';
  notes: string[];
  inStock: boolean;
  stockLeft?: number;
  isBestSeller?: boolean;
  options?: {
    label: string;
    values: string[];
  };
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedOption?: string;
}

// Landing Page Lead Gen Types
export interface LeadFormState {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  monthlyRevenue: string;
  serviceInterest: string[];
  urgency: 'subito' | '1-3-mesi' | 'valutazione';
  notes?: string;
}

// Web App QuickQuote Types
export interface QuoteItem {
  id: string;
  name: string;
  category: string;
  hours: number;
  hourlyRate: number;
  complexityMultiplier: number;
}

// Restaurant Types
export interface MenuItem {
  id: string;
  category: 'antipasti' | 'primi' | 'secondi' | 'degustazione' | 'dolci' | 'vini';
  title: string;
  description: string;
  price: number;
  image: string;
  tags: ('Vegano' | 'Vegetariano' | 'Senza Glutine' | 'Specialità Chef' | 'DOP/IGP' | 'Bio')[];
  pairing?: string;
  isChefRecommendation?: boolean;
}

export interface TableBooking {
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seatingArea: 'sala-interna' | 'giardino-inverno' | 'chefs-table';
  notes?: string;
  status: 'confermato' | 'in-attesa';
  bookingCode: string;
}

// Hotel Types
export interface HotelRoom {
  id: string;
  name: string;
  type: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  sizeSqm: number;
  bedType: string;
  image: string;
  gallery: string[];
  amenities: string[];
  breakfastIncluded: boolean;
  cancellationPolicy: string;
}

export interface HotelBookingQuote {
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  selectedAddons: string[];
  totalPrice: number;
}
