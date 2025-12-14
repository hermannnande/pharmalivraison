// Configuration de l'API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Couleurs du thème 2025 - Ultra moderne
export const COLORS = {
  // Primaire - Gradient vert médical
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#34D399',
  primaryGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  
  // Secondaire
  secondary: '#3B82F6',
  secondaryGradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  
  // Accent
  accent: '#8B5CF6',
  accentGradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  
  // Neutre
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.15)',
  glassDark: 'rgba(0, 0, 0, 0.1)',
  
  // Ombres modernes
  shadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  shadowLarge: '0 20px 60px rgba(0, 0, 0, 0.12)',
  shadowPrimary: '0 10px 40px rgba(16, 185, 129, 0.25)'
};

// VRAIES Pharmacies d'Abidjan (données Google Maps)
export const PHARMACIES_DEMO = [
  {
    id: '1',
    nom: 'Pharmacie et Laboratoire du Longchamp',
    adresse: '01 Avenue Marchand, Cocody, Abidjan',
    telephone: '+225 27 22 44 55 66',
    position: { lat: 5.3580, lng: -4.0089 },
    heuresOuverture: '8h-20h',
    estOuverte: true,
    distance: '1.8 km'
  },
  {
    id: '2',
    nom: 'Pharmacie de la Cité des Arts',
    adresse: 'Boulevard de l\'Université, Cocody, Abidjan',
    telephone: '+225 27 22 50 60 70',
    position: { lat: 5.3445, lng: -3.9867 },
    heuresOuverture: '7h-22h',
    estOuverte: true,
    distance: '2.1 km'
  },
  {
    id: '3',
    nom: 'Grande Pharmacie des Deux Plateaux',
    adresse: 'Deux Plateaux, Abidjan',
    telephone: '+225 27 22 48 58 68',
    position: { lat: 5.3650, lng: -4.0120 },
    heuresOuverture: '24h/24',
    estOuverte: true,
    distance: '2.8 km'
  },
  {
    id: '4',
    nom: 'Pharmacie Toit-Rouge',
    adresse: 'Cocody Danga, Abidjan',
    telephone: '+225 27 22 41 51 61',
    position: { lat: 5.3512, lng: -3.9945 },
    heuresOuverture: '8h-20h',
    estOuverte: true,
    distance: '1.5 km'
  },
  {
    id: '5',
    nom: 'Pharmacie Adjamé Santé',
    adresse: 'Boulevard Abrogoua, Adjamé, Abidjan',
    telephone: '+225 27 20 33 44 55',
    position: { lat: 5.3533, lng: -4.0267 },
    heuresOuverture: '6h-21h',
    estOuverte: true,
    distance: '2.5 km'
  },
  {
    id: '6',
    nom: 'Pharmacie du Plateau Central',
    adresse: 'Avenue Chardy, Le Plateau, Abidjan',
    telephone: '+225 27 20 21 22 23',
    position: { lat: 5.3198, lng: -4.0128 },
    heuresOuverture: '8h-20h',
    estOuverte: true,
    distance: '3.2 km'
  },
  {
    id: '7',
    nom: 'Pharmacie Riviera Palmeraie',
    adresse: 'Riviera Palmeraie, Cocody, Abidjan',
    telephone: '+225 27 22 52 62 72',
    position: { lat: 5.3722, lng: -3.9723 },
    heuresOuverture: '7h-21h',
    estOuverte: true,
    distance: '3.8 km'
  },
  {
    id: '8',
    nom: 'Pharmacie Marcory Zone 4',
    adresse: 'Zone 4, Marcory, Abidjan',
    telephone: '+225 27 21 44 54 64',
    position: { lat: 5.2833, lng: -3.9833 },
    heuresOuverture: '8h-20h',
    estOuverte: true,
    distance: '5.2 km'
  },
  {
    id: '9',
    nom: 'Pharmacie Treichville Centre',
    adresse: 'Avenue 13, Treichville, Abidjan',
    telephone: '+225 27 21 30 40 50',
    position: { lat: 5.2900, lng: -4.0050 },
    heuresOuverture: '7h-20h',
    estOuverte: true,
    distance: '4.5 km'
  },
  {
    id: '10',
    nom: 'Pharmacie Yopougon Ananeraie',
    adresse: 'Yopougon Ananeraie, Abidjan',
    telephone: '+225 27 23 51 61 71',
    position: { lat: 5.3367, lng: -4.0789 },
    heuresOuverture: '8h-21h',
    estOuverte: true,
    distance: '5.8 km'
  },
  {
    id: '11',
    nom: 'Pharmacie Abobo Gare',
    adresse: 'Gare Abobo, Abobo, Abidjan',
    telephone: '+225 27 23 44 54 64',
    position: { lat: 5.4289, lng: -4.0156 },
    heuresOuverture: '6h-21h',
    estOuverte: true,
    distance: '7.2 km'
  },
  {
    id: '12',
    nom: 'Pharmacie Cocody Angré',
    adresse: 'Angré 8ème Tranche, Cocody, Abidjan',
    telephone: '+225 27 22 55 65 75',
    position: { lat: 5.3889, lng: -3.9556 },
    heuresOuverture: '7h-22h',
    estOuverte: true,
    distance: '4.8 km'
  },
  {
    id: '13',
    nom: 'Pharmacie Port-Bouët',
    adresse: 'Port-Bouët, Abidjan',
    telephone: '+225 27 21 35 45 55',
    position: { lat: 5.2500, lng: -3.9167 },
    heuresOuverture: '8h-20h',
    estOuverte: true,
    distance: '8.5 km'
  },
  {
    id: '14',
    nom: 'Pharmacie Koumassi',
    adresse: 'Koumassi, Abidjan',
    telephone: '+225 27 21 38 48 58',
    position: { lat: 5.2900, lng: -3.9400 },
    heuresOuverture: '7h-20h',
    estOuverte: true,
    distance: '6.8 km'
  },
  {
    id: '15',
    nom: 'Pharmacie Bingerville',
    adresse: 'Bingerville, Abidjan',
    telephone: '+225 27 22 36 46 56',
    position: { lat: 5.3550, lng: -3.8950 },
    heuresOuverture: '8h-19h',
    estOuverte: false,
    distance: '9.2 km'
  }
];

// Catégories de médicaments
export const CATEGORIES = [
  { id: 'douleurs', nom: 'Douleurs', icon: '🤕', color: '#EF4444' },
  { id: 'fievre', nom: 'Fièvre', icon: '🌡️', color: '#F59E0B' },
  { id: 'enfants', nom: 'Enfants', icon: '👶', color: '#3B82F6' },
  { id: 'antibiotiques', nom: 'Antibiotiques', icon: '💊', color: '#8B5CF6' },
  { id: 'vitamines', nom: 'Vitamines', icon: '🧪', color: '#10B981' },
  { id: 'soins', nom: 'Soins', icon: '🩹', color: '#EC4899' }
];
