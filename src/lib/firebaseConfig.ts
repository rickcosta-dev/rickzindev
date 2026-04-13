import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { browser } from '$app/environment';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = browser ? getAnalytics(app) : null;

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech: string[] | null;
  image_url: string | null;
  album: { url: string; type: 'image' | 'video' }[] | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean | null;
  featured_order: number | null;
  created_at: any;
  updated_at?: any;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  linkedin_url: string | null;
  approved: boolean | null;
  created_at: any;
  updated_at?: any;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: any;
}
