import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from './firebase';
import { User } from './firestore-schema';

export interface AuthUser extends User {
  firebaseUser: FirebaseUser;
}

// Authentication API
export const authAPI = {
  // Register new user
  async register(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        name,
        email,
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), userData);

      return {
        id: firebaseUser.uid,
        ...userData,
        firebaseUser
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data() as Omit<User, 'id'>;

      return {
        id: firebaseUser.uid,
        ...userData,
        firebaseUser
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        unsubscribe();
        
        if (!firebaseUser) {
          resolve(null);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
          
          if (!userDoc.exists()) {
            resolve(null);
            return;
          }

          const userData = userDoc.data() as Omit<User, 'id'>;
          
          resolve({
            id: firebaseUser.uid,
            ...userData,
            firebaseUser
          });
        } catch (error) {
          console.error('Get current user error:', error);
          resolve(null);
        }
      });
    });
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
        
        if (!userDoc.exists()) {
          callback(null);
          return;
        }

        const userData = userDoc.data() as Omit<User, 'id'>;
        
        callback({
          id: firebaseUser.uid,
          ...userData,
          firebaseUser
        });
      } catch (error) {
        console.error('Auth state change error:', error);
        callback(null);
      }
    });
  }
};
