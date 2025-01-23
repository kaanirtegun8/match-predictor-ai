import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { doc, setDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      
      // First get the user info to get the name
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then(response => response.json())
        .then(data => {
          const credential = GoogleAuthProvider.credential(id_token);
          return signInWithCredential(auth, credential)
            .then((result) => {
              // Update the user's display name if it's not set
              if (!result.user.displayName && data.name) {
                return updateProfile(result.user, {
                  displayName: data.name
                });
              }
            });
        })
        .catch(error => {
          console.error('Error during Google Sign-In:', error);
        });
    }
  }, [response]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!request) {
        throw new Error('Google Sign-In not initialized properly');
      }

      const result = await promptAsync({
        showInRecents: true
      });
      
      if (result.type === 'success') {
        const { id_token, access_token } = result.params;

        return { success: true };
      }
      
      return { success: false, error: 'Google sign in was cancelled' };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      return { success: false, error: error.message };
    }
  };

  const signOut = () => firebaseSignOut(auth);

  const deleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      // 1. Delete all user analyses first
      const analysesRef = collection(db, 'users', user.uid, 'analyses');
      const analysesSnapshot = await getDocs(analysesRef);
      
      const batch = writeBatch(db);
      analysesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('✅ User analyses deleted');

      // 2. Delete user document
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);
      console.log('✅ User document deleted');

      // 3. Delete Firebase Auth account
      await deleteUser(user);
      console.log('✅ User account deleted');
      
      router.replace('/login');
    } catch (error) {
      console.error('❌ Error deleting account:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isAuthenticated: !!user,
    deleteAccount
  };
} 