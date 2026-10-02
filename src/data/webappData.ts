import { ProjectPhase, ProjectPreset, AgencyInfo, ClientInfo } from '../types';

export const DEFAULT_AGENCY: AgencyInfo = {
  name: 'Cerilli Studio Digitale',
  businessName: 'Cerilli Studio Digitale & Software Engineering S.r.l.',
  vatNumber: 'IT 09876540582',
  address: 'Via dell’Innovazione Tecnologica 14',
  city: '00144 Roma (RM)',
  email: 'progetti@cerillistudio.it',
  phone: '+39 06 8765 4321',
  website: 'www.cerillistudio.it',
  iban: 'IT60 X054 2811 1010 0000 0123 456'
};

export const DEFAULT_CLIENT: ClientInfo = {
  companyName: 'Tornesi & Partners Real Estate S.r.l.',
  contactPerson: 'Dott. Alessandro Tornesi',
  vatNumber: 'IT 04561230589',
  address: 'Corso Vittorio Emanuele II, 88',
  city: '00186 Roma (RM)',
  email: 'direzione@tornesipartners.it',
  phone: '+39 06 4532 9811',
  quoteNumber: 'PREV-2026-042',
  quoteDate: new Date().toISOString().split('T')[0],
  validityDays: 30,
  projectTitle: 'Piattaforma Web Immobiliare con Ricerca Parametrica, Schede Luxury e Calcolatore Mutui',
  projectDescription: 'Sviluppo completo dell’infrastruttura digitale con portale annunci responsive, ricerca avanzata multi-criterio, integrazione schede immobili ad alta risoluzione e calcolatore finanziario per la clientela.'
};

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    id: 'phase-discovery',
    phaseNumber: 1,
    name: 'Discovery, UX/UI Design & Prototipazione',
    description: 'Analisi dei requisiti, wireframing, progettazione visuale dell’interfaccia e prototipo interattivo cliccabile.',
    iconName: 'Compass',
    items: [
      {
        id: 'item-brief-architecture',
        title: 'Analisi Requisiti & Architettura Informativa (IA)',
        description: 'Interviste di allineamento, stesura mappa del sito, definizione user journey e albero di navigazione.',
        defaultHours: 12,
        category: 'Strategia & UX',
        recommended: true
      },
      {
        id: 'item-wireframe-figma',
        title: 'Prototipazione Wireframe & User Flow (Figma)',
        description: 'Strutturazione scheletro funzionale di tutte le schermate chiave desktop e mobile per validare i flussi.',
        defaultHours: 20,
        category: 'UX Design',
        recommended: true
      },
      {
        id: 'item-ui-design-system',
        title: 'Design System & Mockup Visuale Alta Fedeltà',
        description: 'Creazione palette cromatica, tipografia, libreria componenti, layout rifiniti e prototipo interattivo.',
        defaultHours: 28,
        category: 'UI Design',
        recommended: true
      }
    ]
  },
  {
    id: 'phase-frontend',
    phaseNumber: 2,
    name: 'Sviluppo Frontend & Esperienza Utente',
    description: 'Realizzazione delle interfacce con stack moderno (React / Next.js), design responsive e massima fluidità.',
    iconName: 'Layout',
    items: [
      {
        id: 'item-fe-core-setup',
        title: 'Setup Architettura Frontend & Componentistica Reattiva',
        description: 'Inizializzazione boilerplate modulare, configurazione routing, gestione state management e design tokens.',
        defaultHours: 24,
        category: 'Frontend Engineering',
        recommended: true
      },
      {
        id: 'item-fe-responsive-views',
        title: 'Sviluppo Viste Responsive (Desktop, Tablet, Mobile)',
        description: 'Adattamento pixel-perfect di tutte le viste per ogni risoluzione con standard di usabilità touch.',
        defaultHours: 32,
        category: 'Frontend Engineering',
        recommended: true
      },
      {
        id: 'item-fe-search-filters',
        title: 'Motore di Ricerca Parametrico & Filtri Dinamici',
        description: 'Filtri istantanei (range prezzi, categorie, disponibilità, ordinamento) senza ricaricamento pagina.',
        defaultHours: 22,
        category: 'Logica Client-Side'
      },
      {
        id: 'item-fe-interactive-tools',
        title: 'Tool Interattivi & Calcolatori Finanziari',
        description: 'Algoritmo di simulazione preventivo / calcolo mutuo con slider dinamici e output in tempo reale.',
        defaultHours: 16,
        category: 'Logica Client-Side'
      },
      {
        id: 'item-fe-performance-a11y',
        title: 'Ottimizzazione Core Web Vitals & Accessibilità (a11y)',
        description: 'Audit Lighthouse > 90/100, lazy-loading immagini, code-splitting e navigazione da tastiera.',
        defaultHours: 14,
        category: 'Performance'
      }
    ]
  },
  {
    id: 'phase-backend',
    phaseNumber: 3,
    name: 'Backend, API & Architettura Dati',
    description: 'Modellazione del database, logica di business su server sicuro e sviluppo delle API.',
    iconName: 'Server',
    items: [
      {
        id: 'item-be-database-modeling',
        title: 'Progettazione Database Relazionale & Migrazioni',
        description: 'Schema PostgreSQL / MySQL con indici ottimizzati, vincoli di integrità e backup periodici.',
        defaultHours: 18,
        category: 'Database Architecture',
        recommended: true
      },
      {
        id: 'item-be-rest-api',
        title: 'Sviluppo API RESTful & Endpoint Dati Sicuri',
        description: 'Creazione controller, middleware di validazione, gestione rate-limiting e serializzazione risposte.',
        defaultHours: 26,
        category: 'Backend Engineering',
        recommended: true
      },
      {
        id: 'item-be-auth-rbac',
        title: 'Sistema di Autenticazione & Gestione Ruoli (RBAC)',
        description: 'Login sicuro (JWT / Session), recupero password, verifica email e permessi differenziati (Admin / Utente).',
        defaultHours: 20,
        category: 'Security & Auth'
      },
      {
        id: 'item-be-cms-integration',
        title: 'Pannello di Amministrazione / Integrazione Headless CMS',
        description: 'Interfaccia intuitiva per il cliente per gestire contenuti, articoli, schede prodotto e lead in autonomia.',
        defaultHours: 22,
        category: 'Content Management'
      }
    ]
  },
  {
    id: 'phase-integrations',
    phaseNumber: 4,
    name: 'Integrazioni di Terze Parti & Servizi Esterni',
    description: 'Connessione con gateway di pagamento, CRM, piattaforme di invio email e strumenti terzi.',
    iconName: 'Puzzle',
    items: [
      {
        id: 'item-int-payment-gateway',
        title: 'Integrazione Gateway Pagamenti (Stripe / PayPal)',
        description: 'Checkout sicuro conforme SCA / 3D Secure, gestione webhook per conferma transazioni e rimborsi.',
        defaultHours: 20,
        category: 'Fintech & E-Commerce'
      },
      {
        id: 'item-int-crm-marketing',
        title: 'Sincronizzazione Webhook con CRM Aziendale',
        description: 'Inoltro automatico dei contatti a HubSpot, Salesforce o ActiveCampaign con tracciamento sorgente.',
        defaultHours: 14,
        category: 'Marketing Automation'
      },
      {
        id: 'item-int-email-sms',
        title: 'Notifiche Transazionali (Email con template HTML & SMS)',
        description: 'Setup provider affidabile (Resend / SendGrid / Twilio) con template personalizzati e monitoraggio deliverability.',
        defaultHours: 12,
        category: 'Comunicazione'
      }
    ]
  },
  {
    id: 'phase-qa-compliance',
    phaseNumber: 5,
    name: 'Collaudo, Sicurezza & Conformità Legale',
    description: 'Sessioni rigorose di Quality Assurance, hardening di sicurezza e adempimenti normativi.',
    iconName: 'ShieldCheck',
    items: [
      {
        id: 'item-qa-functional-testing',
        title: 'Quality Assurance & Test Cross-Browser / Multi-Device',
        description: 'Verifica sistematica di tutti i flussi, test form, compatibilità Safari/Chrome/Firefox e dispositivi iOS/Android.',
        defaultHours: 16,
        category: 'Quality Assurance',
        recommended: true
      },
      {
        id: 'item-qa-security-hardening',
        title: 'Verifica Sicurezza, Sanificazione Input & Protezione CSRF',
        description: 'Prevenzione vulnerabilità comuni (OWASP Top 10), configurazione intestazioni HTTP di sicurezza e SSL HSTS.',
        defaultHours: 12,
        category: 'Cybersecurity'
      },
      {
        id: 'item-qa-gdpr-cookie',
        title: 'Conformità Privacy GDPR, Cookie Banner & Registro Consensi',
        description: 'Integrazione banner Iubenda / Cookiebot con blocco preventivo script prima del consenso informato.',
        defaultHours: 10,
        category: 'Legal Tech',
        recommended: true
      }
    ]
  },
  {
    id: 'phase-deployment',
    phaseNumber: 6,
    name: 'Rilascio, Deployment Cloud & Avviamento',
    description: 'Messa online su infrastruttura scalabile, formazione al cliente e periodo di garanzia post-lancio.',
    iconName: 'Rocket',
    items: [
      {
        id: 'item-dep-cloud-cicd',
        title: 'Setup Hosting Cloud, Pipeline CI/CD & Configurazione DNS',
        description: 'Deploy automatizzato su infrastruttura Vercel / AWS / Cloudflare con certificati SSL e monitoraggio uptime.',
        defaultHours: 12,
        category: 'DevOps & Cloud',
        recommended: true
      },
      {
        id: 'item-dep-training-docs',
        title: 'Sessione di Formazione al Personale & Documentazione d’Uso',
        description: 'Video-guida operativa registrata e incontro di formazione da remoto (2 ore) per la gestione ordinaria.',
        defaultHours: 8,
        category: 'Handover & Training',
        recommended: true
      },
      {
        id: 'item-dep-warranty',
        title: '60 Giorni di Garanzia di Collaudo & Assistenza Correttiva',
        description: 'Risoluzione tempestiva di eventuali anomalie o bug riscontrati senza costi aggiuntivi dopo la pubblicazione.',
        defaultHours: 16,
        category: 'SLA & Garanzia',
        recommended: true
      }
    ]
  }
];

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: 'preset-realestate',
    name: 'Portale Immobiliare & Calcolo Mutui',
    subtitle: 'Ricerca avanzata, schede immobile luxury, simulatore mutui e lead capture',
    description: 'Ideale per agenzie immobiliari strutturate e gruppi di intermediazione che richiedono filtri avanzati, visualizzazione planimetrie e lead generation mirata.',
    clientTitle: 'Piattaforma Web Immobiliare con Ricerca Parametrica, Schede Luxury e Calcolatore Mutui',
    selectedItemIds: [
      'item-brief-architecture',
      'item-wireframe-figma',
      'item-ui-design-system',
      'item-fe-core-setup',
      'item-fe-responsive-views',
      'item-fe-search-filters',
      'item-fe-interactive-tools',
      'item-fe-performance-a11y',
      'item-be-database-modeling',
      'item-be-rest-api',
      'item-be-cms-integration',
      'item-int-crm-marketing',
      'item-int-email-sms',
      'item-qa-functional-testing',
      'item-qa-gdpr-cookie',
      'item-dep-cloud-cicd',
      'item-dep-training-docs',
      'item-dep-warranty'
    ],
    recommendedHourlyRate: 70,
    estimatedWeeks: 6
  },
  {
    id: 'preset-corporate',
    name: 'Sito Web Corporate B2B & Lead Gen',
    subtitle: 'Presenza istituzionale d’alto profilo, catalogo servizi e funnel qualificazione contatti',
    description: 'Soluzione per aziende B2B, studi professionali e PMI che desiderano una comunicazione d’impatto, alta velocità e lead generation profilata.',
    clientTitle: 'Sito Web Corporate B2B con Presentazione Servizi e Funnel di Qualificazione Contatti',
    selectedItemIds: [
      'item-brief-architecture',
      'item-wireframe-figma',
      'item-ui-design-system',
      'item-fe-core-setup',
      'item-fe-responsive-views',
      'item-fe-performance-a11y',
      'item-be-cms-integration',
      'item-int-crm-marketing',
      'item-qa-functional-testing',
      'item-qa-gdpr-cookie',
      'item-dep-cloud-cicd',
      'item-dep-training-docs',
      'item-dep-warranty'
    ],
    recommendedHourlyRate: 65,
    estimatedWeeks: 4
  },
  {
    id: 'preset-ecommerce',
    name: 'Piattaforma E-Commerce B2C / B2B',
    subtitle: 'Catalogo prodotti, carrello dinamico, pagamenti Stripe e integrazione gestionale',
    description: 'E-commerce ad alte prestazioni orientato alla conversione, con checkout sicuro conforme 3D Secure e sincronizzazione magazzino/ordini.',
    clientTitle: 'Piattaforma E-Commerce ad Alte Prestazioni con Checkout Stripe e Gestione Magazzino',
    selectedItemIds: [
      'item-brief-architecture',
      'item-wireframe-figma',
      'item-ui-design-system',
      'item-fe-core-setup',
      'item-fe-responsive-views',
      'item-fe-search-filters',
      'item-fe-performance-a11y',
      'item-be-database-modeling',
      'item-be-rest-api',
      'item-be-auth-rbac',
      'item-be-cms-integration',
      'item-int-payment-gateway',
      'item-int-email-sms',
      'item-qa-functional-testing',
      'item-qa-security-hardening',
      'item-qa-gdpr-cookie',
      'item-dep-cloud-cicd',
      'item-dep-training-docs',
      'item-dep-warranty'
    ],
    recommendedHourlyRate: 75,
    estimatedWeeks: 7
  },
  {
    id: 'preset-saas',
    name: 'Web Application SaaS & Portale Riservato',
    subtitle: 'Dashboard analitica, gestione utenti multi-ruolo, API scalabili e fatturazione ricorrente',
    description: 'Applicazione web complessa su misura con logica di business avanzata, area riservata clienti e flussi di onboarding personalizzati.',
    clientTitle: 'Applicazione Web SaaS con Dashboard Interattiva, Area Riservata e Abbonamenti Ricorrenti',
    selectedItemIds: [
      'item-brief-architecture',
      'item-wireframe-figma',
      'item-ui-design-system',
      'item-fe-core-setup',
      'item-fe-responsive-views',
      'item-fe-interactive-tools',
      'item-fe-performance-a11y',
      'item-be-database-modeling',
      'item-be-rest-api',
      'item-be-auth-rbac',
      'item-int-payment-gateway',
      'item-int-crm-marketing',
      'item-int-email-sms',
      'item-qa-functional-testing',
      'item-qa-security-hardening',
      'item-qa-gdpr-cookie',
      'item-dep-cloud-cicd',
      'item-dep-training-docs',
      'item-dep-warranty'
    ],
    recommendedHourlyRate: 80,
    estimatedWeeks: 8
  }
];
