export type FiscalRegime = 'ordinario_22' | 'forfettario_0' | 'reverse_charge';

export type PaymentSchedule = '40_30_30' | '50_50' | '30_40_30' | '100_anticipato';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  defaultHours: number;
  category: string;
  recommended?: boolean;
}

export interface ProjectPhase {
  id: string;
  phaseNumber: number;
  name: string;
  description: string;
  iconName: string;
  items: ProjectItem[];
}

export interface ActiveItem {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  hours: number;
  isCustom?: boolean;
}

export interface AgencyInfo {
  name: string;
  businessName: string;
  vatNumber: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  iban: string;
}

export interface ClientInfo {
  companyName: string;
  contactPerson: string;
  vatNumber: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  quoteNumber: string;
  quoteDate: string;
  validityDays: number;
  projectTitle: string;
  projectDescription: string;
}

export interface ProjectPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  clientTitle: string;
  selectedItemIds: string[];
  recommendedHourlyRate: number;
  estimatedWeeks: number;
}
