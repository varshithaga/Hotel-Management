export interface Room {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  shortDescription?: string;
  guests: number;
  size?: number;
  bed?: string;
  roomType?: string;
  soldOut?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

export interface Amenity {
  id: string;
  icon: string;
  title: string;
  text: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  label: string;
  size?: 'wide' | 'tall' | 'wide-tall';
}
