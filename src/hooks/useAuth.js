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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // Fetch complete user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Merge Firebase user with Firestore data
            setUser({
              ...firebaseUser,
              ...userData,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()
            });
          } else {
            // User exists in Auth but not in Firestore yet
            setUser(firebaseUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      console.log('useAuth: Starting signUpWithEmail');
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('useAuth: User created in Auth', user.uid);

      // Update user profile
      await updateProfile(user, {
        displayName: `${additionalData.firstName} ${additionalData.lastName}`
      });
      console.log('useAuth: Profile updated');

      // Generate tenant ID
      const tenantId = additionalData.company
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Save additional user data to Firestore
      console.log('useAuth: Saving to Firestore users collection');
      await setDoc(doc(db, 'users', user.uid), {
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        email: user.email,
        phone: additionalData.phone,
        company: additionalData.company,
        sector: additionalData.sector,
        companySize: additionalData.companySize,
        city: additionalData.city,
        state: additionalData.state,
        tenantId: tenantId,
        role: 'admin',
        isTenantAdmin: true,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('useAuth: User saved to Firestore');

      // Create tenant document
      const tenantRef = doc(db, 'tenants', tenantId);
      const tenantDoc = await getDoc(tenantRef);

      if (!tenantDoc.exists()) {
        console.log('useAuth: Creating new tenant', tenantId);
        await setDoc(tenantRef, {
          name: additionalData.company,
          adminUserId: user.uid,
          sector: additionalData.sector,
          companySize: additionalData.companySize,
          location: {
            city: additionalData.city,
            state: additionalData.state
          },
          createdAt: new Date().toISOString(),
          plan: 'free',
          status: 'active'
        });
        console.log('useAuth: Tenant created');
      }

      return user;
    } catch (error) {
      console.error('useAuth: SignUp Error', error);
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('useAuth: Starting signInWithGoogle');
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('useAuth: Google Sign In Success', user.uid);

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log('useAuth: Creating basic user doc for Google user');
        await setDoc(doc(db, 'users', user.uid), {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: '',
          company: '',
          sector: '',
          companySize: '',
          city: '',
          state: '',
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authProvider: 'google'
        });
        console.log('useAuth: User doc created');
      }

      return user;
    } catch (error) {
      console.error('useAuth: Google Sign In Error', error);
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
          onboardingCompleted: false,
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
