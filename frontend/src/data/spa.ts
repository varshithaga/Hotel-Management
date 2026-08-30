import type { SpaTreatment } from '../types';

export const spaTreatments: SpaTreatment[] = [
  {
    id: 'signature-massage',
    name: 'Grandeur Signature Massage',
    duration: '80 min',
    price: 160,
    icon: 'fa-solid fa-spa',
    description:
      'A full-body deep-tissue ritual with warm aromatic oils, tailored pressure and a scalp massage to finish.',
  },
  {
    id: 'hot-stone',
    name: 'Hot Stone Therapy',
    duration: '90 min',
    price: 185,
    icon: 'fa-solid fa-fire',
    description:
      'Smooth heated basalt stones and slow, flowing strokes release the deepest muscular tension.',
  },
  {
    id: 'radiance-facial',
    name: 'Radiance Facial',
    duration: '60 min',
    price: 140,
    icon: 'fa-solid fa-face-smile',
    description:
      'A brightening treatment built around your skin type, using marine-collagen serums and a lifting massage.',
  },
  {
    id: 'couples-retreat',
    name: 'Couples Retreat',
    duration: '120 min',
    price: 320,
    icon: 'fa-solid fa-heart',
    description:
      'Side-by-side massages in a private suite, finished with champagne, pralines and a rain shower.',
  },
  {
    id: 'ayurvedic-abhyanga',
    name: 'Ayurvedic Abhyanga',
    duration: '75 min',
    price: 150,
    icon: 'fa-solid fa-leaf',
    description:
      'A traditional warm herbal-oil massage designed to calm the nervous system and restore balance.',
  },
  {
    id: 'moroccan-hammam',
    name: 'Moroccan Hammam',
    duration: '70 min',
    price: 130,
    icon: 'fa-solid fa-droplet',
    description:
      'Steam, black-soap cleanse and a full-body exfoliation that leaves skin polished and glowing.',
  },
];

export const spaFacilities: string[] = [
  'Thermal suite with sauna, steam room & ice fountain',
  'Indoor vitality pool and cold plunge',
  'Private relaxation lounges with herbal teas',
  'Dedicated couples treatment suites',
  'Salon for hair, nails and grooming',
  'Open daily, 8:00 am – 10:00 pm',
];
