export interface PGListing {
  id: string;
  name: string;
  area: string;
  city: string;
  price: number;
  type: 'boys' | 'girls' | 'unisex';
  amenities: string[];
  rating: number;
  verified: boolean;
  isNew: boolean;
  distance: string;
  contact: string;
  image?: string;
}

export interface TiffinService {
  id: string;
  name: string;
  area: string;
  city: string;
  pricePerDay: number;
  cuisines: string[];
  rating: number;
  verified: boolean;
  isNew: boolean;
  distance: string;
  contact: string;
  deliveryTime: string;
  image?: string;
}

export interface LocalService {
  id: string;
  name: string;
  area: string;
  city: string;
  category: 'maid' | 'plumber' | 'electrician' | 'carpenter' | 'internet';
  price: number;
  priceUnit: string;
  rating: number;
  verified: boolean;
  experience: string;
  distance: string;
  contact: string;
  image?: string;
}

export const pgListings: PGListing[] = [
  {
    id: 'pg1',
    name: 'Sharma PG',
    area: 'JP Nagar',
    city: 'Bangalore', // Tier 1
    price: 7000,
    type: 'boys',
    amenities: ['WiFi', 'AC', 'Food', 'Laundry'],
    rating: 4.5,
    verified: true,
    isNew: false,
    distance: '2.3 km',
    contact: '9876543210',
    image: 'https://images.unsplash.com/photo-1596276122653-651a3898309f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg2',
    name: 'Sunrise Girls Hostel',
    area: 'Andheri West',
    city: 'Mumbai', // Tier 1
    price: 15500,
    type: 'girls',
    amenities: ['WiFi', 'AC', 'Food', 'Security'],
    rating: 4.8,
    verified: true,
    isNew: true,
    distance: '1.5 km',
    contact: '9876543211',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg3',
    name: 'Happy Stay PG',
    area: 'Gomti Nagar',
    city: 'Lucknow', // Tier 2
    price: 5500,
    type: 'unisex',
    amenities: ['WiFi', 'Laundry', 'Parking'],
    rating: 4.2,
    verified: false,
    isNew: false,
    distance: '5.1 km',
    contact: '9876543212',
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg4',
    name: 'Royal Living PG',
    area: 'Vaishali Nagar',
    city: 'Jaipur', // Tier 2
    price: 8000,
    type: 'boys',
    amenities: ['WiFi', 'AC', 'Gym', 'Food'],
    rating: 4.6,
    verified: true,
    isNew: false,
    distance: '3.2 km',
    contact: '9876543213',
    image: 'https://images.unsplash.com/photo-1522771753035-4a50462e6958?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg5',
    name: 'Comfort Zone Hostel',
    area: 'Sector 62',
    city: 'Delhi NCR', // Tier 1
    price: 9000,
    type: 'girls',
    amenities: ['WiFi', 'AC', 'Food', 'Security', 'Gym'],
    rating: 4.9,
    verified: true,
    isNew: true,
    distance: '2.8 km',
    contact: '9876543214',
    image: 'https://images.unsplash.com/photo-1628592102751-ba83b0314276?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg6',
    name: 'Budget Stay PG',
    area: 'Sector 3',
    city: 'Udaipur', // Tier 3
    price: 4500,
    type: 'boys',
    amenities: ['WiFi', 'Laundry'],
    rating: 4.0,
    verified: false,
    isNew: false,
    distance: '4.5 km',
    contact: '9876543215',
    image: 'https://images.unsplash.com/photo-1633511089902-861c8a167096?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg7',
    name: 'Green View PG',
    area: 'College Road',
    city: 'Nashik', // Tier 3
    price: 5000,
    type: 'unisex',
    amenities: ['WiFi', 'Parking', 'Garden'],
    rating: 4.3,
    verified: true,
    isNew: false,
    distance: '8.2 km',
    contact: '9876543216',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg8',
    name: 'Metro Stay Hostel',
    area: 'MG Road',
    city: 'Bangalore',
    price: 11000,
    type: 'girls',
    amenities: ['WiFi', 'AC', 'Food', 'Security', 'Metro Access'],
    rating: 4.7,
    verified: true,
    isNew: true,
    distance: '1.2 km',
    contact: '9876543217',
    image: 'https://images.unsplash.com/photo-1596276122653-651a3898309f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg9',
    name: 'Nest PG for Boys',
    area: 'BTM Layout',
    city: 'Bangalore',
    price: 7500,
    type: 'boys',
    amenities: ['WiFi', 'AC', 'Food'],
    rating: 4.4,
    verified: true,
    isNew: false,
    distance: '3.8 km',
    contact: '9876543218',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pg10',
    name: 'Safe Haven Ladies PG',
    area: 'Jayanagar',
    city: 'Bangalore',
    price: 8000,
    type: 'girls',
    amenities: ['WiFi', 'AC', 'Food', 'Security'],
    rating: 4.6,
    verified: true,
    isNew: false,
    distance: '2.1 km',
    contact: '9876543219',
    image: 'https://images.unsplash.com/photo-1522771753035-4a50462e6958?q=80&w=800&auto=format&fit=crop'
  }
];

