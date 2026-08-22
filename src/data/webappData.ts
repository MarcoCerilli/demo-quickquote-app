export interface PresetModule {
  id: string;
  category: string;
  name: string;
  description: string;
  baseHours: number;
  iconName: string;
}

export const PRESET_MODULES: PresetModule[] = [
  {
    id: 'ui-design',
    category: 'Design & UX',
    name: 'Design System & Prototipazione Figma',
    description: 'Studio wireframe, palette cromatica, tipografia e prototipo cliccabile per desktop e mobile',
    baseHours: 20,
    iconName: 'Palette'
  },
  {
    id: 'frontend-core',
    category: 'Sviluppo Frontend',
    name: 'Sviluppo Next.js 15 / Astro 5 Reattivo',
    description: 'Componenti modulari, animazioni fluide, 100/100 Core Web Vitals e accessibilità',
    baseHours: 35,
    iconName: 'Code'
  },
  {
    id: 'realestate-filter',
    category: 'Funzionalità Speciali',
    name: 'Motore di Ricerca & Filtri Multi-Parametro',
    description: 'Filtro in tempo reale con mappa geolocalizzata, slider budget e ordinamenti dinamici',
    baseHours: 24,
    iconName: 'Search'
  },
  {
    id: 'ecommerce-engine',
    category: 'E-Commerce',
    name: 'Carrello Interattivo, Coupon & Checkout',
    description: 'Gestione varianti, calcolo spedizioni, sconti automatici e integrazione Stripe / PayPal',
    baseHours: 30,
    iconName: 'ShoppingBag'
  },
  {
    id: 'booking-sys',
    category: 'Booking & Prenotazioni',
    name: 'Motore di Prenotazione Tavoli / Camere Hotel',
    description: 'Selezione date, disponibilità in tempo reale, promemoria WhatsApp e riepilogo automatico',
    baseHours: 25,
    iconName: 'Calendar'
  },
  {
    id: 'lead-multi-step',
    category: 'Marketing & Lead Gen',
    name: 'Funnel di Qualificazione Lead Multi-Step',
    description: 'Wizard interattivo con validazione istantanea, invio webhook a CRM e tracking Pixel',
    baseHours: 16,
    iconName: 'Zap'
  },
  {
    id: 'calculator-tool',
    category: 'Tool & Calcolatori',
    name: 'Simulatore Preventivi & Calcolo Mutuo / Finanziamento',
    description: 'Calcolo TAN, piano di ammortamento e generazione riepilogo per il cliente finale',
    baseHours: 18,
    iconName: 'Calculator'
  },
  {
    id: 'seo-analytics',
    category: 'SEO & Performance',
    name: 'Setup Tecnico SEO, Schema Markup & GA4',
    description: 'Dati strutturati Schema.org (RealEstateAgent, Restaurant, Product), sitemap dinamica e tracciamento',
    baseHours: 12,
    iconName: 'TrendingUp'
  }
];
