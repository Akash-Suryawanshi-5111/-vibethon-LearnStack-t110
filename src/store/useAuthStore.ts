import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  streak: number;
  completedModules: string[];
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: (uid: string) => Promise<void>;
  updateXp: (amount: number) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: async (user) => {
    set({ user, loading: true });
    if (user) {
      await get().fetchProfile(user.uid);
    } else {
      set({ profile: null, loading: false });
    }
  },
  fetchProfile: async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        set({ profile: docSnap.data() as UserProfile, loading: false });
      } else {
        // Create new profile if it doesn't exist
        const user = get().user;
        if (!user) return;
        
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Learner',
          xp: 0,
          streak: 1,
          completedModules: [],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        
        await setDoc(docRef, newProfile);
        set({ profile: newProfile, loading: false });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ loading: false });
    }
  },
  updateXp: async (amount) => {
    const { user, profile } = get();
    if (!user || !profile) return;
    
    const newXp = profile.xp + amount;
    const docRef = doc(db, 'users', user.uid);
    
    try {
      await setDoc(docRef, { xp: newXp }, { merge: true });
      set({ profile: { ...profile, xp: newXp } });
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  },
  completeModule: async (moduleId) => {
    const { user, profile } = get();
    if (!user || !profile) return;
    
    if (profile.completedModules.includes(moduleId)) return;
    
    const newCompleted = [...profile.completedModules, moduleId];
    const docRef = doc(db, 'users', user.uid);
    
    try {
      await setDoc(docRef, { completedModules: newCompleted }, { merge: true });
      set({ profile: { ...profile, completedModules: newCompleted } });
      // Award XP for completing module
      await get().updateXp(50);
    } catch (error) {
      console.error('Error completing module:', error);
    }
  }
}));
