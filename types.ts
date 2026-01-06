
export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  MARKETPLACE = 'MARKETPLACE',
  PROFILE_CREATOR = 'PROFILE_CREATOR',
  WORKER_DETAIL = 'WORKER_DETAIL',
  MY_GIGS = 'MY_GIGS',
  SHOWCASE = 'SHOWCASE',
  LOGIN = 'LOGIN',
  PROFILE = 'PROFILE',
  FIND_NEARBY = 'FIND_NEARBY',
  FIND_WORK = 'FIND_WORK',
  POST_GIG = 'POST_GIG'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'WORKER' | 'CUSTOMER';
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: number;
}

export interface WorkerProfile {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  experience: string;
  location: string;
  rating: number;
  completedJobs: number;
  trustScore: number;
  skills: string[];
  avatar: string;
  images: string[];
}

export interface WorkPost {
  id: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  workerSpecialty: string;
  image: string;
  caption: string;
  timestamp: string;
  likes: number;
  aiVerified: boolean;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: string;
  category: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Open';
  type: 'Applied' | 'Posted';
  date: string;
}

export interface Review {
  id: string;
  author: string;
  comment: string;
  rating: number;
  date: string;
}