export const tiffinServices: TiffinService[] = [
  {
    id: 'tiffin1',
    name: 'Ghar Jaisa Khana',
    area: 'Marathahalli',
    city: 'Bangalore',
    pricePerDay: 90,
    cuisines: ['North Indian', 'Punjabi'],
    rating: 4.6,
    verified: true,
    isNew: false,
    distance: '1.8 km',
    contact: '9876543220',
    deliveryTime: '12:00 PM - 1:00 PM',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin2',
    name: 'Mumbai Dabba',
    area: 'HSR Layout',
    city: 'Bangalore',
    pricePerDay: 110,
    cuisines: ['Maharashtrian', 'Konkani'],
    rating: 4.8,
    verified: true,
    isNew: true,
    distance: '2.5 km',
    contact: '9876543221',
    deliveryTime: '12:30 PM - 1:30 PM',
    image: 'https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin3',
    name: 'Homely Meals',
    area: 'Indiranagar',
    city: 'Bangalore',
    pricePerDay: 85,
    cuisines: ['South Indian', 'North Indian'],
    rating: 4.4,
    verified: false,
    isNew: false,
    distance: '3.2 km',
    contact: '9876543222',
    deliveryTime: '12:00 PM - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin4',
    name: 'Andhra Ruchulu',
    area: 'Koramangala',
    city: 'Bangalore',
    pricePerDay: 100,
    cuisines: ['Andhra', 'Telangana'],
    rating: 4.7,
    verified: true,
    isNew: false,
    distance: '1.5 km',
    contact: '9876543223',
    deliveryTime: '12:00 PM - 1:30 PM',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin5',
    name: 'Gujarati Thali Service',
    area: 'JP Nagar',
    city: 'Bangalore',
    pricePerDay: 120,
    cuisines: ['Gujarati', 'Rajasthani'],
    rating: 4.9,
    verified: true,
    isNew: true,
    distance: '2.8 km',
    contact: '9876543224',
    deliveryTime: '12:00 PM - 1:00 PM',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin6',
    name: 'Bengali Kitchen',
    area: 'Whitefield',
    city: 'Bangalore',
    pricePerDay: 95,
    cuisines: ['Bengali'],
    rating: 4.5,
    verified: true,
    isNew: false,
    distance: '5.5 km',
    contact: '9876543225',
    deliveryTime: '1:00 PM - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1616174771696-2637a895b6d1?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin7',
    name: 'Healthy Bites',
    area: 'BTM Layout',
    city: 'Bangalore',
    pricePerDay: 130,
    cuisines: ['Multi-cuisine', 'Diet Food'],
    rating: 4.3,
    verified: false,
    isNew: true,
    distance: '4.0 km',
    contact: '9876543226',
    deliveryTime: '12:30 PM - 1:30 PM',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin8',
    name: 'Amma\'s Kitchen',
    area: 'Electronic City',
    city: 'Bangalore',
    pricePerDay: 75,
    cuisines: ['South Indian'],
    rating: 4.6,
    verified: true,
    isNew: false,
    distance: '7.2 km',
    contact: '9876543227',
    deliveryTime: '12:00 PM - 1:00 PM',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin9',
    name: 'Pure Veg Delights',
    area: 'Jayanagar',
    city: 'Bangalore',
    pricePerDay: 105,
    cuisines: ['North Indian', 'Jain'],
    rating: 4.7,
    verified: true,
    isNew: false,
    distance: '2.2 km',
    contact: '9876543228',
    deliveryTime: '12:00 PM - 1:30 PM',
    image: 'https://images.unsplash.com/photo-1543353071-087f9bcbd111?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'tiffin10',
    name: 'Spice Box',
    area: 'MG Road',
    city: 'Bangalore',
    pricePerDay: 140,
    cuisines: ['Multi-cuisine', 'Continental'],
    rating: 4.4,
    verified: false,
    isNew: true,
    distance: '1.0 km',
    contact: '9876543229',
    deliveryTime: '12:30 PM - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop'
  }
];

