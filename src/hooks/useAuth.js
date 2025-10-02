import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, additionalData) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${additionalData.firstName} ${additionalData.lastName}`
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        phone: additionalData.phone,
        company: additionalData.company,
        sector: additionalData.sector,
        companySize: additionalData.companySize,
        city: additionalData.city,
        state: additionalData.state,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists, if not create a basic one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          phone: '',
          company: '',
          sector: '',
          companySize: '',
          city: '',
          state: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authProvider: 'google'
        });
      }

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // Check if user document exists, if not create a basic one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          phone: '',
          company: '',
          sector: '',
          companySize: '',
          city: '',
          state: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authProvider: 'github'
        });
      }

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      setError(null);
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    updateUserProfile
  };
}
