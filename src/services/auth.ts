import { auth } from '@/config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@user';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const registerWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = mapFirebaseUser(userCredential.user);
    await saveUserToStorage(user);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = mapFirebaseUser(userCredential.user);
    await saveUserToStorage(user);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};

const saveUserToStorage = async (user: AuthUser): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const mapFirebaseUser = (firebaseUser: User): AuthUser => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}; 