export const localServices: LocalService[] = [
  {
    id: 'local1',
    name: 'Radha Maid Service',
    area: 'Koramangala',
    city: 'Bangalore',
    category: 'maid',
    price: 3000,
    priceUnit: '/month',
    rating: 4.5,
    verified: true,
    experience: '5+ years',
    distance: '1.2 km',
    contact: '9876543230',
    image: 'https://images.unsplash.com/photo-1616860361139-36cd66099ae8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local2',
    name: 'Quick Fix Plumber',
    area: 'JP Nagar',
    city: 'Bangalore',
    category: 'plumber',
    price: 300,
    priceUnit: '/visit',
    rating: 4.6,
    verified: true,
    experience: '8+ years',
    distance: '2.5 km',
    contact: '9876543231',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc253e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local3',
    name: 'Expert Electrician',
    area: 'Whitefield',
    city: 'Bangalore',
    category: 'electrician',
    price: 250,
    priceUnit: '/visit',
    rating: 4.4,
    verified: false,
    experience: '6+ years',
    distance: '4.8 km',
    contact: '9876543232',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local4',
    name: 'Shanti House Help',
    area: 'HSR Layout',
    city: 'Bangalore',
    category: 'maid',
    price: 3500,
    priceUnit: '/month',
    rating: 4.8,
    verified: true,
    experience: '10+ years',
    distance: '3.1 km',
    contact: '9876543233',
    image: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local5',
    name: 'ACT Fibernet',
    area: 'Indiranagar',
    city: 'Bangalore',
    category: 'internet',
    price: 799,
    priceUnit: '/month',
    rating: 4.3,
    verified: true,
    experience: 'Since 2010',
    distance: '2.0 km',
    contact: '9876543234',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local6',
    name: 'Kumar Carpenter',
    area: 'BTM Layout',
    city: 'Bangalore',
    category: 'carpenter',
    price: 400,
    priceUnit: '/hour',
    rating: 4.7,
    verified: true,
    experience: '15+ years',
    distance: '3.5 km',
    contact: '9876543235',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local7',
    name: 'Lightning Electricals',
    area: 'Marathahalli',
    city: 'Bangalore',
    category: 'electrician',
    price: 350,
    priceUnit: '/visit',
    rating: 4.5,
    verified: true,
    experience: '7+ years',
    distance: '4.2 km',
    contact: '9876543236',
    image: 'https://images.unsplash.com/photo-1413882353314-73389f63b6fd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local8',
    name: 'Jio Fiber',
    area: 'Electronic City',
    city: 'Bangalore',
    category: 'internet',
    price: 699,
    priceUnit: '/month',
    rating: 4.2,
    verified: true,
    experience: 'Since 2019',
    distance: '7.0 km',
    contact: '9876543237',
    image: 'https://images.unsplash.com/photo-1558498421-4d37a803e655?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local9',
    name: 'Pipe Master Plumber',
    area: 'Jayanagar',
    city: 'Bangalore',
    category: 'plumber',
    price: 350,
    priceUnit: '/visit',
    rating: 4.6,
    verified: true,
    experience: '12+ years',
    distance: '2.3 km',
    contact: '9876543238',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'local10',
    name: 'Lakshmi Domestic Help',
    area: 'MG Road',
    city: 'Bangalore',
    category: 'maid',
    price: 4000,
    priceUnit: '/month',
    rating: 4.9,
    verified: true,
    experience: '8+ years',
    distance: '1.5 km',
    contact: '9876543239',
    image: 'https://images.unsplash.com/photo-1581577717646-3023ebc5457a?q=80&w=800&auto=format&fit=crop'
  }
];

export const areas = [
  'JP Nagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'Indiranagar',
  'Marathahalli',
  'Electronic City',
  'MG Road',
  'BTM Layout',
  'Jayanagar'
];
