
import React from 'react';
import { Briefcase, MapPin, Star, ShieldCheck, Camera, Mic, Wallet } from 'lucide-react';
import { WorkPost } from './types';

export const MOCK_WORKERS = [
  {
    id: 'w1',
    name: 'Rajesh Kumar',
    specialty: 'Master Electrician',
    bio: '15 years of experience in residential and commercial wiring. Expert in smart home installations.',
    experience: '15+ Years',
    location: 'Indiranagar, Bangalore',
    rating: 4.8,
    completedJobs: 124,
    trustScore: 95,
    skills: ['Wiring', 'Smart Home', 'Fault Finding', 'Industrial Panels'],
    avatar: 'https://picsum.photos/seed/rajesh/200/200',
    images: ['https://picsum.photos/seed/work1/400/300', 'https://picsum.photos/seed/work2/400/300']
  },
  {
    id: 'w2',
    name: 'Sunita Sharma',
    specialty: 'Beautician & Bridal Makeup',
    bio: 'Certified beautician specializing in bridal makeup and skin therapy. I bring the salon to your doorstep.',
    experience: '8 Years',
    location: 'Koramangala, Bangalore',
    rating: 4.9,
    completedJobs: 310,
    trustScore: 98,
    skills: ['Bridal Makeup', 'Facials', 'Hair Styling', 'Henna'],
    avatar: 'https://picsum.photos/seed/sunita/200/200',
    images: ['https://picsum.photos/seed/work3/400/300', 'https://picsum.photos/seed/work4/400/300']
  },
  {
    id: 'w3',
    name: 'Amit Singh',
    specialty: 'Professional Plumber',
    bio: 'Expert in fixing leakages, new piping systems, and bathroom renovations. Quick response time.',
    experience: '10 Years',
    location: 'Whitefield, Bangalore',
    rating: 4.7,
    completedJobs: 89,
    trustScore: 92,
    skills: ['Pipe Fitting', 'Bathroom Decor', 'Water Heaters', 'Emergency Fixes'],
    avatar: 'https://picsum.photos/seed/amit/200/200',
    images: ['https://picsum.photos/seed/work5/400/300', 'https://picsum.photos/seed/work6/400/300']
  }
];

export const MOCK_POSTS: WorkPost[] = [
  {
    id: 'p1',
    workerId: 'w1',
    workerName: 'Rajesh Kumar',
    workerAvatar: 'https://picsum.photos/seed/rajesh/200/200',
    workerSpecialty: 'Electrician',
    image: 'https://picsum.photos/seed/electric1/800/600',
    caption: 'Completed a full smart home panel upgrade today in Indiranagar. Everything synced and running smooth! ⚡',
    timestamp: '2h ago',
    likes: 24,
    aiVerified: true
  },
  {
    id: 'p2',
    workerId: 'w2',
    workerName: 'Sunita Sharma',
    workerAvatar: 'https://picsum.photos/seed/sunita/200/200',
    workerSpecialty: 'Beautician',
    image: 'https://picsum.photos/seed/beauty1/800/600',
    caption: 'Bridal glow-up for a beautiful client this morning. Used long-lasting HD products for the summer heat. ✨',
    timestamp: '5h ago',
    likes: 42,
    aiVerified: true
  },
  {
    id: 'p3',
    workerId: 'w3',
    workerName: 'Amit Singh',
    workerAvatar: 'https://picsum.photos/seed/amit/200/200',
    workerSpecialty: 'Plumber',
    image: 'https://picsum.photos/seed/plumb1/800/600',
    caption: 'Fixed a complex leak behind a marble wall. Zero damage to the tiles, customer is happy! 🛠️',
    timestamp: '1d ago',
    likes: 18,
    aiVerified: false
  }
];

export const CATEGORIES = [
  { name: 'Electrical', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Beauty', icon: <Star className="w-5 h-5" /> },
  { name: 'Plumbing', icon: <MapPin className="w-5 h-5" /> },
  { name: 'Cleaning', icon: <ShieldCheck className="w-5 h-5" /> },
  { name: 'Carpentry', icon: <Briefcase className="w-5 h-5" /> },
];
