// Firebase Configuration for SkillBridge
// This file configures Firebase for real-time features

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// Firebase configuration - Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection references
export const gigsCollection = collection(db, 'gigs');
export const usersCollection = collection(db, 'users');
export const professionalsCollection = collection(db, 'professionals');

// Types
export interface Gig {
    id?: string;
    title: string;
    description: string;
    category: string;
    budget: string;
    location: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    status: 'open' | 'accepted' | 'in_progress' | 'completed';
    acceptedBy?: string;
    acceptedByName?: string;
    createdAt: Timestamp | Date;
    updatedAt?: Timestamp | Date;
}

export interface ProfessionalProfile {
    id?: string;
    userId: string;
    name: string;
    email: string;
    bio: string;
    skills: string[];
    category: string;
    experience: string;
    rating: number;
    completedGigs: number;
    isAvailable: boolean;
    createdAt: Timestamp | Date;
}

// Gig Functions
export const createGig = async (gig: Omit<Gig, 'id' | 'createdAt'>): Promise<string> => {
    console.log('[Firebase] Creating gig:', gig.title);
    try {
        const docRef = await addDoc(gigsCollection, {
            ...gig,
            createdAt: serverTimestamp(),
            status: 'open'
        });
        console.log('[Firebase] Gig created successfully with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('[Firebase] Error creating gig:', error);
        throw error;
    }
};

export const getOpenGigs = async (): Promise<Gig[]> => {
    console.log('[Firebase] Fetching open gigs...');
    const q = query(gigsCollection, where('status', '==', 'open'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    console.log('[Firebase] Fetched', snapshot.docs.length, 'open gigs');
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gig));
};

export const acceptGig = async (gigId: string, professionalId: string, professionalName: string): Promise<void> => {
    const gigRef = doc(db, 'gigs', gigId);
    await updateDoc(gigRef, {
        status: 'accepted',
        acceptedBy: professionalId,
        acceptedByName: professionalName,
        updatedAt: serverTimestamp()
    });
};

export const subscribeToGigs = (callback: (gigs: Gig[]) => void) => {
    const q = query(gigsCollection, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const gigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gig));
        callback(gigs);
    });
};

export const subscribeToOpenGigs = (callback: (gigs: Gig[]) => void, onError?: (error: Error) => void) => {
    // Note: This query requires a composite index in Firestore
    // Go to Firebase Console -> Firestore -> Indexes and create an index:
    // Collection: gigs, Fields: status (Ascending), createdAt (Descending)
    const q = query(gigsCollection, where('status', '==', 'open'), orderBy('createdAt', 'desc'));
    return onSnapshot(
        q,
        (snapshot) => {
            console.log('[Firebase] Received gigs update:', snapshot.docs.length, 'documents');
            const gigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gig));
            callback(gigs);
        },
        (error) => {
            console.error('[Firebase] Error in subscribeToOpenGigs:', error);
            console.error('[Firebase] Error code:', error.code);
            console.error('[Firebase] Error message:', error.message);

            // Check if it's a missing index error
            if (error.message.includes('index')) {
                console.error('[Firebase] MISSING INDEX: Please create a composite index for the "gigs" collection.');
                console.error('[Firebase] Fields: status (Ascending), createdAt (Descending)');
                console.error('[Firebase] Or click the link in the error message above to create it automatically.');
            }

            if (onError) {
                onError(error);
            }
        }
    );
};

export const subscribeToMyGigs = (clientId: string, callback: (gigs: Gig[]) => void) => {
    const q = query(gigsCollection, where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const gigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gig));
        callback(gigs);
    });
};

// Professional Profile Functions
export const createProfessionalProfile = async (profile: Omit<ProfessionalProfile, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(professionalsCollection, {
        ...profile,
        createdAt: serverTimestamp(),
        rating: 0,
        completedGigs: 0
    });
    return docRef.id;
};

export const getProfessionalProfiles = async (): Promise<ProfessionalProfile[]> => {
    const q = query(professionalsCollection, where('isAvailable', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProfessionalProfile));
};

export const subscribeToProfessionals = (callback: (professionals: ProfessionalProfile[]) => void) => {
    const q = query(professionalsCollection, where('isAvailable', '==', true));
    return onSnapshot(q, (snapshot) => {
        const professionals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProfessionalProfile));
        callback(professionals);
    });
};

export const updateProfessionalProfile = async (profileId: string, updates: Partial<ProfessionalProfile>): Promise<void> => {
    const profileRef = doc(db, 'professionals', profileId);
    await updateDoc(profileRef, updates);
};

// Auto-generate sample gigs for testing
export const generateSampleGigs = async (): Promise<void> => {
    const sampleGigs: Omit<Gig, 'id' | 'createdAt'>[] = [
        {
            title: "Need Electrician for Home Wiring",
            description: "Looking for an experienced electrician to fix the wiring in my 3BHK apartment. Some switches are not working and need to install new fans in 2 rooms.",
            category: "electrician",
            budget: "₹2,000 - ₹5,000",
            location: "Indiranagar, Bangalore",
            clientId: "sample_client_1",
            clientName: "Rahul Sharma",
            clientEmail: "rahul@example.com",
            status: "open"
        },
        {
            title: "Plumber Needed for Bathroom Renovation",
            description: "Complete bathroom plumbing work needed. Installing new fixtures, toilet, and fixing leaking pipes. Urgent requirement.",
            category: "plumber",
            budget: "₹5,000 - ₹10,000",
            location: "Koramangala, Bangalore",
            clientId: "sample_client_2",
            clientName: "Priya Patel",
            clientEmail: "priya@example.com",
            status: "open"
        },
        {
            title: "House Painting - 2BHK",
            description: "Need to paint my entire 2BHK flat. Prefer Asian Paints. Must complete within a week. Please quote with labor and material.",
            category: "painter",
            budget: "₹15,000 - ₹25,000",
            location: "HSR Layout, Bangalore",
            clientId: "sample_client_3",
            clientName: "Amit Kumar",
            clientEmail: "amit@example.com",
            status: "open"
        },
        {
            title: "AC Repair and Service",
            description: "Two split ACs not cooling properly. Need servicing and gas refilling if required. Prefer experienced technician.",
            category: "electrician",
            budget: "₹1,500 - ₹3,000",
            location: "Whitefield, Bangalore",
            clientId: "sample_client_4",
            clientName: "Sneha Reddy",
            clientEmail: "sneha@example.com",
            status: "open"
        }
    ];

    for (const gig of sampleGigs) {
        await createGig(gig);
    }
    console.log('Sample gigs created!');
};

// Export Firebase instances
export { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
export type { FirebaseUser };
