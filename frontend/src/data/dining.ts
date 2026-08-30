import type { DiningVenue } from '../types';

export const diningVenues: DiningVenue[] = [
  {
    id: 'azure',
    name: 'Azure',
    cuisine: 'Modern European · Fine Dining',
    hours: 'Dinner · 6:30 pm – 11:00 pm',
    icon: 'fa-solid fa-utensils',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    description:
      'Our flagship restaurant pairs seasonal tasting menus with a 400-label cellar and floor-to-ceiling skyline views.',
  },
  {
    id: 'saffron',
    name: 'Saffron',
    cuisine: 'Indian & Pan-Asian',
    hours: 'Lunch & Dinner · 12:00 pm – 11:00 pm',
    icon: 'fa-solid fa-bowl-food',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description:
      'Char-grills, slow-cooked curries and hand-folded dim sum served in a warm, lantern-lit room.',
  },
  {
    id: 'the-terrace',
    name: 'The Terrace',
    cuisine: 'All-Day Dining · Buffet & À la carte',
    hours: 'Breakfast to Late · 6:00 am – midnight',
    icon: 'fa-solid fa-mug-hot',
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    description:
      'Generous international buffets and comfort classics served indoors or poolside under the stars.',
  },
  {
    id: 'lobby-bar',
    name: 'Grandeur Lobby Bar',
    cuisine: 'Cocktails & Small Plates',
    hours: 'Daily · 11:00 am – 1:00 am',
    icon: 'fa-solid fa-martini-glass',
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
    description:
      'Signature cocktails, rare spirits and a tapas menu, with live piano every evening from 8 pm.',
  },
  {
    id: 'in-room-dining',
    name: 'In-Room Dining',
    cuisine: '24-Hour Service',
    hours: 'Round the clock',
    icon: 'fa-solid fa-bell-concierge',
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
    description:
      'A full à la carte menu delivered to your door at any hour, plus curated late-night bites.',
  },
];
